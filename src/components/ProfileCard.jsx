import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { accountIcon, activeItemIcon, add, brandIcon, eventMain, eventMain2, eventMain3, flag, notActiveIcon, spaceIcon, subtract, uploadIcon, user } from '../assets'
import { useLocation, useNavigate } from 'react-router-dom'
import ReusableModal from './Modal'
import ImageModal from './ImageModal'
import { LoadingButton } from '@mui/lab'

const ProfileCard = ({ userRole = "account", isEdit, handleProfileImgClick, handleProfileChange, profileImgRef, handleMainImgChange, mainImgRef, coverImg, userProfileImg, userName, imgUrl, editImage, cover, currentIndex, HandleSlideChange, HandleInputCLick, handleRemove, onClick, loading, profileStats }) => {
    const theme = useTheme()
    const location = useLocation()
    const navigate = useNavigate();
    const [showImageModal, setShowImageModal] = useState(false)
    const [previewImage, setPreviewImage] = useState(userProfileImg ? userProfileImg : null);

    const handleModalClose = () => {
        setShowImageModal(false)
    }

    useEffect(() => {
        setPreviewImage(userProfileImg);
    }, [userProfileImg]);

    useEffect(() => {
        console.log(editImage)
     }, [editImage])


    // const handleImageChange = (event) => {
    //     handleProfileChange(event);
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             setPreviewImage(e.target.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleImageChange = (event) => {
        console.log("Hello")
        handleProfileChange(event);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + cover?.length > 3) {
            toast.error("You can not select more than 3 images. Please first remove the selected image")
        } else {
            if (handleMainImgChange) {
                handleMainImgChange(files);
            }
        }
        // Reset the file input value to allow selecting the same file again
        if (mainImgRef && mainImgRef.current) {
            mainImgRef.current.value = '';
        }
    };

    const images = cover?.map((item) => (item?.url))
    return (
        <>
            <Box
                sx={{
                    height: "220px",
                    borderRadius: "5px 5px 0 0",
                    border: "1px dashed rgba(0, 20, 28, 0.4)",
                    backgroundColor: "rgba(209, 219, 215, 0.2)",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // overflow: "hidden",
                }}
                onClick={() => !isEdit && setShowImageModal(true)}
            >
                {editImage && (
                    <img
                        src={editImage}
                        alt="edit"
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            borderRadius: "5px 5px 0 0",
                        }}
                    />
                )}
                {editImage && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgb(185 185 185 / 40%)",
                            borderRadius: "5px 5px 0 0",
                            zIndex: 2,
                        }}
                    />
                )}
                {isEdit && <Box
                    sx={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        display: "flex",
                        columnGap: "20px",
                        zIndex: 3,
                    }}
                >

                    <img
                        src={add}
                        alt="Add Icon"
                        style={{ cursor: "pointer" }}
                        onClick={HandleInputCLick}
                    />
                    <img
                        src={subtract}
                        alt="Remove Icon"
                        style={{ cursor: "pointer" }}
                        onClick={handleRemove}
                    />
                    {Array.from({ length: cover?.length }).map((_, index) => (
                        <img
                            key={index}
                            src={index === currentIndex ? activeItemIcon : notActiveIcon}
                            alt={index === currentIndex ? "Active Icon" : "Not Active Icon"}
                            style={{ cursor: "pointer" }}
                            onClick={() => HandleSlideChange(index)}
                        />
                    ))}
                </Box>}
                {
                    isEdit && <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            cursor: "pointer",
                            zIndex: 3,
                            position: "absolute",
                            right: 10,
                            bottom: 0
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
                            ref={mainImgRef}
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Box>
                }
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
                        },
                        zIndex: 8
                    }}
                >
                    <figure
                        style={{ width: "100%", height: "100%" }}
                        role="img"

                    >
                        <img src={user} alt="User Icon" style={{ width: "31px", height: "32px" }} />
                    </figure>

                </Button>
                <LoadingButton
                    sx={{
                        backgroundColor: isEdit ? "rgb(0, 20, 28, 0.9)" : "#4d5b60",
                        height: "31px",
                        minWidth: isEdit ? "103px" : "77px",
                        position: "absolute",
                        top: "10px",
                        right: { xs: "0px", sm: "5px", lg: "20px" },
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "white",
                        ":hover": {
                            backgroundColor: isEdit ? "rgb(0, 20, 28, 0.9)" : "#4d5b60"
                        },
                        zIndex: 8
                    }}
                    onClick={() => {
                        if (isEdit) {
                            if (onClick) {
                                onClick();
                            }
                        } else {
                            navigate(`/profile/${location?.pathname.split("/").at(-1)}/edit`);
                        }
                    }}
                    loading={loading}
                    loadingIndicator={<CircularProgress size={20} sx={{ color: "#FFFFFF" }} />}
                >
                    {
                        isEdit ? "Publish" : "Edit"
                    }

                </LoadingButton>
                <Box
                    sx={{
                        position: "absolute",
                        width: { xs: "90%", md: "70%", lg: "50%", xl: "40%" },
                        top: { xs: "50%", md: "20px" },
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 8
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            padding: { xs: "10px 10px", lg: "10px 25px" },
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "3px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "5px",
                        }}
                    >
                        {
                            isEdit
                                ?
                                <Box
                                    sx={{
                                        height: "96px",
                                        width: "96px",
                                        border: "1px dashed rgb(0, 20, 28, 0.4)",
                                        backgroundColor: "rgb(209, 219, 215, 0.2)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        pt: "15px",
                                        overflow: "hidden",
                                        position: "relative",
                                        borderRadius: "5px"
                                    }}
                                >
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                opacity: 0.5,
                                                borderRadius: '5px',
                                                pointerEvents: "none", // ✅ Allows clicks to pass through
                                            }}
                                        />
                                    )}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            rowGap: "0px",
                                            cursor: "pointer",
                                        }}
                                        onClick={handleProfileImgClick}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '14px',
                                                fontWeight: "300",
                                                color: theme.palette.primary.main,
                                                fontStyle: "italic",
                                                textAlign: "center"
                                            }}
                                        >
                                            upload image:
                                        </Typography>

                                        <figure
                                            style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                                            role="img"

                                        >
                                            <img src={uploadIcon} alt="Icon" />
                                        </figure>
                                        <input type="file" style={{ display: "none" }}
                                            ref={profileImgRef}
                                            onChange={handleImageChange}
                                        />
                                    </Box>

                                </Box>
                                :
                                <Box
                                    sx={{
                                        width: "96px",
                                        height: "96px",
                                        position: "relative"
                                    }}
                                >
                                    <figure
                                        style={{ width: "100%", height: "100%" }}
                                        role="img"

                                    >
                                        <img src={userProfileImg} alt="User Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                                    </figure>
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

                                        <figure
                                            style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                                            role="img"

                                        >
                                            <img src={userRole === "event" ? flag : userRole === "brand" ? brandIcon : userRole === "space" ? spaceIcon : accountIcon} alt="Icon" style={{ width: "12px", height: "10px" }} />
                                        </figure>
                                    </Box>
                                </Box>
                        }
                        <Typography
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: "600"
                            }}
                            variant='h1'
                        >
                            {userName}

                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                flexWrap: "wrap",
                                gap: "16px",
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
                                                fontSize: "12px",
                                                fontWeight: "300",
                                                color: theme.palette.primary.main
                                            }}
                                        >{item?.name}</Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                color: theme.palette.primary.main
                                            }}
                                        >{item?.value}</Typography>

                                    </Box>
                                ))
                            }
                        </Box>

                    </Box>
                </Box>




            </Box>
            <ReusableModal hideHeader={true} open={showImageModal} handleClose={handleModalClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "95%", md: "75%", lg: "50%", xl: "40%" },
                        ".swiper": {
                            height: "65vh !important",
                        },
                        ":focus-visible": {
                            outline: "none !important",
                        },
                        ".slide-content": {
                            height: "100% !important",
                            img: {
                                height: "100%",
                                width: "auto",
                                objectFit: "cover",
                                borderRadius: "10px",
                            },
                        },
                    }}
                >
                    <ImageModal slides={images} />
                </Box>
            </ReusableModal>
        </>
    )
}

export default ProfileCard
