import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Button, CircularProgress, Modal, Stack, Typography } from "@mui/material";
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
import { useSpacePriceMutation } from "../../../../services/space";
import { useGetAllBrandsQuery } from "../../../../services/brands";

const SpaceInquireModal = ({ open, handleClose, handleSave, spaceName, bookedDates, brandName, spaceImage, pricing }) => {
  const [selectedDate, setSelectedDate] = useState([]);
  const selectedDateRef = useRef([]);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    pricing: [],
    days: 0
  })
  const [totalPrice, setTotalPrice] = useState("0")
  const [price, { data, isLoading, isError, error, isSuccess }] = useSpacePriceMutation()
  const { data: brandData, isError: IsBrandError, isLoading: IsBrandLoading, isSuccess: IsBrandSuccess, error: BrandError, isFetching: IsBrandFetching } = useGetAllBrandsQuery({}, { refetchOnMountOrArgChange: true });
  const [brandOptions, setBrandOptions] = useState([])
  const [selectedValue, setSelectedValue] = useState("");

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
      setTotalPrice(data?.totalPrice)
    }
  }, [data, isSuccess])

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
    console.log(e.target.value);
    setSelectedValue(e.target.value)
  }

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
          >
            <Dropdown
              options={brandOptions}
              onChange={handleSelectChange}
              value={selectedValue}
              label={'Select brand:'}
              placeholder={"Brand name"}
            />
          </Stack>
          {/* <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography fontWeight={300} fontSize={16}>
              Event:
              <Typography
                component="span"
                sx={{ display: "inline", marginLeft: "5px" }}
                fontWeight={600}
                fontSize={16}
              >
                Event Name
              </Typography>
            </Typography>
            <Box
              sx={{
                width: "24px",
                height: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img width={8} height={5} src={arrowDown} alt="down" />
            </Box>
          </Stack> */}
        </Box>
        <Box sx={{ marginY: "16px" }} component="section">
          <Input
            multiline
            rows={2}
            sx={{
              height: "auto",
              borderRadius: "5px",
              padding: "16px 10px",
              background: (theme) => theme.palette.primary.contrastText,
              border: (theme) =>
                `1px solid ${theme.palette.border.borderColor[0]}`,
            }}
            placeholder={"Type your message here"}
          />
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ marginY: "16px" }}
          component="section"
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="31px"
          >
            <img width={16} height={16} src={bold} alt="bold" />
            <img width={16} height={16} src={italic} alt="italic" />
            <img width={16} height={16} src={lineThrough} alt="line-through" />
            <img width={16} height={16} src={paperClip} alt="paper-clip" />
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="31px"
          >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap="18px"
            >
              <img width={24} height={24} src={link} alt="link" />
              <img width={24} height={24} src={smile} alt="smile" />
            </Stack>
            <Button
              onClick={() => handleSave(open)}
              sx={{
                width: "85px",
                height: "31px",
                fontSize: "16px",
                fontWeight: 700,
                color: (theme) => theme.palette.primary.main,
                background: (theme) => theme.palette.button.primary,
                ":hover": {
                  color: (theme) => theme.palette.primary.contrastText,
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default SpaceInquireModal;
