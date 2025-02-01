import React from 'react';
import { Box, FormControl, MenuItem, Select, Typography, useTheme } from '@mui/material';

const Dropdown = ({ label, options, value, onChange, disable, placeholder }) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
            {label && (
                <Typography
                    component="label"
                    sx={{ fontSize: "14px", fontStyle: "italic", textAlign: "left", fontWeight: 300, color: theme.palette.primary.main }}
                >
                    {label}
                </Typography>
            )}
            <FormControl fullWidth variant="outlined">
                <Select
                    value={value || ""}
                    onChange={onChange}
                    label={label}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                            },
                        },
                    }}
                    disabled={disable}
                    displayEmpty
                >
                    {placeholder && (
                        <MenuItem value="" disabled>
                            {placeholder}
                        </MenuItem>
                    )}
                    {options?.map((option,index) => (
                        <MenuItem key={index} value={option?.value}>
                            {option?.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default Dropdown;
