import { Box, IconButton, InputAdornment } from "@mui/material";

import Input from "../input";

import { search } from "../../assets";

const SearchMessage = () => {
  return (
    <Box sx={{ margin: "16px 0px" }}>
      <Input
        name="message"
        type="text"
        placeholder="Search Messages..."
        sx={{
          backgroundColor: "white",
          border: "1px solid rgba(209, 219, 215, 0.5)",
          borderRadius: "5px",
          padding: "0 16px",
          "& input": {
            paddingRight: 0,
            paddingLeft: 0,
          },
          "& input::placeholder": {
            color: "rgba(0, 20, 28, 0.5)",
          },
        }}
        endAdornment={
          <InputAdornment position="start">
            <IconButton edge="end">
              <img src={search} alt="Search" />
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  );
};

export default SearchMessage;
