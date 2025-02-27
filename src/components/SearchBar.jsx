import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { search } from "../assets";

import { setAllCategoriesNotSearch, setSearchQuery } from "../store/slices/search";

import { getCookie, setCookie } from "../utils";

import { useGetGeneralCategoriesQuery } from "../services/general";

const SearchBar = ({
  label,
  name,
  placeholder,
  onInputChange,
  value,
  helperText,
  error,
  onBlur,
  // handleFilterDrawer,
  canType
}) => {
  const theme = useTheme();

  const isLessThan1281 = useMediaQuery("(max-width:1281px)");

  const token = localStorage.getItem("token")
  const searchQuery = getCookie("search_query")

  // const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {search_query} = useSelector(state => state.search)

  const { data } = useGetGeneralCategoriesQuery(undefined, {
    skip: !token, // pathname === "/search",
  });

  useEffect(() => {
    if (data?.data?.length && !isLessThan1281) {
      const updatedCategories = data?.data
        .map((category, index) => ({
          id: index,
          name: category,
          selected: false,
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
        // cursor: pathname !== "/search" ? "pointer" : "default",
        cursor: !canType && !(searchQuery || search_query) ? "pointer" : "default",
      }}
      onClick={() => {
        // if (pathname !== "/search" || isLessThan1281) {
        //   handleFilterDrawer && handleFilterDrawer();
        // }
        if (!canType && !(searchQuery || search_query) || isLessThan1281) {
          navigate("/activity")
          setCookie("search_query", true);
          dispatch(setSearchQuery(true))
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
        // placeholder={placeholder}
        placeholder={!(searchQuery || search_query) ? placeholder : "Search Query"}
        onChange={onInputChange}
        value={value}
        helperText={helperText}
        error={error}
        onBlur={onBlur}
        variant="outlined"
        InputProps={{
          readOnly: canType ? false : true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton sx={{ pointerEvents: "none" }}>
                <img src={search} alt="Search Icon" />
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
              // cursor: pathname !== "/search" ? "pointer" : "default",
              cursor: !canType && !(searchQuery || search_query) ? "pointer" : canType ? 'text' : "default",

              "& input": {
                // cursor: pathname !== "/search" ? "pointer" : "default",
                cursor: !canType && !(searchQuery || search_query) ? "pointer" : canType ? 'text' : "default",
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;

// "&.searchBar": {
//     border: "1px solid #D1DBD7",
//     borderRadius: "5px",
//     height: "48px",
//     color: "red",
//     fontSize: "16px",
//     fontWeight: "500",
//     backgroundColor: "red",
//     padding: " 0px 15px",
//     ":focus": {
//       border: "1px solid #D1DBD7",
//     },
//   },
