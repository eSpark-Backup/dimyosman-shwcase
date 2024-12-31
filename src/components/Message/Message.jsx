import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";

const Message = ({ ActivityType, theme, message, sender }) => {
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        marginTop: 2,
        padding: 2,
        border: "1px solid rgba(209, 219, 215, 0.5)",
        borderRadius: "5px",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: "48px",
            height: "48px",
            marginRight: 2,
            position: "relative",
          }}
        >
          {sender?.brandImage ? (
            <img
              src={sender.brandImage}
              alt="Message Icon"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
                border: "1px solid rgba(209, 219, 215, 0.4)",
              }}
            />
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

          <ActivityType type={message?.activity} theme={theme} />
        </Box>

        <Box flex={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 600,
                lineHeight: "22px",
                fontSize: "16px",
                textAlign: "left",
              }}
            >
              {sender.brandName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: "10px",
                  marginRight: 2,
                  lineHeight: "14px",
                }}
              >
                {message.date}
              </Typography>
              <Typography
                sx={{ fontWeight: 300, fontSize: "10px", lineHeight: "14px" }}
              >
                {message.time}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{ fontWeight: 300, fontSize: "12px", lineHeight: "17px" }}
          >
            {message.sender.name}
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          marginTop: isLessThan1400 ? 2 : 3,

          "& a": {
            color: "#00141C !important",
          },
        }}
        dangerouslySetInnerHTML={{
          __html: message.text,
        }}
      />
    </Box>
  );
};

export default Message;
