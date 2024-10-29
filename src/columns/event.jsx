import { Box, Stack, Typography } from "@mui/material";
import { eventBadge } from "../assets";

const myEventsColumns = (gotoDetail, handleAction) => {
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
                <img
                  style={{ width: "100%" }}
                  src={item?.eventImg}
                  alt="event-img"
                />
              )}
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
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, cursor: "pointer" }}
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
          <Typography
            onClick={() => handleAction(item)}
            sx={{ fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Edit
          </Typography>
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
                <img
                  style={{ width: "100%" }}
                  src={item?.eventImg}
                  alt="event-img"
                />
              )}
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
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, cursor: "pointer" }}
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
          <Typography
            onClick={() => handleAction(item)}
            sx={{ fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            {item?.action}
          </Typography>
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
                <img
                  style={{ width: "100%" }}
                  src={item?.eventImg}
                  alt="event-img"
                />
              )}
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
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, cursor: "pointer" }}
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
          <Typography
            onClick={() => handleAction(item)}
            sx={{ fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Remove
          </Typography>
        );
      },
    },
  ];
};

export { myEventsColumns, rsvpEventColumns, likedEventColumns };
