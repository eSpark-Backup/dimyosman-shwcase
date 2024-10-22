import { Box, TextField, Typography } from "@mui/material";

const Input = ({ onInputChange, name, label, type, placeholder, value }) => {
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
        onChange={(e) => onInputChange(name, e.target.value)}
        value={value}
      />
    </Box>
  );
};

export default Input;
