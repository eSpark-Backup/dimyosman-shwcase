import { Box, Button, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { close, copyIcon, fbIcon, shareHovered, shareNotHovered } from '../assets'
import { socialShareOptions } from '../constant'
import { useClickOutside } from '../utils'

const ProfileAboutSection = ({ content }) => {
    const theme = useTheme()
    const [showShareBox, setShowShareBox] = useState(false)
    const shareBoxRef = useRef(null);
    const [isIconHovered, setIsIconHovered] = useState(false)

  useClickOutside(shareBoxRef, () => setShowShareBox(false));

    return (
        <Box sx={{ my: "50px" }}>
            {
                content?.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            {
                                item?.type === "heading"
                                    ?
                                    <Typography
                                        variant='h3'
                                        sx={{
                                            textAlign: "left",
                                            color: theme.palette.primary.main,
                                            fontWeight: "600",

                                        }}
                                    >
                                        {item?.content}
                                    </Typography>
                                    :
                                    item?.type === "paragraph"
                                        ?
                                        <Typography
                                            variant='h5'
                                            sx={{
                                                textAlign: "left",
                                                color: theme.palette.primary.main,
                                                fontWeight: "400",
                                            }}
                                        >
                                            {item?.content}
                                        </Typography>
                                        :
                                        item?.type === "breaker"
                                            ?
                                            <br />
                                            :
                                            <img src={item?.content} style={{ width: "100%" }} />
                            }
                        </React.Fragment>
                    )
                })
            }
            <Box sx={{ marginTop: "30px", position: "relative", width: "100%" }}>
                <Button
                    sx={{
                        backgroundColor: "transparent",
                        maxWidth: "10.68px",
                        minWidth: "10.68px",
                        maxHeight: "17.68px",
                        "&:hover": { backgroundColor: "transparent" }
                    }}
                    onClick={() => setShowShareBox(true)}
                    onMouseEnter={() => setIsIconHovered(true)}
                    onMouseLeave={() => setIsIconHovered(false)}>
                    <img src={isIconHovered ? shareHovered : shareNotHovered} alt="" />
                </Button>

                <Box
                    sx={{
                        width: { xs: "100%", sm: "460px" },
                        maxWidth: "100%",
                        backgroundColor: "#FFFFFF",
                        position: "absolute",
                        bottom: "0px",
                        boxShadow: "0px 0px 20px #00141C",
                        borderRadius: "4.53px",
                        p: "16px",
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "32px",
                        opacity: showShareBox ? 1 : 0,
                        visibility: showShareBox ? 'visible' : 'hidden',
                        transform: showShareBox ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 300ms ease-in, transform 300ms ease-in, visibility 0ms 0ms"
                    }}
                    ref={shareBoxRef}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                columnGap: "10px",
                                flexDirection: { xs: "column", sm: "row" }
                            }}
                        >
                            <Box
                                sx={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "5px",
                                    backgroundColor: "rgb(0, 20, 28, 0.2)",
                                    border: "1px solid rgb(209, 219, 215, 0.4)"
                                }}
                            >
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: theme.palette.primary.main
                                }}
                            >
                                Brand/Event/Space Name
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: "transparent",
                                "&:hover": {
                                    backgroundColor: "rgb(209, 219, 215, 0.4)"
                                }
                            }}>
                            <img src={close} alt="Close Icon" style={{ cursor: "pointer" }} onClick={() => setShowShareBox(false)} />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            rowGap: "10px"
                        }}
                    >
                        {socialShareOptions?.map((item, index) => {
                            return (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "57px",
                                            height: "57px",
                                            backgroundColor: "#F2F3F4",
                                            borderRadius: "4.53px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <img src={item?.icon} alt="Icon" />
                                    </Box>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            fontWeight: "400",
                                            color: theme.palette.primary.main
                                        }}
                                    >
                                        {item?.name}
                                    </Typography>
                                </Box>
                            )
                        })}
                    </Box>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            p: "14px",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#F2F3F4",
                            borderRadius: "4.53px",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: "8px", sm: "0px" }
                        }}
                    >
                        <Typography
                            sx={{
                                width: { xs: "100%", sm: "90%" },
                                textAlign: { xs: "center", sm: "left" },
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                        >
                            shwcase.co/NlfVhYygR9mAQasassdsada/Share...
                        </Typography>
                        <img src={copyIcon} alt="Icon" style={{ cursor: "pointer" }} />
                    </Box>


                </Box>

            </Box>
        </Box >
    )
}

export default ProfileAboutSection
