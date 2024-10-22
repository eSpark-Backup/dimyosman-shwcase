import { useState } from "react";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { eye } from "../assets";

const Input = ({ onInputChange, name, label, type, placeholder, value, onBlur, error, helperText }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
      {label && (
        <Typography
          sx={{ fontStyle: "italic", textAlign: "left", fontWeight: 300 }}
          variant="h6"
        >
          {label}
        </Typography>
      )}
      <TextField
        type={showPassword ? "text" : type}
        name={name}
        placeholder={placeholder}
        onChange={onInputChange}
        value={value}
        helperText={helperText}
        error={error}
        onBlur={onBlur}
        InputProps={
          type === "password"
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      <img src={eye} alt="eye" />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}
        }
      />
    </Box>
  );
};

export default Input;
