import { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { Input } from "../../../../components";
import {
  arrowDown,
  bold,
  close,
  italic,
  lineThrough,
  link,
  paperClip,
  smile,
  spaceActivityImage,
  spaceBadge,
} from "../../../../assets";

const SpaceInquireModal = ({ open, handleClose, handleSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
              alignItems="flex-start"
              gap="16px"
            >
              <Box
                sx={{
                  borderRadius: "5px",
                  minWidth: "48px",
                  height: "48px",
                  position: "relative",
                }}
              >
                <img
                  style={{ width: "48px", height: "48px" }}
                  src={spaceActivityImage}
                  alt="brand-profile"
                />
                <img
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "16px",
                    height: "16px",
                    zIndex: 99,
                  }}
                  src={spaceBadge}
                  alt="space-badge"
                />
              </Box>
              <Box>
                <Typography
                  lineHeight="20px"
                  textAlign="left"
                  fontWeight={600}
                  fontSize={24}
                >
                  Urban Pop-Up Studio 3B{" "}
                </Typography>
                <Typography
                  marginTop="10px"
                  textAlign="left"
                  fontWeight={600}
                  fontSize={12}
                >
                  Urban Pop-Up Pavilion{" "}
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
        <Box sx={{ marginTop: "28px" }} component="section">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap="28px"
          >
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  sx={{
                    width: "296px",
                    minWidth: "296px",
                    borderRadius: "5px",
                    border: (theme) => theme.palette.border.primary,
                    ".MuiDateCalendar-root": {
                      width: "296px",
                      minWidth: "296px",
                    },
                    ".Mui-selected": {
                      color: (theme) =>
                        `${theme.palette.primary.main} !important`,
                      backgroundColor: (theme) =>
                        `${theme.palette.secondary.main} !important`,
                    },
                    ".Mui-selected:hover": {
                      color: (theme) =>
                        `${theme.palette.primary.main} !important`,
                      backgroundColor: (theme) =>
                        `${theme.palette.secondary.main} !important`,
                    },
                    ".MuiPickersLayout-toolbar": {
                      display: "none",
                    },
                    ".MuiDialogActions-root>:not(style)~:not(style)": {
                      fontWeight: 700,
                    },
                    button: {
                      background: "transparent",
                      color: (theme) => theme.palette.primary.main,
                      fontSize: "12px",
                      ":hover": {
                        background: "transparent",
                      },
                    },
                  }}
                  onChange={(date) => setSelectedDate(date)}
                  defaultValue={dayjs(selectedDate) || dayjs()}
                />
              </LocalizationProvider>
            </Box>
            <Stack
              direction="column"
              justifyContent="space-between"
              alignItems="flex-start"
              gap="10px"
              sx={{ height: "399px" }}
            >
              <Box>
                <Typography textAlign="left" fontWeight={600} fontSize={12}>
                  Selected Date Range:
                </Typography>
                <time
                  style={{
                    fontSize: "20px",
                    fontFamily: `"Segoe UI", "sans-serif"`,
                    fontWeight: "600",
                    textAlign: "left",
                    lineHeight: "140%",
                  }}
                >
                  24.02.2024 -
                </time>
                <time
                  style={{
                    fontSize: "20px",
                    fontFamily: `"Segoe UI", "sans-serif"`,
                    fontWeight: "600",
                    textAlign: "left",
                    lineHeight: "140%",
                    display: "inline-block",
                  }}
                >
                  15-03.2024
                </time>
              </Box>
              <Box>
                <Typography textAlign="left" fontWeight={600} fontSize={12}>
                  Selected lease total:
                </Typography>
                <Typography textAlign="left" fontSize={32} fontWeight={600}>
                  $2000
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>
        <Box sx={{ marginTop: "28px" }} component="section">
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography fontWeight={300} fontSize={16}>
              Tenant:
              <Typography
                sx={{ display: "inline", marginLeft: "5px" }}
                fontWeight={600}
                fontSize={16}
              >
                Brand Name
              </Typography>
            </Typography>
            <Box
              sx={{
                width: "24px",
                height: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img width={8} height={5} src={arrowDown} alt="down" />
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography fontWeight={300} fontSize={16}>
              Event:
              <Typography
                sx={{ display: "inline", marginLeft: "5px" }}
                fontWeight={600}
                fontSize={16}
              >
                Event Name
              </Typography>
            </Typography>
            <Box
              sx={{
                width: "24px",
                height: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img width={8} height={5} src={arrowDown} alt="down" />
            </Box>
          </Stack>
        </Box>
        <Box sx={{ marginY: "16px" }} component="section">
          <Input
            multiline
            rows={2}
            minRows={2}
            sx={{
              height: "auto",
              borderRadius: "5px",
              padding: "16px 10px",
              background: (theme) => theme.palette.primary.contrastText,
              border: (theme) =>
                `1px solid ${theme.palette.border.borderColor[0]}`,
            }}
            placeholder={"Type your message here"}
          />
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ marginY: "16px" }}
          component="section"
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="31px"
          >
            <img width={16} height={16} src={bold} alt="bold" />
            <img width={16} height={16} src={italic} alt="italic" />
            <img width={16} height={16} src={lineThrough} alt="line-through" />
            <img width={16} height={16} src={paperClip} alt="paper-clip" />
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="31px"
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap="18px"
            >
              <img width={24} height={24} src={link} alt="link" />
              <img width={24} height={24} src={smile} alt="smile" />
            </Stack>
            <Button
              onClick={() => handleSave(open)}
              sx={{
                width: "85px",
                height: "31px",
                fontSize: "16px",
                fontWeight: 700,
                color: (theme) => theme.palette.primary.main,
                background: (theme) => theme.palette.button.primary,
                ":hover": {
                  color: (theme) => theme.palette.primary.contrastText,
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default SpaceInquireModal;
