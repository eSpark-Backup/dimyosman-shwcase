import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { brandBadge } from "../assets";
import { LoadingButton } from "@mui/lab";

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

                <figure style={{ width: "100%", height: "100%" }} role="brand-image">
                  <img
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    src={item?.brandImg}
                    alt="brand-img"
                  />
                </figure>
              )}

              <figure style={{ width: "100%", height: "100%" }} role="brand-icon">
                <img
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 8,
                  }}
                  width={16}
                  height={16}
                  src={brandBadge}
                  alt="brand-icon"
                />
              </figure>
            </Box>
            <Tooltip title={item?.brandName?.length > 30 ? item?.brandName : ""}>
              <Typography
                textAlign="left"
                sx={{ fontWeight: 600, cursor: "pointer", fontSize: "16px" }}
              >
                {item?.brandName?.length > 30
                  ? `${item?.brandName.slice(0, 29)}...`
                  : item?.brandName}
              </Typography>
            </Tooltip>
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
      name: "Col Header",
      key: "colHeader7",
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

                <figure style={{ width: "100%", height: "100%" }} role="brand-icon">
                  <img
                    style={{ width: "100%", height: "100%", objectFit: "cover"  }}
                    src={item?.brandImg}
                    alt="brand-img"
                  />
                </figure>
              )}

              <figure style={{ width: "100%", height: "100%" }} role="brand-icon">
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
              </figure>
            </Box>
            <Typography sx={{ fontWeight: 600, cursor: "pointer", fontSize: "16px" }}>
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
          <Button
            onClick={() => handleAction(item)}
            sx={{
              width: "89px",
              maxHeight: "26px",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "none"
            }}
          >
            Unfollow
          </Button>
        );
      },
    },
  ];
};

const likedBrandColumns = (likeLoading, savedId, gotoDetail, handleAction) => {
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

                <figure style={{ width: "100%", height: "100%" }} role="brand-image">
                  <img
                    style={{ width: "100%", height: "100%", objectFit: "cover"  }}
                    src={item?.brandImg}
                    alt="brand-img"
                  />
                </figure>
              )}

              <figure style={{ width: "100%", height: "100%" }} role="brand-icon">
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
              </figure>
            </Box>
            <Typography sx={{ fontWeight: 600, cursor: "pointer", fontSize: "16px" }}>
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
          <LoadingButton
            loading={likeLoading && item?.id === savedId}
            disabled={likeLoading && item?.id === savedId}
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
          </LoadingButton>
        );
      },
    },
  ];
};

const myDraftBrandColumns = (gotoDetail, handleAction) => {
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

                <figure style={{ width: "100%", height: "100%" }} role="brand-image">
                  <img
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    src={item?.brandImg}
                    alt="brand-img"
                  />
                </figure>
              )}

              <figure style={{ width: "100%", height: "100%" }} role="brand-icon">
                <img
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 8,
                  }}
                  width={16}
                  height={16}
                  src={brandBadge}
                  alt="brand-icon"
                />
              </figure>
            </Box>
            <Tooltip title={item?.brandName?.length > 30 ? item?.brandName : ""}>
              <Typography
                textAlign="left"
                sx={{ fontWeight: 600, cursor: "pointer", fontSize: "16px" }}
              >
                {item?.brandName?.length > 30
                  ? `${item?.brandName.slice(0, 29)}...`
                  : item?.brandName}
              </Typography>
            </Tooltip>
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
      name: "Col Header",
      key: "colHeader7",
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

export { myBrandColumns, followingBrandColumns, likedBrandColumns, myDraftBrandColumns };
