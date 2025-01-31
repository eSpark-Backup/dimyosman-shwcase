import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Stack, Typography, useTheme } from "@mui/material";
import {
  accountIcon,
  brandIcon,
  brandMain,
  calender,
  comment,
  eventMain,
  eventMain2,
  eventMain3,
  flag,
  like,
  liked,
  miniMap,
  miniMap2,
  share,
  spaceIcon,
  spaceMain,
} from "../assets/index.js";
import DynamicPaginationSwiper from "./Slider.jsx";
import { useNavigate } from "react-router-dom";
import { useAddInFavouritesMutation } from "../services/favourite.js";
import { toast } from "react-toastify";

const ActivityCard = ({
  fullItem = {},
  id,
  activityId,
  userName,
  userRole,
  userImage,
  mainImage,
  activity,
  activityLocationId,
  activityName,
  activityMaker,
  content,
  activityImage,
  activityLocation,
  activityLocation2,
  activityAddress,
  value,
  deadline,
  features,
  slides,
  search = false,
  isFavourite,
  handleAction = () => {},
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [likePost, setLikePost] = useState(isFavourite);
  useEffect(() => {
    setLikePost(isFavourite);
  },[isFavourite])
  const [likeFunc, { isLoading }] = useAddInFavouritesMutation();
  return (
    <Box
      sx={{
        background: theme.palette.primary.contrastText,
        py: "20px",
        borderRadius: "5px",
        rowGap: "25px",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: { xs: "0px 8px", md: "0px 20px" },
          flexDirection: "row",
          rowGap: "10px",
        }}
      >
        <Box
          component="section"
          sx={{
            width: { xs: "100%", md: "80%" },
            display: "flex",
            columnGap: "10px",
            alignItems: "center",
            flexDirection: "row",
            rowGap: "10px",
          }}
        >
          <Box
            onClick={
              id && id === 1 ? () => navigate(`/${userRole}/${id}`) : () => {}
            }
            sx={{
              cursor: "pointer",
              width: "64px",
              height: "64px",
              minWidth: "64px",
              minHeight: "64px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                borderRadius: "5px",
                border: "1px solid rgb(209, 219, 215, 0.4)",
                height: "62px",
              }}
            >
              {userImage ? (
                <figure
                  style={{ width: "100%", height: "100%" }}
                  role="img"
                  aria-labelledby="profile-figcaption"
                >
                  <img
                    src={userImage}
                    alt="User Image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </figure>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(0, 28, 20, 0.4)",
                    borderRadius: "5px",
                  }}
                />
              )}
            </Box>
            <Box
              sx={{
                background:
                  userRole === "event"
                    ? "rgb(148, 185, 134)"
                    : userRole === "brand"
                    ? "rgb(196, 119, 127)"
                    : userRole === "space"
                    ? "rgb(120, 150, 195)"
                    : theme.palette.primary.main,
                width: "16px",
                height: "16px",
                position: "absolute",
                bottom: "0px",
                right: "0px",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={
                  userRole === "event"
                    ? flag
                    : userRole === "brand"
                    ? brandIcon
                    : userRole === "space"
                    ? spaceIcon
                    : accountIcon
                }
                alt="Icon"
                style={{ width: "12px", height: "10px" }}
              />
            </Box>
          </Box>
          <Box
            onClick={
              activityId
                ? () =>
                    navigate(`/${activity}/${activityId}`, {
                      state: search ? { other: true } : null,
                    })
                : () => {}
            }
            sx={{
              cursor: activityId ? "pointer" : "default",
              display: "flex",
              columnGap: "5px",
              flexDirection: { xs: "row", sm: "row" },
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "400",
                textAlign: "left",
                fontSize: { xs: "12px", md: "16px" },
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontWeight: 600,
                  marginRight: "5px",
                }}
              >
                {userName}{" "}
              </span>
              published a new{" "}
              {activity === "event"
                ? "Event!"
                : activity === "brand"
                ? "Brand!"
                : "Space!"}
            </Typography>
          </Box>
        </Box>
        <Box
          onClick={
            activityId
              ? () =>
                  navigate(`/${activity}/${activityId}`, {
                    state: search ? { other: true } : null,
                  })
              : () => {}
          }
          sx={{
            cursor: "pointer",
            background:
              activity === "event"
                ? "rgba(148, 185, 134, 0.3)"
                : activity === "brand"
                ? "rgba(196, 119, 127, 0.2)"
                : "rgba(120, 150, 195, 0.3)",
            width: "48px",
            height: "48px",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={
              activity === "event"
                ? flag
                : activity === "brand"
                ? brandIcon
                : spaceIcon
            }
            alt=""
          />
        </Box>
      </Box>
      <Box sx={{ cursor: "pointer" }}>
        {/* {slides?.length !== 1 ? (
          <Box
            sx={{
              width: "100%",
            }}
          >
            {" "}
            <DynamicPaginationSwiper
              onClick={
                activityId
                  ? () => navigate(`/${activity}/${activityId}`)
                  : () => {}
              }
              slides={slides}
            />
          </Box>
        ) : (
          <img
            onClick={
              activityId
                ? () => navigate(`/${activity}/${activityId}`)
                : () => {}
            }
            src={slides[0]}
            alt="Activity"
            style={{ width: "100%" }}
          />
        )} */}
        <Box
          sx={{
            width: "100%",
          }}
        >
          <DynamicPaginationSwiper
            onClick={
              activityId
                ? () =>
                    navigate(`/${activity}/${activityId}`, {
                      state: search ? { other: true } : null,
                    })
                : () => {}
            }
            slides={slides}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: { xs: "0px 8px", md: "0px 20px" },
          flexDirection: { xs: "column", md: "row" },
          gap: "16px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
          }}
        >
          <Box
            component="section"
            onClick={
              activityId
                ? () =>
                    navigate(`/${activity}/${activityId}`, {
                      state: search ? { other: true } : null,
                    })
                : () => {}
            }
            sx={{
              cursor: "pointer",
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
                position: "relative",
              }}
            >
              <img
                src={activityImage}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box
                sx={{
                  background:
                    activity === "event"
                      ? "rgb(148, 185, 134)"
                      : activity === "brand"
                      ? "rgb(196, 119, 127)"
                      : "rgb(120, 150, 195)",
                  width: "16px",
                  height: "16px",
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={
                    activity === "event"
                      ? flag
                      : activity === "brand"
                      ? brandIcon
                      : spaceIcon
                  }
                  alt="Icon"
                  style={{ width: "12px", height: "10px" }}
                />
              </Box>
            </Box>

            <Box
              component="header"
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "600",
                  fontSize: { xs: "20px", md: "24px" },
                  textAlign: "start"
                }}
                variant="h2"
              >
                {activityName}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "300",
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                {activityMaker}
              </Typography>
            </Box>
          </Box>
          <Box
            component="section"
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: { xs: "30px", md: "20px" },
            }}
          >
            {content?.map((item, index) => (
              <Typography
                sx={{
                  textAlign: "left",
                  fontSize: { xs: "13px", md: "16px" },
                  color: theme.palette.primary.main,
                  fontWeight: "400",
                }}
                key={index}
              >
                {item}
              </Typography>
            ))}
          </Box>
          {activity === "space" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "15px",
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.primary.dark,
                  fontWeight: "600",
                  textAlign: "left",
                  fontSize: "12px",
                }}
              >
                Ammenities & Features:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  rowGap: "15px",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                {features?.map(
                  (item, index) =>
                    index >= 0 &&
                    index <= 2 && (
                      <Box
                        sx={{
                          display: "flex",
                          columnGap: "5px",
                          width: { xs: "100%", sm: "150px" },
                        }}
                        key={index}
                      >
                        <img
                          src={item?.icon}
                          alt="Icon"
                          style={{ width: "16px", height: "16px" }}
                        />
                        <Typography
                          sx={{
                            textAlign: "left",
                            fontWeight: "400",
                            fontSize: { xs: "12px", sm: "11px", xl: "12px" },
                            color: (theme) => theme.palette.primary.dark,
                          }}
                        >
                          {item?.description}
                        </Typography>
                      </Box>
                    )
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  rowGap: "15px",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                {features?.map(
                  (item, index) =>
                    index >= 3 &&
                    index <= 5 && (
                      <Box
                        sx={{
                          display: "flex",
                          columnGap: "5px",
                          width: { xs: "100%", sm: "150px" },
                        }}
                        key={index}
                      >
                        <img
                          src={item?.icon}
                          alt="Icon"
                          style={{ width: "16px", height: "16px" }}
                        />
                        <Typography
                          sx={{
                            textAlign: "left",
                            fontWeight: "400",
                            fontSize: { xs: "12px", sm: "11px", xl: "12px" },
                            color: (theme) => theme.palette.primary.dark,
                          }}
                        >
                          {item?.description}
                        </Typography>
                      </Box>
                    )
                )}
              </Box>
            </Box>
          )}
        </Box>
        {activity !== "brand" && (
          <Box
            sx={{
              width: { xs: "100%", md: "max-content" },
              display: "flex",
              flexDirection: "column",
              rowGap: "5px",
            }}
          >
            {" "}
            <header>
              <Typography
                variant="h3"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: theme.palette.primary.dark,
                  textAlign: "left",
                }}
              >
                {activity === "event" ? "Hosted" : "Located"} at:
              </Typography>
              <Typography
                onClick={
                  activity !== "space" && activityLocationId
                    ? () => navigate(`/space/${activityLocationId}`)
                    : () => {}
                }
                style={{
                  cursor:
                    activity !== "space" && activityLocationId
                      ? "pointer"
                      : "default",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: theme.palette.primary.dark,
                  textAlign: "left",
                }}
              >
                {activityLocation}
              </Typography>

              <Typography
                style={{
                  fontSize: "12px",
                  fontWeight: "300",
                  color: theme.palette.primary.main,
                  textAlign: "left",
                }}
              >
                {activityLocation2}
              </Typography>
            </header>
            <figure
              style={{ width: "100%", height: "100%" }}
              role="img"
              aria-labelledby="profile-figcaption"
            >
              <img src={activity === "event" ? miniMap : miniMap2} alt="" />
              <figcaption
                style={{
                  fontStyle: "normal",
                  fontSize: "12px",
                  fontWeight: "400",
                  color: theme.palette.primary.main,
                  textAlign: "left",
                  fontFamily: `"Segoe UI", "sans-serif"`,
                }}
              >
                {activityAddress}
              </figcaption>
            </figure>
            <Divider />
            <Typography
              variant="h3"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: theme.palette.primary.main,
                textAlign: "left",
              }}
            >
              {activity === "event" ? "Starting" : "Lease"} from:
            </Typography>
            <Typography
              style={{
                fontSize: "32px",
                fontWeight: "600",
                textAlign: "left",
                lineHeight: "140%",
              }}
            >
              {value}
            </Typography>
            <Typography
              style={{
                fontWeight: "300",
                color: theme.palette.primary.main,
                textAlign: "left",
              }}
            >
              {deadline}
            </Typography>
            <Divider />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: { xs: "0px 8px", md: "0px 20px" },
          flexDirection: "row",
          rowGap: "15px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            columnGap: "10px",
          }}
        >
          <img
            onClick={() => {
              if (!isLoading) {
                likeFunc({
                  entityId: activityId,
                  entityType: activity?.toLocaleUpperCase(),
                }).then((res) => {
                  res?.data?.status &&
                    toast.success(
                      res?.data?.message
                        .replace("Entity", "Post")
                        .replace(" successfully", "")
                    );
                  setLikePost(!likePost);
                });
              }
            }}
            style={{
              cursor: isLoading ? "not-allowed" : "pointer",
              animation: isLoading ? "pulse 1s infinite" : "none",
              opacity: isLoading ? 0.5 : 1,
            }}
            src={likePost ? liked : like}
            className={`like-icon ${isLoading ? "loading" : ""}`}
            alt="Like Icon"
          />
          {activity !== "space" && <img src={comment} alt="Comment Icon" />}
          <img src={share} alt="Share Icon" />
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ gap: { xs: 1, sm: 2 } }}
        >
          <Button
            variant="text"
            onClick={
              activityId
                ? () =>
                    navigate(`/${activity}/${activityId}`, {
                      state: search ? { other: true } : null,
                    })
                : () => {}
            }
            sx={{
              backgroundColor: "transparent",
              width: { xs: "120px", sm: "220px" },
              height: "31px",
              fontSize: "16px",
              fontWeight: 600,
              color: theme.palette.primary.main,
              textTransform: "capitalize",
              ":hover": {
                backgroundColor: "rgb(209, 219, 215, 0.4)",
              },
            }}
          >
            Learn more
          </Button>
          <Button
            sx={{
              backgroundColor: "rgb(209, 219, 215, 0.4)",
              width: { xs: "120px", sm: "220px" },
              height: "31px",
              fontSize: "16px",
              fontWeight: "700",
              color: theme.palette.primary.main,
              display: "flex",
              columnGap: "5px",
              textTransform: "none",
              ":hover": {
                backgroundColor: "rgb(209, 219, 215, 0.4)",
              },
            }}
            onClick={() => handleAction(fullItem)}
          >
            {activity === "event" ? (
              "RSVP"
            ) : activity === "brand" ? (
              "Follow"
            ) : (
              <>
                <img src={calender} alt="Calender Icon" />
                Inquire
              </>
            )}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ActivityCard;
