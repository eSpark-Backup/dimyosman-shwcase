import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/material";

import {
  emptyGoToMessage,
  setFromNotification,
} from "../../store/slices/notification";

const IconBadge = ({ icon, bg, type, activeBG, onClick, activeTab }) => {
  const dispatch = useDispatch();
  const { fromNotification } = useSelector((state) => state.notification);

  useEffect(() => {
    if (fromNotification) {
      if (activeTab !== "space") {
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
      {/* {isRead && (
        <Box
          sx={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: theme.palette.error.danger,
            position: "absolute",
            top: "-4px",
            right: "-3px",
          }}
        />
      )} */}
    </Box>
  );
};

export default IconBadge;
