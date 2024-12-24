import { Box, Button, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { accountIcon, brandIcon, eventMain, eventMain2, eventMain3, flag, spaceIcon, uploadIcon, user } from '../assets'
import { profileStats } from '../constant'
import { useLocation, useNavigate } from 'react-router-dom'
import ReusableModal from './Modal'
import ImageModal from './ImageModal'

const ProfileCard = ({ userRole = "account", isEdit, handleProfileImgClick, handleProfileChange, profileImgRef, handleMainImgChange, mainImgRef, handleMainImgClick, coverImg, userProfileImg, userName, imgUrl }) => {
    const theme = useTheme()
    const location = useLocation()
    const navigate = useNavigate();
    const [showImageModal, setShowImageModal] = useState(false)
    const [previewImage, setPreviewImage] = useState(imgUrl ? imgUrl : null);
    const [coverPreview, setCoverPreview] = useState(coverImg || null);



    const handleModalClose = () => {
        setShowImageModal(false)
    }

    const handleImageChange = (event) => {
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

    const handleMainImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        handleMainImgChange(event);
    };
    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    minHeight: { xs: "400px", md: "180px" },
                    flex: 1,
                    backgroundImage: isEdit && coverPreview
                        ? `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${coverPreview})`
                        : !isEdit && `url(${coverImg})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: isEdit && "rgba(209, 219, 215, 0.2)",
                    border: isEdit && "1px dashed rgba(0, 20, 28, 0.4)",
                    cursor: "pointer",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                }}
                onClick={() => !isEdit && setShowImageModal(true)}
            >
                {isEdit && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            zIndex: 1,
                            pointerEvents: "none",
                            borderTopLeftRadius: "5px",
                            borderTopRightRadius: "5px",
                        }}
                    />
                )}
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
                        zIndex: 99
                    }}
                >
                    <figure
                        style={{ width: "100%", height: "100%" }}
                        role="img"

                    >
                        <img src={user} alt="User Icon" style={{ width: "31px", height: "32px" }} />
                    </figure>

                </Button>
                <Button
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
                        zIndex: 99
                    }}
                    onClick={() => isEdit ? navigate(`/profile/${location?.pathname.split("/").at(-2)}`) : navigate(`/profile/${location?.pathname.split("/").at(-1)}/edit`)}
                >
                    {
                        isEdit ? "Publish" : "Edit"
                    }

                </Button>
                <Box
                    sx={{
                        position: "absolute",
                        width: { xs: "90%", md: "70%", lg: "50%", xl: "40%" },
                        top: { xs: "50%", md: "10px", lg: "10px", xl: "20px" },
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 99
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
                                            //  onChange={handleProfileChange}
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
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                flexWrap: "wrap"
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
                                        >{item?.name}</Typography>
                                        <Typography
                                            sx={{
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
                {
                    isEdit
                    &&
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: "20px",
                            zIndex: 99
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: "0px",
                                cursor: "pointer"
                            }}
                            onClick={handleMainImgClick}
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
                            <figure
                                style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "centers" }}
                                role="img"

                            >
                                <img src={uploadIcon} alt="Icon" />
                            </figure>
                            <input type="file" style={{ display: "none" }}
                                ref={mainImgRef} onChange={handleMainImageChange}
                            />
                        </Box>
                    </Box>
                }



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
                    <ImageModal slides={[eventMain, eventMain2, eventMain3]} />
                </Box>
            </ReusableModal>
        </>
    )
}

export default ProfileCard
