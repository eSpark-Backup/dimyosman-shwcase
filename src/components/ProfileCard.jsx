import { Box, Button, Typography, useTheme } from '@mui/material'
import React from 'react'
import { accountIcon, brandIcon, brandUserImage, flag, profileBanner, spaceIcon, user } from '../assets'
import { profileStats } from '../constant'

const ProfileCard = ({ userRole = "account" }) => {
    const theme = useTheme()
    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "300px",
                objectFit: "cover"
            }}
        >
            <img src={profileBanner} alt="Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <Button
                sx={{
                    backgroundColor: "rgb(0, 20, 28, 0.2)",
                    height: "48px",
                    minWidth: "48px",
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    ":hover": {
                        backgroundColor: "rgb(0, 20, 28, 0.2)"
                    }
                }}
            >
                <img src={user} alt="User Icon" style={{ width: "31px", height: "32px" }} />

            </Button>
            <Button
                sx={{
                    backgroundColor: "#4d5b60",
                    height: "31px",
                    minWidth: "77px",
                    position: "absolute",
                    top: "10px",
                    right: "20px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "white",
                    ":hover": {
                        backgroundColor: "#4d5b60"
                    }
                }}
            >
                Edit

            </Button>
            <Box
                sx={{
                    position: "absolute",
                    width: { xs: "90%", md: "65%", xl: "35%" },
                    top: "0px",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "white",
                        padding: "10px 50px",
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "3px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "5px"
                    }}
                >
                    <Box
                        sx={{
                            width: "96px",
                            height: "96px",
                            position: "relative"
                        }}
                    >
                        <img src={brandUserImage} alt="User Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <Box
                            sx={{
                                background: userRole === "event" ? "rgb(148, 185, 134)" : userRole === "brand" ? "rgb(196, 119, 127)" : userRole === "space" ? "rgb(120, 150, 195)" : theme.palette.primary.main,
                                width: "16px",
                                height: "16px",
                                position: "absolute",
                                bottom: "0px",
                                right: "0px",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <img src={userRole === "event" ? flag : userRole === "brand" ? brandIcon : userRole === "space" ? spaceIcon : accountIcon} alt="Icon" style={{ width: "12px", height: "10px" }} />
                        </Box>
                    </Box>
                    <Typography
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: "600"
                        }}
                        variant='h1'
                    >
                        Emily Thompson

                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%"
                        }}
                    >
                        {
                            profileStats?.map((item, index) => (

                                <Box
                                    sx={{
                                        display: "flex",
                                        columnGap: "5px"
                                    }}
                                    key={index}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: "300",
                                            color: theme.palette.primary.main
                                        }}
                                        variant='h6'
                                    >{item?.name}</Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: "600",
                                            color: theme.palette.primary.main
                                        }}
                                        variant='h6'
                                    >{item?.value}</Typography>

                                </Box>
                            ))
                        }
                    </Box>

                </Box>
            </Box>

        </Box>
    )
}

export default ProfileCard
