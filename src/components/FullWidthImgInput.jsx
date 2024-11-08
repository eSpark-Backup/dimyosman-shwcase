import { Box, Button, Typography, useTheme } from '@mui/material'
import React from 'react'
import { activeItemIcon, add, notActiveIcon, subtract, uploadIcon } from '../assets'
import { useNavigate } from 'react-router-dom'

const FullWidthImgInput = ({ HandleChange, imageRef, HandleInputCLick, icon, activity }) => {
    const theme = useTheme()
    const naivgate = useNavigate()
    return (
        <Box
            sx={{
                height: activity === "brand" ? "300px" : "500px",
                borderRadius: "5px 5px 0 0",
                border: "1px dashed rgb(0, 20, 28, 0.4)",
                backgroundColor: "rgb(209, 219, 215, 0.2)",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Box
                sx={{
                    background: activity === "brand" ? "rgb(196, 119, 127, 0.2)" : activity === "event" ? "rgb(148, 185, 134, 0.3)" : "",
                    width: "48px",
                    height: "48px",
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <img src={icon} alt="Icon" style={{ width: "23px", height: "32px" }} />
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    top: { xs: "10px", md: "10px" },
                    right: "10px",
                    display: "flex",
                    columnGap: "25px",
                    // flexWrap: "wrap",
                    rowGap: "10px",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "flex-end",
                    alignItems: "flex-end"
                }}
            >
                <Button
                    sx={{
                        fontSize: "16px",
                        width: "143px",
                        height: "31px",
                        textTransform: "none",
                    }}
                    onClick={() => naivgate(`/${activity}`)}
                >
                    Save as Draft

                </Button>
                <Button
                    sx={{
                        fontSize: "16px",
                        width: "103px",
                        height: "31px",
                        backgroundColor: "rgb(0, 20, 28, 0.9)",
                        textTransform: "none",
                    }}
                >
                    Publish

                </Button>
                <Button
                    sx={{
                        fontSize: "16px",
                        width: "102px",
                        height: "31px",
                        textTransform: "none",
                    }}
                    onClick={() => naivgate(`/${activity}`)}
                >
                    Archive

                </Button>
            </Box>
            <Box
                sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    display: "flex",
                    columnGap: "20px"
                }}
            >
                <img src={activeItemIcon} alt="Icon" style={{ cursor: "pointer" }} />
                <img src={notActiveIcon} alt="Icon" style={{ cursor: "pointer" }} />
                <img src={notActiveIcon} alt="Icon" style={{ cursor: "pointer" }} />
                <img src={add} alt="Icon" style={{ cursor: "pointer" }} />
                <img src={subtract} alt="Icon" style={{ cursor: "pointer" }} />

            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "0px",
                    cursor: "pointer"
                }}
                onClick={HandleInputCLick}
            >
                <Typography
                    sx={{
                        fontSize: '14px',
                        fontWeight: "300",
                        color: theme.palette.primary.main,
                        fontStyle: "italic"
                    }}
                >
                    upload image:
                </Typography>
                <img src={uploadIcon} alt="Icon" />
                <input type="file" style={{ display: "none" }} ref={imageRef} onChange={HandleChange} />
            </Box>
        </Box>
    )
}

export default FullWidthImgInput
