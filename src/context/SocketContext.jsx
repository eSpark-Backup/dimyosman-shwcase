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
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useGetMyChatsQuery } from "../services/chats";
import { emptyActiveMembers, getMessages, getMyChat, isUserHasChat } from "../store/slices/chat";
import { useLocation } from "react-router-dom";

const SocketContext = createContext(null);

const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { activeMembers } = useSelector((state) => state.chat);
  const { data, isSuccess, isError, error, refetch } = useGetMyChatsQuery(
    undefined,
    { skip: !user }
  );
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data) {
      if (data.chats && Array.isArray(data.chats)) {
        dispatch(isUserHasChat("empty"));
      }

      if (data.chats && data?.chats?.brands?.length > 0) {
        dispatch(getMyChat(data.chats.brands));
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
        console.log("REFETCH_CHAT EVENT TRIGGERED.");
        refetch();
      });

      socket.current.on("NEW_REQUEST", () => {
        console.log("NEW_REQUEST EVENT TRIGGERED.");
        refetch();
      });

      // socket.current.on("NEW_MESSAGE", (data) => {
      //   console.log("NEW_MESSAGE EVENT TRIGGERED.");

      //   dispatch(getMessages([...messages, data.message]));
      // });

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

  useEffect(() => {
    console.log(pathname !== "/message" && activeMembers?.length > 0);

    if (pathname !== "/message" && activeMembers?.length > 0) {
      const obj = {
        userId: user.userChatId,
        members: activeMembers,
      };

      console.log(obj);
      socket.current.emit("CHAT_LEFT", obj);
      
      dispatch(emptyActiveMembers())
    }
  }, [pathname, activeMembers]);

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
