import { Box, Button, IconButton, useMediaQuery } from "@mui/material";

import MessageInput from "./MessageInput";

import { smile } from "../../assets";

const InputBox = ({
  setEmojiPickerVisible,
  emojiPickerVisible,
  buttonRef,
  handleSendMessage,
  buttonDisabled,
  quillInstance,
  handleInputChange,
  finalMessage,
  setButtonDisabled,
}) => {
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",

        "& .ql-toolbar.ql-snow+.ql-container.ql-snow": {
          border: "1px solid rgba(209, 219, 215, 0.5) !important",
          borderTop: "1px solid rgba(209, 219, 215, 0.5) !important",
          borderRadius: "5px",
          marginBottom: isLessThan1400 ? 1.25 : 1.5,
        },

        "& .ql-editor": {
          padding: "10px 16px",
          fontSize: "16px",
          fontFamily: `"Segoe UI", "sans-serif"`,
          fontStyle: "unset",
          fontWeight: 400,
          lineHeight: "21px",
          // "& img": {
          //   width: "80px",
          //   height: "80px",
          // },
        },

        "& .ql-blank::before": {
          fontStyle: "unset",
          color: "rgba(0, 20, 28, 0.5)",
        },

        "& .ql-tooltip": {
          left: "0px !important",
        },

        "& .ql-toolbar": {
          border: "none",
          order: 2,
          alignItems: "center",
          width: isLessThan1280 ? "calc(100% - 135px)" : "calc(100% - 145px)",
          padding: "4px 8px !important",

          "& .ql-formats": {
            columnGap: isLessThan1280 ? "15px" : "25px",
          },

          "& .ql-formats:has(.ql-link)": {
            flex: 1,
            justifyContent: "end",
            columnGap: "10px",
          },

          "& button": {
            padding: 0,
            width: "25px",
          },

          "& .ql-active": {
            "& img": {
              filter:
                "invert(21%) sepia(80%) saturate(4500%) hue-rotate(190deg) brightness(100%) contrast(90%)",
            },
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: "0px !important",
          right: "0px !important",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
          sx={{
            padding: 0,
            margin: isLessThan1280
              ? "0px 25px 0px 0px !important"
              : "0px 35px 0px 0px !important",
          }}
          disableRipple
          onMouseEnter={() => {
            buttonRef.current = true;
          }}
          onMouseLeave={() => {
            buttonRef.current = false;
          }}
        >
          <img src={smile} />
        </IconButton>

        <Button
          style={{ marginBottom: "10px" }}
          sx={{
            padding: 0,
            margin: "0px !important",
            height: "31px",
            width: "85px",
            fontWeight: 700,
            fontSize: "16px",
            bgcolor: "rgba(209, 219, 215, 0.4) !important",
            borderRadius: "10px",
            color: "#00141C",
            textTransform: "inherit",
            lineHeight: "21px",
            letterSpacing: "-0.01em",
          }}
          onClick={handleSendMessage}
          disabled={buttonDisabled}
        >
          Send
        </Button>
      </Box>

      <MessageInput
        emojiPickerVisible={emojiPickerVisible}
        setEmojiPickerVisible={setEmojiPickerVisible}
        quillInstance={quillInstance}
        onChange={handleInputChange}
        value={finalMessage?.message}
        setButtonDisabled={setButtonDisabled}
      />
    </Box>
  );
};

export default InputBox;
