import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";

import AllMessages from "./messages";

import MessageItem from "../../../components/Message/MessageItem";
import IconBadge from "../../../components/Message/IconBadge";
import SearchMessage from "../../../components/Message/SearchMessage.jsx";

import {
  messageIcon,
  brandIcon,
  flag,
  spaceIcon,
  profileIcon,
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

import {
  deleteCookie,
  getCookie,
  messageBox,
  setCookie,
} from "../../../utils/index.js";

const icons = [
  { icon: messageIcon, bg: "rgba(0, 20, 28, 0.8)", type: "message" },
  { icon: brandIcon, bg: "rgba(196, 119, 127, 0.2)", type: "brand" },
  { icon: flag, bg: "rgba(148, 185, 134, 0.2)", type: "event" },
  { icon: spaceIcon, bg: "rgba(120, 150, 195, 0.2)", type: "space" },
  { icon: profileIcon, bg: "rgba(0, 20, 28, 0.1)", type: "profile" },
];

const Message = () => {
  const theme = useTheme();

  const isLessThan900 = useMediaQuery("(max-width:900px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");

  const { emitEvent, addListener, removeListener } = useSocket();

  const { myChat, messages, chatDetails, hasChats, allChatIds } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [isNewIdsForChatDetails, setIsNewIdsForChatDetails] = useState([]);
  const [isNewIdsForAllMessages, setIsNewIdsForAllMessages] = useState([]);

  const filterNewIds = (allIds, existingIds) =>
    allIds?.filter((id) => !existingIds.includes(id));

  useEffect(() => {
    const existingDetailsIds = chatDetails.map((item) => item._id);
    setIsNewIdsForChatDetails(filterNewIds(allChatIds, existingDetailsIds));
  }, [myChat, chatDetails, allChatIds]);

  useEffect(() => {
    const existingMessagesIds = messages.map((item) => item.chat);
    setIsNewIdsForAllMessages(filterNewIds(allChatIds, existingMessagesIds));
  }, [myChat, messages, allChatIds]);

  const { data: messageData, isSuccess } = useGetChatsForContactsQuery(
    {
      chats: isNewIdsForAllMessages,
    },
    {
      skip: !myChat?.length,
    }
  );

  const { data: chatDetailsData, isSuccess: chatDetailsSuccess } =
    useGetAllChatDetailsQuery(
      {
        chats: isNewIdsForChatDetails,
      },
      {
        skip: !myChat?.length,
      }
    );

  const [allMessages, setAllMessages] = useState([]);
  const [isTypingUser, setIsTypingUser] = useState(null);

  const [expanded, setExpanded] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [initialChatId, setInitialChatId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [toShare, setToShare] = useState();

  useEffect(() => {
    if (isSuccess && messageData && messageData?.length) {
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
      } else {
        dispatch(getMessages(filteredMessages));
      }
    }
  }, [messageData, isSuccess]);

  useEffect(() => {
    if (chatDetailsSuccess && chatDetailsData && chatDetailsData?.length) {
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
      } else {
        dispatch(getChatDetails(filteredChat));
      }
    }
  }, [chatDetailsData, chatDetailsSuccess]);

  useEffect(() => {
    addListener("NEW_MESSAGE", (data) => {
      dispatch(getMessages([...messages, data.message]));
    });

    const handleNewMessageAlert = (data) => {
      if (
        allMessages.length > 0 &&
        data.chatId !== (initialChatId || selectedChatId)
      ) {
        const getNotReadMessage = JSON.parse(getCookie("unread"));
        const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds"));

        const updatedMessages = getNotReadMessage?.some(
          (el) => el.chatId === data.chatId
        )
          ? getNotReadMessage.map((el) =>
              el.chatId === data.chatId ? { ...el, count: el.count + 1 } : el
            )
          : [...getNotReadMessage, { chatId: data.chatId, count: 1 }];

        setCookie("unread", JSON.stringify(updatedMessages));
        if (!getUnreadChatIds.includes(data.chatId)) {
          getUnreadChatIds.push(data.chatId);
          setCookie("unreadChatIds", JSON.stringify(getUnreadChatIds));
        }
      }
    };

    addListener("NEW_MESSAGE_ALERT", handleNewMessageAlert);

    return () => {
      removeListener("NEW_MESSAGE");
      removeListener("NEW_MESSAGE_ALERT");
    };
  }, [addListener, removeListener, messages, emitEvent, allMessages]);

  useEffect(() => {
    const handleTypingStatus = (event, isTyping) => {
      setIsTypingUser(
        isTyping ? { chatId: event.chatId, userId: user.id } : null
      );
    };

    addListener("START_TYPING", (data) => handleTypingStatus(data, true));
    addListener("STOP_TYPING", () => handleTypingStatus(null, false));

    return () => {
      removeListener("START_TYPING");
      removeListener("STOP_TYPING");
    };
  }, [addListener, removeListener, emitEvent]);

  useEffect(() => {
    if (chatDetails.length > 0 && messages?.length > 0) {
      let message = myChat.map((el) => {
        return messageBox(el, chatDetails, messages);
      });
      setAllMessages(message);
    }
  }, [myChat, messageData, chatDetailsData, messages, chatDetails, ,]);

  useEffect(() => {
    addListener("ONLINE_USERS", (data) => {
      const filterCurrentUser = data?.filter((acc) => acc !== user?.userChatId);
      setOnlineUsers(filterCurrentUser);
    });

    return () => {
      removeListener("ONLINE_USERS");
    };
  }, [addListener, removeListener, emitEvent, allMessages, user]);

  const handleAccordionChange = (index) => (event, isExpanded) => {
    const selectedGroup = {
      chatGroup: allMessages[index]?.chatGroups[0],
      group: allMessages[index],
    };
    setExpanded(index);
    setSelectedGroup(selectedGroup);
    setSelectedChatId(allMessages[index]?.chatGroups[0]?.chatId);

    const obj = {
      userId: user.userChatId,
      members: allMessages[index]?.chatGroups[0]?.members,
    };

    if (index !== expanded) {
      dispatch(isActiveMembers(obj.members));
      emitEvent("CHAT_JOINED", obj);
    }
    const getUnreadMessage = JSON.parse(getCookie("unread")) || [];
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

        dispatch(isActiveMembers(obj.members));
        emitEvent("CHAT_JOINED", obj);
      }

      if (selectedChatId !== null && expanded !== null) {
        const group = allMessages[expanded];
        const chatGroup = group?.chatGroups?.find(
          (msg) => msg.id === selectedChatId
        );

        if (chatGroup) {
          if (toShare && toShare?.chatId !== selectedChatId) {
            emitEvent("STOP_TYPING", toShare);
          }
          setInitialChatId(null);
          setSelectedGroup({ chatGroup, group });

          setTimeout(() => {
            setToShare();
          }, 10);
        }
      }
    }
  }, [allMessages, selectedChatId, expanded, messages]);

  if (
    (chatDetails?.length === 0 || messages.length === 0) &&
    hasChats != "empty"
  ) {
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
              <SearchMessage />

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
                    setSelectedChatId={setSelectedChatId}
                    emitEvent={emitEvent}
                    onlineUsers={onlineUsers}
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
                  selectedGroup={selectedGroup}
                  emitEvent={emitEvent}
                  isTypingUser={isTypingUser}
                  onlineUsers={onlineUsers}
                  setToShare={setToShare}
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
