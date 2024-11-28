import { Box, Button, Typography, useTheme } from '@mui/material'
import React from 'react'
import { activeItemIcon, add, brandMain, notActiveIcon, subtract, uploadIcon } from '../assets'
import { useNavigate } from 'react-router-dom'

const FullWidthImgInput = ({ HandleChange, imageRef, HandleInputCLick, icon, activity, editImage }) => {
    const theme = useTheme()
    const naivgate = useNavigate()
    return (
        <Box
            sx={{
                marginTop: "-63px",
                height: activity === "brand" ? "300px" : "500px",
                borderRadius: "5px 5px 0 0",
                border: "1px dashed rgba(0, 20, 28, 0.4)",
                backgroundColor: "rgba(209, 219, 215, 0.2)",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Dimming overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: editImage && `url(${editImage})`,
                    backgroundPosition: "top",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "5px 5px 0 0",
                    zIndex: 1,
                    opacity: editImage ? 0.5 : 1
                }}
            />
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
                    alignItems: "center",
                    zIndex: 2
                }}
            >
                <img src={icon} alt="Icon" style={{ width: "23px", height: "32px" }} />
            </Box>


            <Box
                sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    display: "flex",
                    columnGap: "20px",
                    zIndex: 2
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
                    cursor: "pointer",
                    zIndex: 2
                }}
                onClick={HandleInputCLick}
            >
                <Typography
                    component="label"
                    sx={{
                        fontSize: '14px',
                        fontWeight: "300",
                        color: theme.palette.primary.main,
                        fontStyle: "italic"
                    }}
                >
                    Upload image:
                </Typography>
                <img src={uploadIcon} alt="Icon" />
                <input type="file" style={{ display: "none" }} ref={imageRef} onChange={HandleChange} />
            </Box>
        </Box>

    )
}

export default FullWidthImgInput
