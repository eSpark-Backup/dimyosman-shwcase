import React, { useEffect } from 'react'
import { Box, FormControl, MenuItem, Select, Typography, useTheme } from '@mui/material';
const Dropdown = ({ label, options, value, onChange, disable, placeholder }) => {
    const theme = useTheme()
    useEffect(() => {
        if (!value && options?.length > 0) {
            onChange({ target: { value: options[0].value } });
        }
    }, [value, options, onChange]);
    return (
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "8px" }}>
            {label && (
                <Typography
                    sx={{ fontStyle: "italic", textAlign: "left", fontWeight: 300, color: theme.palette.primary.main }}
                    variant="h6"
                >
                    {label}
                </Typography>
            )}
            <FormControl fullWidth variant="outlined">
                <Select
                    value={value || (options?.length > 0 ? options[0].value : "")}
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
                    placeholder={placeholder}

                >
                    {options?.map((option) => (
                        <MenuItem key={option?.value} value={option?.value}>
                            {option?.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default Dropdown
