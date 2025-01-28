import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

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
  changeMessageType,
  filterAllMyGroups,
  getAllMyGroups,
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
  { icon: messageIcon, bg: "rgba(0, 20, 28, 0.8)", activeBG: "rgba(0, 5, 7, 1)", type: "all", },
  { icon: brandIcon, bg: "rgba(196, 119, 127, 0.2)", activeBG: "rgba(196, 119, 127, 0.8)", type: "brand", },
  { icon: flag, bg: "rgba(148, 185, 134, 0.2)", activeBG: "rgba(148, 185, 134, 0.8)", type: "event", },
  { icon: spaceIcon, bg: "rgba(120, 150, 195, 0.2)", activeBG: "rgba(120, 150, 195, 0.8)", type: "space", },
  { icon: profileIcon, bg: "rgba(0, 20, 28, 0.1)", activeBG: "rgba(0, 20, 28, 0.8)", type: "profile", },
];

const style = {
  paddingLeft: "105px",
  maxWidth: {
    xs: "calc(100% - 111px)",
    md: "100%",
  },

  "@media only screen and (min-width: 1281px)": {
    maxWidth: "1100px",
  },

  "@media only screen and (min-width: 1600px)": {
    maxWidth: "1500px",
  },
};

const Message = () => {
  const theme = useTheme();

  const isLessThan900 = useMediaQuery("(max-width:900px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");

  const { emitEvent, addListener, removeListener } = useSocket();

  const {
    myChat,
    messages,
    chatDetails,
    hasChats,
    allChatIds,
    allGroups,
    hasMessages,
  } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();

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

  const { data: messageData, isSuccess } = useGetChatsForContactsQuery({ chats: isNewIdsForAllMessages }, { skip: !myChat?.length } );
  const { data: chatDetailsData, isSuccess: chatDetailsSuccess } = useGetAllChatDetailsQuery( { chats: isNewIdsForChatDetails }, { skip: !myChat?.length, } );

  const [allMessages, setAllMessages] = useState([]);
  const [isTypingUser, setIsTypingUser] = useState(null);

  const [expanded, setExpanded] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [initialChatId, setInitialChatId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [toShare, setToShare] = useState();
  const [activeTab, setActiveTab] = useState("all");

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
        allGroups?.length > 0 &&
        data.chatId !== (initialChatId || selectedChatId)
      ) {
        const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds"));

        if (!getUnreadChatIds) {
          setCookie("unreadChatIds", JSON.stringify([data.chatId]));
          return;
        }

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
  }, [addListener, removeListener, messages, emitEvent, allGroups]);

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

      dispatch(getAllMyGroups(message));
      setAllMessages(message);

      return () => {
        dispatch(changeMessageType());
      };
    }
  }, [myChat, messageData, chatDetailsData, messages, chatDetails]);

  useEffect(() => {
    addListener("ONLINE_USERS", (data) => {
      const filterCurrentUser = data?.filter((acc) => acc !== user?.userChatId);
      setOnlineUsers(filterCurrentUser);
    });

    return () => {
      removeListener("ONLINE_USERS");
    };
  }, [addListener, removeListener, emitEvent, allGroups, user]);

  const handleNewInquiry = (selected, initialId) => {
    const findParentIndex = allGroups?.findIndex(
      (msg) => msg?.parentName === (state?.spaceName || state?.brandName)
    );

    if (findParentIndex !== -1) {
      setExpanded(findParentIndex);
      const parentGroup = allGroups[findParentIndex];
      const selectedGroup = parentGroup?.chatGroups?.find(
        (gr) => gr?.id === state.chatId
      );

      selected.chatGroup = selectedGroup;
      selected.group = parentGroup;
      initialId = selectedGroup.id;
    }

    setTimeout(() => {
      navigate(pathname, { replace: true });
    }, 1000);
  };

  const handleAccordionChange = (index) => (event, isExpanded) => {
    setExpanded(index);
    setSelectedGroup(commonSelectedChatGroup(allGroups, index));
    setSelectedChatId(allGroups[index]?.chatGroups[0]?.chatId);

    const obj = {
      userId: user.userChatId,
      members: allGroups[index]?.chatGroups[0]?.members,
    };

    if (index !== expanded) {
      dispatch(isActiveMembers(obj.members));
      emitEvent("CHAT_JOINED", obj);
    }
    const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds")) || [];

    const ifChatIdExists = getUnreadChatIds?.filter(
      (id) => id !== allGroups[index]?.chatGroups[0]?.id
    );

    if (ifChatIdExists?.length > 0) {
      setCookie("unreadChatIds", JSON.stringify(ifChatIdExists));
    } else {
      deleteCookie("unreadChatIds");
    }
  };

  useEffect(() => {
    if (allGroups?.length) {
      if (
        (selectedChatId === null && selectedGroup === null) ||
        (selectedChatId === null && selectedGroup !== null)
      ) {
        const selected = {
          chatGroup: {},
          group: {},
        };
        let initialId = null;

        if (state) {
          handleNewInquiry(selected, initialId);
        } else {
          selected.chatGroup = allGroups[0]?.chatGroups[0];
          selected.group = allGroups[0];
          initialId = allGroups[0]?.chatGroups[0]?._id;
        }

        setInitialChatId(initialId);
        setSelectedGroup(selected);

        const obj = {
          userId: user.userChatId,
          members: selected?.chatGroup?.members,
        };

        dispatch(isActiveMembers(obj.members));
        emitEvent("CHAT_JOINED", obj);
      }

      if (selectedChatId !== null && expanded !== null) {
        const group = allGroups[expanded];
        const chatGroup = group?.chatGroups?.find(
          (msg) => msg.id === selectedChatId
        );

        const selected = {
          chatGroup: {},
          group: {},
        };

        if (state) {
          handleNewInquiry(selected, null);
        } else {
          selected.chatGroup = chatGroup;
          selected.group = group;
        }

        if (chatGroup) {
          if (toShare && toShare?.chatId !== selectedChatId) {
            emitEvent("STOP_TYPING", toShare);
          }
          setInitialChatId(null);
          setSelectedGroup(selected);

          setTimeout(() => {
            setToShare();
          }, 10);
        }
      }
    }
  }, [allGroups, selectedChatId, expanded, messages]);

  const filterChats = (type) => {
    const filterGroups =
      type !== "all"
        ? allMessages?.filter((group) => group?.parentActivity === type)
        : allMessages;

    const obj = {
      type,
      filterGroups,
    };

    if (type !== activeTab) {
      setActiveTab(type);
      dispatch(filterAllMyGroups(obj));
      setExpanded(0);
      setSelectedGroup(commonSelectedChatGroup(filterGroups, 0));
      setSelectedChatId(filterGroups[0]?.chatGroups[0]?.chatId);
    }
  };

  const commonSelectedChatGroup = (all, index) => {
    return {
      chatGroup: all[index]?.chatGroups[0],
      group: all[index],
    };
  };

  if (
    (chatDetails?.length === 0 || messages.length === 0) &&
    hasChats != "empty"
  ) {
    return (
      <Box sx={style}>
        <LinearProgress />
      </Box>
    );
  }

  if (hasChats === "empty") {
    return (
      <Box sx={style}>
        <h1>You don't have any conversations.</h1>
      </Box>
    );
  }

  return (
    <Box sx={style}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={3.8}>
          <SearchMessage />

          <Box
            sx={{
              display: "flex",
              marginBottom: 2,
              justifyContent: "space-between",
            }}
          >
            {icons.map((icon, i) => (
              <IconBadge
                key={i}
                {...icon}
                theme={theme}
                onClick={filterChats}
                allGroups={allGroups}
                activeTab={activeTab}
              />
            ))}
          </Box>

          {hasMessages === "No Chats" ? null : (
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
              {allGroups?.map((message, index) => (
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
          )}
        </Grid>

        <Grid
          sx={{ display: isLessThan900 ? "none" : "block" }}
          item
          xs={12}
          md={8}
        >
          {hasMessages === "No Chats" ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <h1>No chats available</h1>
            </Box>
          ) : (
            <>
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
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Message;
