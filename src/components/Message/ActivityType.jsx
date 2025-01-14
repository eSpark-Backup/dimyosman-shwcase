import { Box } from "@mui/material";

import { accountIcon, brandIcon, flag, spaceIcon } from "../../assets";

const ActivityType = ({ type, theme }) => {
  return (
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
};

export default ActivityType;
