import { Box, Button, Typography, useTheme } from '@mui/material'
import React from 'react'
import { brandIcon, brandMain, brandUserImage, comment, eventUserImage, like, share } from '../assets'

const BrandCard = ({ items }) => {
    const theme = useTheme()
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "30px"
            }}
        >
            {
                items?.map((item, index) => {
                    return (
                        <Box
                            sx={{
                                border: "1px solid #eff2f1",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: { xs: "column", md: "row" },
                                rowGap: "15px"
                            }}
                            key={index}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    pt: "10px",
                                    pr: "10px",
                                    pl: "10px",
                                    pb: { xs: "10px", xl: "0px" },
                                    width: { xs: "100%", md: "49%" },
                                    rowGap: "30px"
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { xs: "100%", md: "80%" },
                                        display: "flex",
                                        columnGap: "10px",
                                        alignItems: { xs: "flex-start", sm: "center" },
                                        flexDirection: { xs: "column", sm: "row" },
                                        rowGap: "10px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "64px",
                                            height: "64px",
                                            position: "relative"
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                borderRadius: "5px",
                                                border: "1px solid rgb(209, 219, 215, 0.4)",
                                                height: "62px"
                                            }}
                                        >
                                            <img src={item?.profileImage} alt="User Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </Box>
                                        <Box
                                            sx={{
                                                background: "rgb(196, 119, 127)",
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
                                            <img src={brandIcon} alt="Icon" style={{ width: "12px", height: "10px" }} />
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            columnGap: "5px",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: theme.palette.primary.main,
                                                fontWeight: "600",
                                                textAlign: "left",
                                            }}
                                            variant="h3"
                                        >
                                            {item?.brandName}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: theme.palette.primary.main,
                                                fontWeight: "400",
                                                textAlign: "left",
                                                fontSize: { xs: "10px", lg: "16px" }
                                            }}
                                            variant="h5"
                                        >
                                            {item?.brandCategory}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant='h5' sx={{ fontWeight: '400', color: theme.palette.primary.main, textAlign: "left" }}>
                                    {item?.description}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexDirection: { xs: "column", lg: "row" },
                                        rowGap: "15px",
                                        alignItems: "center"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            columnGap: "25px",
                                        }}
                                    >
                                        <img src={like} alt="Like Icon" />
                                        <img src={comment} alt="Comment Icon" />
                                        <img src={share} alt="Share Icon" />

                                    </Box>
                                    <Typography
                                        sx={{
                                            color: theme.palette.primary.main,
                                            textAlign: "left"
                                        }}
                                        variant="h5"
                                    >
                                        Learn more
                                    </Typography>
                                    <Button
                                        sx={{
                                            backgroundColor: "rgb(209, 219, 215, 0.4)",
                                            width: { xs: "150px", sm: "220px" },
                                            height: "31px",
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            color: theme.palette.primary.main,
                                            display: "flex",
                                            columnGap: "5px",
                                            textTransform: "none",
                                            ":hover": {
                                                backgroundColor: "rgb(209, 219, 215, 0.4)"
                                            }
                                        }}
                                    >
                                        RSVP
                                    </Button>
                                </Box>

                            </Box>
                            <Box
                                sx={{
                                    width: { xs: "100%", md: "49%" },
                                    flex: 1,
                                }}
                            >
                                <img
                                    src={item?.brandImage}
                                    alt="Image"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                        </Box>
                    )
                })
            }
        </Box>
    )
}

export default BrandCard
