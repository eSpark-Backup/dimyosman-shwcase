import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { activeItemIcon, add, notActiveIcon, subtract, uploadIcon } from '../assets';

const FullWidthImgInput = ({
    HandleChange,
    imageRef,
    HandleInputCLick,
    icon,
    activity,
    editImage,
    handleAdd,
    handleRemove,
    currentIndex,
}) => {
    const theme = useTheme();

    const handleFileChange = (event) => {
        if (HandleChange) {
            HandleChange(event);
        }
        // Reset the file input value to allow selecting the same file again
        if (imageRef && imageRef.current) {
            imageRef.current.value = '';
        }
    };

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
                overflow: "hidden",
            }}
        >
            {/* Image as background */}
            {editImage && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${ editImage })`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        borderRadius: "5px 5px 0 0",
                        zIndex: 1,
                        opacity: 0.5,
                    }}
                />
            )}

            {/* Dimming overlay */}
            {editImage && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent black overlay
                        borderRadius: "5px 5px 0 0",
                        zIndex: 2, // Overlay above the image
                    }}
                />
            )}

            {/* Top-left icon */}
            <Box
                sx={{
                    background: activity === "brand" ? "rgb(196, 119, 127, 0.2)" : "",
                    width: "48px",
                    height: "48px",
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 3, // Above the overlay
                }}
            >
                <img src={icon} alt="Icon" style={{ width: "23px", height: "32px" }} />
            </Box>

            {/* Bottom-right icons */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    display: "flex",
                    columnGap: "20px",
                    zIndex: 3, // Above the overlay
                }}
            >
                {[0, 1, 2].map((index) => (
                    <img
                        key={index}
                        src={index === currentIndex ? activeItemIcon : notActiveIcon}
                        alt={index === currentIndex ? "Active Icon" : "Not Active Icon"}
                        style={{ cursor: "pointer" }}
                    />
                ))}
                <img
                    src={add}
                    alt="Add Icon"
                    style={{ cursor: "pointer" }}
                    onClick={handleAdd}
                />
                <img
                    src={subtract}
                    alt="Remove Icon"
                    style={{ cursor: "pointer" }}
                    onClick={handleRemove}
                />
            </Box>

            {/* Image upload section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    zIndex: 3, // Above the overlay
                }}
                onClick={HandleInputCLick}
            >
                <Typography
                    component="label"
                    sx={{
                        fontSize: "14px",
                        fontWeight: "300",
                        color: theme.palette.primary.main,
                        fontStyle: "italic",
                    }}
                >
                    Upload image:
                </Typography>
                <img src={uploadIcon} alt="Upload Icon" />
                <input
                    type="file"
                    style={{ display: "none" }}
                    ref={imageRef}
                    onChange={handleFileChange} // Use the updated handler
                />
            </Box>
        </Box>
    );
};

export default FullWidthImgInput;
