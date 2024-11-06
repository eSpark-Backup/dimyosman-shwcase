import { Box, Button, Typography, useTheme } from '@mui/material'
import React from 'react'
import { calender, eventBadge, spaceIcon } from '../assets'

const SpaceCard = ({ onClick, spaces, showBtn }) => {
    const theme = useTheme()
    return (
        <Box
            onClick={onClick ? onClick : () => { }}
            sx={{
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #e8ebed",
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                pb: "10px",
                cursor: onClick ? "pointer" : "default",
            }}
        >
            <img
                style={{ borderRadius: "5px 5px 0 0 " }}
                width="100%"
                height="100%"
                src={spaces?.spacePic}
                alt="space-img"
            />
            <Box
                sx={{
                    background: "rgb(120, 150, 195)",
                    width: "24px",
                    height: "24px",
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <img src={spaceIcon} alt="Icon" style={{ width: "12px", height: "12px" }} />
            </Box>
            <Box padding={2} sx={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                <Typography textAlign="left" fontSize={20} fontWeight={600}>
                    {spaces?.spaceName}
                </Typography>
                <Typography textAlign="left" fontWeight={300} variant="h5">
                    {spaces?.spaceAddress}
                </Typography>
                <Typography textAlign="left" fontWeight={400} variant="h6">
                    {spaces?.spaceDescription}
                </Typography>
                <Typography fontWeight={600} variant="h5" textAlign="left">
                    Lease from:
                </Typography>
                <Typography fontWeight={600} variant="h1" textAlign="left">
                    {spaces?.spacePrice}
                </Typography>
                <Typography fontWeight={300} variant="h6" textAlign="left">
                    {spaces?.spaceDeadline}
                </Typography>

            </Box>
            {showBtn &&
                <Button
                    sx={{
                        width: "90%",
                        backgroundColor: "rgb(209, 219, 215, 0.4)",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: theme.palette.primary.main,
                        display: "flex",
                        columnGap: "10px",
                        "&:hover": {
                            backgroundColor: "rgb(209, 219, 215, 0.4)"
                        }
                    }}
                >
                    <img src={calender} alt='Calender Icon' />
                    Inquire
                </Button>
            }
        </Box>
    )
}

export default SpaceCard
