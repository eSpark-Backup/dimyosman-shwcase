import { Box, Button, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { addGrey, brandIcon, brandMain, brandUserImage, comment, eventUserImage, like, share } from '../assets'
import { useNavigate } from 'react-router-dom'

const BrandCard = ({ items, filter1, filter2, filter3 }) => {
    const theme = useTheme()
    const [selectedChoice, setSelectedChoice] = useState(0);
    const navigate = useNavigate()
    return (
        <Box sx={{ mt: "50px" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    rowGap: "10px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        columnGap: "16px",
                        flexDirection: { xs: "column", sm: "row" },
                        rowGap: "2px"
                    }}
                >
                    <Typography variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "400" }}>Show:</Typography>
                    <Typography onClick={() => setSelectedChoice(0)} variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 0 ? "600" : "400", cursor: "pointer" }}>{filter1}</Typography>
                    <Typography onClick={() => setSelectedChoice(1)} variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 1 ? "600" : "400", cursor: "pointer" }}>{filter2}</Typography>
                    <Typography onClick={() => setSelectedChoice(2)} variant='h5' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: selectedChoice === 2 ? "600" : "400", cursor: "pointer" }}>{filter3}</Typography>
                </Box>
                <Button
                    sx={{
                        backgroundColor: "rgb(209, 219, 215, 0.4)",
                        height: "31px",
                        width: "142px",
                        color: theme.palette.primary.main,
                        fontWeight: "600",
                        fontSize: "16px",
                        display: "flex",
                        columnGap: "6px",
                        alignItems: "center",
                        "&:hover": {
                            backgroundColor: "rgb(209, 219, 215, 0.4)",
                        }
                    }}
                    onClick={() => navigate("/new-brand")}
                >
                    <img src={addGrey} alt="" />
                    Add New
                </Button>

            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "30px",
                    mt: "50px",
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
                                    rowGap: "15px",
                                    overflow: "hidden",
                                    width: "100%"
                                }}
                                key={index}
                            >
                                <Box
                                    sx={{
                                        pt: "10px",
                                        pr: "10px",
                                        pl: "10px",
                                        pb: { xs: "10px", xl: "0px" },
                                        width: { xs: "100%", md: "50%" },
                                        rowGap: "30px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
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
                                            {/* <img src={like} alt="Like Icon" /> */}
                                            {/* <img src={comment} alt="Comment Icon" /> */}
                                            <img src={share} alt="Share Icon" />

                                        </Box>
                                        {/* <Typography
                                            sx={{
                                                color: theme.palette.primary.main,
                                                textAlign: "left"
                                            }}
                                            variant="h5"
                                        >
                                            Learn more
                                        </Typography> */}
                                        <Button
                                            sx={{
                                                backgroundColor: "rgb(209, 219, 215, 0.4)",
                                                width: { xs: "150px", sm: "348px" },
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
                                            onClick={() => navigate(`/brand/${item?.id}/edit`)}
                                        >
                                            Edit
                                        </Button>
                                    </Box>

                                </Box>
                                <Box
                                    sx={{
                                        width: { xs: "100%", md: "50%" },
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img
                                        src={item?.brandImage}
                                        alt="Image"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>

                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default BrandCard
