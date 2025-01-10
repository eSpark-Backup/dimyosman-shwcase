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
import {
  getChatDetails,
  getMessages,
  isActiveMembers,
} from "../../../store/slices/chat.js";
import { useSocket } from "../../../context/SocketContext.jsx";
import { deleteCookie, getCookie, messageBox, setCookie } from "../../../utils/index.js";

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

  const { emitEvent, addListener, removeListener } = useSocket();

  const { myChat, messages, chatDetails, hasChats } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);

  const gatherBrandsChatId = () => {
    return (
      myChat?.brands?.flatMap((chat) => chat.chats.map((c) => c._id)) || []
    );
  };

  const gatherSpacesChatId = () => {
    return (
      myChat?.spaces?.flatMap((chat) => chat.chats.map((c) => c._id)) || []
    );
  };

  const dispatch = useDispatch();

  const [isNewIdsForChatDetails, setIsNewIdsForChatDetails] = useState([]);
  const [isNewIdsForAllMessages, setIsNewIdsForAllMessages] = useState([]);
  const [fetchedChatIds, setFetchedChatIds] = useState(new Set());
  const [fetchedMessageIds, setFetchedMessageIds] = useState(new Set());

  useEffect(() => {
    const existingDetailsIds = chatDetails.map((item) => item._id);
    const newIdsForDetails = [
      ...gatherBrandsChatId(),
      ...gatherSpacesChatId(),
    ].filter(
      (id) => !existingDetailsIds.includes(id) && !fetchedChatIds.has(id)
    );

    if (newIdsForDetails.length) {
      setIsNewIdsForChatDetails(newIdsForDetails);
    } else {
      setIsNewIdsForChatDetails([]);
    }
  }, [myChat, chatDetails, fetchedChatIds]);

  useEffect(() => {
    const existingMessagesIds = messages.map((item) => item.chat);
    const newIdsForMessages = [
      ...gatherBrandsChatId(),
      ...gatherSpacesChatId(),
    ].filter(
      (id) => !existingMessagesIds.includes(id) && !fetchedMessageIds.has(id)
    );

    if (newIdsForMessages.length) {
      setIsNewIdsForAllMessages(newIdsForMessages);
    } else {
      setIsNewIdsForAllMessages([]);
    }
  }, [myChat, messages, fetchedMessageIds]);

  const {
    data: messageData,
    isSuccess,
    isLoading,
  } = useGetChatsForContactsQuery(
    {
      chats: isNewIdsForAllMessages,
    },
    {
      skip: !isNewIdsForAllMessages?.length,
    }
  );

  const {
    data: chatDetailsData,
    isSuccess: chatDetailsSuccess,
    isLoading: chatDetailsLoading,
  } = useGetAllChatDetailsQuery(
    {
      chats: isNewIdsForChatDetails,
    },
    {
      skip: !isNewIdsForChatDetails?.length,
    }
  );

  const [allMessages, setAllMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingUser, setIsTypingUser] = useState(null);

  const [expanded, setExpanded] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [initialChatId, setInitialChatId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (messageData && messageData?.length) {
      const filteredMessages = messageData
        .map((message) => message?.messages)
        .flat();

      // Get existing message IDs from the current state
      const existingMessageIds = messages.map((message) => message.chat);

      // Filter new messages that are not already in the current state
      const newMessages = filteredMessages.filter(
        (message) => !existingMessageIds.includes(message.chat)
      );

      // Dispatch only new messages to add them to the state
      if (newMessages.length > 0) {
        dispatch(getMessages([...messages, ...newMessages]));
        newMessages.forEach((msg) => {
          setFetchedMessageIds((prev) => new Set(prev).add(msg.chat)); // Mark as fetched
        });
      } else {
        dispatch(getMessages(filteredMessages));
      }
    }
  }, [messageData, isSuccess]);

  useEffect(() => {
    if (chatDetailsData && chatDetailsData?.length) {
      const filteredChat = chatDetailsData?.map((chat) => chat?.chat);

      // Get existing chat IDs from the current state
      const existingChatIds = chatDetails.map((chat) => chat._id);

      // Filter new chats that are not already in the current state
      const newChats = filteredChat.filter(
        (chat) => !existingChatIds.includes(chat._id)
      );

      // Dispatch only new chats to add them to the state
      if (newChats.length > 0) {
        dispatch(getChatDetails([...chatDetails, ...newChats]));
        newChats.forEach((chat) => {
          setFetchedChatIds((prev) => new Set(prev).add(chat._id)); // Mark as fetched
        });
      } else {
        dispatch(getChatDetails(filteredChat));
      }
    }
  }, [chatDetailsData, chatDetailsSuccess]);

  useEffect(() => {
    addListener("NEW_MESSAGE", (data) => {
      dispatch(getMessages([...messages, data.message]));
    });

    addListener("NEW_MESSAGE_ALERT", (data) => {
      if (
        allMessages.length > 0 &&
        data.chatId !== (initialChatId || selectedChatId)
      ) {
        const getNotReadMessage = JSON.parse(getCookie("unread"));
        const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds"));

        if (!getNotReadMessage) {
          // If no unread messages cookie exists, create it
          setCookie(
            "unread",
            JSON.stringify([
              {
                chatId: data.chatId,
                count: 1,
              },
            ])
          );

          setCookie("unreadChatIds", JSON.stringify([data.chatId]));
        } else {
          const updatedMessages = getNotReadMessage.some(
            (el) => el.chatId === data.chatId
          )
            ? getNotReadMessage.map((el) =>
                el.chatId === data.chatId
                  ? { chatId: el.chatId, count: el.count + 1 }
                  : el
              )
            : [
                ...getNotReadMessage,
                {
                  chatId: data.chatId,
                  count: 1,
                },
              ];

          setCookie("unread", JSON.stringify(updatedMessages));
          if (!getUnreadChatIds.includes(data.chatId)) {
            getUnreadChatIds.push(data.chatId);
            setCookie("unreadChatIds", JSON.stringify(getUnreadChatIds));
          }
        }
      }
    });

    return () => {
      removeListener("NEW_MESSAGE");
      removeListener("NEW_MESSAGE_ALERT");
    };
  }, [addListener, removeListener, messages, emitEvent, allMessages]);

  useEffect(() => {
    addListener("START_TYPING", (data) => {
      console.log("START_TYPING EVENT TRIGGERED.");

      setIsTypingUser({
        chatId: data.chatId,
        userId: user.id,
      });
    });

    addListener("STOP_TYPING", () => {
      console.log("STOP_TYPING EVENT TRIGGERED.");

      setIsTypingUser(null);
    });

    return () => {
      removeListener("START_TYPING");
      removeListener("STOP_TYPING");
    };
  }, [addListener, removeListener, emitEvent]);

  useEffect(() => {
    if (isSuccess && chatDetailsSuccess) {
      if (chatDetailsData && messages) {
        let newArr = [...myChat.brands, ...myChat.spaces];

        let message = newArr.map((el) => {
          return messageBox(el, chatDetails, messages);
        });

        setAllMessages(message);
      }
    }
  }, [
    myChat,
    messageData,
    chatDetailsData,
    messages,
    isSuccess,
    chatDetailsSuccess,
    chatDetails,
  ]);

  // useEffect(() => {
  //   addListener("ONLINE_USERS", (data) => {
  //     console.log("ONLINE_USERS EVENT TRIGGERED.",data);

  //     const filterCurrentUser = data?.filter((acc) => acc !== user?.userChatId);

  //     if (allMessages?.length > 0 && filterCurrentUser?.length > 0) {
  //     console.log(allMessages?.length > 0 && filterCurrentUser?.length > 0);

  //       const updatedMessages = allMessages.map((messageGroup) => {
  //         return {
  //           ...messageGroup,
  //           messageGroups: messageGroup.messageGroups.map((group) => {
  //             const findOppositeUser = group.members?.find(
  //               (member) => member !== user?.userChatId
  //             );

  //             // Check if it's a receiver chat or sender chat
  //             if (messageGroup.isReceiverChats) {
  //               // If the current user is the sender, mark sender as active
  //               if (filterCurrentUser.includes(findOppositeUser)) {
  //                 return {
  //                   ...group,
  //                   isActive: true,
  //                 };
  //               } else {
  //                 return {
  //                   ...group,
  //                   isActive: false,
  //                 };
  //               }
  //             } else {
  //               // If the current user is the receiver, mark receiver as active
  //               if (filterCurrentUser.includes(findOppositeUser)) {
  //                 return {
  //                   ...group,
  //                   isActive: true,
  //                 };
  //               } else {
  //                 return {
  //                   ...group,
  //                   isActive: false,
  //                 };
  //               }
  //             }
  //           }),
  //         };
  //       });
  //       // setAllMessages(updatedMessages);
  //       setOnlineUsers(filterCurrentUser);
  //     }
  //   });

  //   return () => {
  //     removeListener("ONLINE_USERS");
  //   };
  // }, [addListener, removeListener, selectedGroup]);

  const handleAccordionChange = (index) => (event, isExpanded) => {
    const selectedGroup = {
      chatGroup: allMessages[index]?.chatGroups[0],
      group: allMessages[index],
    };

    const obj = {
      userId: user.userChatId,
      members: allMessages[index]?.chatGroups[0]?.members,
    };

    if (index !== expanded) {
      // dispatch(isActiveMembers(obj.members))
      // emitEvent("CHAT_JOINED", obj);
    }
    const getUnreadMessage = JSON.parse(getCookie("unread"))|| [];
    const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds")) || [];

    const ifCountExists = getUnreadMessage?.filter(
      (msg) => msg.chatId !== allMessages[index]?.chatGroups[0]?.id
    );
    const ifChatIdExists = getUnreadChatIds?.filter(
      (id) => id !== allMessages[index]?.chatGroups[0]?.id
    );

    if (ifCountExists?.length > 0) {
      setCookie("unread", JSON.stringify(ifCountExists));
      setCookie("unreadChatIds", JSON.stringify(ifChatIdExists));
    } else {
      deleteCookie("unread");
      deleteCookie("unreadChatIds");
    }

    setSelectedChatId(allMessages[index]?.chatGroups[0]?.chatId);
    setSelectedGroup(selectedGroup);
    setExpanded(index);
  };

  useEffect(() => {
    if (allMessages.length) {
      if (
        (selectedChatId === null && selectedGroup === null) ||
        (selectedChatId === null && selectedGroup !== null)
      ) {
        setInitialChatId(allMessages[0]?.chatGroups[0]?._id);
        setSelectedGroup({
          chatGroup: allMessages[0]?.chatGroups[0],
          group: allMessages[0],
        });

        const obj = {
          userId: user.userChatId,
          members: allMessages[0]?.chatGroups[0]?.members,
        };
        // dispatch(isActiveMembers(obj.members))
        // emitEvent("CHAT_JOINED", obj);
      }

      if (selectedChatId !== null && expanded !== null) {
        const group = allMessages[expanded];
        const chatGroup = group?.chatGroups?.find(
          (msg) => msg.id === selectedChatId
        );

        if (chatGroup) {
          setInitialChatId(null);
          setSelectedGroup({ chatGroup, group });
        }
      }
    }
  }, [allMessages, selectedChatId, expanded, messages]);

  // useEffect(() => {
  //   if (
  //     selectedGroup &&
  //     selectedGroup.group &&
  //     selectedGroup.group.messageGroups
  //   ) {
  //     const obj = {
  //       userId: user.userChatId,
  //       members: allMessages[expanded]?.messageGroups[0]?.members,
  //     };

  //     return () => {
  //       emitEvent("CHAT_LEFT", obj);
  //       setOnlineUsers([]);
  //     };
  //   }
  // }, []);

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
                    emitEvent={emitEvent}
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
                  setIsTyping={setIsTyping}
                  isTyping={isTyping}
                  isTypingUser={isTypingUser}
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
