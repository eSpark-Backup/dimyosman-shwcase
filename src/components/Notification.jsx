import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Stack, Typography } from "@mui/material";

import ActivityType from "./Message/ActivityType";

import { setRedirectTab } from "../store/slices/space";
import {
  emptyGoToMessage,
  setFromNotification,
  setGoToMessage,
} from "../store/slices/notification";

const Notification = ({ open, theme, setShowNotification }) => {
  const notifRef = useRef();

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications } = useSelector((state) => state.notification);
  const { activeTabForNotif } = useSelector((state) => state.space);

  const navigation = (item) => {
    if (item?.metadata?.redirect) {
      let redName = item.metadata.redirect;

      if (pathname === "/space") {
        if (
          item.metadata?.redirect === "Lease" &&
          activeTabForNotif !== "Lease"
        ) {
          redName = "Lease";
        } else if (
          item.metadata?.redirect === "Tenant" &&
          activeTabForNotif !== "Tenant"
        ) {
          redName = "Tenant";
        }
        dispatch(setRedirectTab(redName));
      } else {
        dispatch(setRedirectTab(redName));
        navigate("/space");
      }
    } else {
      dispatch(emptyGoToMessage());
      dispatch(setFromNotification(false));

      if (item?.metadata?.receiverSpaceName) {
        const navigateData = {
          spaceName: item.metadata.receiverSpaceName,
          chatId: item.metadata.ChatId,
        };

        dispatch(setGoToMessage(navigateData));
      } else {
        const navigateData = {
          brandName: item.metadata.senderBrandName,
          chatId: item.metadata.chatId,
        };

        dispatch(setGoToMessage(navigateData));
      }

      dispatch(setFromNotification(true));

      if (pathname !== "/message") {
        navigate("/message");
      }
    }
    setShowNotification(false);
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
                  {item?.metadata?.senderBrandImage ||
                  item?.metadata?.senderImage ? (
                    <img
                      src={
                        item?.metadata?.senderBrandImage ||
                        item?.metadata?.senderImage
                      }
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
                  {item?.metadata?.redirect ? (
                    item?.message
                  ) : (
                    <>
                      <strong style={{ textTransform: "capitalize" }}>
                        {item?.metadata?.senderBrandUserName ||
                          item?.metadata?.senderBrandName}
                      </strong>{" "}
                      sent a{" "}
                      {item.title
                        ?.split(/for/i)[0]
                        .replace("received", "")
                        .trim()}{" "}
                      on{" "}
                      <span style={{ textTransform: "capitalize" }}>
                        {item?.metadata?.spaceId
                          ? "Space"
                          : item?.metadata?.name?.includes("Brand")
                          ? "Brand"
                          : "Event"}
                      </span>{" "}
                      <strong style={{ textTransform: "capitalize" }}>
                        {item.title?.split(/for/i)[1]}
                      </strong>
                    </>
                  )}
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
