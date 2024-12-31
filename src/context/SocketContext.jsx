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
import { getMessages, getMyChat } from "../store/slices/chat";

const SocketContext = createContext(null);

const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const { data, isSuccess, isError, error, refetch } = useGetMyChatsQuery(
    undefined,
    { skip: !user }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data) {
      if (data.chats && data?.chats?.brands?.length > 0) {
        dispatch(getMyChat(data.chats.brands));
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

      return () => {
        // Cleanup socket on unmount
        if (socket.current) {
          socket.current.disconnect();
          socket.current = null;
        }
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export { useSocket };
export default SocketProvider;
