import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";

import {
  emptyGoToMessage,
  setFromNotification,
} from "../../store/slices/notification";

import { getCookie } from "../../utils";

const IconBadge = ({
  icon,
  bg,
  type,
  activeBG,
  theme,
  onClick,
  allGroups,
  activeTab,
}) => {
  const getUnreadChatIds =
    getCookie("unreadChatIds") && JSON.parse(getCookie("unreadChatIds"));

  const dispatch = useDispatch();

  const { fromNotification } = useSelector((state) => state.notification);

  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    if (getUnreadChatIds?.length) {
      for (const unreadChatId of getUnreadChatIds) {
        const matchingMessage = allGroups?.find((message) =>
          !message.chatGroups
            ? message.directUserChat?._id === unreadChatId
            : message.chatGroups.some((group) => group.id === unreadChatId)
        );

        if (matchingMessage) {
          const matchingIcon = type === matchingMessage.parentActivity;

          if (matchingIcon) {
            setIsMatched(true);
            break;
          } else {
            setIsMatched(false);
          }
        } else {
          setIsMatched(false);
        }
      }
    } else {
      setIsMatched(false);
    }
  }, [icon, allGroups, getUnreadChatIds]);

  useEffect(() => {
    if (fromNotification) {
      if (activeTab !== "all") {
        callFn();
      }
    }
  }, [fromNotification]);

  const callFn = () => {
    onClick("all");
  };

  return (
    <Box
      sx={{
        bgcolor: activeTab === type ? activeBG : bg,
        height: "48px",
        width: "48px",
        minHeight: "48px",
        minWidth: "48px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s ease-in-out",

        "&:hover": {
          bgcolor: activeBG,
        },

        "&:last-child": {
          marginRight: 0,
        },
      }}
      onClick={() => {
        dispatch(emptyGoToMessage());
        dispatch(setFromNotification(false));
        onClick(type);
      }}
    >
      <img src={icon} alt="Icon" />
      {isMatched ? (
        <Box
          sx={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: theme.palette.error.danger,
            position: "absolute",
            top: "0px",
            right: "0px",
          }}
        />
      ) : null}
    </Box>
  );
};

export default IconBadge;
