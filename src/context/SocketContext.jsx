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
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { io } from "socket.io-client";

import { toast } from "react-toastify";

import { useGetMyChatsQuery } from "../services/chats";
import { useGetNotificationDataQuery } from "../services/notifications";

import {
  emptyActiveMembers,
  getMessages,
  getMyChat,
  isUserHasChat,
} from "../store/slices/chat";
import {
  getNotification,
  getNotificationCount,
  setFromNotification,
  setGoToMessage,
} from "../store/slices/notification";

import { getCookie, setCookie } from "../utils";

// import { setHasPaymentDone, setRedirectTab } from "../store/slices/space";

const SocketContext = createContext(null);

const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { activeMembers, messages } = useSelector((state) => state.chat);
  const { activeTabForNotif } = useSelector((state) => state.space);

  const { data, isSuccess, refetch } = useGetMyChatsQuery(undefined, {
    skip: !user,
  });
  const {
    data: notificationData,
    isSuccess: notificationSuccess,
    refetch: notificationRefetch,
  } = useGetNotificationDataQuery(undefined, { skip: !user });

  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      notificationData?.data &&
      notificationData?.data?.notifications?.length > 0
    ) {
      dispatch(getNotification(notificationData?.data?.notifications));
    }
  }, [notificationSuccess, notificationData]);

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

  const handleNotificationUpdate = (cookieName, action) => {
    const currentValue = getCookie(cookieName);
    const newCount = currentValue ? parseInt(currentValue) + 1 : 1;

    setCookie(cookieName, newCount);
    dispatch(action(newCount));
  };

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

      // socket.current.on("NEW_NOTIFICATION", (data) => {
      //   // console.log("NEW_NOTIFICATION EVENT TRIGGERED.");

      //   if (pathname === "/space") {
      //     dispatch(setHasPaymentDone(true));
      //   }

      //   handleNotificationUpdate("newNotification", getNotificationCount);
      //   let redName = data.redirect;

      //   if (pathname === "/space") {
      //     if (data.redirect === "Lease" && activeTabForNotif !== "Lease") {
      //       redName = "Lease";
      //     } else if (
      //       data.redirect === "Tenant" &&
      //       activeTabForNotif !== "Tenant"
      //     ) {
      //       redName = "Tenant";
      //     }
      //   }

      //   toast.info(data?.name, {
      //     position: "bottom-right",
      //     onClick: () => {
      //       dispatch(setRedirectTab(redName));
      //       if (pathname !== "/space") {
      //         navigate("/space");
      //       }
      //     },
      //   });

      //   notificationRefetch();
      // });

      socket.current.on("NEW_REQUEST", (data) => {
        // console.log("NEW_REQUEST EVENT TRIGGERED.");

        handleNotificationUpdate("newNotification", getNotificationCount);
        if (pathname !== "/message") {
          handleNotificationUpdate("newInquiry", getNotificationCount);
        }

        const navigateData = {
          spaceName: data.receiverSpaceName,
          chatId: data.chatId,
        };

        const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds"));

        if (!getUnreadChatIds) {
          setCookie("unreadChatIds", JSON.stringify([data.chatId]));
          return;
        }

        if (!getUnreadChatIds.includes(data.chatId)) {
          getUnreadChatIds.push(data.chatId);
          setCookie("unreadChatIds", JSON.stringify(getUnreadChatIds));
        }

        toast.info(data?.name, {
          position: "bottom-right",
          onClick: () => {
            dispatch(setGoToMessage(navigateData));
            dispatch(setFromNotification(true));

            if (pathname !== "/message") {
              navigate("/message");
            }
          },
        });

        notificationRefetch();
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
          const getUnreadChatIds = JSON.parse(getCookie("unreadChatIds"));

          if (!getUnreadChatIds) {
            setCookie("unreadChatIds", JSON.stringify([data.chatId]));
            return;
          }

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
