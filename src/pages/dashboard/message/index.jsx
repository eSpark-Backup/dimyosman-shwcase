import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";

import AllMessages from "./messages";

import { Input } from "../../../components";
import MessageItem from "../../../components/Message/MessageItem";
import IconBadge from "../../../components/Message/IconBadge";

import {
  search,
  messageIcon,
  brandIcon,
  flag,
  spaceIcon,
  profileIcon,
  accountIcon,
} from "../../../assets";

import {
  useGetChatsForContactsQuery,
  useGetAllChatDetailsQuery,
} from "../../../services/chats.js";
import { format } from "date-fns";
import { getMessages } from "../../../store/slices/chat.js";
import { useSocket } from "../../../context/SocketContext.jsx";

const icons = [
  { icon: messageIcon, bg: "rgba(0, 20, 28, 0.8)", type: "message" },
  { icon: brandIcon, bg: "rgba(196, 119, 127, 0.2)", type: "brand" },
  { icon: flag, bg: "rgba(148, 185, 134, 0.2)", type: "event" },
  { icon: spaceIcon, bg: "rgba(120, 150, 195, 0.2)", type: "space" },
  { icon: profileIcon, bg: "rgba(0, 20, 28, 0.1)", type: "profile" },
];

const ActivityType = ({ type, theme }) => (
  <Box
    sx={{
      background:
        type === "event"
          ? "rgb(148, 185, 134)"
          : type === "brand"
          ? "rgb(196, 119, 127)"
          : type === "space"
          ? "rgb(120, 150, 195)"
          : theme.palette.primary.main,
      width: "16px",
      height: "16px",
      position: "absolute",
      bottom: "0px",
      right: "0px",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img
      src={
        type === "event"
          ? flag
          : type === "brand"
          ? brandIcon
          : type === "space"
          ? spaceIcon
          : accountIcon
      }
      alt="Icon"
      style={{ width: "12px", height: "10px" }}
    />
  </Box>
);

const Message = () => {
  const theme = useTheme();

  const isLessThan900 = useMediaQuery("(max-width:900px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");

  const { myChat, messages, hasChats } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const {
    data: messageData,
    isSuccess,
    isLoading,
  } = useGetChatsForContactsQuery(
    {
      chats: myChat?.flatMap((chat) => chat.chats.map((c) => c._id)),
    },
    {
      skip: !myChat?.length,
    }
  );

  const {
    data: chatDetailsData,
    isSuccess: chatDetailsSuccess,
    isLoading: chatDetailsLoading,
  } = useGetAllChatDetailsQuery(
    {
      chats: myChat?.flatMap((chat) => chat.chats.map((c) => c._id)),
    },
    {
      skip: !myChat?.length,
    }
  );

  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    if (
      messageData &&
      !messageData.includes(undefined) &&
      messageData?.length
    ) {
      const filteredMessages = messageData
        ?.map((message) => message?.messages)
        ?.flat();

      dispatch(getMessages(filteredMessages));
    }
  }, [messageData, isSuccess, myChat]);

  const { emitEvent, addListener, removeListener } = useSocket();

  useEffect(() => {
    addListener("NEW_MESSAGE", (data) => {
      console.log("NEW_MESSAGE EVENT TRIGGERED.");

      dispatch(getMessages([...messages, data.message]));
    });

    return () => {
      removeListener("NEW_MESSAGE");
    };
  }, [addListener, removeListener, messages, emitEvent]);

  useEffect(() => {
    if (chatDetailsData && messages) {
      const message = myChat.map((el) => {
        return {
          id: el?.brandDetails?.id,
          activity: "brand",
          brandName: el?.brandDetails?.brandName,
          brandImage: el?.brandDetails?.brandImage,
          read: false,
          creatorDetail: el?.brandDetails?.user,
          spaces: 1234,
          followers: 234566,
          saved: "789k",
          reviews: 12345,
          leases: 12345,
          rating: 5,
          messageGroups: el?.chats?.map((item) => {
            let matchingItem = chatDetailsData
              ?.map((item2) => {
                if (item2.chat._id === item._id) {
                  return {
                    members: item2.chat?.members,
                    name: item2.chat?.name,
                    createdAt: item2.chat?.createdAt,
                    updatedAt: item2.chat?.updatedAt,
                    chatId: item2.chat?._id,
                  };
                }
              })
              .find((result) => result !== undefined);
            const currentChatMessages = [];

            messages.forEach((message) => {
              if (message.chat === item?._id) {
                currentChatMessages.push(message);
              }
            });

            return {
              ...item,
              id: item?._id,
              chatId: matchingItem?.chatId,
              members: matchingItem?.members,
              brandName: item?.receiverBrand?.brandName,
              activity: "brand",
              brandImage: item?.receiverBrand?.brandImage,
              creator: item?.receiverBrand?.user?.name,
              read: false,
              chatName: matchingItem?.name,
              date: format(new Date(matchingItem?.createdAt), "MM/dd/yy"),
              time: format(new Date(matchingItem?.createdAt), "h:mma"),
              messages: currentChatMessages?.map((messageItem) => {
                return {
                  ...messageItem,
                  id: messageItem?._id,
                  brandName: item?.senderBrand?.brandName,
                  brandImage: item?.senderBrand?.brandImage,
                  activity: "brand",
                  creator: el?.name,
                  date: format(new Date(messageItem?.createdAt), "MM/dd/yy"),
                  time: format(new Date(messageItem?.createdAt), "h:mma"),
                };
              }),
            };
          }),
        };
      });
      setAllMessages(message);
    }
  }, [myChat, messageData, chatDetailsData, messages]);

  const [expanded, setExpanded] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleAccordionChange = (index) => (event, isExpanded) => {
    setSelectedChatId(allMessages[index]?.messageGroups[0]?.chatId);
    setSelectedGroup(() => {
      if (isExpanded) {
        return {
          messageGroup: allMessages[index]?.messageGroups[0],
          group: allMessages[index],
        };
      } else {
        setSelectedGroup(null);
      }
    });

    setExpanded(isExpanded ? index : null);
  };

  useEffect(() => {
    if (
      allMessages.length &&
      selectedChatId === null &&
      selectedGroup !== null
    ) {
      setSelectedGroup({
        messageGroup: allMessages[0]?.messageGroups[0],
        group: allMessages[0],
      });
    }
  }, [allMessages, selectedChatId, messages]);

  useEffect(() => {
    if (
      allMessages.length &&
      selectedChatId === null &&
      selectedGroup === null
    ) {
      setSelectedGroup({
        messageGroup: allMessages[0]?.messageGroups[0],
        group: allMessages[0],
      });
    } else if (
      allMessages.length &&
      selectedChatId !== null &&
      expanded !== null
    ) {
      setSelectedGroup({
        messageGroup: allMessages[expanded]?.messageGroups?.find(
          (msg) => msg.id === selectedChatId
        ),
        group: allMessages[expanded],
      });
    }
  }, [allMessages, selectedChatId, expanded, messages]);

  if (isLoading || chatDetailsLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (hasChats === "empty") {
    return (
      <Box sx={{ width: "100%" }}>
        <h1>You don't have any conversations.</h1>
      </Box>
    );
  }

  return (
    <>
      {allMessages?.length === 0 ? null : (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} lg={3}>
              <Box sx={{ margin: "16px 0px" }}>
                <Input
                  name="message"
                  type="text"
                  placeholder="Search Messages..."
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid rgba(209, 219, 215, 0.5)",
                    borderRadius: "5px",
                    padding: "0 16px",
                    "& input": {
                      paddingRight: 0,
                      paddingLeft: 0,
                    },
                    "& input::placeholder": {
                      color: "rgba(0, 20, 28, 0.5)",
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="start">
                      <IconButton edge="end">
                        <img src={search} alt="Search" />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  marginBottom: 2,
                  justifyContent: "space-between",
                }}
              >
                {icons.map((icon, i) => (
                  <IconBadge key={i} {...icon} theme={theme} />
                ))}
              </Box>

              <Box
                sx={{
                  fontFamily: '"Segoe UI", "sans-serif"',
                  maxHeight: isLessThan1280
                    ? "calc(100vh - 240px)"
                    : isLessThan1400
                    ? "calc(100vh - 252px)"
                    : "calc(100vh - 269px)",
                  overflowY: "auto",
                  marginBottom: isLessThan1280
                    ? "20px"
                    : isLessThan1400
                    ? "32px"
                    : "50px",
                }}
              >
                {allMessages?.map((message, index) => (
                  <MessageItem
                    key={index}
                    message={message}
                    theme={theme}
                    expanded={expanded === index}
                    onChange={handleAccordionChange(index)}
                    setSelectedGroup={setSelectedGroup}
                    selectedGroup={selectedGroup}
                    ActivityType={ActivityType}
                    setSelectedChatId={setSelectedChatId}
                  />
                ))}
              </Box>
            </Grid>

            <Grid
              sx={{ display: isLessThan900 ? "none" : "block" }}
              item
              md={8}
              lg={9}
            >
              {expanded === null ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <h1>No chat selected</h1>
                </Box>
              ) : (
                <AllMessages
                  setSelectedGroup={setSelectedGroup}
                  selectedGroup={selectedGroup}
                  ActivityType={ActivityType}
                  allMessages={allMessages}
                  setSelectedChatId={selectedChatId}
                  emitEvent={emitEvent}
                  removeListener={removeListener}
                  addListener={addListener}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Message;
