import { Box } from "@mui/material";

import { allMessages } from "../../constant";

const hasReadTrue = (messages) => {
  for (const item of messages) {
    if (item.read) return true;
    if (item.messageGroups && hasReadTrue(item.messageGroups)) return true;
  }
  return false;
};

const isMessageRead = (type) => {
  return allMessages.some((item) => item.activity === type && item.read);
};

const IconBadge = ({ icon, bg, type, onClick }) => {
  const isRead =
    isMessageRead(type) || (hasReadTrue(allMessages) && type === "message");

  return (
    <Box
      sx={{
        bgcolor: bg,
        height: "48px",
        width: "48px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        marginRight: 2,
        position: "relative",
        cursor: "pointer",

        "&:last-child": {
          marginRight: 0,
        },
      }}
      onClick={() => {
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
