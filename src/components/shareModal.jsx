import { useState } from "react";
import { toast } from "react-toastify";
import { Box, Modal, Stack, Typography } from "@mui/material";
import { brandBadge, close, copyIcon, eventBadge, spaceBadge } from "../assets";

const ShareModal = ({ open, handleClose }) => {
  const [url] = useState("shwcase.co/NlfVhYygR9mAQasassdsada/Share...");
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };
  return (
    <Modal
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          width: { xs: "95vw", sm: "478px" },
          maxHeight: "90vh",
          overflowY: "auto",
          outline: "none",
          padding: 2,
          background: "#fff",
          border: (theme) => `1px solid ${theme.palette.border.borderColor[0]}`,
          boxShadow: "0px 0px 20px 0px #00141C33",
          borderRadius: "5px",
        }}
      >
        <Box component="header">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap="10px"
          >
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              gap="16px"
            >
              <Box
                sx={{
                  borderRadius: "5px",
                  width: "32px",
                  height: "32px",
                  minWidth: "32px",
                  minHeight: "32px",
                  position: "relative",
                }}
              >
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={open?.profileImage}
                  alt="profile"
                />
                <img
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    right: "0px",
                    width: "16px",
                    height: "16px",
                    zIndex: 99,
                  }}
                  src={
                    open?.profileType === "space"
                      ? spaceBadge
                      : open?.profileType === "event"
                      ? eventBadge
                      : brandBadge
                  }
                  alt="badge"
                />
              </Box>
              <Box>
                <Typography
                  lineHeight="20px"
                  textAlign="left"
                  fontWeight={600}
                  fontSize={24}
                  variant="h2"
                >
                  {open?.profileName}
                </Typography>
              </Box>
            </Stack>
            <img
              src={close}
              alt="Close Icon"
              style={{ cursor: "pointer", width: "24px", height: "24px" }}
              onClick={handleClose}
            />
          </Stack>
        </Box>
        <Stack
          sx={{
            mt: "32px",
            background: "#F2F3F4",
            padding: "15px",
          }}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={5}
        >
          <Typography
            sx={{
              width: "85%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {url}
          </Typography>
          <img
            onClick={handleCopy}
            style={{ cursor: "pointer" }}
            src={copyIcon}
            alt="copy"
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default ShareModal;
