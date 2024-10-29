import { Box, IconButton, InputAdornment, TextField, Typography, useTheme } from '@mui/material'
import React from 'react'
import { search } from '../assets'

const SearchBar = ({ label, name, placeholder, onInputChange, value, helperText, error, onBlur }) => {
    const theme = useTheme();
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
                type='text'
                name={name}
                placeholder={placeholder}
                onChange={onInputChange}
                value={value}
                helperText={helperText}
                error={error}
                onBlur={onBlur}
                variant='outlined'
                InputProps={
                    {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
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
                                fontSize: "16px"
                            }
                        }
                    }
                }


            />
        </Box>
    )
}

export default SearchBar

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
