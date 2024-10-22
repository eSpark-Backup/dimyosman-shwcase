import { Box, TextField, Typography } from "@mui/material";

const Input = ({ onInputChange, name, label, type, placeholder, value, onBlur, error, helperText }) => {
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
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onInputChange}
        value={value}
        helperText={helperText}
        error={error}
        onBlur={onBlur}
      />
    </Box>
  );
};

export default Input;
