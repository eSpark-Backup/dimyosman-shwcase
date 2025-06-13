import { useSelector } from "react-redux";

import { Box } from "@mui/material";

const SearchIconBox = ({ icon, filterClick }) => {
  const { parameters } = useSelector((state) => state.search);

  return (
    <Box
      onClick={() => {
        filterClick({ type: icon.type });
      }}
      sx={{
        background: parameters.entity === icon.type ? icon.activeBG : icon.bg,
        width: "16px",
        height: "16px",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={icon.icon}
        alt={icon.type}
        style={{ width: "12px", height: "10px" }}
      />
    </Box>
  );
};

export default SearchIconBox;
