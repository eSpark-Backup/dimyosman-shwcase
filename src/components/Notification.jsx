import { Box, Stack, Typography } from "@mui/material";

import ActivityType from "./Message/ActivityType";

const Notification = ({ open, data, theme }) => {
  return (
    <Box
      sx={{
        opacity: open ? 1 : 0,
        display: open ? "block" : "none",
        position: "absolute",
        top: "58px",
        right: '30px',
        border: "1px solid #D1DBD7",
        background: "#fff",
        borderRadius: "0px 0px 5px 5px",
        padding: "16px",
        width: "366px",
        overflow: "hidden",
      }}
    >
      <Typography
        fontSize={16}
        fontWeight={300}
        color="#000"
        textAlign="left"
        sx={{ marginBottom: 2 }}
        variant="h3"
      >
        Notifications:
      </Typography>

      <Stack gap={4} sx={{ overflowY: "auto", maxHeight: "220px", }}>
        {data.map((item) => {
          return (
            <Stack key={item._id} flexDirection="row" alignItems="center">
              <Box
                sx={{
                  width: "48px",
                  height: "48px",
                  marginRight: 2,
                  borderRadius: "5px",
                  position: "relative",
                }}
              >
                {item?.metadata?.senderBrandImage ? (
                  <img
                    src={item?.metadata?.senderBrandImage}
                    alt="Icon"
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

                <ActivityType type={item?.activity || "brand"} theme={theme} />
              </Box>

              <Typography
                fontSize={16}
                fontWeight={400}
                textTransform="lowercase"
                maxWidth={"270px"}
              >
                <strong style={{ textTransform: "capitalize" }}>
                  {item?.metadata?.senderBrandUserName}
                </strong>{" "}
                sent a {item.title?.split("For")[0]} for{" "}
                <strong style={{ textTransform: "capitalize" }}>{item.title?.split("For")[1]}</strong>
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Notification;
