import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { eventBadge } from "../assets";
import { useNavigate } from "react-router-dom";

const myEventsColumns = (gotoDetail, handleAction, gotoBrand, gotoSpace) => {
  return [
    {
      name: "Event Name",
      key: "eventName",
      component: (item) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
            sx={{ cursor: "pointer" }}
            onClick={() => gotoDetail(item)}
          >
            <Box
              sx={{
                background: "#ccd0d2",
                borderRadius: "5px",
                width: "32px",
                height: "32px",
                position: "relative",
              }}
            >
              {item?.eventImg && (

                <figure style={{ width: "100%", height: "100%" }} role="event-image">
                  <img
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    src={item?.eventImg}
                    alt="event-img"
                  />
                </figure>
              )}
              <figure style={{ width: "100%", height: "100%" }} role="event-icon">
                <img
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 99,
                  }}
                  width={16}
                  height={16}
                  src={eventBadge}
                  alt="event-icon"
                />
              </figure>
            </Box>
            <Tooltip title={item?.eventName?.length > 30 ? item?.eventName : ""}>
              <Typography
                textAlign="left"
                sx={{ fontWeight: 600, cursor: "pointer", fontSize: "16px" }}
              >
                {item?.eventName?.length > 30
                  ? `${item?.eventName.slice(0, 29)}...`
                  : item?.eventName}
              </Typography>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      name: "Brand",
      key: "brand",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.brandUrl ? 600 : 400,
              cursor: "pointer",
            }}
            onClick={() => gotoBrand(item)}
          >
            {item?.brand}
          </Typography>
        );
      },
    },

    { name: "RSVP", key: "rsvp" },
    { name: "Start Date", key: "startDate" },
    { name: "Status", key: "status" },
    {
      name: "Hosted in",
      key: "hostedIn",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.spaceUrl ? 600 : 400,
              cursor: "pointer",
            }}
            onClick={() => gotoSpace(item)}
          >
            {item?.hostedIn}
          </Typography>
        );
      },
    },
    {
      name: "Action",
      key: "action",
      component: (item) => {
        return (
          <Button
            onClick={() => handleAction(item)}
            sx={{
              width: "56px",
              maxHeight: "26px",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "none"
            }}
          >
            Edit
          </Button>

        );
      },
    },
  ];
};

const rsvpEventColumns = (gotoDetail, handleAction) => {
  return [
    {
      name: "Event Name",
      key: "eventName",
      component: (item) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
            sx={{ cursor: "pointer" }}
            onClick={() => gotoDetail(item)}
          >
            <Box
              sx={{
                background: "#ccd0d2",
                borderRadius: "5px",
                width: "32px",
                height: "32px",
                position: "relative",
              }}
            >
              {item?.eventImg && (

                <figure style={{ width: "100%", height: "100%" }} role="event-icon">
                  <img
                    style={{ width: "100%" }}
                    src={item?.eventImg}
                    alt="event-img"
                  />
                </figure>
              )}
              <figure style={{ width: "100%", height: "100%" }} role="event-icon">
                <img
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 99,
                  }}
                  width={16}
                  height={16}
                  src={eventBadge}
                  alt="event-icon"
                />
              </figure>
            </Box>
            <Typography
              sx={{ fontWeight: 600, cursor: "pointer", fontSize: "16px" }}
            >
              {item?.eventName}
            </Typography>
          </Stack>
        );
      },
    },
    {
      name: "Brand",
      key: "brand",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.brandUrl ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {item?.brand}
          </Typography>
        );
      },
    },
    {
      name: "RSVP",
      key: "rsvp",
    },
    { name: "Start Date", key: "startDate" },
    { name: "Status", key: "status" },
    {
      name: "Hosted in",
      key: "hostedIn",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.spaceUrl ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {item?.hostedIn}
          </Typography>
        );
      },
    },
    {
      name: "Action",
      key: "action",
      component: (item) => {
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <Button
              onClick={() => handleAction(item)}
              sx={{
                maxHeight: "26px",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "none",

                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item?.action}
            </Button>
          </Box>
        );
      },
    },
  ];
};

const likedEventColumns = (gotoDetail, handleAction) => {
  return [
    {
      name: "Event Name",
      key: "eventName",
      component: (item) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
            sx={{ cursor: "pointer" }}
            onClick={() => gotoDetail(item)}
          >
            <Box
              sx={{
                background: "#ccd0d2",
                borderRadius: "5px",
                width: "32px",
                height: "32px",
                position: "relative",
              }}
            >
              {item?.eventImg && (

                <figure style={{ width: "100%", height: "100%" }} role="event-icon">
                  <img
                    style={{ width: "100%" }}
                    src={item?.eventImg}
                    alt="event-img"
                  />
                </figure>
              )}

              <figure style={{ width: "100%", height: "100%" }} role="event-icon">
                <img
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 99,
                  }}
                  width={16}
                  height={16}
                  src={eventBadge}
                  alt="event-icon"
                />
              </figure>
            </Box>
            <Typography
              sx={{ fontWeight: 600, cursor: "pointer", fontSize: "16px" }}
            >
              {item?.eventName}
            </Typography>
          </Stack>
        );
      },
    },
    {
      name: "Brand",
      key: "brand",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.brandUrl ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {item?.brand}
          </Typography>
        );
      },
    },
    {
      name: "Category",
      key: "category",
    },
    { name: "Start Date", key: "startDate" },
    { name: "Status", key: "status" },
    {
      name: "Hosted in",
      key: "hostedIn",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.spaceUrl ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {item?.hostedIn}
          </Typography>
        );
      },
    },
    {
      name: "Action",
      key: "action",
      component: (item) => {
        return (
          <Button
            onClick={() => handleAction(item)}
            sx={{
              minWidth: "83px",
              maxHeight: "26px",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "none"
            }}
          >
            Remove
          </Button>
        );
      },
    },
  ];
};

export { myEventsColumns, rsvpEventColumns, likedEventColumns };
