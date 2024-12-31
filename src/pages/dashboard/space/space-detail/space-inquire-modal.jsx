import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Button, CircularProgress, IconButton, Modal, Stack, Typography, useMediaQuery } from "@mui/material";
import { Dropdown, Input } from "../../../../components";
import {
  arrowDown,
  bold,
  close,
  italic,
  lineThrough,
  link,
  paperClip,
  smile,
  spaceActivityImage,
  spaceBadge,
} from "../../../../assets";
import { DateRangePicker } from "rsuite";
import { toast } from "react-toastify";
import { useSpaceInquireMutation, useSpacePriceMutation } from "../../../../services/space";
import { useGetAllBrandsQuery } from "../../../../services/brands";
import MessageInput from "../../../../components/Message/MessageInput";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { LoadingButton } from "@mui/lab";


const SpaceInquireModal = ({ open, handleClose, handleSave, spaceName, bookedDates, brandName, spaceImage, pricing, spaceId, brandId }) => {
  const [selectedDate, setSelectedDate] = useState([]);
  const selectedDateRef = useRef([]);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    pricing: [],
    days: 0
  })
  const [totalPrice, setTotalPrice] = useState("0")
  const [price, { data: spaceData, isLoading, isError, error, isSuccess }] = useSpacePriceMutation()
  const [spaceMessage, { data: messageData, isLoading: messageLoading, isError: IsMessageError, error: messageError, isSuccess: IsMessageSuccess }] = useSpaceInquireMutation()
  const { data: brandData, isError: IsBrandError, isLoading: IsBrandLoading, isSuccess: IsBrandSuccess, error: BrandError, isFetching: IsBrandFetching } = useGetAllBrandsQuery({}, { refetchOnMountOrArgChange: true });
  const [brandOptions, setBrandOptions] = useState([])
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const quillInstance = useRef(null);
  const isLessThan1400 = useMediaQuery("(max-width:1400px)");
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");
  const [finalMessage, setFinalMessage] = useState({
    receiverSpaceId: spaceId ? spaceId : "",
    receiverBrandId: brandId ? brandId : "",
    senderBrandId: "",
    message: ""
  })

  useEffect(() => {
    const bookedEventsDate = bookedDates?.map((item) => ({
      start: new Date(item?.start),
      end: new Date(item?.end),
    }))

    setBookedRanges(bookedEventsDate)
  }, [bookedDates])

  const isDateInRanges = (date, ranges) => {
    return ranges.some(
      (range) => date >= range.start && date <= range.end
    );
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
      setTotalPrice("0")
      return;
    }

    if (isRangeValid(newValue, bookedRanges)) {
      setSelectedDate(newValue);
      selectedDateRef.current = newValue;
    } else {
      toast.error("Selected range includes disabled dates. Please choose a valid range.");
      setSelectedDate([]);
      selectedDateRef.current = [];
      setTotalPrice("0")
      return;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTotalPrice(spaceData?.totalPrice)
    }
  }, [spaceData, isSuccess])

  useEffect(() => {
    if (IsBrandSuccess && brandData) {
      const options = Array.isArray(brandData?.data?.groupedBrands?.publishedBrands) ?
        brandData?.data?.groupedBrands?.publishedBrands?.map((brand) => ({
          label: brand.brandName,
          value: brand.id,
          item: brand,
        })) : [];
      setBrandOptions(options)
    }
  }, [brandData, IsBrandSuccess])

  const handleSelectChange = (e) => {
    setFinalMessage((prevData) => ({
      ...prevData,
      senderBrandId: e.target.value
    }))
  }

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

    setEmojiPickerVisible(false);
  };

  const handleInputChange = ({ content, text }) => {
    setFinalMessage((prevData) => ({
      ...prevData,
      message: content,
    }))
  };

  const HandleMessageSend = () => {
    if (finalMessage?.senderBrandId === "") {
      toast.error("Please Select Brand First");
      return;
    }
    if (finalMessage?.message === "") {
      toast.error("Message can not be empty");
      return;
    }
    const strippedContent = finalMessage?.message?.replace(/<[^>]*>/g, "").trim();
    if (!strippedContent) {
      toast?.error("Message can not be empty.");
      return false;
    }
    spaceMessage({ message: finalMessage })
  }

  useEffect(() => {
    if (IsMessageSuccess && messageData) {
      toast.success("Message sent successfully");
      setTimeout(() => {
        setFinalMessage((prevData) => ({
          ...prevData,
          message: "",
          senderBrandId: ""
        }));
        handleClose()
      }, 0);
    }
  }, [IsMessageSuccess, messageData]);

  if (IsBrandFetching || IsBrandLoading) {
    return (
      <>Loading...</>
    )
  }
  return (
    <Modal
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      open={open}
      onClose={handleClose}
    >
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
              onClick={handleClose}
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
                  width: '100%',
                  minHeight: '300px',
                }}
              >
                <DateRangePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  onOk={handleOk}
                  appearance="default"
                  showOneCalendar
                  menuStyle={{ zIndex: 1300 }}
                  shouldDisableDate={(date) => isDateInRanges(date, bookedRanges)}
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
                  {selectedDate?.length === 0 ? "Please select date" : "Selected Date Range:"}
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
                  {selectedDate?.length >= 1 ? dayjs(selectedDate[0]).format("DD.MM.YYYY") : "Start Date"}
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
                  {selectedDate?.length >= 1 ? dayjs(selectedDate[1]).format("DD.MM.YYYY") : "End Date"}
                </time>
              </Box>
              <Box>
                <Typography textAlign="left" fontWeight={600} fontSize={12}>
                  Selected lease total:
                </Typography>
                {isLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: "5px" }}>
                  <CircularProgress size={15} disableShrink />
                </Box>
                  :
                  <Typography textAlign="left" fontSize={32} fontWeight={600}>
                    ${totalPrice}
                  </Typography>
                }
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
            position: "relative",
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
            "& .ql-toolbar.ql-snow+.ql-container.ql-snow": {
              border: "1px solid rgba(209, 219, 215, 0.5) !important",
              borderTop: "1px solid rgba(209, 219, 215, 0.5) !important",
              borderRadius: "5px",
              marginBottom: isLessThan1400 ? 1.25 : 1.5,
            },
            "& .ql-toolbar.ql-snow": {
              border: "1px solid white !important"
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
              loadingIndicator={<CircularProgress size={15} sx={{ color: "#00000" }} />}
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
              <Picker data={data} onEmojiSelect={addEmoji} />
            </div>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default SpaceInquireModal;
