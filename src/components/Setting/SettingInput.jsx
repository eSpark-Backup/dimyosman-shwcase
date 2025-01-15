import { useState } from "react";

import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";

import { eye } from "../../assets";

const SettingInput = ({
  label,
  name,
  type,
  value,
  onInputChange,
  onBlur,
  error,
  helperText,
  placeholder,
  stackStyle,
  textFieldStyle,
  labelStyle,
  isEditable,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Stack sx={{ ...stackStyle }}>
      <Typography component="label" sx={labelStyle}>
        {label}
      </Typography>

      {isEditable ? (
        <TextField
          type={showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          onChange={onInputChange}
          value={value}
          helperText={helperText}
          error={error}
          onBlur={onBlur}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              ...textFieldStyle,
              padding: "0px",
              "& input": {
                fontWeight: 600,
                padding: "16px",
                "&::placeholder": {
                  opacity: 0.5,
                },
              },
            },
          }}
          InputProps={{
            endAdornment:
              type === "password" ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{ marginRight: "0px" }}
                  >
                    {!showPassword ? (
                      <RemoveRedEyeSharpIcon
                        style={{ color: "#ACB4B5", fontSize: "22px" }}
                      />
                    ) : (
                      <img src={eye} alt="eye" />
                    )}
                  </IconButton>
                </InputAdornment>
              ) : null,
          }}
        />
      ) : (
        <Typography
          style={{
            fontWeight: 600,
            lineHeight: "22px",
            fontFamily: `"Segoe UI", "sans-serif"`,
            paddingLeft: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: 1,
            height: "43px",
          }}
        >
          {value}
        </Typography>
      )}
    </Stack>
  );
};

export default SettingInput;
