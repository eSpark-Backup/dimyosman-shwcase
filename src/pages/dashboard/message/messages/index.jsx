import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import MessageHeader from "../../../../components/Message/MessageHeader";
import Message from "../../../../components/Message/Message";
import ActivityType from "../../../../components/Message/ActivityType";
import InputBox from "../../../../components/Message/InputBox";
import EditorSenderSection from "../../../../components/Message/EditorSenderSection";
import ReusableModal from "../../../../components/Modal";
import AfterSignature from "../../../../components/AfterSignature";
import ManageInquiry from "../../../../components/ManageInquiry";

import { addEmoji, cleanHTML, convertToSameKeys } from "../../../../utils";

import { useGetSingleChatQuery } from "../../../../services/chats";

import { getMessages, getTotalPages } from "../../../../store/slices/chat";

const TopHeading = ({ name, size, my = 0 }) => {
  return (
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: size,
        color: "#00141C",
        my,
      }}
    >
      {name}
    </Typography>
  );
};

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

const AllMesaages = ({
  setSelectedChatId,
  setInitialChatId,
  selectedGroup,
  emitEvent,
  isTypingUser,
  onlineUsers,
  setToShare,
  inViewLoader,
  setInViewLoader,
  page,
  setPage,
  totalPageOfMessage,
}) => {
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");
  const isLessThan1100 = useMediaQuery("(max-width:1100px)");

  const theme = useTheme();

  const quillInstance = useRef(null);
  const messagesContainerRef = useRef(null);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);
  const observerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { messages, totalPagesOfMessage } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const {
    data: messageD,
    isSuccess,
    isFetching,
    isLoading,
  } = useGetSingleChatQuery(
    {
      id: selectedGroup?.chatGroup?.chatId || selectedGroup?.group?.directUserChat?._id,
      page: totalPageOfMessage?.currentPage,
      pageSize: 10,
    },
    {
      skip: page === 1,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  useEffect(() => {
    if (isSuccess && messageD && totalPageOfMessage?.hasMore && page > 1) {
      if (messageD?.messages?.length) {
        if (
          messages?.some((m) =>
            messageD?.messages?.find((msg) => msg._id === m._id)
          )
        ) {
          return;
        }

        if (
          messages?.some(
            (m) => !messageD?.messages?.find((msg) => msg._id === m._id)
          )
        ) {
          const update = totalPagesOfMessage?.map((p) => {
            if (
              p.chat === selectedGroup?.chatGroup?.chatId ||
              selectedGroup?.group?.directUserChat?._id
            ) {
              return {
                ...p,
                hasMore: totalPageOfMessage?.currentPage < messageD?.totalPages,
              };
            }
            return { ...p };
          });

          dispatch(getTotalPages(update));
          dispatch(getMessages([...messageD?.messages, ...messages]));
          setInViewLoader(false);
        }
      }
    }
  }, [
    messageD,
    isSuccess,
    isLoading,
    isFetching,
    selectedGroup,
    page,
    messages,
  ]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current && page === 1) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (
      page === totalPageOfMessage?.totalPages ||
      !totalPageOfMessage?.hasMore ||
      isFetching ||
      totalPageOfMessage?.currentPage === totalPageOfMessage?.totalPages
    )
      return;

    setInViewLoader(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!isFetching) {
            const update = totalPagesOfMessage?.map((p) => {
              if (
                p.chat === selectedGroup?.chatGroup?.chatId ||
                selectedGroup?.group?.directUserChat?._id
              ) {
                return {
                  ...p,
                  currentPage: totalPageOfMessage?.currentPage + 1,
                };
              }
              return { ...p };
            });

            dispatch(getTotalPages(update));
            setPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isFetching, selectedGroup, totalPagesOfMessage?.length]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedGroup]);

  const [sender, setSender] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [finalMessage, setFinalMessage] = useState({
    chatId: selectedGroup?.chatGroup?.id || selectedGroup?.group?.directUserChat?._id,
    members: selectedGroup?.chatGroup?.members || selectedGroup?.group?.directUserChat?.members,
    message: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showInquiryModal, setShowIinquiryModal] = useState(false);
  const [afterSignature, setAfterSignature] = useState(false);

  useEffect(() => {
    if (selectedGroup?.group?.parentName) {
      setSender(selectedGroup.group.parentName);
    }

    if (selectedGroup?.chatGroup?.id || selectedGroup?.group?.directUserChat?._id) {
      setFinalMessage({
        chatId: selectedGroup?.chatGroup?.id || selectedGroup?.group?.directUserChat?._id,
        members: selectedGroup?.chatGroup?.members || selectedGroup?.group?.directUserChat?.members,
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

  const isCursorActive = () => {
    const selection = quillInstance.current.getSelection();
    return selection !== null && selection.length > 0;
  };

  const selectedGroupData = useRef(null);

  useEffect(() => {
    if ((selectedGroup?.chatGroup?.members && selectedGroup?.chatGroup?.chatId) || (selectedGroup?.group?.directUserChat?.members && selectedGroup?.group?.directUserChat?._id)) {
      selectedGroupData.current = selectedGroup?.chatGroup || selectedGroup?.group?.directUserChat;
    }
  }, [selectedGroup]);

  const handleInputChange = ({ content, text }) => {
    const newMessage = text.trim();
    const dataToSend = {
      members: selectedGroupData.current?.members,
      chatId: selectedGroupData.current?.chatId || selectedGroupData.current?._id,
    };

    setFinalMessage((prevData) => ({
      ...prevData,
      message: content,
    }));

    if (newMessage.length > 0) {
      setToShare(dataToSend);
      emitEvent("START_TYPING", dataToSend);
    } else {
      emitEvent("STOP_TYPING", dataToSend);
    }
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

    if (!finalMessage?.chatId) {
      toast.error("Chat id is required");
      return;
    }

    const updateMessage = {
      ...finalMessage,
      message: cleanHTML(finalMessage.message),
    };

    emitEvent("NEW_MESSAGE", updateMessage);

    setFinalMessage((prevData) => ({
      ...prevData,
      message: "",
    }));
  };

  const handleModalClose = () => {
    setShowIinquiryModal(false);
    setAfterSignature(false);
  };

  const handleModalOpen = () => {
    setShowIinquiryModal(true);
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
      {selectedGroup && (
        <MessageHeader
          selectedGroup={selectedGroup}
          theme={theme}
          ActivityType={ActivityType}
          GroupDetail={GroupDetail}
          onlineUsers={onlineUsers}
          setSelectedChatId={setSelectedChatId}
          setInitialChatId={setInitialChatId}
        />
      )}

      {selectedGroup && selectedGroup?.chatGroup ? (
        <Box display="flex" justifyContent="end" mt={1} height="31px">
          {selectedGroup?.group?.parentActivity === "space" ? (
            <Button
              sx={{
                padding: "0px 24px",
                height: "100%",
                textTransform: "capitalize",
                background:
                  "linear-gradient(0deg, rgba(0, 20, 28, 0.7), rgba(0, 20, 28, 0.7)), #FFFFFF",
                borderRadius: "5px",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "21px",
                letterSpacing: "-0.01em",
              }}
              onClick={handleModalOpen}
            >
              Manage Inquiry
            </Button>
          ) : null}
        </Box>
      ) : null}

      <Box
        sx={{
          height: isLessThan1100
            ? "calc(100vh - 249px)"
            : isLessThan1280
            ? "calc(100vh - 259px)"
            : isLessThan1400
            ? "calc(100vh - 293px)"
            : "calc(100vh - 315px)",
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
            {(selectedGroup?.group?.directUserChat?.userToUser
              ? selectedGroup?.group?.directUserChat?.messages
              : selectedGroup?.chatGroup?.messages
            )
              ?.slice()
              .reverse()
              ?.map((message, i) => {
                const brandSenderCreator =
                  selectedGroup?.chatGroup?.senderBrand?.user?.name;
                const brandSendor = selectedGroup?.chatGroup?.senderBrand;
                const brandReciever = selectedGroup?.chatGroup?.receiverBrand;
                const eventRecieverBrandName =
                  selectedGroup?.chatGroup?.receiverEvent;
                const eventRecieverBrandImg =
                  selectedGroup?.chatGroup?.receiverEvent;
                const isDirect =
                  selectedGroup?.group?.directUserChat?.userToUser ||
                  selectedGroup?.chatGroup?.userToUser;

                const dC = selectedGroup?.group?.directUserChat;
                const recEvent = dC?.receiverEvent?.brand;
                const recBrand = dC?.receiverBrand;
                const grRecBrand = selectedGroup?.chatGroup?.receiverBrand;
                const grRecEvent =
                  selectedGroup?.chatGroup?.receiverEvent?.brand;

                const bName = !selectedGroup?.chatGroup
                  ? message?.sender?.name ===
                    selectedGroup?.group?.ownerDetails?.name
                    ? recEvent?.brandName || recBrand?.brandName
                    : user?.name
                  : message?.sender?.name === selectedGroup?.chatGroup?.name
                  ? selectedGroup?.chatGroup?.name
                  : grRecEvent?.brandName || grRecBrand?.brandName;

                  const chatActivity = !selectedGroup?.chatGroup
                  ? message?.sender?.name ===
                    selectedGroup?.group?.ownerDetails?.name
                    ? "brand"
                    : "profile"
                  : message?.sender?.name === selectedGroup?.chatGroup?.name
                  ? "profile"
                  : "brand";

                  const shortName = !selectedGroup?.chatGroup
                  ? message?.sender?.name ===
                    selectedGroup?.group?.ownerDetails?.name
                    ? recEvent?.user?.name || recBrand?.user?.name
                    : ""
                  : message?.sender?.name === selectedGroup?.chatGroup?.name
                  ? ""
                  : grRecEvent?.user?.name || grRecBrand?.user?.name;

                const bAvatar = !selectedGroup?.chatGroup
                  ? message?.sender?.name ===
                    selectedGroup?.group?.ownerDetails?.name
                    ? recEvent?.brandImage || recBrand?.brandImage
                    : user?.profileImage
                  : message?.sender?.name === selectedGroup?.chatGroup?.name
                  ? selectedGroup?.chatGroup?.avatar[0]
                  : grRecEvent?.brandImage || grRecBrand?.brandImage;
         

                return (
                  <Fragment key={i}>
                    {message.content ? (
                      <Message
                        ActivityType={ActivityType}
                        theme={theme}
                        index={0}
                        message={message}
                        chatActivity={isDirect ? chatActivity : message?.activity}
                        shortName={shortName}
                        isDirect={isDirect}
                        sender={{
                          brandName: isDirect
                            ? bName
                            : message?.sender?.name === brandSenderCreator
                            ? brandSendor?.brandName
                            : brandReciever?.brandName ||
                              eventRecieverBrandName?.brand?.brandName,
                          brandImage: isDirect
                            ? bAvatar || ""
                            : message?.sender?.name === brandSenderCreator
                            ? brandSendor?.brandImage
                            : brandReciever?.brandImage ||
                              eventRecieverBrandImg?.brand?.brandImage,
                        }}
                      />
                    ) : null}
                  </Fragment>
                );
              })}
            {(selectedGroup?.group?.directUserChat
              ? selectedGroup?.group?.directUserChat?.message?.length > 0
              : selectedGroup?.chatGroup?.messages?.length > 0) &&
              totalPageOfMessage?.hasMore && (
                <div
                  ref={observerRef}
                  style={{
                    minHeight: 10,
                    textAlign: "center",
                    marginBottom: "16px",
                  }}
                >
                  {inViewLoader && (
                    <CircularProgress
                      sx={{
                        width: "30px !important",
                        height: "30px !important",
                      }}
                    />
                  )}
                </div>
              )}
          </Box>

          {isTypingUser?.userId === user?.id &&
            (selectedGroup?.group?.directUserChat?._id ||
              selectedGroup?.chatGroup?.chatId) === isTypingUser?.chatId && (
              <span className="typing-indicator">
                <span className="dots">...</span>
              </span>
            )}

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
            <EditorSenderSection selectedGroup={selectedGroup} />

            <InputBox
              setEmojiPickerVisible={setEmojiPickerVisible}
              emojiPickerVisible={emojiPickerVisible}
              buttonRef={buttonRef}
              handleSendMessage={handleSendMessage}
              buttonDisabled={buttonDisabled}
              quillInstance={quillInstance}
              handleInputChange={handleInputChange}
              finalMessage={finalMessage}
              setButtonDisabled={setButtonDisabled}
            />

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
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) =>
                    addEmoji(
                      emoji,
                      isCursorActive,
                      quillInstance,
                      setEmojiPickerVisible
                    )
                  }
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <ReusableModal
        hideHeader={true}
        open={showInquiryModal}
        handleClose={handleModalClose}
      >
        <ManageInquiry
          handleModalClose={handleModalClose}
          details={convertToSameKeys(selectedGroup)}
          setAfterSignature={setAfterSignature}
          TopHeading={TopHeading}
          setShowIinquiryModal={setShowIinquiryModal}
        />
      </ReusableModal>

      <ReusableModal
        hideHeader={true}
        open={afterSignature}
        handleClose={handleModalClose}
      >
        <AfterSignature
          image={selectedGroup?.group?.parentImage}
          alt="SpaceImage"
          activity={selectedGroup?.group?.parentActivity}
          TopHeading={TopHeading}
          name={selectedGroup?.group?.parentName}
          brandName={selectedGroup?.chatGroup?.receiverbrandName}
          handleClose={handleModalClose}
          upperPara="Your Lease document has been sent to Tenant for Signature."
          lowerPara="Lease details are available under Spaces -> Tenancy."
        />
      </ReusableModal>
    </Box>
  );
};

export default AllMesaages;
