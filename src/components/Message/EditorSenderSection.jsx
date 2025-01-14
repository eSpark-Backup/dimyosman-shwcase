import {
  Box,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { arrowDown } from "../../assets";

const EditorSenderSection = ({ selectedGroup }) => {
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");

  return (
    <Stack
      sx={{
        flexDirection: "row",
        marginBottom: isLessThan1400 ? 1.5 : 2,
      }}
    >
      <Typography sx={{ fontWeight: 300, lineHeight: "22px" }}>
        Sender:
      </Typography>

      <Box
        sx={{
          width: "auto",
          bgcolor: "transparent",
          padding: 0,
          fontSize: "16px",
          lineHeight: "22px",
          border: "none",
          marginLeft: "5px",
          fontWeight: 600,
          cursor: "default",
          display: "flex",
          alignItems: "center",
        }}
      >
        {selectedGroup?.chatGroup?.receiverbrandName !== "" ? (
          <>
            <span>{selectedGroup?.chatGroup?.receiverbrandName}</span>
            <img src={arrowDown} alt="arrow" style={{ marginLeft: "8px" }} />
          </>
        ) : (
          selectedGroup?.group?.parentName && (
            <>
              <span>{selectedGroup.group.parentName}</span>
              <img src={arrowDown} alt="arrow" style={{ marginLeft: "8px" }} />
            </>
          )
        )}
      </Box>

      {/* <Select
      sx={{
        width: "auto",
        bgcolor: "transparent",
        padding: 0,
        fontSize: "16px",
        lineHeight: "22px",
        border: "none",
        marginLeft: "5px",
        fontWeight: 600,
        cursor: "default",

        "& .MuiSelect-select": {
          padding: 0,
          cursor: "default",
        },

        "& .MuiSelect-icon": {
          transform: "none !important", // Prevent rotation
        },
      }}
      value={sender || ""}
      onChange={handleChange}
      onClick={handleSelectClick}
      MenuProps={{
        PaperProps: {
          sx: {
            visibility: "hidden",
            pointerEvents: "none",
          },
        },
      }}
    >
      {selectedGroup?.group?.parentName && (
        <MenuItem value={selectedGroup.group.brandName}>
          {selectedGroup.group.brandName}
        </MenuItem>
      )}
    </Select> */}
    </Stack>
  );
};

export default EditorSenderSection;
