import { Box, Stack, Typography } from "@mui/material";
import { brandBadge } from "../assets";

const myBrandColumns = (gotoDetail, handleAction) => {
  return [
    {
      name: "Brand Name",
      key: "brandName",
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
              {item?.brandImg && (
                <img
                  style={{ width: "100%" }}
                  src={item?.brandImg}
                  alt="brand-img"
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
                src={brandBadge}
                alt="brand-icon"
              />
            </Box>
            <Typography variant="h5" sx={{ cursor: "pointer" }}>
              {item?.brandName}
            </Typography>
          </Stack>
        );
      },
    },
    { name: "Brand Category", key: "brandCategory" },
    {
      name: "Events",
      key: "events",
    },
    { name: "Followers", key: "followers" },
    { name: "Status", key: "status" },
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
      name: "Action",
      key: "action",
      component: (item) => {
        return (
          <Typography
            onClick={() => handleAction(item)}
            sx={{ fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
          >
            Edit
          </Typography>
        );
      },
    },
  ];
};

const followingBrandColumns = (gotoDetail, handleAction) => {
  return [
    {
      name: "Brand Name",
      key: "brandName",
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
              {item?.brandImg && (
                <img
                  style={{ width: "100%" }}
                  src={item?.brandImg}
                  alt="brand-img"
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
                src={brandBadge}
                alt="brand-icon"
              />
            </Box>
            <Typography variant="h5" sx={{ cursor: "pointer" }}>
              {item?.brandName}
            </Typography>
          </Stack>
        );
      },
    },
    { name: "Brand Category", key: "brandCategory" },
    {
      name: "Events",
      key: "events",
    },
    { name: "Followers", key: "followers" },
    { name: "Follow Date", key: "followDate" },
    {
      name: "Action",
      key: "action",
      component: (item) => {
        return (
          <Typography
            onClick={() => handleAction(item)}
            sx={{ fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
          >
            Unfollow
          </Typography>
        );
      },
    },
  ];
};

const likedBrandColumns = (gotoDetail, handleAction) => {
  return [
    {
      name: "Brand Name",
      key: "brandName",
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
              {item?.brandImg && (
                <img
                  style={{ width: "100%" }}
                  src={item?.brandImg}
                  alt="brand-img"
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
                src={brandBadge}
                alt="brand-icon"
              />
            </Box>
            <Typography variant="h5" sx={{ cursor: "pointer" }}>
              {item?.brandName}
            </Typography>
          </Stack>
        );
      },
    },
    { name: "Brand Category", key: "brandCategory" },
    {
      name: "Events",
      key: "events",
    },
    { name: "Followers", key: "followers" },
    { name: "Save Date", key: "savedDate" },
    {
      name: "Action",
      key: "action",
      component: (item) => {
        return (
          <Typography
            onClick={() => handleAction(item)}
            sx={{ fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
          >
            Remove
          </Typography>
        );
      },
    },
  ];
};

export { myBrandColumns, followingBrandColumns, likedBrandColumns };
