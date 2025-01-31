import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";

import Input from "./input";
import CheckBox from "./CheckBox";
import MapDisplay from "./MapDisplay";

import {
  allIconLight,
  brandIcon,
  close,
  flag,
  locationIcon,
  mapMarker,
  mapMarkerBrand,
  mapMarkerSpace,
  profileIcon,
  spaceIcon,
} from "../assets";

import { useDebounce } from "../helper/useDebounce";

import { useGetGeneralCategoriesQuery } from "../services/general";

import {
  emptyAllLocations,
  emptyCategoryNames,
  emptyFilters,
  setAllFilterCategories,
  setCategoryNames,
  setEntity,
  setLocation,
  setPageNumber,
  setRadius,
  setSkip,
} from "../store/slices/search";

const icons = [
  { icon: allIconLight, type: "not" },
  {
    icon: brandIcon,
    bg: "rgba(196, 119, 127, 0.2)",
    activeBG: "rgba(196, 119, 127, 0.8)",
    type: "BRAND",
  },
  {
    icon: flag,
    bg: "rgba(148, 185, 134, 0.2)",
    activeBG: "rgba(148, 185, 134, 0.8)",
    type: "EVENT",
  },
  {
    icon: spaceIcon,
    bg: "rgba(120, 150, 195, 0.2)",
    activeBG: "rgba(120, 150, 195, 0.8)",
    type: "SPACE",
  },
  {
    icon: profileIcon,
    bg: "rgba(0, 20, 28, 0.1)",
    activeBG: "rgba(0, 20, 28, 0.8)",
    type: "not",
  },
];

const Filters = ({
  setOpenFilterDrawer = null,
  setHasMore = null,
  setLoadingStart = null,
  setData = null,
  loadingStart = false,
}) => {
  const isLessThan1281 = useMediaQuery("(max-width:1281px)");

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    parameters,
    allFilterCategories,
    allCategoriesNotSearch,
    allLocations,
  } = useSelector((state) => state.search);

  const [radiusInput, setRadiusInput] = useState(parameters.radius);
  const [debouncedRadius, resetDebouncedRadius] = useDebounce(radiusInput, 500);
  const [hasSet, setHasSet] = useState(false);
  const [loc, setLoc] = useState({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setLoc({ lat: latitude, long: longitude });
          setHasSet(true);
        },
        (error) => {
          setHasSet(false);
        }
      );
    } else {
      setHasSet(false);
    }
  }, []);

  useEffect(() => {
    if (pathname !== "/search") {
      resetDebouncedRadius();
      dispatch(emptyFilters());
      setRadiusInput("");
      dispatch(setLocation({ lat: "", long: "" }));
      dispatch(emptyAllLocations());
      dispatch(setPageNumber(1));
    }

    if (pathname === "/search" && !isLessThan1281) {
      setOpenFilterDrawer?.(false);
    }
  }, [pathname, isLessThan1281]);

  const [searchCategory, setSearchCategory] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (pathname === "/search" && debouncedRadius !== parameters.radius) {
      dispatch(setPageNumber(1));
      setHasMore?.(true);
      setLoadingStart?.(false);

      if (hasSet) {
        dispatch(setLocation(loc));
      }

      dispatch(setRadius(debouncedRadius));
      dispatch(setSkip(false));
      setData?.([]);
      setOpenFilterDrawer?.(false);
    }
  }, [debouncedRadius, dispatch, parameters.radius]);

  const {
    data: generalCategories,
    isSuccess: isGeneralCategorySuccess,
    isLoading: isGeneralCategoryLoading,
    isFetching: isGeneralCategoryFetching,
  } = useGetGeneralCategoriesQuery(
    {
      categoryType:
        parameters?.entity?.length === 0 ? "" : `${parameters.entity}S`,
    },
    {
      skip: pathname !== "/search",
      refetchOnMountOrArgChange: allFilterCategories?.some(
        (cat) => cat.entity === parameters?.entity
      )
        ? false
        : true,
    }
  );

  useEffect(() => {
    if (pathname !== "/search") {
      if (allCategoriesNotSearch?.length > 0) {
        dispatch(setAllFilterCategories(allCategoriesNotSearch));
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/search") {
      if (generalCategories?.data?.length) {
        const updatedCategories = generalCategories?.data
          .map((category, index) => {
            const existingCategory = allFilterCategories.find(
              (cat) => cat.name === category
            );
            return {
              id: index,
              name: category,
              selected: existingCategory ? existingCategory.selected : false,
              entity: parameters?.entity,
            };
          })
          .filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.name === value.name)
          );

        dispatch(setAllFilterCategories(updatedCategories));
      } else {
        dispatch(setAllFilterCategories([]));
      }
    }
  }, [isGeneralCategorySuccess, generalCategories]);

  const filteredCategories = allFilterCategories.filter((category) =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const actionAsDrawer = () => {
    setOpenFilterDrawer?.(false);
    navigate("/search");
  };

  const filterClick = (entity) => {
    if (entity.type === parameters.entity) {
      return;
    }

    const updatedCategories = allFilterCategories.map((category) => {
      return { ...category, selected: false };
    });

    dispatch(setAllFilterCategories(updatedCategories));

    dispatch(setPageNumber(1));
    setHasMore?.(true);
    setLoadingStart?.(false);
    setData?.([]);

    dispatch(emptyCategoryNames());
    dispatch(setEntity(entity.type));
    dispatch(setSkip(false));

    if (pathname !== "/search") {
      actionAsDrawer();
    }
    setOpenFilterDrawer?.(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    console.log(query);
  };

  const handleCategoryChange = (id) => {
    if (parameters?.entity?.length === 0) {
      toast.error("Filter is not selected");
      return;
    }

    let isSelectingNew = false;

    const updatedCategories = allFilterCategories.map((category) => {
      if (category.id === id) {
        if (!category.selected) {
          isSelectingNew = true;
        }
        return { ...category, selected: !category.selected };
      }
      return category;
    });

    dispatch(setAllFilterCategories(updatedCategories));

    const selectedNames = updatedCategories
      .filter((cat) => cat.selected)
      .map((cat) => cat.name)
      .join(",");

    dispatch(setPageNumber(1));
    setHasMore?.(true);
    setLoadingStart?.(false);

    dispatch(setCategoryNames(selectedNames));
    dispatch(setSkip(false));

    if (pathname !== "/search") {
      actionAsDrawer();
    }
    setOpenFilterDrawer?.(false);
  };

  const inputStyles = {
    border: "1px solid rgba(209, 219, 215, 0.5)",
    backgroundColor: "white",
    pl: 0,
    "& ::placeholder": {
      color: "rgba(0, 20, 28, 0.5)",
      fontWeight: 300,
    },
  };

  if (isGeneralCategoryLoading || isGeneralCategoryFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "white",
        width: "100%",
        border: "1px solid rgba(209, 219, 215, 0.5)",
        borderRadius: "5px",
        overflowY: "auto",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          textAlign: "end",
        }}
        onClick={() => setOpenFilterDrawer?.(false)}
      >
        <img src={close} alt="Close Icon" />
      </Box>

      <Typography sx={{ fontWeight: 300 }}>
        Filter by:
        <strong
          style={{
            fontWeight: 600,
            color: parameters.entity.length === 0 ? "#888" : "inherit",
          }}
        >
          {" "}
          {parameters.entity.length === 0 ? "Select Filter" : parameters.entity}
        </strong>
      </Typography>

      <Box
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {icons.map((icon) => (
          <Box
            sx={{
              bgcolor:
                parameters.entity === icon.type ? icon.activeBG : icon.bg,
              height: "48px",
              width: "48px",
              minHeight: "48px",
              minWidth: "48px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5px",
              position: "relative",
              cursor: icon.type !== "All" ? "pointer" : "default",
              transition: "background-color 0.3s ease-in-out",
              "&:hover": {
                bgcolor: icon.activeBG,
              },

              "&:last-child": {
                marginRight: 0,
              },
            }}
            onClick={() => {
              if (icon.type !== "not") {
                filterClick(icon);
              }
            }}
            key={icon.type}
          >
            <img src={icon.icon} alt={icon.type} />
          </Box>
        ))}
      </Box>

      <Grid container>
        <Grid item xs={12} sm={8} pr={1} sx={{ mb: { xs: 1, sm: 0 } }}>
          <Typography
            component="label"
            sx={{
              fontWeight: 300,
              mb: 1,
              display: "block",
            }}
          >
            Location:
          </Typography>
          <Input
            sx={inputStyles}
            // value={parameters.locaion}
            // onInputChange={(e) =>
            //   dispatch(setLocation({ locaion: e.target.value }))
            // }
            value={address}
            onInputChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="Type Address..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton>
                  <img src={locationIcon} alt="" />
                </IconButton>
              </InputAdornment>
            }
          />
        </Grid>

        <Grid item xs={12} sm={4} pl={1}>
          <Typography
            component="label"
            sx={{
              fontWeight: 300,
              mb: 1,
              display: "block",
            }}
          >
            Radius:
          </Typography>
          <Input
            sx={inputStyles}
            value={radiusInput}
            readOnly={
              parameters?.entity?.length === 0 ? true : !hasSet ? true : false
            }
            onClick={() => {
              if (parameters?.entity?.length === 0) {
                toast.error("Filter is not selected");
                return;
              }
              
              if (parameters?.lat === "") {
                toast.error("You need to allow location");
                return;
              }
            }}
            onInputChange={(e) => {
              const value = e.target.value;
              setRadiusInput(value);
            }}
            type="number"
            placeholder="100km"
          />
        </Grid>
      </Grid>

      <Box sx={{ width: "100%", height: "411px", mt: 2, mb: 4 }}>
        {loadingStart ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <MapDisplay
            locations={allLocations}
            marker={
              parameters?.entity === "SPACE"
                ? mapMarkerSpace
                : parameters?.entity === "BRAND"
                ? mapMarkerBrand
                : mapMarker
            }
          />
        )}
      </Box>

      {allFilterCategories?.length === 0 ? (
        <Box>
          <h6 style={{ textAlign: "center" }}>No Categories found</h6>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "start", sm: "center" },
            gap: { xs: 0.5, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            component="label"
            sx={{
              fontWeight: 300,
              display: "block",
            }}
          >
            Include Categories:
          </Typography>
          <Input
            width="100%"
            sx={{
              ...inputStyles,
              height: "32px",
              "& input": {
                padding: "10.5px 14px",
              },
            }}
            value={searchCategory}
            onInputChange={(e) => setSearchCategory(e.target.value)}
            type="text"
            placeholder="search Interests..."
            flex={1}
          />
        </Box>
      )}

      {filteredCategories?.length === 0 ? null : (
        <Box
          sx={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid rgba(209, 219, 215, 0.5)",
            borderRadius: "5px",
            padding: 2,
            mt: 2,
          }}
        >
          {filteredCategories?.map((category) => (
            <Box
              display="flex"
              alignItems="center"
              sx={{ width: "100%", marginBottom: "10px", columnGap: 1 }}
              key={category.id}
            >
              <CheckBox
                checked={category.selected}
                onChange={() => handleCategoryChange(category?.id)}
              />
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {category.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Filters;
