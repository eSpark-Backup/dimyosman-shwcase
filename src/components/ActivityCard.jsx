import React from 'react'
import { Box, Button, Divider, Grid, Paper, styled, Typography, useTheme } from "@mui/material";
import { activityLogo, brand, brandIcon, calender, comment, event, flag, like, miniMap, share, space, spaceIcon } from "../assets/index.js";

const ActivityCard = ({ userName, userImage, mainImage, activity, activityName, activityMaker, content, activityImage, activityLocation, activityLocation2, activityAddress, value, deadline }) => {
    const theme = useTheme()
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={8} sx={{ pb: "10px" }}>
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
                            flexDirection: { xs: "column", md: "row" },
                            rowGap: "10px"
                        }}
                    >
                        <Box
                            sx={{
                                width: { xs: "100%", md: "80%" },
                                display: "flex",
                                columnGap: "10px",
                                alignItems: { xs: "flex-start", md: "center" },
                                flexDirection: { xs: "column", md: "row" },
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
                                <img src={mainImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                                    columnGap: "5px",
                                    flexDirection: { xs: "row", sm: "row" },
                                    alignItems: "center"
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "#00141C",
                                        fontWeight: "700",
                                        textAlign: "left",
                                        fontSize: { xs: "12px", lg: "16px" }
                                    }}
                                    variant="h5"
                                >
                                    {userName}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "#00141C",
                                        fontWeight: "500",
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
                    <img src={mainImage} alt="Activity" style={{ width: "100%" }} />
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
                                    <img src={mainImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                                {/* <Typography variant="h5" sx={{ textAlign: "left" }}>
                                    A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.
                                </Typography>
                                <Typography variant="h5" sx={{ textAlign: "left" }}>
                                    Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.
                                </Typography>
                                <Typography variant="h5" sx={{ textAlign: "left" }}>
                                    The event will also include workshops on sustainable fashion and personal styling sessions.
                                </Typography> */}
                                {content?.map((item, index) => (
                                    <Typography variant="h5" sx={{ textAlign: "left" }} key={index}>
                                        {item}
                                    </Typography>
                                ))}

                            </Box>

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
                                        color: "#000000",
                                        textAlign: "left"
                                    }}
                                >
                                    {activity === "event" ? "Hosted" : "Located"} at:
                                </Typography>
                                <Typography
                                    variant="h5"
                                    style={{
                                        fontWeight: "600",
                                        color: "#000000",
                                        textAlign: "left"
                                    }}
                                >
                                    {activityLocation}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontWeight: "300",
                                        color: "#00141C",
                                        textAlign: "left"
                                    }}
                                >
                                    {activityLocation2}
                                </Typography>
                                <img src={miniMap} alt="" />
                                <Typography
                                    variant="h6"
                                    style={{
                                        fontWeight: "400",
                                        color: "#00141C",
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
                                        color: "#000000",
                                        textAlign: "left"
                                    }}
                                >
                                    {activity === "event" ? "Starting" : "Lease"} from:
                                </Typography>
                                <Typography
                                    variant="h1"
                                    style={{
                                        fontWeight: "600",
                                        color: "#000000",
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
                                        color: "#00141C",
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
                                color: "#00141C",
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
                                color: "#00141C",
                                display: "flex",
                                columnGap: "5px",
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
                                        </>
                            }
                        </Button>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
            </Grid>
        </Grid >
    )
}

export default ActivityCard
