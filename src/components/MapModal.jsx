import React from 'react'
import Input from './input'
import { Box, Button, IconButton, InputAdornment, Typography, useTheme } from '@mui/material'
import { locationIcon, modalMap } from '../assets'

const MapModal = ({ value, setValue, addressLine, address, handleClose, buttonVal }) => {
    const theme = useTheme()
    return (
        <>
            <Input value={value} type={"text"} placeholder={"Type Address..."} onInputChange={(e) => setValue(e.target.value)} endAdornment={<InputAdornment position="end">
                <IconButton>
                    <img src={locationIcon} alt="" />
                </IconButton>
            </InputAdornment>} />
            <img src={modalMap} alt='Modal Map' />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "3px"
                }}
            >
                <Typography
                    variant='h5'
                    sx={{
                        textAlign: "left",
                        color: theme.palette.primary.main,
                        fontWeight: "600"
                    }}
                >
                    <span style={{ fontWeight: "300" }}>{addressLine} </span>
                    {address}
                </Typography>
                <Input type={"text"} placeholder={"Additional instructions like entrances, flores..."} />

            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    sx={{
                        height: "31px",
                        width: "92px",
                        background: "rgba(209, 219, 215, 0.4)",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: theme.palette.primary.main,
                        "&:hover": {
                            backgroundColor: "rgba(209, 219, 215, 0.4)"
                        }
                    }}
                    onClick={handleClose}
                >
                    {buttonVal}
                </Button>
            </Box>
        </>
    )
}

export default MapModal
