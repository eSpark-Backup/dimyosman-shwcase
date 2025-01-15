import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

import ActivityType from "./ActivityType";

import { isActiveMembers } from "../../store/slices/chat";

import { deleteCookie, getCookie, setCookie } from "../../utils";

const MessageItem = ({
  message,
  theme,
  expanded,
  onChange,
  setSelectedGroup,
  selectedGroup,
  setSelectedChatId,
  emitEvent,
  onlineUsers
}) => {
  const detailsRef = useRef(null);

  const getUnreadMessage =
    getCookie("unread") && JSON.parse(getCookie("unread"));
  const getUnreadChatIds =
    getCookie("unreadChatIds") && JSON.parse(getCookie("unreadChatIds"));

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (expanded && detailsRef.current) {
      detailsRef.current.scrollTop = 0;
    }
  }, [expanded]);

  const getCount = (id) => {
    const ifCountExists = getUnreadMessage?.filter((msg) => msg.chatId === id);

    if (ifCountExists?.length > 0) {
      const count = getUnreadMessage?.find((msg) => msg.chatId === id)?.count;

      return count;
    }
  };

  const filterCount = (id) => {
    const ifCountExists = getUnreadMessage?.filter((msg) => msg.chatId !== id);
    const ifChatIdExists = getUnreadChatIds?.filter((id) => id !== id);

    if (ifCountExists?.length > 0) {
      setCookie("unread", JSON.stringify(ifCountExists));
      setCookie("unreadChatIds", JSON.stringify(ifChatIdExists));
    } else {
      deleteCookie("unread");
      deleteCookie("unreadChatIds");
    }
  };

  return (
    <Accordion
      sx={{
        bgcolor: "#ffffff",
        marginBottom: 2,
        borderRadius: "3px",
        border: "none",
        boxShadow: "none",
        padding: 0,
        "&:before": {
          display: "none",
        },
        "&:last-child": {
          marginBottom: 0,
        },
      }}
      expanded={message?.chatGroups?.length ? expanded : false}
      onChange={message?.chatGroups?.length ? onChange : null}
    >
      <AccordionSummary
        sx={{
          padding: 1,
          display: "flex",
          minHeight: "auto !important",
          alignItems: "center",
          margin: "0px !important",
          position: "relative",

          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            margin: "0px !important",
          },
        }}
      >
        <Box
          sx={{
            width: "32px",
            height: "32px",
            marginRight: 2,
            borderRadius: "5px",
            position: "relative",
          }}
        >
          {message.parentImage ? (
            <img
              src={message.parentImage}
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

          <ActivityType type={message.parentActivity} theme={theme} />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            lineHeight: "22px",
            fontSize: "16px",
            textAlign: "left",
          }}
        >
          {message.parentName}
        </Typography>

        {getUnreadMessage?.length
          ? message?.chatGroups?.some((msg) =>
              getUnreadChatIds?.includes(msg.chatId)
            ) && (
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: theme.palette.error.danger,
                  position: "absolute",
                  top: "0px",
                  right: "2px",
                }}
              />
            )
          : null}
      </AccordionSummary>

      <AccordionDetails
        ref={detailsRef}
        sx={{
          padding: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {message?.chatGroups?.length
          ? message.chatGroups.map((el, i) => {
              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: el?.creator ? "center" : "unset",
                    padding: 1,
                    bgcolor:
                      selectedGroup?.chatGroup?.chatId === el?.chatId
                        ? "rgba(209, 219, 215, 0.6)"
                        : "#ffffff",
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: "3px",
                  }}
                  onClick={() => {
                    const obj = {
                      userId: user.userChatId,
                      members: el?.members,
                    };
                    dispatch(isActiveMembers(obj.members));
                    emitEvent("CHAT_JOINED", obj);

                    setSelectedChatId(el?.chatId);
                    setSelectedGroup({ chatGroup: el, group: message });
                    getCount(el.chatId) && filterCount(el?.chatId);
                  }}
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
                    {el?.receiverSpace?.spaceImage ||
                    el?.senderBrand?.brandImage ? (
                      <Box sx={{ position: "relative", height: "100%" }}>
                        <img
                          src={
                            el?.isInquiryRole === "sender"
                              ? el?.receiverSpace?.spaceImage
                              : el?.senderBrand?.brandImage
                          }
                          alt="Message Icon"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "5px",
                            border: "1px solid rgba(209, 219, 215, 0.4)",
                          }}
                        />
                        {onlineUsers?.length
                          ? el.members?.some((member) =>
                              onlineUsers?.includes(member)
                            ) && (
                              <Box
                                sx={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: "#00FF00",
                                  position: "absolute",
                                  top: "-4px",
                                  right: "-3px",
                                }}
                              />
                            )
                          : null}
                      </Box>
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

                    <ActivityType type={el.activity} theme={theme} />
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
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
                      {el?.childName}
                    </Typography>

                    {el?.creator && (
                      <Typography
                        sx={{
                          fontWeight: 300,
                          fontSize: "12px",
                          lineHeight: "17px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{el.creator}</span>
                        {getUnreadMessage?.length && getCount(el.chatId) && (
                          <Box
                            component={"span"}
                            sx={{
                              minWidth: "15px",
                              height: "15px",
                              borderRadius: "50%",
                              backgroundColor: "#ee6161",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              color: "#ffffff",
                              padding:
                                getCount(el.chatId) > 10 ? "0px 4px" : "0px",
                            }}
                          >
                            {getCount(el.chatId)}
                          </Box>
                        )}
                      </Typography>
                    )}

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 300,
                          fontSize: "10px",
                          lineHeight: "14px",
                        }}
                      >
                        {el?.date}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 300,
                          fontSize: "10px",
                          lineHeight: "14px",
                        }}
                      >
                        {el?.time}
                      </Typography>
                    </Box>
                  </Box>

                  {el.read && (
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: theme.palette.error.danger,
                        position: "absolute",
                        top: "-4px",
                        right: "-3px",
                      }}
                    />
                  )}
                </Box>
              );
            })
          : null}
      </AccordionDetails>
    </Accordion>
  );
};

export default MessageItem;
