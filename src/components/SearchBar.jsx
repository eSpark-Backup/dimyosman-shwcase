import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SearchIconBox from "./SearchIconBox";

import {
  setAllCategoriesNotSearch,
  setSearchQuery,
} from "../store/slices/search";

import { getCookie, setCookie } from "../utils";

import { useGetGeneralCategoriesQuery } from "../services/general";
import { brandIcon, flag, search, spaceIcon } from "../assets";

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

const SearchBar = ({
  label,
  name,
  placeholder,
  onInputChange,
  value,
  helperText,
  error,
  onBlur,
  canType,
  handleKeyDown,
  filterClick,
  handleFilterDrawer = () => {},
}) => {
  const theme = useTheme();

  const isLessThan1281 = useMediaQuery("(max-width:1281px)");

  const token = localStorage.getItem("token");
  const searchQuery = getCookie("search_query");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search_query, generalSearchLoading } = useSelector(
    (state) => state.search
  );

  const { data } = useGetGeneralCategoriesQuery(undefined, {
    skip: !token || searchQuery || search_query,
  });

  useEffect(() => {
    if (data?.data?.length && !isLessThan1281) {
      const updatedCategories = data?.data
        .map((category, index) => ({
          id: index,
          name: category,
          selected: false,
          entity: "BRAND",
        }))
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
        );

      dispatch(setAllCategoriesNotSearch(updatedCategories));
    }
  }, [data, isLessThan1281]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: "8px",
        cursor: !canType && !(searchQuery || search_query) ? "pointer" : "text",
      }}
      onClick={() => {
        if (!isLessThan1281) {
          if (!canType && !(searchQuery || search_query)) {
            navigate("/activity");
            setCookie("search_query", true);
            dispatch(setSearchQuery(true));
          }
        } else {
          handleFilterDrawer();
        }
      }}
    >
      {label && (
        <Typography
          sx={{ fontStyle: "italic", textAlign: "left", fontWeight: 300 }}
          variant="h6"
        >
          {label}
        </Typography>
      )}
      <TextField
        type="text"
        name={name}
        placeholder={
          !(searchQuery || search_query) ? placeholder : "Search Query"
        }
        onChange={onInputChange}
        value={value}
        helperText={helperText}
        error={error}
        onBlur={onBlur}
        variant="outlined"
        onKeyDown={handleKeyDown}
        disabled={generalSearchLoading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                disableRipple
              >
                {canType ? (
                  <img src={search} alt="Search Icon" />
                ) : (
                  icons.map((icon) => (
                    <SearchIconBox
                      key={icon.type}
                      icon={icon}
                      filterClick={filterClick}
                    />
                  ))
                )}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            "&.MuiOutlinedInput-root": {
              border: theme.palette.border.primary,
              backgroundColor: theme.palette.primary.contrastText,
              color: theme.palette.primary.main,
              fontWeight: "500",
              fontSize: "16px",
              cursor:
                !canType && !(searchQuery || search_query) ? "pointer" : "text",

              "& input": {
                cursor:
                  !canType && !(searchQuery || search_query)
                    ? "pointer"
                    : "text",
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
