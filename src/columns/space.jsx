import { Box, Button, Stack, Typography } from "@mui/material";
import { eventBadge, spaceBadge } from "../assets";

const mySpaceColumns = (gotoDetail, handleAction) => {
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
          <Button
            onClick={() => handleAction(item)}
            sx={{
              width: "56px",
              maxHeight: "26px",
              fontSize: "14px",
              fontWeight: "600",
              transition: "width 0.3s ease-in-out",
              "&:hover": {
                width: "100px",
              },
            }}
          >
            Edit
          </Button>

        );
      },
    },
  ];
};

const leasingSpaceColumns = (gotoDetail, handleAction) => {
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
                  src={spaceBadge}
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
      name: "Currently",
      key: "currently"
    },
    {
      name: "Price",
      key: "price",
    },
    { name: "Term", key: "term" },
    {
      name: "Event",
      key: "event",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.eventUrl ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {item?.event}
          </Typography>
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
      name: "Col Header",
      key: "colHeader1",
    },
    {
      name: "Col Header",
      key: "colHeader2",
    },
    {
      name: "Col Header",
      key: "colHeader3",
    },
    {
      name: "Col Header",
      key: "colHeader4",
    },
    {
      name: "Col Header",
      key: "colHeader5",
    },
    {
      name: "Col Header",
      key: "colHeader6",
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
                minWidth: "56px",
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

const likedSpaceColumns = (gotoDetail, handleAction) => {
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
                  src={spaceBadge}
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
      name: "Price",
      key: "price",
    },
    { name: "Term", key: "term" },
    { name: "Status", key: "status" },
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
            }}
          >
            Remove
          </Button>
        );
      },
    },
  ];
};

export { mySpaceColumns, leasingSpaceColumns, likedSpaceColumns };
