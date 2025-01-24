import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

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
  setCategoryNames,
  setEntity,
  setLocation,
  setRadius,
  setSkip,
} from "../store/slices/search";

const icons = [
  { icon: allIconLight, type: "All" },
  { icon: brandIconlight, type: "Brand" },
  { icon: eventIconLight, type: "Event" },
  { icon: spaceIconLight, type: "Space" },
  { icon: memberIconLight, type: "Profile" },
];

const Filters = ({ setOpenFilterDrawer = null }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { parameters } = useSelector((state) => state.search);
  console.log(parameters)

  const {
    data: generalCategories,
    isSuccess: isGeneralCategorySuccess,
    isLoading: isGeneralCategoryLoading,
    isFetching: isGeneralCategoryFetching,
  } = useGetGeneralCategoriesQuery();

  const [allCategories, setAllCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");

  useEffect(() => {
    if (isGeneralCategorySuccess) {
      if (generalCategories?.data) {
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

        setAllCategories(updatedCategories);
      }
    }
  }, [isGeneralCategorySuccess, generalCategories]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          dispatch(setLocation({ lat: latitude, long: longitude }));
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

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

    if (searchTerm.length === 0) {
      setAllCategories(allCategories);
    } else {
      const filteredNames = allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm)
      );
      setAllCategories(filteredNames);
    }
  };

  const handleCategoryChange = (index) => {
    const newCategories = allCategories?.map((cat) =>
      cat?.id === index ? { ...cat, selected: !cat.selected } : cat
    );

    const names = newCategories
      .filter((item) => item.selected)
      .map((item) => item.name)
      .join(", ");

    dispatch(setCategoryNames(names));
    dispatch(setSkip(false));

    setOpenFilterDrawer?.(false);
    setAllCategories(newCategories);

    pathname !== "/search" && navigate("/search");
  };

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
      {isGeneralCategoryLoading || isGeneralCategoryFetching ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          <Typography sx={{ fontWeight: 300 }}>
            Filter by:
            <strong
              style={{
                fontWeight: 600,
                color:
                  parameters.entity === "Select Filter" ? "#888" : "inherit",
              }}
            >
              {" "}
              {parameters.entity}
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
                sx={{
                  border: "1px solid rgba(209, 219, 215, 0.5)",
                  backgroundColor: "white",
                  pl: 0,
                  "& ::placeholder": {
                    color: "rgba(0, 20, 28, 0.5)",
                    fontWeight: 300,
                  },
                }}
                value={parameters.locaion}
                type="text"
                placeholder="Type Address..."
                onInputChange={(e) =>
                  dispatch(setLocation({ locaion: e.target.value }))
                }
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
                sx={{
                  border: "1px solid rgba(209, 219, 215, 0.5)",
                  backgroundColor: "white",
                  pl: 0,
                  "& ::placeholder": {
                    color: "rgba(0, 20, 28, 0.5)",
                    fontWeight: 300,
                  },
                }}
                value={parameters.radius}
                onInputChange={(e) => dispatch(setRadius(e.target.value))}
                type="text"
                placeholder="100km"
              />
            </Grid>
          </Grid>

          <Box sx={{ width: "100%", height: "411px", mt: 2, mb: 4 }}>
            <img
              src={mediumMap}
              alt="Map"
              style={{ width: "100%", height: "!100%", objectFit: "cover" }}
            />
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
                border: "1px solid rgba(209, 219, 215, 0.5)",
                backgroundColor: "white",
                pl: 0,
                height: "32px",
                "& input": {
                  padding: "10.5px 14px",
                },
                "& ::placeholder": {
                  color: "rgba(0, 20, 28, 0.5)",
                  fontWeight: 300,
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
        </>
      )}
    </Box>
  );
};

export default Filters;
