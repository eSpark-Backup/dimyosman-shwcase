import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import MessageInput from "./Message/MessageInput";
import Dropdown from "./Dropdown";
import { useGetAllBrandsQuery } from "../services/brands";
import { addEmoji, cleanHTML, inquireInputStyles, useClickOutside } from "../utils";
import { close, smile } from "../assets";
import { useSendDirectMessageMutation } from "../services/chats";

const CommentModal = ({ open, handleClose, handleSuccess, commentId }) => {
  const quillInstance = useRef(null);

  const [brandOptions, setBrandOptions] = useState([]);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const {
    data: brandData,
    isError: IsBrandError,
    isLoading: IsBrandLoading,
    isSuccess: IsBrandSuccess,
    isFetching: IsBrandFetching,
  } = useGetAllBrandsQuery({}, { refetchOnMountOrArgChange: true, skip: !localStorage.getItem("token") });
  const [sendDirectMessage, { isLoading }] = useSendDirectMessageMutation();

  const isLessThan1400 = useMediaQuery("(max-width:1400px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");

  const [id, setId] = useState(commentId || "");
  const [finalMessage, setFinalMessage] = useState({
    senderBrandId: "",
    message: "",
  });

  useEffect(() => {
    if (commentId) {
      setId(commentId);
    }
  }, [commentId]);

  useEffect(() => {
    if (IsBrandSuccess && brandData) {
      const options = Array.isArray(
        brandData?.data?.groupedBrands?.publishedBrands
      )
        ? brandData?.data?.groupedBrands?.publishedBrands?.map((brand) => ({
            label: brand.brandName,
            value: brand.id,
            item: brand,
          }))
        : [];
      setBrandOptions(options);
    }
    if (IsBrandError) {
      toast.error(
        "Something went wrong while fetching brand. Please try again."
      );
      setBrandOptions([]);
    }
  }, [brandData, IsBrandSuccess, IsBrandError]);

  const handleSelectChange = (e) => {
    setFinalMessage((prevData) => ({
      ...prevData,
      senderBrandId: e.target.value,
    }));
  };

  const isCursorActive = () => {
    const selection = quillInstance.current.getSelection();
    return selection !== null && selection.length > 0;
  };

  const handleInputChange = ({ content }) => {
    setFinalMessage((prevData) => ({
      ...prevData,
      message: content,
    }));
  };

  const HandleMessageSend = () => {
    // if (finalMessage?.senderBrandId === "") {
    //   toast.error("Please Select Brand First");
    //   return;
    // }
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
    let obj = {};
    
    if (finalMessage?.senderBrandId === "" || finalMessage?.senderBrandId === "none") {
      obj = {
        message: cleanHTML(finalMessage.message),
      };
    } else {
      obj = {
        ...finalMessage,
        message: cleanHTML(finalMessage.message),
      };
    }
    
    sendDirectMessage({ id, credentials: obj })
      .then((res) => {
        if (res?.data?.status) {
          resetALsStates();
          handleSuccess();
        }
      })
      .catch((err) => console.log(err, "err"));
  };

  const resetALsStates = () => {
    handleClose();
    quillInstance.current = null;
    setFinalMessage((prevData) => ({
      ...prevData,
      message: "",
      senderBrandId: "",
    }));
  };

  const emojiRef = useRef();
  useClickOutside(emojiRef, () => setEmojiPickerVisible(false));

  return (
    <Modal
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      open={open}
      onClose={resetALsStates}
    >
      {IsBrandFetching || IsBrandLoading ? (
        <>Loading...</>
      ) : (
        <Box
          sx={{
            width: { xs: "95vw", sm: "478px" },
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none",
            padding: 2,
            background: "#fff",
            border: (theme) =>
              `1px solid ${theme.palette.border.borderColor[0]}`,
            boxShadow: "0px 0px 20px 0px #00141C33",
            borderRadius: "5px",
          }}
        >
          <Box component="header">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              gap="10px"
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                gap="16px"
              >
                <Box
                  sx={{
                    borderRadius: "5px",
                    minWidth: "32px",
                    height: "32px",
                    background: "#D1DBD7",
                  }}
                ></Box>
                <Box>
                  <Typography
                    lineHeight="20px"
                    textAlign="left"
                    fontWeight={600}
                    fontSize={24}
                    variant="h2"
                  >
                    Message Recipient
                  </Typography>
                </Box>
              </Stack>
              <img
                src={close}
                alt="Close Icon"
                style={{ cursor: "pointer", width: "24px", height: "24px" }}
                onClick={resetALsStates}
              />
            </Stack>
          </Box>
          <Box sx={{ marginTop: "28px" }} component="section">
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              columnGap={1}
            >
              <Typography
                component="span"
                sx={{ display: "inline", marginLeft: "5px" }}
                fontWeight={600}
                fontSize={16}
              >
                Sender:
              </Typography>
              <Dropdown
                options={[...brandOptions, { label: "None", value: "none" }]}
                onChange={handleSelectChange}
                value={finalMessage?.senderBrandId}
                placeholder={"Brand name"}
              />
            </Stack>
          </Box>
          <Box
            sx={{
              ...inquireInputStyles(isLessThan1400, isLessThan1280),
              marginTop: "10px",

              "& .ql-toolbar.ql-snow": {
                border: "1px solid white !important",
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
              >
                <img src={smile} />
              </IconButton>

              <LoadingButton
                style={{ marginBottom: "10px" }}
                sx={{
                  padding: 0,
                  margin: "0px !important",
                  height: "31px",
                  width: "85px",
                  fontWeight: 700,
                  fontSize: "16px",
                  bgcolor: "rgba(209, 219, 215, 0.4) !important",
                  color: "#00141C",
                  textTransform: "inherit",
                  lineHeight: "21px",
                  letterSpacing: "-0.01em",
                }}
                onClick={HandleMessageSend}
                loading={isLoading}
                loadingIndicator={
                  <CircularProgress size={15} sx={{ color: "#00000" }} />
                }
              >
                SEND
              </LoadingButton>
            </Box>

            <MessageInput
              emojiPickerVisible={emojiPickerVisible}
              setEmojiPickerVisible={setEmojiPickerVisible}
              quillInstance={quillInstance}
              onChange={handleInputChange}
              value={finalMessage?.message}
            />
            {emojiPickerVisible && (
              <div
                ref={emojiRef}
                style={{
                  position: "fixed",
                  zIndex: 9999,
                  backgroundColor: "white",
                  padding: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  border: "1px solid #ccc",
                }}
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
              </div>
            )}
          </Box>
        </Box>
      )}
    </Modal>
  );
};

export default CommentModal;
