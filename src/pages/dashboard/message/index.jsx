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
import { getChatDetails, getMessages, isActiveMembers } from "../../../store/slices/chat.js";
import { useSocket } from "../../../context/SocketContext.jsx";
import { messageBox } from "../../../utils/index.js";

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
  const allMyChatIds =
    myChat?.flatMap((chat) => chat.chats.map((c) => c._id)) || [];

  const dispatch = useDispatch();

  const [isNewIdsForChatDetails, setIsNewIdsForChatDetails] = useState([]);
  const [isNewIdsForAllMessages, setIsNewIdsForAllMessages] = useState([]);
  const [fetchedChatIds, setFetchedChatIds] = useState(new Set());
  const [fetchedMessageIds, setFetchedMessageIds] = useState(new Set());

  useEffect(() => {
    const existingDetailsIds = chatDetails.map((item) => item._id);
    const newIdsForDetails = allMyChatIds.filter(
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
    const newIdsForMessages = allMyChatIds.filter(
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
      skip: !myChat?.length,
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
      skip: !myChat?.length,
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
      console.log("NEW_MESSAGE EVENT TRIGGERED.");

      dispatch(getMessages([...messages, data.message]));
    });

    addListener("NEW_MESSAGE_ALERT", (data) => {
      console.log("NEW_MESSAGE_ALERT EVENT TRIGGERED.", data);

      // if (
      //   allMessages.length &&
      //   data.chatId !== (initialChatId || selectedChatId)
      // ) {
      //   const updateRead = allMessages?.map((msg) => {
      //     const findGroup = msg.messageGroups.findIndex(
      //       (group) => group._id === data.chatId
      //     );

      //     if (findGroup !== -1) {
      //       return {
      //         ...msg,
      //         read: true,
      //         messageGroups: msg.messageGroups.map((group, index) => {
      //           if (index === findGroup) {
      //             return {
      //               ...group,
      //               read: true,
      //             };
      //           }
      //           return group;
      //         }),
      //       };
      //     } else {
      //       return msg;
      //     }
      //   });

      //   setAllMessages(updateRead);
      // }
    });

    return () => {
      removeListener("NEW_MESSAGE");
      // removeListener("NEW_MESSAGE_ALERT");
    };
  }, [addListener, removeListener, messages, emitEvent]);

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
        let newArr = [];

        myChat.forEach((brandObj) => {
          // Separate sender and receiver chats
          let senderChats = [];
          let receiverChats = [];

          // Separate sender and receiver chats based on the isInquiryRole property
          brandObj.chats.forEach((chat) => {
            if (chat.isInquiryRole === "sender") {
              senderChats.push(chat); // Store sender chats
            } else if (chat.isInquiryRole === "receiver") {
              receiverChats.push(chat); // Store receiver chats
            }
          });

          // Deep clone the brand details to ensure no shared reference issues
          const clonedBrandDetails = JSON.parse(
            JSON.stringify(brandObj.brandDetails)
          );

          // Handle sender chats
          if (senderChats.length > 0) {
            let existingSenderBrand = newArr.find(
              (brand) => brand.brandDetails.id === clonedBrandDetails.id
            );

            if (!existingSenderBrand) {
              existingSenderBrand = {
                hasReceiverChats: false, // Set to true if there are receiver chats
                brandDetails: clonedBrandDetails, // Add the brand details
                chats: [], // Initialize an empty chats array
              };

              // Add the new brand object to newArr for sender chats
              newArr.push(existingSenderBrand);
            }

            // Add the sender chats to the existing sender brand object
            senderChats.forEach((senderChat) => {
              // Add sender chat to sender brand's chats array
              existingSenderBrand.chats.push(senderChat);
            });
          }

          // Handle receiver chats
          receiverChats.forEach((receiverChat) => {
            // Check if this space already has a corresponding receiver object
            let existingReceiverBrand = newArr.find(
              (brand) =>
                brand.brandDetails.id === receiverChat.receiverBrand.id &&
                brand.chats.some(
                  (chat) =>
                    chat.receiverSpace.id === receiverChat.receiverSpace.id
                )
            );

            if (!existingReceiverBrand) {
              // Create a new object for each receiver brand if not already present in newArr
              existingReceiverBrand = {
                hasReceiverChats: true, // Receiver brand will always have receiver chats
                brandDetails: receiverChat.receiverBrand, // Add the receiver brand details
                chats: [], // Initialize an empty chats array
                receiverSpace: receiverChat.receiverSpace,
              };

              // Add the receiver brand object to newArr
              newArr.push(existingReceiverBrand);
            }

            // Add the receiver chat to the corresponding receiver brand object
            existingReceiverBrand.chats.push(receiverChat);
          });
        });

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

  useEffect(() => {
    addListener("ONLINE_USERS", (data) => {
      console.log("ONLINE_USERS EVENT TRIGGERED.",data);

      const filterCurrentUser = data?.filter((acc) => acc !== user?.userChatId);

      if (allMessages?.length > 0 && filterCurrentUser?.length > 0) {
      console.log(allMessages?.length > 0 && filterCurrentUser?.length > 0);

        const updatedMessages = allMessages.map((messageGroup) => {
          return {
            ...messageGroup,
            messageGroups: messageGroup.messageGroups.map((group) => {
              const findOppositeUser = group.members?.find(
                (member) => member !== user?.userChatId
              );

              // Check if it's a receiver chat or sender chat
              if (messageGroup.isReceiverChats) {
                // If the current user is the sender, mark sender as active
                if (filterCurrentUser.includes(findOppositeUser)) {
                  return {
                    ...group,
                    isActive: true,
                  };
                } else {
                  return {
                    ...group,
                    isActive: false,
                  };
                }
              } else {
                // If the current user is the receiver, mark receiver as active
                if (filterCurrentUser.includes(findOppositeUser)) {
                  return {
                    ...group,
                    isActive: true,
                  };
                } else {
                  return {
                    ...group,
                    isActive: false,
                  };
                }
              }
            }),
          };
        });
        setAllMessages(updatedMessages);
        setOnlineUsers(filterCurrentUser);
      }
    });

    return () => {
      removeListener("ONLINE_USERS");
    };
  }, [addListener, removeListener, selectedGroup]);

  const handleAccordionChange = (index) => (event, isExpanded) => {
    const selectedGroup = {
      messageGroup: allMessages[index]?.messageGroups[0],
      group: allMessages[index],
    };

    const obj = {
      userId: user.userChatId,
      members: allMessages[index]?.messageGroups[0]?.members,
    };

    if (index !== expanded) {
      dispatch(isActiveMembers(obj.members))
      emitEvent("CHAT_JOINED", obj);
    }

    setSelectedChatId(allMessages[index]?.messageGroups[0]?.chatId);
    setSelectedGroup(selectedGroup);
    setExpanded(index);
  };

  useEffect(() => {
    if (allMessages.length) {
      if (selectedChatId === null && selectedGroup === null) {
        setInitialChatId(allMessages[0]?.messageGroups[0]?._id);
        setSelectedGroup({
          messageGroup: allMessages[0]?.messageGroups[0],
          group: allMessages[0],
        });

        const obj = {
          userId: user.userChatId,
          members: allMessages[0]?.messageGroups[0]?.members,
        };
        dispatch(isActiveMembers(obj.members))
        emitEvent("CHAT_JOINED", obj);
      }

      if (selectedChatId !== null && expanded !== null) {
        const group = allMessages[expanded];
        const messageGroup = group?.messageGroups?.find(
          (msg) => msg.id === selectedChatId
        );

        if (messageGroup) {
          setInitialChatId(null);
          setSelectedGroup({ messageGroup, group });
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
