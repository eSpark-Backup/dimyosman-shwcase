import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { eventBadge, spaceBadge } from "../assets";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const mySpaceColumns = (gotoDetail, handleAction, gotoBrand) => {
  return [
    {
      name: "Space Name",
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
                    zIndex: 8,
                  }}
                  width={16}
                  height={16}
                  src={spaceBadge}
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
      name: "Price",
      key: "price",
    },
    {
      name: "Term",
      key: "term",
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

const leasingSpaceColumns = (gotoDetail, handleAction, gotoBrand, gotoEvent) => {
  return [
    {
      name: "Leasing Name",
      key: "eventName",
      component: (item) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
            sx={{ cursor: "pointer" }}
            onClick={() => gotoDetail(item, "lease")}
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
              cursor: item?.eventUrl === "-" ? "default" : "pointer",
            }}
            onClick={() => {
              if(item?.eventUrl !== "-"){
                gotoEvent(item);
              }
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
            onClick={() => gotoBrand(item)}
          >
            {item?.brand}
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
              justifyContent: "flex-end",
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
                color: "#fff !important",
                opacity: item?.action === "Verify Pay 1/2" ? "0.7" : 1,
              }}
              disabled={item?.action === "Verify Pay 1/2"}
            >
              {item?.action}
            </Button>
          </Box>
        );
      },
    },
  ];
};

const likedSpaceColumns = (likeLoading, savedId, gotoDetail, handleAction) => {
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
              a: {
                color: "#00141C !important"
              }
            }}
          >
          
            {item?.brandUrl ? <Link to={item?.brandUrl}>{item?.brand}</Link> :  item?.brand}
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
          <LoadingButton
            loading={likeLoading && savedId === item?.spaceId}
            disabled={likeLoading && savedId === item?.spaceId}
            onClick={() => handleAction(item)}
            sx={{
              minWidth: "83px",
              maxHeight: "26px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Remove
          </LoadingButton>
        );
      },
    },
  ];
};

const tenantSpaceColumns = (gotoDetail, handleAction, gotoBrand, gotoEvent) => {
  return [
    {
      name: "Tenant Name",
      key: "eventName",
      component: (item) => {
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
            sx={{ cursor: "pointer" }}
            onClick={() => gotoDetail(item, "tenant")}
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
                <figure
                  style={{ width: "100%", height: "100%" }}
                  role="event-icon"
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={item?.eventImg}
                    alt="event-img"
                  />
                </figure>
              )}
              <figure
                style={{ width: "100%", height: "100%" }}
                role="event-icon"
              >
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
            onClick={() => gotoBrand(item, "other")}
          >
            {item?.brand}
          </Typography>
        );
      },
    },
    {
      name: "Owner",
      key: "owner",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.eventUrl ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {item?.owner}
          </Typography>
        );
      },
    },
    {
      name: "Event",
      key: "event",
      component: (item) => {
        return (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: item?.eventUrl ? 600 : 400,
              cursor: item?.eventUrl === "-" ? "default" : "pointer",
            }}
            onClick={() => {
              if(item?.eventUrl !== "-"){
                gotoEvent(item, "other");
              }
            }}
          >
            {item?.event}
          </Typography>
        );
      },
    },
    {
      name: "Starting",
      key: "starting",
    },
    {
      name: "Ending",
      key: "ending",
    },
    { name: "Lease Amount", key: "lease" },
    { name: "Status", key: "status" },
    {
      name: "Action",
      key: "action",
      component: (item) => {
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                handleAction(item);
              }}
              sx={{
                minWidth: "56px",
                maxHeight: "26px",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "#fff !important",
                opacity: item?.action === "Verify 0/2" ? "0.7" : 1,
              }}
              disabled={item?.action === "Verify 0/2"}
            >
              {item?.action}
            </Button>
          </Box>
        );
      },
    },
  ];
};

export { mySpaceColumns, leasingSpaceColumns, likedSpaceColumns, tenantSpaceColumns };
