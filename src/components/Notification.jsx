import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Stack, Typography } from "@mui/material";

import ActivityType from "./Message/ActivityType";

import {
  emptyGoToMessage,
  setFromNotification,
  setGoToMessage,
} from "../store/slices/notification";

const Notification = ({ open, theme, setShowNotification }) => {
  const notifRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { notifications } = useSelector((state) => state.notification);

  const navigation = (item) => {
    dispatch(emptyGoToMessage());
    dispatch(setFromNotification(false));

    const navigateData = {
      spaceName: item.metadata.receiverSpaceName,
      chatId: item.metadata.ChatId,
    };
    setShowNotification(false);

    dispatch(setGoToMessage(navigateData));
    dispatch(setFromNotification(true));

    if (pathname !== "/message") {
      navigate("/message");
    }
  };

  useEffect(() => {
    if (open && notifRef.current) {
      notifRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [open]);

  return (
    <Box
      sx={{
        opacity: open ? 1 : 0,
        display: open ? "block" : "none",
        position: "absolute",
        top: "58px",
        right: { xs: "0px", sm: "30px" },
        border: "1px solid #D1DBD7",
        background: "#fff",
        borderRadius: "0px 0px 5px 5px",
        padding: "16px",
        width: { xs: "300px", sm: "366px" },
        overflow: "hidden",
        zIndex: "99999",
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

      <Stack
        gap={4}
        sx={{ overflowY: "auto", maxHeight: "220px" }}
        ref={notifRef}
      >
        {notifications.length > 0 ? (
          notifications.map((item) => {
            return (
              <Stack
                key={item._id}
                sx={{
                  cursor: "pointer",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onClick={() => navigation(item)}
              >
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

                  <ActivityType
                    type={item?.activity || "brand"}
                    theme={theme}
                  />
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
                  <strong style={{ textTransform: "capitalize" }}>
                    {item.title?.split("For")[1]}
                  </strong>
                </Typography>
              </Stack>
            );
          })
        ) : (
          <div>
            <Typography
              fontSize={16}
              fontWeight={600}
              textTransform="capitalize"
            >
              You dont have any notifications
            </Typography>
          </div>
        )}
      </Stack>
    </Box>
  );
};

export default Notification;
