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
import SearchBar from "./SearchBar";

import {
  // allIconLight,
  brandIcon,
  close,
  flag,
  locationIcon,
  mapMarker,
  mapMarkerBrand,
  mapMarkerSpace,
  spaceIcon,
} from "../assets";

import { useDebounce } from "../helper/useDebounce";

import {
  useGetGeneralCategoriesQuery,
  useGetGeneralLocationQuery,
} from "../services/general";

import {
  emptyCategoryNames,
  setAllSearchData,
  setAllFilterCategories,
  setCategoryNames,
  setEntity,
  setLocation,
  setRadius,
  setSpaceSearchData,
  setIsTyping,
  setName,
  setAllGeneralData,
  setLocationStart,
  setSearch,
  setSearchRecall,
  setSearchQuery,
} from "../store/slices/search";
import { setActivityPageNumber } from "../store/slices/activity";

import { deleteCookie, getCookie, setCookie } from "../utils";

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
];

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Filters = ({ handleCloseFilterDrawer = () => {} }) => {
  const searchQuery = getCookie("search_query");
  const isLessThan769 = useMediaQuery("(max-width:768px)");

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { pathname } = useLocation();

  const {
    parameters,
    allFilterCategories,
    isTyping,
    search_query,
    allData,
    search,
    generalSearchLoading
  } = useSelector((state) => state.search);

  const mapRef = useRef(null);

  const [radiusInput, setRadiusInput] = useState(parameters.radius || "");
  const [debouncedRadius, resetDebouncedRadius] = useDebounce(radiusInput, 500);

  const [suggestions, setSuggestions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [value, setValue] = useState(parameters?.locaion || "");
  const [showNoData, setShowNoData] = useState(false)

  useEffect(() => {
    // Reset the timer if loading starts
    if ((searchQuery || search_query) && generalSearchLoading) {
      setShowNoData(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowNoData(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [generalSearchLoading, allData?.length, searchQuery, search_query]);

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

  const [searchCategory, setSearchCategory] = useState("");

  useEffect(() => {
    if (
      (searchQuery || search_query) &&
      debouncedRadius !== parameters.radius
    ) {
      isLessThan769 && handleCloseFilterDrawer?.();
      dispatch(setRadius(debouncedRadius));

      commonReset();

    }
  }, [debouncedRadius, dispatch]);

  const {
    data: generalCategories,
    isSuccess: isGeneralCategorySuccess,
    isLoading: isGeneralCategoryLoading,
    isFetching: isGeneralCategoryFetching,
  } = useGetGeneralCategoriesQuery(
    {
      categoryType: `${parameters.entity}S`,
    },
    {
      skip: parameters?.entity?.length === 0,
      refetchOnMountOrArgChange: allFilterCategories?.some(
        (cat) => cat.entity === parameters?.entity
      )
        ? false
        : true,
    }
  );

  useEffect(() => {
    if (searchQuery || search_query) {
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

  const queryCalled = () => {
    setCookie("search_query", true);
    deleteCookie("isCalled");

    dispatch(setSearchQuery(true));

    pathname !== "/activity" && navigate("/activity");
  };

  const filterClick = (entity) => {
    if (!(searchQuery || search_query) && isLessThan769) {
      queryCalled();
    }

    if (
      entity.type === parameters.entity &&
      search.toLowerCase() === parameters.name.toLowerCase()
    ) {
      return;
    }

    isLessThan769 && handleCloseFilterDrawer?.();

    const updatedCategories = allFilterCategories.map((category) => {
      return { ...category, selected: false };
    });

    dispatch(setAllFilterCategories(updatedCategories));
    dispatch(setSearchRecall(Date.now()));

    commonReset();

    dispatch(emptyCategoryNames());
    dispatch(setEntity(entity.type));
    dispatch(setName(search));
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


    dispatch(setCategoryNames(selectedNames));
    dispatch(setSearchRecall(Date.now()))
    isLessThan769 && handleCloseFilterDrawer?.();
  };

  const handleSelectPlace = (place) => {
    isLessThan769 && handleCloseFilterDrawer?.();

    if (!(searchQuery || search_query) && isLessThan769) {
      queryCalled();
    }
    dispatch(setLocationStart(true));
    setValue(place.description);
    setSuggestions([]);
    setIsSelecting(true);

    dispatch(setIsTyping(true));
    commonReset();

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
          if (parameters.entity.trim().length === 0) {
            dispatch(setEntity("BRAND"));
          } else {
            dispatch(setEntity(parameters.entity));
          }

          if (parameters?.lat !== lat || parameters?.long !== lng) {
            commonReset();
          }
        }
        setSuggestions([]);
      })
      .catch((error) =>
        console.error("Error fetching location details:", error)
      );
  };

  const commonReset = () => {
    dispatch(setAllSearchData([]));
    dispatch(setSpaceSearchData([]));
    dispatch(setAllGeneralData([]));
  };

  const emptyInputs = () => {
    setRadiusInput("");
    dispatch(setLocation({ lat: "", long: "", location: "" }));
    setValue("");
    dispatch(setRadius(""));
    dispatch(setIsTyping(false));
    resetDebouncedRadius();
    dispatch(setSearchRecall(Date.now()))
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      dispatch(setSearchRecall(Date.now()));
      dispatch(setActivityPageNumber(1));

      if (parameters?.entity.trim().length === 0) {
        dispatch(setEntity("BRAND"));
      } else {
        dispatch(setEntity(parameters?.entity));
      }

      dispatch(setName(search));

      if (!(searchQuery || search_query)) {
        queryCalled();
      }

      isLessThan769 && handleCloseFilterDrawer?.();
    }
  };

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
        onClick={() => handleCloseFilterDrawer?.()}
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

      {isLessThan769 && (
        <div className="search-box" style={{ marginTop: "10px" }}>
          <SearchBar
            name={"query"}
            placeholder={"Search..."}
            onInputChange={(e) => {
              const value = e.target.value;
              if (value.length === 0) {
                dispatch(setName(""));
              }
              dispatch(setSearch(value));
            }}
            value={search}
            handleKeyDown={handleKeyDown}
            filterClick={filterClick}
          />
        </div>
      )}

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
              if (icon.type !== "not" && !generalSearchLoading) {
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
        <Grid
          item
          xs={12}
          sm={8}
          pr={1}
          sx={{ mb: { xs: 1, sm: 0 }, position: "relative" }}
        >
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
            onInputChange={(e) => {
              const value = e.target.value;
              if(value.length === 0) {
                emptyInputs()
              }
              handleSearch(e)
            }}
            type="text"
            placeholder="Type Address..."
            autoComplete="off"
            disabled={generalSearchLoading}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  sx={{
                    cursor:
                      parameters?.lat || parameters?.long
                        ? "pointer"
                        : "default",
                    backgroundColor: "transparent !important",
                    pointerEvents:
                      parameters?.lat || parameters?.long ? "auto" : "none",
                  }}
                  onClick={() => {
                    if (parameters?.lat || parameters?.long) {
                      emptyInputs();
                      commonReset();
                    }
                  }}
                >
                  {parameters?.lat || parameters?.long ? (
                    <img src={close} alt="Close" />
                  ) : (
                    <img src={locationIcon} alt="Location" />
                  )}
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
                width: "calc(100% - 8px)",
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
                : !parameters?.lat || !parameters?.long
                ? true
                : false
            }
            onClick={() => {
              if (!parameters?.lat || !parameters?.long) {
                toast.error("Please add location first");
                return;
              }
            }}
            onInputChange={(e) => {
              const value = e.target.value;
              if (value.length === 0) {
                setRadiusInput("");
                dispatch(setRadius(""));
                resetDebouncedRadius();
              }
              setRadiusInput(value);
            }}
            type="number"
            placeholder="10km"
            disabled={generalSearchLoading}
          />
        </Grid>
      </Grid>

      {isGeneralCategoryLoading ||
      isGeneralCategoryFetching ||
      generalSearchLoading ? (
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ width: "100%", height: "411px", mt: 2, mb: 4 }}>
            {!showNoData ? (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            ) : (
              <MapDisplay
                locations={allData}
                marker={
                  parameters?.entity === "SPACE"
                    ? mapMarkerSpace
                    : parameters?.entity === "BRAND"
                    ? mapMarkerBrand
                    : mapMarker
                }
                mapRef={mapRef}
                handleCloseFilterDrawer={handleCloseFilterDrawer}
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
                disabled={generalSearchLoading}
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
        </>
      )}
    </Box>
  );
};

export default Filters;
