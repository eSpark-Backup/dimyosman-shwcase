import { Box, Button, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { accountIcon, brandIcon, eventMain, eventMain2, eventMain3, flag, spaceIcon, uploadIcon, user } from '../assets'
import { profileStats } from '../constant'
import { useLocation, useNavigate } from 'react-router-dom'
import ReusableModal from './Modal'
import ImageModal from './ImageModal'

const ProfileCard = ({ userRole = "account", isEdit, handleProfileImgClick, handleProfileChange, profileImgRef, handleMainImgChange, mainImgRef, handleMainImgClick, coverImg, userProfileImg, userName }) => {
    const theme = useTheme()
    const location = useLocation()
    const navigate = useNavigate();
    const [showImageModal, setShowImageModal] = useState(false)

    const handleModalClose = () => {
        setShowImageModal(false)
        console.log("Hello")
    }
    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    minHeight: { xs: "400px", lg: "180px" },
                    flex: 1,
                    backgroundImage: !isEdit && `url(${coverImg})`,
                    backgroundPosition: !isEdit && "center",
                    backgroundSize: !isEdit && "cover",
                    backgroundRepeat: !isEdit && "no-repeat",
                    backgroundColor: isEdit && "rgb(209, 219, 215, 0.2)",
                    border: isEdit && "1px dashed rgb(0, 20, 28, 0.4)",
                    cursor: "pointer"
                }}
                onClick={() => setShowImageModal(true)}
            >
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
                        backgroundColor: isEdit ? "rgb(0, 20, 28, 0.9)" : "#4d5b60",
                        height: "31px",
                        minWidth: isEdit ? "103px" : "77px",
                        position: "absolute",
                        top: "10px",
                        right: { xs: "0px", lg: "20px" },
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "white",
                        ":hover": {
                            backgroundColor: isEdit ? "rgb(0, 20, 28, 0.9)" : "#4d5b60"
                        }
                    }}
                    onClick={() => isEdit ? navigate(`/profile/${location?.pathname.split("/").at(-1)}`) : navigate(`/profile/edit/${location?.pathname.split("/").at(-1)}`)}
                >
                    {
                        isEdit ? "Publish" : "Edit"
                    }

                </Button>
                <Box
                    sx={{
                        position: "absolute",
                        width: { xs: "90%", md: "70%", xl: "35%" },
                        top: { xs: "50%", md: "0px" },
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "white",
                            padding: { xs: "10px 10px", lg: "10px 50px" },
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "3px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "5px"
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
                                        pt: "15px"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            rowGap: "0px",
                                            cursor: "pointer"
                                        }}
                                        onClick={handleProfileImgClick}
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
                                        <input type="file" style={{ display: "none" }}
                                            ref={profileImgRef} onChange={handleProfileChange}
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
                                    <img src={userProfileImg} alt="User Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                {
                    isEdit
                    &&
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: "20px",
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
                            <img src={uploadIcon} alt="Icon" />
                            <input type="file" style={{ display: "none" }}
                                ref={mainImgRef} onChange={handleMainImgChange}
                            />
                        </Box>
                    </Box>
                }



            </Box>
            <ReusableModal hideHeader={true} open={showImageModal} handleClose={handleModalClose}>
                <ImageModal slides={[eventMain, eventMain2, eventMain3]} />
            </ReusableModal>
        </>
    )
}

export default ProfileCard
