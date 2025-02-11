import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import dayjs from "dayjs";

import { DateRangePicker } from "rsuite";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import MessageInput from "./Message/MessageInput";
import Dropdown from "./Dropdown";

import { close, smile, spaceBadge } from "../assets";

import { addEmoji, inquireInputStyles } from "../utils";

import { useGetMyChatsQuery } from "../services/chats";
import {
  useSpaceInquireMutation,
  useSpacePriceMutation,
} from "../services/space";
import { useGetAllBrandsQuery } from "../services/brands";

const SpaceInquireModal = ({
  open,
  handleClose,
  handleSave,
  spaceName,
  bookedDates,
  brandName,
  spaceImage,
  pricing,
  spaceId,
  brandId,
}) => {
  const quillInstance = useRef(null);

  const [selectedDate, setSelectedDate] = useState([]);
  const selectedDateRef = useRef([]);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    pricing: [],
    days: 0,
  });
  const [totalPrice, setTotalPrice] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const [price, { data: spaceData, isLoading, isError, error, isSuccess }] =
    useSpacePriceMutation();
  const [
    spaceMessage,
    {
      data: messageData,
      isLoading: messageLoading,
      isError: IsMessageError,
      error: messageError,
      isSuccess: IsMessageSuccess,
    },
  ] = useSpaceInquireMutation();
  const {
    data: brandData,
    isError: IsBrandError,
    isLoading: IsBrandLoading,
    isSuccess: IsBrandSuccess,
    error: BrandError,
    isFetching: IsBrandFetching,
  } = useGetAllBrandsQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.error)
      return
    }
  }, [isError, error])

  const isLessThan1400 = useMediaQuery("(max-width:1400px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");

  const [finalMessage, setFinalMessage] = useState({
    receiverSpaceId: spaceId ? spaceId : "",
    receiverBrandId: brandId ? brandId : "",
    senderBrandId: "",
    message: "",
  });
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (spaceId && brandId) {
      setFinalMessage((prev) => ({
        ...prev,
        receiverSpaceId: spaceId ? spaceId : "",
        receiverBrandId: brandId ? brandId : "",
      }));
    }
  }, [spaceId, brandId]);

  const { refetch } = useGetMyChatsQuery(undefined, { skip: !user });

  useEffect(() => {
    const bookedEventsDate = bookedDates?.map((item) => ({
      start: new Date(item?.start),
      end: new Date(item?.end),
    }));

    setBookedRanges(bookedEventsDate);
  }, [bookedDates]);

  const isDateInRanges = (date, ranges) => {
    return ranges.some((range) => date >= range.start && date <= range.end);
  };

  const isRangeValid = (range, ranges) => {
    if (!range || range.length < 2) return false;
    const [startDate, endDate] = range;

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (isDateInRanges(new Date(d), ranges)) {
        return false;
      }
    }

    return true;
  };

  const handleOk = () => {
    if (selectedDateRef.current?.length > 0) {
      const start = dayjs(selectedDateRef.current[0]);
      const end = dayjs(selectedDateRef.current[1]);
      const totalDays = end.diff(start, "day") + 1;
      // const findDay = pricing?.find((price) => price?.term === "Day");

      // if (totalDays < Number(findDay?.minimum)) {
      //   toast.error(
      //     `Selected range should be greater than or equal to ${findDay?.minimum} days`
      //   );
      //   return;
      // }

      const updatedBookingDetails = {
        pricing: pricing,
        days: totalDays,
      };

      setBookingDetails(updatedBookingDetails);
      price({ priceData: updatedBookingDetails });
    }
  };

  const handleDateChange = (newValue) => {
    if (newValue === null) {
      setSelectedDate([]);
      selectedDateRef.current = [];
      setTotalPrice("0");
      return;
    }

    if (isRangeValid(newValue, bookedRanges)) {
      setSelectedDate(newValue);
      selectedDateRef.current = newValue;
    } else {
      toast.error(
        "Selected range includes disabled dates. Please choose a valid range."
      );
      setSelectedDate([]);
      selectedDateRef.current = [];
      setTotalPrice("0");
      return;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTotalPrice(spaceData?.totalPrice);
    }
  }, [spaceData, isSuccess]);

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
  }, [brandData, IsBrandSuccess]);

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

  const handleInputChange = ({ content, text }) => {
    setFinalMessage((prevData) => ({
      ...prevData,
      message: content,
    }));
  };

  const HandleMessageSend = () => {
    if (selectedDate.length === 0) {
      toast.error("Please Select Date range");
      return;
    }

    const start = dayjs(selectedDate[0]);
    const end = dayjs(selectedDate[1]);
    const totalDays = end.diff(start, "day") + 1;
    const findDay = pricing?.find((price) => price?.term === "Day");

    if (totalDays < Number(findDay?.minimum)) {
      toast.error(
        `Selected range should be greater than or equal to ${findDay?.minimum} days`
      );
      return;
    }

    if (totalPrice === null) {
      toast.error("Price is not set");
      return;
    }

    if (finalMessage?.senderBrandId === "") {
      toast.error("Please Select Brand First");
      return;
    }
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

    const inquiryInfo = `Inquiry for: <strong>${spaceName}</strong><br />Date Range: <strong>${dayjs(
      selectedDate[0]
    ).format("DD.MM.YYYY")}</strong> - <strong>${dayjs(selectedDate[1]).format(
      "DD.MM.YYYY"
    )}</strong><br />Lease Total: <strong>$${totalPrice}</strong>`;

    const fullMessage = `${inquiryInfo}<br /><br />${finalMessage.message}`;

    const updateMessage = {
      ...finalMessage,
      message: fullMessage,
    };

    spaceMessage({ message: updateMessage });
  };

  const resetALsStates = () => {
    handleClose();
    setSelectedDate([]);
    selectedDateRef.current = [];
    quillInstance.current = null;
    setTotalPrice("0");
    setFinalMessage((prevData) => ({
      ...prevData,
      message: "",
      senderBrandId: "",
    }));
  };

  useEffect(() => {
    if (IsMessageSuccess && messageData) {
      toast.success("Message sent successfully");
      setTimeout(() => {
        setFinalMessage((prevData) => ({
          ...prevData,
          message: "",
          senderBrandId: "",
        }));
        refetch();
        resetALsStates();
      }, 0);
    }
  }, [IsMessageSuccess, messageData]);

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
      {IsBrandFetching || IsBrandLoading ?
        <>Loading...</>
        :
        <Box
          sx={{
            width: { xs: "95vw", sm: "478px" },
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none",
            padding: 2,
            background: "#fff",
            border: (theme) => `1px solid ${theme.palette.border.borderColor[0]}`,
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
                alignItems="flex-start"
                gap="16px"
              >
                <Box
                  sx={{
                    borderRadius: "5px",
                    minWidth: "48px",
                    height: "48px",
                    position: "relative",
                  }}
                >
                  <img
                    style={{ width: "48px", height: "48px" }}
                    src={spaceImage}
                    alt="brand-profile"
                  />
                  <img
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "16px",
                      height: "16px",
                      zIndex: 99,
                    }}
                    src={spaceBadge}
                    alt="space-badge"
                  />
                </Box>
                <Box>
                  <Typography
                    lineHeight="20px"
                    textAlign="left"
                    fontWeight={600}
                    fontSize={24}
                    variant="h2"
                  >
                    {spaceName}
                  </Typography>
                  <Typography
                    marginTop="10px"
                    textAlign="left"
                    fontWeight={600}
                    fontSize={12}
                  >
                    {brandName}
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
              justifyContent="space-between"
              alignItems="flex-start"
              gap="28px"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    width: "100%",
                    minHeight: "300px",
                  }}
                >
                  <DateRangePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    onOk={handleOk}
                    appearance="default"
                    showOneCalendar
                    menuStyle={{ zIndex: 1300 }}
                    shouldDisableDate={(date) =>
                      isDateInRanges(date, bookedRanges)
                    }
                  />
                </Box>
              </LocalizationProvider>
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="flex-start"
                gap="10px"
                sx={{ height: "399px" }}
              >
                <Box>
                  <Typography textAlign="left" fontWeight={600} fontSize={12}>
                    {selectedDate?.length === 0
                      ? "Please select date"
                      : "Selected Date Range:"}
                  </Typography>
                  <time
                    style={{
                      fontSize: "20px",
                      fontFamily: `"Segoe UI", "sans-serif"`,
                      fontWeight: "600",
                      textAlign: "left",
                      lineHeight: "140%",
                    }}
                  >
                    {selectedDate?.length >= 1
                      ? dayjs(selectedDate[0]).format("DD.MM.YYYY")
                      : "Start Date"}
                  </time>
                  <time
                    style={{
                      fontSize: "20px",
                      fontFamily: `"Segoe UI", "sans-serif"`,
                      fontWeight: "600",
                      textAlign: "left",
                      lineHeight: "140%",
                      display: "inline-block",
                    }}
                  >
                    {selectedDate?.length >= 1
                      ? dayjs(selectedDate[1]).format("DD.MM.YYYY")
                      : "End Date"}
                  </time>
                </Box>
                {pricing?.map((item) => {
                  return (
                    <Typography>
                      {/* Minimum Lease {item?.term}: {item?.minimum} {item?.term} */}
                      {`Minimum Lease ${item?.term}${Number(item?.minimum) > 1 ? "s" : ""}: ${item?.minimum} ${item?.term}${Number(item?.minimum) > 1 ? "s" : ""}`}
                    </Typography>
                  )
                })}
                <Box>
                  <Typography textAlign="left" fontWeight={600} fontSize={12}>
                    Selected lease total:
                  </Typography>
                  {isLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: "5px",
                      }}
                    >
                      <CircularProgress size={15} disableShrink />
                    </Box>
                  ) : (
                    <Typography textAlign="left" fontSize={32} fontWeight={600}>
                      ${totalPrice === null ? 0 : totalPrice}
                    </Typography>
                  )}
                </Box>
              </Stack>
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
                Select brand:
              </Typography>
              <Dropdown
                options={brandOptions}
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
                loading={messageLoading}
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
                style={{
                  position: "absolute",
                  zIndex: 9999,
                  backgroundColor: "white",
                  padding: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  bottom: "230px",
                  left: "10px",
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
      }
    </Modal>
  );
};

export default SpaceInquireModal;
