import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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

import { setAllCategoriesNotSearch } from "../store/slices/search";

import { getCookie } from "../utils";

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
}) => {
  const theme = useTheme();

  const isLessThan1024 = useMediaQuery("(max-width:1024px)");

  const token = localStorage.getItem("token");
  const searchQuery = getCookie("search_query");

  const dispatch = useDispatch();

  const { search_query, generalSearchLoading } = useSelector(
    (state) => state.search
  );

  const { data } = useGetGeneralCategoriesQuery(undefined, {
    skip: !token || searchQuery || search_query,
  });

  useEffect(() => {
    if (data?.data?.length && !isLessThan1024) {
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
  }, [data, isLessThan1024]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: "8px",
        cursor: "text",
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
        placeholder={placeholder}
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
              cursor: "text",

              "& input": {
                cursor: "text",
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
