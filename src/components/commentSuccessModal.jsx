import { Box, Modal, Stack, Typography } from "@mui/material";
import { close } from "../assets";

const CommentSuccessModal = ({ open, handleClose }) => {
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
                  minWidth: "32px",
                  height: "32px",
                  background: "#D1DBD7",
                }}
              ></Box>
              <Box>
                <Typography
                  lineHeight="20px"
                  textAlign="left"
                  fontWeight={600}
                  fontSize={24}
                  variant="h2"
                >
                  Message Recipient
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
        <Typography my="28px" textAlign="center">
          Your message has been sent.<br></br> You can access this conversation under
          Messages.
        </Typography>
        <Typography textAlign="center" fontSize="24px" fontWeight={600}>
          Thank You!
        </Typography>
      </Box>
    </Modal>
  );
};

export default CommentSuccessModal;
