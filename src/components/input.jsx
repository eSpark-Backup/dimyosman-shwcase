import { useState } from "react";
import { Box, IconButton, InputAdornment, TextField, Typography, useTheme } from "@mui/material";
import { eye } from "../assets";
import RemoveRedEyeSharpIcon from '@mui/icons-material/RemoveRedEyeSharp';

const Input = ({ login, onInputChange, name, label, type, placeholder, value, onBlur, error, helperText, sx, multiline, endAdornment }) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme()

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
      {label && (
        <Typography
          sx={{ fontSize: login ? "12px" : "14px", fontStyle: "italic", textAlign: "left", fontWeight: 300, color: theme.palette.primary.main }}
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
        multiline={multiline}
        sx={{
          "& .MuiOutlinedInput-root": {
            ...sx, // Apply sx styles to the OutlinedInput root
          },
        }}
        InputProps={{
          endAdornment: endAdornment || (
            type === "password" ? (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end" sx={{ marginRight: "0px" }}>
                  {!showPassword ? (
                    <RemoveRedEyeSharpIcon style={{ color: "#ACB4B5", fontSize: "22px" }} />
                  ) : (
                    <img src={eye} alt="eye" />
                  )}
                </IconButton>
              </InputAdornment>
            ) : null
          ),
        }}
      />
    </Box>
  );
};

export default Input;
