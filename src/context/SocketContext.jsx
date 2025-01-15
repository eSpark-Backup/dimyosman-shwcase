// import { createContext, useContext, useEffect, useMemo, useRef } from "react";
// import { useSelector } from "react-redux";
// import { io } from "socket.io-client";

// const SocketContext = createContext(null);

// const useSocket = () => {
//     return useContext(SocketContext)
// }

// const SocketProvider = ({ children }) => {
//     const { user } = useSelector((state) => state.auth)
//     const socket = useMemo(() => {
//         if (user) {
//             const s = io("https://shwcase-stg.esparkconsultants.com/socket", {
//                 withCredentials: true,
//             });

//             s.on("connect", () => {
//                 console.log("Socket connected:", s.id);
//             });

//             s.on("connect_error", (error) => {
//                 console.error("Socket connection error:", error);
//             });

//             s.on("NEW_USER_CONNECTED", (user) => {
//                 console.log(user?.message);
//                 console.log("hello user");
//             });

//             return s;
//         }
//     }, [user]);

//     return (
//         <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//     );
// };

// export { useSocket };
// export default SocketProvider;

// Second

import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { io } from "socket.io-client";

import { useGetMyChatsQuery } from "../services/chats";

import {
  emptyActiveMembers,
  getMessages,
  getMyChat,
  isUserHasChat,
} from "../store/slices/chat";
import { getCookie, setCookie } from "../utils";

const SocketContext = createContext(null);

const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { activeMembers, messages } = useSelector((state) => state.chat);
  const { data, isSuccess, refetch } = useGetMyChatsQuery(undefined, {
    skip: !user,
  });
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data) {
      if (
        data.chats &&
        (Array.isArray(data.chats) ||
          (data?.chats?.brands?.length === 0 &&
            data?.chats?.spaces?.length === 0))
      ) {
        dispatch(isUserHasChat("empty"));
      }

      if (
        data.chats &&
        (data?.chats?.brands?.length > 0 || data?.chats?.spaces?.length > 0)
      ) {
        dispatch(getMyChat(data.chats));
        dispatch(isUserHasChat(""));
      }
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (user && !socket.current) {
      socket.current = io("https://shwcase-stg.esparkconsultants.com/socket", {
        withCredentials: true,
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server from client");
      });

      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
      });

      socket.current.on("REFETCH_CHATS", () => {
        // console.log("REFETCH_CHAT EVENT TRIGGERED.");
        refetch();
      });

      socket.current.on("NEW_REQUEST", () => {
        // console.log("NEW_REQUEST EVENT TRIGGERED.");
        refetch();
      });

      return () => {
        // Cleanup socket on unmount
        if (socket.current) {
          socket.current.removeAllListeners();
          socket.current.disconnect();
          socket.current = null;
        }
      };
    }
  }, [user, socket]);

  useEffect(() => {
    if (user) {
      if (pathname !== "/message") {
        socket.current.on("NEW_MESSAGE", (data) => {
          if (messages?.length > 0) {
            dispatch(getMessages([...messages, data.message]));
          } else {
            refetch();
          }
        });

        const handleNewMessageAlert = (data) => {
          const getNotReadMessage = JSON.parse(getCookie("unread"));
          const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds"));

          if (!getNotReadMessage) {
            setCookie(
              "unread",
              JSON.stringify([{ chatId: data.chatId, count: 1 }])
            );
            setCookie("unreadChatIds", JSON.stringify([data.chatId]));
            return;
          }

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
        };
        socket.current.on("NEW_MESSAGE_ALERT", handleNewMessageAlert);

        return () => {
          // Cleanup event on unmount
          if (socket.current) {
            socket.current.off("NEW_MESSAGE");
            socket.current.off("NEW_MESSAGE_ALERT");
          }
        };
      }
    }
  }, [messages, user, socket, pathname]);

  useEffect(() => {
    if (user) {
      if (pathname !== "/message" && activeMembers?.length > 0) {
        const obj = {
          userId: user.userChatId,
          members: activeMembers,
        };

        socket.current.emit("CHAT_LEFT", obj);
        dispatch(emptyActiveMembers());
        return () => {
          // Cleanup event on unmount
          if (socket.current) {
            socket.current.off("CHAT_LEFT");
          }
        };
      }
    }
  }, [pathname, activeMembers, user, socket]);

  const emitEvent = (event, payload) => {
    if (socket.current) {
      socket.current.emit(event, payload);
    }
  };

  const addListener = (event, callback) => {
    if (socket.current) {
      socket.current.on(event, callback);
    }
  };

  const removeListener = (event) => {
    if (socket.current) {
      socket.current.off(event);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket: socket.current, emitEvent, addListener, removeListener }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { useSocket };
export default SocketProvider;
