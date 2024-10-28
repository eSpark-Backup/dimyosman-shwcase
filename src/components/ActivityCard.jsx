import React from 'react'
import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { accountIcon, brandIcon, brandMain, calender, comment, eventMain, eventMain2, eventMain3, flag, like, miniMap, miniMap2, share, spaceIcon, spaceMain } from "../assets/index.js";
import DynamicPaginationSwiper from './Slider.jsx';

const ActivityCard = ({ userName, userRole, userImage, mainImage, activity, activityName, activityMaker, content, activityImage, activityLocation, activityLocation2, activityAddress, value, deadline, features, slides }) => {
    const theme = useTheme()
    return (
        <Box
            sx={{
                background: theme.palette.primary.contrastText,
                py: "20px",
                borderRadius: "5px",
                rowGap: "25px",
                flexDirection: "column",
                display: "flex"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    padding: { xs: "0px 8px", md: "0px 20px" },
                    flexDirection: { xs: "column", sm: "row" },
                    rowGap: "10px",
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
                            <img src={userImage} alt="User Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Box>
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
                    <Box
                        sx={{
                            display: "flex",
                            columnGap: "5px",
                            flexDirection: { xs: "row", sm: "row" },
                            alignItems: "center"
                        }}
                    >
                        <Typography
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: "600",
                                textAlign: "left",
                                fontSize: { xs: "12px", lg: "16px" }
                            }}
                            variant="h5"
                        >
                            {userName}
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
                            published a new {activity === "event" ? "Event!" : activity === "brand" ? "Brand!" : "Space!"}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        background: activity === "event" ? "rgba(148, 185, 134, 0.3)" : activity === "brand" ? "rgba(196, 119, 127, 0.2)" : "rgba(120, 150, 195, 0.3)",
                        width: "48px",
                        height: "48px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img src={activity === "event" ? flag : activity === "brand" ? brandIcon : spaceIcon} alt="" />
                </Box>

            </Box>
            {
                slides?.length !== 1
                    ?

                    <Box
                        sx={{
                            width: "100%"
                        }}
                    > <DynamicPaginationSwiper slides={slides} />

                    </Box>
                    :
                    <img src={slides[0]} alt="Activity" style={{ width: "100%" }} />
            }
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: { xs: "0px 8px", md: "0px 20px" },
                    flexDirection: { xs: "column", lg: "row" },
                    rowGap: "10px"
                }}
            >
                <Box
                    sx={{
                        width: { xs: "100%", lg: activity === "brand" ? "100%" : "60%" },
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "20px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            columnGap: "15px",
                            alignItems: { xs: "flex-start", sm: "center" },
                            flexDirection: { xs: "column", sm: "row" },
                        }}
                    >
                        <Box
                            sx={{
                                width: "64px",
                                height: "64px",
                                position: "relative"
                            }}
                        >
                            <img src={activityImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <Box
                                sx={{
                                    background: activity === "event" ? "rgb(148, 185, 134)" : activity === "brand" ? "rgb(196, 119, 127)" : "rgb(120, 150, 195)",
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
                                <img src={activity === "event" ? flag : activity === "brand" ? brandIcon : spaceIcon} alt="Icon" style={{ width: "12px", height: "10px" }} />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <Typography
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: "600",
                                    fontSize: { xs: "20px", md: "24px" }
                                }}
                                variant="h3"
                            >
                                {activityName}

                            </Typography>
                            <Typography
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: "300",
                                    textAlign: "left"
                                }}
                                variant="h5"
                            >
                                {activityMaker}
                            </Typography>

                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: { xs: "30px", md: "20px" }
                        }}
                    >
                        {content?.map((item, index) => (
                            <Typography variant="h5" sx={{ textAlign: "left", fontSize: { xs: "13px", md: "16px" }, color: theme.palette.primary.main, fontWeight: "400" }} key={index}>
                                {item}
                            </Typography>
                        ))}

                    </Box>
                    {
                        activity === "space"
                        &&
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: "15px"
                            }}
                        >
                            <Typography
                                sx={{
                                    color: theme.palette.primary.dark,
                                    fontWeight: "600",
                                    textAlign: "left"
                                }}
                                variant='h6'
                            >
                                Ammenities & Features:
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    rowGap: "15px",
                                    flexDirection: { xs: "column", md: "row" }
                                }}
                            >
                                {features?.map((item, index) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            columnGap: "5px",
                                            width: { xs: "100%", md: "33%" }
                                        }}
                                        key={index}
                                    >
                                        <img src={item?.icon} alt="Icon" style={{ width: "16px", height: "16px" }} />
                                        <Typography
                                            sx={{
                                                textAlign: "left",
                                                fontWeight: "400",
                                                fontSize: { xs: "12px", sm: "11px", xl: "12px" }
                                            }}
                                            variant='h6'
                                        >
                                            {item?.description}

                                        </Typography>
                                    </Box>
                                ))}

                            </Box>

                        </Box>
                    }

                </Box>
                {
                    activity !== "brand"
                    &&
                    <Box
                        sx={{
                            width: { xs: "100%", lg: "35%" },
                            display: "flex",
                            flexDirection: "column",
                            rowGap: "5px"
                        }}
                    >
                        <Typography
                            variant="h6"
                            style={{
                                fontWeight: "600",
                                color: theme.palette.primary.dark,
                                textAlign: "left"
                            }}
                        >
                            {activity === "event" ? "Hosted" : "Located"} at:
                        </Typography>
                        <Typography
                            variant="h5"
                            style={{
                                fontWeight: "600",
                                color: theme.palette.primary.dark,
                                textAlign: "left"
                            }}
                        >
                            {activityLocation}
                        </Typography>

                        <Typography
                            variant="h6"
                            style={{
                                fontWeight: "300",
                                color: theme.palette.primary.main,
                                textAlign: "left"
                            }}
                        >
                            {activityLocation2}
                        </Typography>
                        <img src={activity === "event" ? miniMap : miniMap2} alt="" />
                        <Typography
                            variant="h6"
                            style={{
                                fontWeight: "400",
                                color: theme.palette.primary.main,
                                textAlign: "left"
                            }}
                        >
                            {activityAddress}
                        </Typography>
                        <Divider />
                        <Typography
                            variant="h6"
                            style={{
                                fontWeight: "600",
                                color: theme.palette.primary.main,
                                textAlign: "left"
                            }}
                        >
                            {activity === "event" ? "Starting" : "Lease"} from:
                        </Typography>
                        <Typography
                            variant="h1"
                            style={{
                                fontWeight: "600",
                                color: theme.palette.primary.main,
                                textAlign: "left",
                                lineHeight: "140%"
                            }}
                        >
                            {value}
                        </Typography>
                        <Typography
                            variant="h6"
                            style={{
                                fontWeight: "300",
                                color: theme.palette.primary.main,
                                textAlign: "left"
                            }}
                        >
                            {deadline}
                        </Typography>
                        <Divider />
                    </Box>
                }
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: { xs: "0px 8px", md: "0px 20px" },
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
                    {activity !== "space" && <img src={comment} alt="Comment Icon" />}
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
                    {
                        activity === "event"
                            ?
                            "RSVP"
                            :
                            activity === "brand"
                                ?
                                "Follow"
                                :
                                <>
                                    <img src={calender} alt='Calender Icon' />
                                    Inquire
                                </>
                    }
                </Button>
            </Box>
        </Box>
    )
}

export default ActivityCard
