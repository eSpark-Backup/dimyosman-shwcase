import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Divider, Stack, Tooltip, Typography, useTheme } from "@mui/material";
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
import dayjs from "dayjs";
import RSVPCalendar from "./rsvp-calendar.jsx";
import { addHyphenToName, useClickOutside } from "../utils/index.js";
import { useAddRsvpDateMutation } from "../services/events.js";
import CommentModal from "./commentModal.jsx";
import CommentSuccessModal from "./commentSuccessModal.jsx";
import ShareModal from "./shareModal.jsx";
import { useFollowMutation } from "../services/follower.js";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";

const ActivityCard = ({
  fullItem = {},
  id,
  publicProfile,
  activityId,
  userName,
  userRole,
  userImage,
  mainImage,
  shareableLink,
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
  isFollowed,
  startDate,
  endDate,
  rsvpDates,
  handleAction = () => { },
  handleNavigation = () => { },
  isDraftedBrandOwner,
  brandStatus,
  isDraftedSpaceOwner,
  spaceStatus
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [commentModal, setCommentModal] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [shareModalDetails, setShareModalDetails] = useState(false);
  const [likePost, setLikePost] = useState(isFavourite);
  const [followPost, setFollowPost] = useState(isFollowed);
  useEffect(() => {
    setLikePost(isFavourite);
  }, [isFavourite]);
  useEffect(() => {
    setFollowPost(isFollowed);
  }, [isFollowed]);
  const [likeFunc, { isLoading }] = useAddInFavouritesMutation();
  const [follow, { isLoading: followLoading }] = useFollowMutation();
  const [addRsvp, { isLoading: rsvpLoading }] = useAddRsvpDateMutation();

  const [selectedDates, setSelectedDates] = useState(
    rsvpDates && rsvpDates.length > 0 ? rsvpDates?.map((date) => dayjs(date).format("YYYY-MM-DD")) : []
  );

  const [openCalendar, setOpenCalendar] = useState(false);
  const { user } = useSelector((state) => state.auth);


  const handleOk = () => {
    const newRsvpDates = selectedDates.map(item => { return { dateTime: item } })
    const objToSend = {
      id: activityId,
      credentials: {
        attendanceDates: {
          dateTime: "string",
          rsvpDates: newRsvpDates,
        },
      },
    };
    addRsvp(objToSend).then((res) => {
      if (res?.data?.status) {
        toast.success(res?.data?.message);
        setOpenCalendar(false);
      }
    });
  };

  const handleCancel = () => {
    setOpenCalendar(false);
  };

  const modalRef = useRef();
  useClickOutside(modalRef, () => setOpenCalendar(false));

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
            onClick={() => {
              if (
                (id &&
                  userRole === "brand" &&
                  !isDraftedBrandOwner &&
                  brandStatus !== "ARCHIVE") ||
                (id &&
                  userRole === "brand" &&
                  isDraftedBrandOwner === user?.id &&
                  brandStatus !== "ARCHIVE")
              ) {
                navigate(`/${userRole}/${addHyphenToName(userName)}`, {
                  state: { id },
                });
                handleNavigation();
              } else if (id && userRole === "user" && publicProfile) {
              
                navigate(`/profile/${addHyphenToName(userName)}`, {state: { id }});
                handleNavigation();
              } else {
                if (userRole === "brand") {
                  toast.error(
                    `This brand is ${brandStatus?.toLowerCase()}${
                      brandStatus === "ARCHIVE" ? "d" : "ed"
                    }. You can not view this brand.`
                  );
                } else {
                  toast.error("You are not authorized to view this profile.");
                }
              }
            }}
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
                      borderRadius: "5px",
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
                bottom: "3px",
                right: "1px",
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
            onClick={() => {
              if (
                (id &&
                  userRole === "brand" &&
                  !isDraftedBrandOwner &&
                  brandStatus !== "ARCHIVE") ||
                (id &&
                  userRole === "brand" &&
                  isDraftedBrandOwner === user?.id &&
                  brandStatus !== "ARCHIVE")
              ) {
                navigate(`/${userRole}/${addHyphenToName(userName)}`, {
                  state: { id },
                });
                handleNavigation();
              } else if (id && userRole === "user" && publicProfile) {
                navigate(`/profile/${addHyphenToName(userName)}`, {state: { id }});
                handleNavigation();
              } else {
                if (userRole === "brand") {
                  toast.error(
                    `This brand is ${brandStatus?.toLowerCase()}${
                      brandStatus === "ARCHIVE" ? "d" : "ed"
                    }. You can not view this brand.`
                  );
                } else {
                  toast.error("You are not authorized to view this profile.");
                }
              }
            }}
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
              ? () => {
                  navigate(`/${activity}/${addHyphenToName(activityName)}`, {
                    state: search
                      ? { other: true, id: activityId }
                      : { id: activityId },
                  });
                  handleNavigation();
                }
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
                  ? () => { navigate(`/${activity}/${activityId}`); handleNavigation(); }
                  : () => {}
              }
              slides={slides}
            />
          </Box>
        ) : (
          <img
            onClick={
              activityId
                ? () => { navigate(`/${activity}/${activityId}`); handleNavigation(); }
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
                ? () => {
                    navigate(`/${activity}/${addHyphenToName(activityName)}`, {
                      state: search
                        ? { other: true, id: activityId }
                        : { id: activityId },
                    });
                    handleNavigation();
                  }
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
                ? () => {
                    navigate(`/${activity}/${addHyphenToName(activityName)}`, {
                      state: search
                        ? { other: true, id: activityId }
                        : { id: activityId },
                    });
                    handleNavigation();
                  }
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
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
                  textAlign: "start",
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
                onClick={() => {
                  if (
                    id &&
                    activity === "event" &&
                    (spaceStatus === "DRAFT" || spaceStatus === "ARCHIVE")
                  ) {
                    toast.error(
                      `This space is ${spaceStatus?.toLowerCase()}${
                        spaceStatus === "ARCHIVE" ? "d" : "ed"
                      }. You can not view this space.`
                    );
                  } else {
                    if (activity !== "space" && activityLocationId) {
                      navigate(`/space/${addHyphenToName(activityLocation)}`, {
                        state: { id: activityLocationId },
                      });
                      handleNavigation();
                    }
                  }
                }}
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
              <Tooltip
                title={activityAddress?.length > 40 ? activityAddress : ""}
              >
                <figcaption
                  style={{
                    fontStyle: "normal",
                    fontSize: "12px",
                    fontWeight: "400",
                    color: theme.palette.primary.main,
                    textAlign: "left",
                    fontFamily: `"Segoe UI", "sans-serif"`,
                    textWrap: "wrap",
                  }}
                >
                  {activityAddress?.length > 40
                    ? activityAddress?.slice(0, 41) + "..."
                    : activityAddress}
                </figcaption>
              </Tooltip>
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
          {activity !== "space" && (
            <img
              onClick={() => {
                setCommentId(activityId);
                setCommentModal(true);
              }}
              src={comment}
              alt="Comment Icon"
              style={{ cursor: "pointer" }}
            />
          )}
          <img
            onClick={() => {
              setShareModalDetails({
                id: activityId,
                profileName: activityName,
                profileImage: activityImage,
                profileType: activity,
              });
              setShareModal(true);
            }}
            src={share}
            alt="Share Icon"
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ position: "relative", gap: { xs: 1, sm: 2 } }}
        >
          <Button
            variant="text"
            onClick={
              activityId
                ? () => {
                    navigate(`/${activity}/${addHyphenToName(activityName)}`, {
                      state: search
                        ? { other: true, id: activityId }
                        : { id: activityId },
                    });
                    handleNavigation();
                  }
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
          {openCalendar && activity === "event" && (
            <RSVPCalendar
              loading={rsvpLoading}
              modalRef={modalRef}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              handleCancel={handleCancel}
              handleOk={handleOk}
              startDate={startDate}
              endDate={endDate}
            />
          )}
          <LoadingButton
            loading={followLoading}
            disabled={followLoading}
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
            onClick={() => {
              if (activity === "event") {
                setOpenCalendar(true);
              } else if (activity === "brand") {
                if (!followLoading) {
                  follow({
                    entityId: activityId,
                    entityType: "BRAND",
                  }).then((res) => {
                    res?.data?.status &&
                      toast.success(
                        `You ${
                          followPost ? "Unfollowed" : "Followed"
                        } ${activityName}`
                      );
                    setFollowPost(!followPost);
                  });
                }
              } else {
                handleAction(fullItem);
              }
            }}
          >
            {activity === "event" ? (
              "RSVP"
            ) : activity === "brand" ? (
              followPost ? (
                "Unfollow"
              ) : (
                "Follow"
              )
            ) : (
              <>
                <img src={calender} alt="Calender Icon" />
                Inquire
              </>
            )}
          </LoadingButton>
        </Stack>
      </Box>
      <CommentModal
        open={commentModal}
        handleClose={() => {
          setCommentId(null);
          setCommentModal(false);
        }}
        handleSuccess={() => setSuccessModal(true)}
        commentId={commentId}
      />
      <CommentSuccessModal
        open={successModal}
        handleClose={() => setSuccessModal(false)}
      />
      <ShareModal
        shareableLink={shareableLink}
        open={shareModal}
        handleClose={() => setShareModal(false)}
        shareModalDetails={shareModalDetails}
      />
    </Box>
  );
};

export default ActivityCard;
