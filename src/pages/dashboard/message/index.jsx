import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { toast } from "react-toastify";

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
import { useGetNotificationDataQuery } from "../../../services/notifications.js";

import {
  changeMessageType,
  // filterAllMyGroups,
  getAllMyGroups,
  getChatDetails,
  getMessages,
  getTotalPages,
  isActiveMembers,
} from "../../../store/slices/chat.js";
import {
  emptyGoToMessage,
  getNotification,
  getNotificationCount,
  setFromNotification,
  setGoToMessage,
} from "../../../store/slices/notification.js";

import { useSocket } from "../../../context/SocketContext.jsx";

import {
  deleteCookie,
  getCookie,
  handleNotificationUpdate,
  messageBox,
  removeNewInquiry,
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
  maxWidth: "1500px",
};

const Message = () => {
  const theme = useTheme();

  const isLessThan768 = useMediaQuery("(max-width:768px)");
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
    totalPagesOfMessage,
  } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const { gotToMessage, fromNotification } = useSelector(
    (state) => state.notification
  );

  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [isNewIdsForChatDetails, setIsNewIdsForChatDetails] = useState([]);
  const [isNewIdsForAllMessages, setIsNewIdsForAllMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [inViewLoader, setInViewLoader] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

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

  const {
    data: messageData,
    isSuccess,
    isFetching: isFetchingMessage,
  } = useGetChatsForContactsQuery(
    { chats: isNewIdsForAllMessages },
    {skip: !myChat?.length, refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );

  const {
    data: chatDetailsData,
    isSuccess: chatDetailsSuccess,
    isFetching,
  } = useGetAllChatDetailsQuery(
    { chats: isNewIdsForChatDetails },
    {skip: !myChat?.length, refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );

  const {
    data: notificationData,
    isSuccess: notificationSuccess,
    refetch: notificationRefetch,
  } = useGetNotificationDataQuery(undefined, { skip: pathname !== "/message" });

  useEffect(() => {
    if (
      notificationData?.data &&
      notificationData?.data?.notifications?.length > 0
    ) {
      dispatch(getNotification(notificationData?.data?.notifications));
    }
  }, [notificationSuccess, notificationData]);

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
    removeNewInquiry(dispatch);
  },[])

  useEffect(() => {
    // if (page === 1) {
      if (isSuccess && messageData && messageData?.length) {
        const filteredMessages = messageData
          .map((message) => message?.messages)
          .flat();

        const filteredMessagesTotalPage = messageData.map((message) => {
          return {
            totalPages: message?.totalPages,
            chat: message?.messages[0]?.chat,
          };
        });

        // Get existing message IDs from the current state
        const existingMessageIds = messages.map((message) => message.chat);
        const existingPageIds = totalPagesOfMessage.map(
          (message) => message.chat
        );
        // Filter new messages that are not already in the current state
        const newMessages = filteredMessages.filter(
          (message) => !existingMessageIds.includes(message.chat)
        );
        const newTotalPage = filteredMessagesTotalPage.filter(
          (message) => !existingPageIds.includes(message.chat)
        );
        // Dispatch only new messages to add them to the state
        if (newMessages.length > 0) {
          dispatch(getMessages([...messages, ...newMessages]));
          dispatch(getTotalPages([...totalPagesOfMessage, ...newTotalPage]));
        } else {
          dispatch(getMessages(filteredMessages));
          dispatch(getTotalPages(filteredMessagesTotalPage));
        }
      }
    // }
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
    addListener("NEW_NOTIFICATION", (data) => {
      notificationRefetch().then(() => {
        handleNotificationUpdate(
          "newNotification",
          getNotificationCount,
          dispatch
        );
        const navigateData = {
          brandName: data.senderBrandName,
          chatId: data.chatId,
        };

        toast.info(data?.name, {
          position: "bottom-right",
          onClick: () => {
            dispatch(setGoToMessage(navigateData));
            dispatch(setFromNotification(false));

            if (pathname !== "/message") {
              navigate("/message");
            }
          },
        });

        const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds"));

        if (!getUnreadChatIds) {
          setCookie("unreadChatIds", JSON.stringify([data.chatId]));
        } else {
          if (!getUnreadChatIds.includes(data.chatId)) {
            getUnreadChatIds.push(data.chatId);
            setCookie("unreadChatIds", JSON.stringify(getUnreadChatIds));
          }
        }
      });
    });

    return () => {
      removeListener("NEW_NOTIFICATION");
    };
  }, [addListener, removeListener, emitEvent]);

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
  }, [addListener, removeListener, messages, emitEvent, allGroups, activeTab]);

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
      if (activeTab === "all") {
        setAllMessages(message);
      } else {
        const filterGroups = message?.filter(
          (msg) => msg?.parentActivity === activeTab
        );

        setAllMessages(filterGroups);
        setSelectedGroup({
          chatGroup: filterGroups[0]?.chatGroups?.find(
            (gr) => gr.chatId === selectedChatId
          ),
          group: filterGroups[0],
        });
      }

      return () => {
        dispatch(changeMessageType(""));
      };
    }
  }, [myChat, messageData, chatDetailsData, messages, chatDetails, activeTab]);

  useEffect(() => {
    addListener("ONLINE_USERS", (data) => {
      const filterCurrentUser = data?.filter((acc) => acc !== user?.userChatId);
      setOnlineUsers(filterCurrentUser);
    });

    return () => {
      removeListener("ONLINE_USERS");
    };
  }, [addListener, removeListener, emitEvent, allGroups, user]);

  const handleNewInquiry = (selected, initialId = null) => {
    let findParentIndex = -1;
    if (activeTab !== "space") {
      findParentIndex = allGroups?.findIndex(
        (msg) =>
          msg?.parentName === (gotToMessage?.pName || gotToMessage?.brandName)
      );
    } else {
      findParentIndex = allMessages?.findIndex(
        (msg) =>
          msg?.parentName === (gotToMessage?.pName || gotToMessage?.brandName)
      );
    }

    if (findParentIndex !== -1) {
      setExpanded(findParentIndex);
      const parentGroup =
        activeTab !== "space"
          ? allGroups[findParentIndex]
          : allMessages[findParentIndex];
      const selectedGroup = parentGroup?.chatGroups?.find(
        (gr) => gr?.id === gotToMessage?.chatId
      );

      selected.chatGroup = selectedGroup;
      selected.group = parentGroup;
      initialId = selectedGroup?.id;
      initialId === null && setSelectedChatId(selectedGroup?.id);
    }
  };

  const handleAccordionChange = (index) => (event, isExpanded) => {
    if (!isLessThan768) {
      dispatch(emptyGoToMessage());
      dispatch(setFromNotification(false));

      setSelectedGroup(commonSelectedChatGroup(allGroups, index));
      setSelectedChatId(allGroups[index]?.chatGroups[0]?.chatId);
    }

    setExpanded(index);

    const obj = {
      userId: user.userChatId,
      members: allGroups[index]?.chatGroups[0]?.members,
    };

    if (index !== expanded) {
      dispatch(isActiveMembers(obj.members));
      emitEvent("CHAT_JOINED", obj);
    }

    unreadChat(allGroups[index]?.chatGroups[0]?.id);
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

        if (gotToMessage) {
          handleNewInquiry(selected, initialId);
          setInitialChatId(selected?.chatGroup?.id);
        } else {
          selected.chatGroup = allGroups[0]?.chatGroups[0];
          selected.group = allGroups[0];
          initialId = allGroups[0]?.chatGroups[0]?._id;

          setInitialChatId(initialId);
        }
        setSelectedGroup(selected);

        const obj = {
          userId: user.userChatId,
          members: selected?.chatGroup?.members,
        };

        dispatch(isActiveMembers(obj.members));
        emitEvent("CHAT_JOINED", obj);

        unreadChat(selected?.chatGroup?.id);
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

        if (gotToMessage) {
          handleNewInquiry(selected, null);
          setSelectedGroup(selected);
          setSelectedChatId(selected?.chatGroup?.id);
        } else {
          selected.chatGroup = chatGroup;
          selected.group = group;

          if (chatGroup) {
            setSelectedGroup(selected);
          }
        }
        unreadChat(selected?.chatGroup?.id);
        setInitialChatId(null);

        if (toShare && toShare?.chatId !== selectedChatId) {
          emitEvent("STOP_TYPING", toShare);
        }
        setTimeout(() => {
          setToShare();
        }, 10);
      }
    }
  }, [allGroups, expanded, messages, gotToMessage, activeTab, allMessages]);

  const unreadChat = (groupId) => {
    const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds")) || [];

    const ifChatIdExists = getUnreadChatIds?.filter((id) => id !== groupId);

    if (ifChatIdExists?.length > 0) {
      setCookie("unreadChatIds", JSON.stringify(ifChatIdExists));
    } else {
      deleteCookie("unreadChatIds");
    }
  };

  const filterChats = (type) => {
    const filterGroups =
      type !== "all"
        ? allGroups?.filter((group) => group?.parentActivity === type)
        : allGroups;

    // const obj = {
    //   type,
    //   filterGroups,
    // };

    if (type !== activeTab) {
      let msgTxt = "";

      if (type === "all") {
        msgTxt = "";
      } else if (filterGroups?.length > 0) {
        msgTxt = "";
      } else {
        msgTxt = "No Chats";
      }
      if (!isLessThan768) {
        setSelectedGroup(commonSelectedChatGroup(filterGroups, 0));
        setSelectedChatId(filterGroups[0]?.chatGroups[0]?.chatId);
      }

      dispatch(changeMessageType(msgTxt));
      setActiveTab(type);
      // dispatch(filterAllMyGroups(obj));
      setAllMessages(filterGroups);
      setExpanded(0);
    }
  };

  const commonSelectedChatGroup = (all, index) => {
    return {
      chatGroup: all[index]?.chatGroups[0],
      group: all[index],
    };
  };

  if (
    ((chatDetails?.length === 0 || messages.length === 0) &&
      hasChats != "empty") ||
    (fromNotification && (isFetching || isFetchingMessage))
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
        <Grid
          sx={{
            display: isLessThan768
              ? !gotToMessage && selectedChatId
                ? "none"
                : gotToMessage &&
                  selectedGroup?.chatGroup?.id === gotToMessage?.chatId
                ? "none"
                : "block"
              : "block",
          }}
          item
          xs={12}
          md={3.8}
          lg={3}
        >
          <SearchMessage />

          <Box
            sx={{
              display: "flex",
              margin: "0 auto 16px auto",
              justifyContent: "flex-start",
              overflowX: "auto",
              maxWidth: "302px",
              gap: 2,
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
              {allMessages?.length
                ? allMessages?.map((message, index) => (
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
                      initialChatId={initialChatId}
                      selectedChatId={selectedChatId}
                      setPage={setPage}
                      setHasMore={setHasMore}
                    />
                  ))
                : null}
            </Box>
          )}
        </Grid>

        <Grid
          sx={{
            display: isLessThan768
              ? !gotToMessage && selectedChatId
                ? "block"
                : gotToMessage &&
                  selectedGroup?.chatGroup?.id === gotToMessage?.chatId
                ? "block"
                : "none"
              : "block",
          }}
          item
          xs={12}
          md={8}
          lg={9}
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
                <>
                  {allMessages?.length ? (
                    <AllMessages
                      setSelectedChatId={setSelectedChatId}
                      setInitialChatId={setInitialChatId}
                      selectedGroup={selectedGroup}
                      emitEvent={emitEvent}
                      isTypingUser={isTypingUser}
                      onlineUsers={onlineUsers}
                      setToShare={setToShare}
                      page={page}
                      setPage={setPage}
                      inViewLoader={inViewLoader}
                      setInViewLoader={setInViewLoader}
                      hasMore={hasMore}
                      setHasMore={setHasMore}
                    />
                  ) : null}
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Message;
