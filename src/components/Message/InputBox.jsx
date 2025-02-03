import { Box, Button, IconButton, useMediaQuery } from "@mui/material";

import MessageInput from "./MessageInput";

import { smile } from "../../assets";

import { inquireInputStyles } from "../../utils";

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
    <Box sx={inquireInputStyles(isLessThan1400, isLessThan1280)}>
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
