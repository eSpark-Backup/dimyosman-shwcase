import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
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

import {
  useGetGeneralCategoriesQuery,
  useGetGeneralLocationQuery,
} from "../services/general";

import {
  emptyAllLocations,
  emptyCategoryNames,
  emptyFilters,
  setAllSearchData,
  setAllFilterCategories,
  setCategoryNames,
  setEntity,
  setLocation,
  setPageNumber,
  setRadius,
  setSkip,
  setSpaceSearchData,
  setIsTyping,
} from "../store/slices/search";

const icons = [
  // { icon: allIconLight, type: "not" },
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

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Filters = ({
  setOpenFilterDrawer = null,
  setHasMore = null,
  setLoadingStart = null,
  loadingStart = false,
  allData = [],
  searchedData = [],
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
    isTyping,
  } = useSelector((state) => state.search);

  const mapRef = useRef(null);

  const [radiusInput, setRadiusInput] = useState(parameters.radius);
  const [debouncedRadius, resetDebouncedRadius] = useDebounce(radiusInput, 500);

  const [suggestions, setSuggestions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [value, setValue] = useState(parameters?.locaion);
  const [map, setMap] = useState(null);

  const { data: getLocationData, error } = useGetGeneralLocationQuery(
    { query: value },
    {
      skip: !value || value.length < 3 || isSelecting,
    }
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mapRef.current && !mapRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/search") {
      resetDebouncedRadius();
      dispatch(emptyFilters());
      setRadiusInput("");
      dispatch(setLocation({ lat: "", long: "", location: "" }));
      setValue("");
      dispatch(emptyAllLocations());
      dispatch(setPageNumber(1));
      dispatch(setSkip(true));
      dispatch(setRadius(""));
      dispatch(setAllSearchData([]));
      dispatch(setSpaceSearchData([]));
      dispatch(setIsTyping(false));
    }

    if (pathname === "/search" && !isLessThan1281) {
      setOpenFilterDrawer?.(false);
    }
  }, [pathname, isLessThan1281]);

  const [searchCategory, setSearchCategory] = useState("");

  useEffect(() => {
    if (pathname === "/search" && debouncedRadius !== parameters.radius) {
      dispatch(setPageNumber(1));
      setHasMore?.(true);
      setLoadingStart?.(false);

      dispatch(setRadius(debouncedRadius));
      dispatch(setSkip(false));
      dispatch(setAllSearchData([]));
      dispatch(setSpaceSearchData([]));
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

    dispatch(setRadius(""));
    dispatch(setPageNumber(1));
    setHasMore?.(true);
    setLoadingStart?.(false);
    dispatch(setAllSearchData([]));
    dispatch(setSpaceSearchData([]));

    dispatch(emptyCategoryNames());
    dispatch(setEntity(entity.type));
    dispatch(setSkip(false));

    if (pathname !== "/search") {
      actionAsDrawer();
    }
    setOpenFilterDrawer?.(false);
  };

  const handleSearch = (e) => {
    dispatch(setIsTyping(false));

    setIsSelecting(false);
    setValue(e.target.value);
  };

  useEffect(() => {
    if (getLocationData?.status && getLocationData?.data && !isTyping) {
      setSuggestions(getLocationData.data);
    } else {
      setSuggestions([]);
    }
  }, [getLocationData, isTyping]);

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

  const handleSelectPlace = (place) => {
    setValue(place.description);
    setSuggestions([]);
    setIsSelecting(true);
    dispatch(setIsTyping(true));

    // Fetch details for selected place
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?place_id=${place.placeId}&key=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results[0]) {
          const { lat, lng } = data.results[0].geometry.location;
          const formattedAddress = data.results[0].formatted_address;

          dispatch(setLocation({ long: lng, lat, locaion: formattedAddress }));

          if (radiusInput?.length === 0) {
            dispatch(setRadius(10));
          }

          dispatch(setSkip(false));
          dispatch(setAllSearchData([]));
          dispatch(setSpaceSearchData([]));
          setOpenFilterDrawer?.(false);
        }
        setSuggestions([]);
      })
      .catch((error) =>
        console.error("Error fetching location details:", error)
      );
  };

  useEffect(() => {
    if (pathname === "/search") {
      if (isTyping && allData?.length === 0 && map && parameters?.lat) {
        map.panTo({ lat: parameters?.lat, lng: parameters?.long });
      }
    }
  }, [allData, isTyping, map, parameters, pathname]);

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
        {icons.map((icon, i) => (
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
            key={i}
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
            value={value}
            readOnly={parameters?.entity?.length === 0 ? true : false}
            onClick={() => {
              if (parameters?.entity?.length === 0) {
                toast.error("Filter is not selected");
                return;
              }
            }}
            onInputChange={handleSearch}
            type="text"
            placeholder="Type Address..."
            autoComplete="off"
            endAdornment={
              <InputAdornment position="end">
                <IconButton>
                  <img src={locationIcon} alt="" />
                </IconButton>
              </InputAdornment>
            }
          />

          {/* Suggestions List */}
          {suggestions.length > 0 && (
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                position: "absolute",
                zIndex: 1,
                width: "100%",
                backgroundColor: "white",
                border: "1px solid #ddd",
              }}
            >
              <List>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    component={"button"}
                    key={index}
                    onClick={() => handleSelectPlace(suggestion)}
                    sx={{ cursor: "pointer", backgroundColor: "white" }}
                  >
                    <ListItemText primary={suggestion.description} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
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
              parameters?.entity?.length === 0
                ? true
                : !parameters?.lat
                ? true
                : false
            }
            onClick={() => {
              if (parameters?.entity?.length === 0) {
                toast.error("Filter is not selected");
                return;
              }

              if (!parameters?.lat) {
                toast.error("Please add location first");
                return;
              }
            }}
            onInputChange={(e) => {
              const value = e.target.value;
              setRadiusInput(value);
            }}
            type="number"
            placeholder="10km"
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
            mapRef={mapRef}
            map={map}
            setMap={setMap}
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
