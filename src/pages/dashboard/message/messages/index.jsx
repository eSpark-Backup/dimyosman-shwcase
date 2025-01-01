import { Fragment, useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { message, smile } from "../../../../assets";

import MessageHeader from "../../../../components/Message/MessageHeader";
import MessageInput from "../../../../components/Message/MessageInput";
import Message from "../../../../components/Message/Message";

import { useSocket } from "../../../../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../../../../store/slices/chat";

const GroupDetail = ({ withColon, text }) => (
  <Typography
    sx={{
      fontSize: "12px",
      fontWeight: 600,
      lineHeight: "17px",
    }}
  >
    <span
      style={{
        fontWeight: 300,
      }}
    >
      {withColon}:{" "}
    </span>
    {text}
  </Typography>
);

const AllMesaages = ({ selectedGroup, ActivityType }) => {
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");
  const isLessThan1100 = useMediaQuery("(max-width:1100px)");

  const socket = useSocket();
  const theme = useTheme();

  const quillInstance = useRef(null);
  const messagesContainerRef = useRef(null);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedGroup?.messageGroup?.messages]);

  const [sender, setSender] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [finalMessage, setFinalMessage] = useState({
    chatId: selectedGroup?.messageGroup?.id,
    members: selectedGroup?.messageGroup?.members,
    message: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (selectedGroup?.group?.brandName) {
      setSender(selectedGroup.group.brandName);
    }

    if (selectedGroup?.messageGroup?.id) {
      setFinalMessage({
        chatId: selectedGroup?.messageGroup?.id,
        members: selectedGroup?.messageGroup?.members,
        message: "",
      });
    }
  }, [selectedGroup]);

  const handleChange = (event) => {
    setSender(event.target.value);
  };

  const handleSelectClick = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (finalMessage.chatId && finalMessage.members && finalMessage.message) {
      socket.on("NEW_MESSAGE", (data) => {
        console.log("NEW_MESSAGE EVENT TRIGGERED.");

        dispatch(getMessages([...messages, data.message]));

        setFinalMessage((prevData) => ({
          ...prevData,
          message: "",
        }));
      });

      return () => {
        if (socket) {
          socket.off("NEW_MESSAGE");
        }
      };
    }
  }, [socket, finalMessage]);

  const addEmoji = (emoji) => {
    const range = quillInstance.current.getSelection();
    const cursorPosition = range
      ? range.index
      : quillInstance.current.getLength();

    quillInstance.current.insertText(cursorPosition, emoji.native, "user");

    quillInstance.current.formatText(
      cursorPosition,
      emoji.native.length,
      "emoji",
      true
    );

    quillInstance.current.setSelection(cursorPosition + emoji.native.length, 0);

    setEmojiPickerVisible(false);
  };

  const handleInputChange = ({ content, text }) => {
    setFinalMessage((prevData) => ({
      ...prevData,
      message: content,
    }));
  };

  // Handle sending the message
  const handleSendMessage = () => {
    if (finalMessage?.message === "") {
      toast.error("Message can not be empty");
      return;
    }
    const strippedContent = finalMessage?.message
      ?.replace(/<[^>]*>/g, "")
      .trim();

    if (!strippedContent) {
      toast?.error("Message can not be empty.");
      return false;
    }

    socket.emit("NEW_MESSAGE", finalMessage);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      setTimeout(() => {
        if (
          pickerRef.current &&
          !pickerRef.current.contains(event.target) &&
          !buttonRef.current
        ) {
          setEmojiPickerVisible(false);
        }
      }, 1);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box position={"relative"}>
      <MessageHeader
        selectedGroup={selectedGroup}
        theme={theme}
        ActivityType={ActivityType}
        GroupDetail={GroupDetail}
      />

      <Box
        sx={{
          height: isLessThan1100
            ? "calc(100vh - 210px)"
            : isLessThan1280
            ? "calc(100vh - 220px)"
            : isLessThan1400
            ? "calc(100vh - 254px)"
            : "calc(100vh - 276px)",
          marginTop: isLessThan1280 ? 1 : isLessThan1400 ? 1.5 : 2,
          overflowY: "auto",
          marginBottom: isLessThan1280 ? 2.5 : isLessThan1400 ? 4 : 6.25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box
            ref={messagesContainerRef}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            {selectedGroup?.messageGroup?.messages
              ?.slice()
              .reverse()
              ?.map((message, i) => {
                return (
                  <Fragment key={i}>
                    {message.content ? (
                      <Message
                        ActivityType={ActivityType}
                        theme={theme}
                        message={message}
                        sender={{
                          brandName:
                            message?.sender?.name ===
                            selectedGroup?.group?.creatorDetail?.name
                              ? selectedGroup?.messageGroup?.senderBrand
                                  ?.brandName
                              : selectedGroup?.messageGroup?.receiverBrand
                                  ?.brandName,
                          brandImage:
                            message?.sender?.name ===
                            selectedGroup?.group?.creatorDetail?.name
                              ? selectedGroup?.messageGroup?.senderBrand
                                  ?.brandImage
                              : selectedGroup?.messageGroup?.receiverBrand
                                  ?.brandImage,
                        }}
                      />
                    ) : null}
                  </Fragment>
                );
              })}
          </Box>

          <Box
            sx={{
              bgcolor: "#ffffff",
              padding: isLessThan1100
                ? "10px 16px"
                : isLessThan1400
                ? "12px 16px"
                : "16px",
              position: "relative",
              borderRadius: "5px",
              marginTop: isLessThan1400 ? "12px" : "16px",
              border: "1px solid rgba(209, 219, 215, 0.5)",
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                marginBottom: isLessThan1400 ? 1.5 : 2,
              }}
            >
              <Typography sx={{ fontWeight: 300, lineHeight: "22px" }}>
                Sender:
              </Typography>

              <Select
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
                    style: {
                      display: "none",
                    },
                  },
                }}
              >
                {selectedGroup?.group?.brandName && (
                  <MenuItem value={selectedGroup.group.brandName}>
                    {selectedGroup.group.brandName}
                  </MenuItem>
                )}
              </Select>
            </Stack>

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
                  width: isLessThan1280
                    ? "calc(100% - 135px)"
                    : "calc(100% - 145px)",
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

            {emojiPickerVisible && (
              <Box
                sx={{
                  position: "fixed",
                  zIndex: 9999,
                  backgroundColor: "white",
                  padding: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  bottom: "90px",
                  right: "18px",
                  border: "1px solid #ccc",

                  "@media only screen and (max-width:1100px)": {
                    bottom: "78px",
                  },

                  "@media only screen and (min-width:1400px)": {
                    bottom: "115px",
                  },
                }}
                ref={pickerRef}
              >
                <Picker data={data} onEmojiSelect={addEmoji} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AllMesaages;
