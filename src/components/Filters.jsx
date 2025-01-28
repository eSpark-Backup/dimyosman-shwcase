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
} from "@mui/material";

import Input from "./input";
import CheckBox from "./CheckBox";
import MapDisplay from "./MapDisplay";

import {
  allIconLight,
  brandIconlight,
  eventIconLight,
  locationIcon,
  mediumMap,
  memberIconLight,
  spaceIconLight,
} from "../assets";

import { useGetGeneralCategoriesQuery } from "../services/general";

import {
  emptyFilters,
  setAllFilterCategories,
  setCategoryNames,
  setEntity,
  setLocation,
  setRadius,
  setSkip,
} from "../store/slices/search";

const icons = [
  { icon: allIconLight, type: "ALL" },
  { icon: brandIconlight, type: "BRAND" },
  { icon: eventIconLight, type: "EVENT" },
  { icon: spaceIconLight, type: "SPACE" },
  { icon: memberIconLight, type: "PROFILE" },
];

const Filters = ({
  setOpenFilterDrawer = null,
  allDataLocation = [],
  loadLocation = false,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (pathname !== "/search") {
      dispatch(emptyFilters());
    }
  }, [pathname]);

  const { parameters, allFilterCategories } = useSelector(
    (state) => state.search
  );

  const {
    data: generalCategories,
    isSuccess: isGeneralCategorySuccess,
    isLoading: isGeneralCategoryLoading,
    isFetching: isGeneralCategoryFetching,
  } = useGetGeneralCategoriesQuery(
    {
      categoryType: parameters.entity.length === 0 ? "" : parameters.entity,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [allCategories, setAllCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Map());
  const [address, setAddress] = useState("");
  const [radiusKm, setRadiusKm] = useState("");

  useEffect(() => {
    if (generalCategories?.data?.length) {
      const updatedCategories = generalCategories?.data
        .map((category, index) => ({
          id: index,
          name: category,
          selected: false,
        }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      dispatch(setAllFilterCategories(updatedCategories));
    } else {
      dispatch(setAllFilterCategories([]));
    }
  }, [isGeneralCategorySuccess, generalCategories]);

  useEffect(() => {
    if (allFilterCategories?.length) {
      setAllCategories(allFilterCategories);
    } else {
      setAllCategories([]);
    }
  }, [allFilterCategories]);

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         dispatch(setLocation({ lat: latitude, long: longitude }));
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error.message);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //       }
  //     );
  //   } else {
  //     console.log("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  useEffect(() => {
    if (pathname === "/search") {
      if (parameters?.categoryNames) {
        const newCategories = allFilterCategories?.map((cat) =>
          cat?.name === parameters?.categoryNames
            ? { ...cat, selected: true }
            : cat
        );
        dispatch(setAllFilterCategories(newCategories));
      }
    }
  }, [pathname]);

  const filterClick = (entity) => {
    dispatch(setEntity(entity.type));
    dispatch(setSkip(false));

    setOpenFilterDrawer?.(false);
    pathname !== "/search" && navigate("/search");
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    console.log(query);
  };

  const handleFilteringCategories = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchCategory(searchTerm);

    const updatedCategories = allFilterCategories.map((cat) => ({
      ...cat,
      selected: selectedCategories.get(cat.id) || false,
    }));

    if (searchTerm.length === 0) {
      setAllCategories(updatedCategories);
    } else {
      const filteredNames = updatedCategories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm)
      );

      setAllCategories(filteredNames);
    }
  };

  const handleCategoryChange = (id) => {
    if (parameters?.entity?.length === 0) {
      toast.error("Filter is not selected");
      return;
    }

    setSelectedCategories((prev) => {
      const newSelected = new Map(prev);
      newSelected.set(id, !prev.get(id));
      return newSelected;
    });

    setAllCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === id ? { ...cat, selected: !cat.selected } : cat
      )
    );

    const selectedNames = Array.from(selectedCategories.entries())
      .filter(([_, selected]) => selected)
      .map(([id]) => allFilterCategories.find((cat) => cat.id === id)?.name)
      .join(", ");

    dispatch(setCategoryNames(selectedNames));
    dispatch(setSkip(false));
    setOpenFilterDrawer?.(false);

    pathname !== "/search" && navigate("/search");
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
        p: 2,
      }}
    >
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
          <img
            key={icon.type}
            src={icon.icon}
            alt={icon.type}
            style={{
              cursor: icon.type !== "All" ? "pointer" : "default",
            }}
            onClick={() => {
              if (icon.type !== "All") {
                filterClick(icon);
              }
            }}
          />
        ))}
      </Box>

      <Grid container>
        <Grid item md={8} pr={1}>
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

        <Grid item md={4} pl={1}>
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
            // value={parameters.radius}
            // onInputChange={(e) => dispatch(setRadius(e.target.value))}
            value={radiusKm}
            onInputChange={(e) => setRadiusKm(e.target.value)}
            type="text"
            placeholder="100km"
          />
        </Grid>
      </Grid>

      <Box sx={{ width: "100%", height: "411px", mt: 2, mb: 4 }}>
        <MapDisplay locations={allDataLocation} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          sx={{
            ...inputStyles,
            height: "32px",
            "& input": {
              padding: "10.5px 14px",
            },
          }}
          value={searchCategory}
          onInputChange={handleFilteringCategories}
          type="text"
          placeholder="search Interests..."
          flex={1}
        />
      </Box>

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
        {allCategories?.map((category) => (
          <Box
            display="flex"
            alignItems="center"
            sx={{ width: "100%", marginBottom: "10px", columnGap: 1 }}
            key={category.id}
          >
            <CheckBox
              checked={category?.selected}
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
    </Box>
  );
};

export default Filters;
