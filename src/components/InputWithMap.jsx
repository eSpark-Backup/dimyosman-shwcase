import { Box, Divider, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { add, arrowDown, miniMap, subtract } from '../assets';
import Input from './input';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../utils';
import CheckBox from './CheckBox';
import { useClickOutside } from '../utils';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import Dropdown from './Dropdown';

const InputWithMap = ({
  edit,
  inputLabel,
  inputValue,
  setInputValue,
  handleClick,
  mapDescription,
  activity,
  eventName,
  eventAddress,
  defaultDate,
  onDateChange,
  options,
  eventData,
  updateEventData,
  selectedValue,
  categories,
  handleModalOpen,
  defaultPrice,
  HandlePriceModal,
  mapInstruction,
  HandleCategoryChange

}) => {
  const theme = useTheme();
  const datePickerRef = useRef(null);
  const containerRef = useRef(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [priceToShow, setPriceToShow] = useState(defaultDate);
  // Format start and end dates
  const formatStartDate = (dateRange) =>
    dateRange && dateRange[0] ? dayjs(dateRange[0]).format("DD.MM.YYYY") : "dd.mm.yyyy";

  const formatEndDate = (dateRange) =>
    dateRange && dateRange[1] ? dayjs(dateRange[1]).format("DD.MM.YYYY") : "dd.mm.yyyy";

  const startDate = formatStartDate(selectedDate);
  const endDate = formatEndDate(selectedDate);

  useEffect(() => {
    if (activity === "space" && Array.isArray(defaultPrice)) {
      const dayItem = defaultPrice.filter((item) => item.term == "Day");
      setPriceToShow(dayItem[0]?.price + "/" + dayItem[0]?.term)
    }
    else {
      setPriceToShow(defaultPrice)
    }
  }, [defaultPrice])

  const datePickerStyle = {
    borderRadius: "5px",
    border: "1px solid #D1DBD7",
    ".rsPickerToggle": {
      color: "#00141C !important",
      backgroundColor: "#e3e9e7 !important",
      borderRadius: "5px",
      fontSize: "14px",
    },
    ".rsPickerToggle:hover": {
      color: "#00141C !important",
      backgroundColor: "#e3e9e7 !important",
    },
    ".rsPickerToolbar": {
      display: "none",
    },
    ".rsBtn": {
      background: "transparent",
      color: "#00141C",
      fontSize: "12px",
      ":hover": {
        background: "transparent",
      },
    },
    // Change the blue color to dark grey for the selected date range and buttons
    ".rsCalendarSelected": {
      backgroundColor: "#4B4B4B !important", // Dark grey
      color: "#FFFFFF !important", // Ensure text is readable
    },
    ".rsBtn.rsBtn-primary": {
      backgroundColor: "#4B4B4B !important", // Dark grey for the primary button
      color: "#FFFFFF !important", // White text for contrast
    },
    ".rsBtn.rsBtn-primary:hover": {
      backgroundColor: "#3B3B3B !important", // Slightly darker grey on hover
    },
  };
  

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const selectedSpaceData = options.filter((item) => item.value === e.target.value)
    const updatedLocation = { lat: selectedSpaceData[0]?.item?.location?.lat, long: selectedSpaceData[0]?.item?.location?.long }
    if (activity === "event") {
      if (eventData.space !== selectedValue) {
        updateEventData("space", selectedValue);
        updateEventData("location", updatedLocation);
        updateEventData("mapInstructions", selectedSpaceData[0]?.item?.location?.additional);
      }
    }

    else {
      updateEventData("selectedBrand", selectedValue);
    }
  };

  useClickOutside(datePickerRef, () => setOpenDatePicker(false));
  useClickOutside(containerRef, () => setOpenDatePicker(false));
  return (
    <Box
      sx={{
        width: "98%",
        display: "flex",
        justifyContent: "space-between",
        rowGap: "10px",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "65%" }, display: "flex", flexDirection: "column", rowGap: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "3px" }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: "left",
              color: theme.palette.primary.main,
              fontWeight: "600",
            }}
          >
            {inputLabel}
          </Typography>
          <Input
            value={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)}
            multiline={true}
            sx={{ height: "auto", fontWeight: "400", py: "10px", px: "10px" }}
          />
        </Box>
        {
          activity === "space" &&
          <Box
            sx={{
              height: "112px",
              border: "1px dashed rgb(0, 20, 28, 0.4)",
              backgroundColor: "rgb(209, 219, 215, 0.2)",
              position: "relative",
              p: "10px 0px",
              overflowY: "auto"
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                px: "20px",
                py: "5px",
                rowGap: '15px'
              }}
            >
              {categories?.filter(cat => cat.selected).length > 0 ? (
                categories
                  ?.filter(cat => cat.selected)
                  .map((cat, index) => (
                    <Box key={cat.name} display="flex" alignItems="center" marginRight={2} columnGap={1.5} sx={{ width: { xs: "100%", sm: "45%", lg: "30%" } }}>
                      <CheckBox checked={cat.selected} onChange={() => HandleCategoryChange(cat?.id)} />
                      <Box sx={{ display: "flex", columnGap: "8px" }}>
                        <img src={cat.icon} alt="Amenity Icon" style={{ width: "16px", height: "16px" }} />
                        <Typography sx={{ fontSize: "12px", fontWeight: "300", color: theme.palette.primary.main }}>{cat.name}</Typography>
                      </Box>
                    </Box>
                  ))
              ) : (
                <Typography>No amenities selected.</Typography>
              )}

            </Box>
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                columnGap: "10px"
              }}
            >
              <img src={add} alt="Add Icon" style={{ cursor: "pointer" }} onClick={handleModalOpen} />
            </Box>

          </Box>
        }
      </Box>


      <Box sx={{ width: { xs: "100%", md: "25%" }, display: "flex", flexDirection: "column", rowGap: "10px" }}>
        <Typography variant='h6' sx={{ textAlign: "left" }}>
          {activity === "brand" ? "Headquarters at:" : activity === "event" ? "Hosted at:" : "Located at:"}
        </Typography>

        {(activity === "event" || activity === "space") && (
          <Dropdown
            options={options}
            onChange={handleSelectChange}
            value={selectedValue}
            placeholder={activity === "event" ? "Select Space" : "Select Your Brand"}
          />
        )}
        {mapInstruction && <Typography fontSize={14} fontWeight={300} sx={{ fontStyle: "italic" }}>{mapInstruction}</Typography>}
        {(activity === "brand" && !edit) &&
          <Typography fontSize={14} fontWeight={300} sx={{ fontStyle: "italic" }}>Click on the map to select Address.</Typography>
        }
        <figure role="img" aria-labelledby="profile-map" onClick={(activity === 'event' && selectedValue !== "") || activity === 'space' || activity === 'brand' ? handleClick : undefined} style={{ cursor: activity === 'space' || selectedValue !== "" ? 'pointer' : 'default' }}>
          <img width="100%" height="auto" src={miniMap} alt="map" />
          <figcaption
            style={activity === "brand" && !edit ?
              {
                fontStyle: "normal",
                fontSize: "12px",
                fontWeight: "400",
                textAlign: "left",
                marginTop: "6px",
                fontFamily: `"Segoe UI", "sans-serif"`,
              }
              :
              {
                fontStyle: "italic",
                fontSize: "12px",
                fontWeight: "300",
                textAlign: "left",
                fontFamily: `"Segoe UI", "sans-serif"`,
              }
            }
          >
            {mapDescription}
          </figcaption>
        </figure>
        {(activity === "event" || activity === "space") && (
          <Box sx={{ position: "relative" }}>
            <Divider sx={{ marginY: 2 }} />
            <Typography
              variant="h3"
              fontSize={12}
              fontWeight={600}
              sx={{ textAlign: "left", marginBottom: "10px" }}
            >
              Starting from:
            </Typography>

            <Box
              onClick={() => activity === "event" ? setOpenDatePicker(!openDatePicker) : HandlePriceModal()}
              sx={{
                width: "100%",
                border: "1px dashed rgba(0, 20, 28, 0.4)",
                borderRadius: "3px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "rgba(209, 219, 215, 0.2)",
                p: "10px",
                flexDirection: "column",
                cursor: "pointer",
              }}
              ref={containerRef}
            >
              <Typography
                fontSize={32}
                fontWeight={700}
                sx={{ color: theme.palette.primary.main, textAlign: "left" }}
              >
                
                {activity === "event" ? startDate : defaultDate ? dateToShow + "." : "$"+priceToShow}
              </Typography>
              <Typography
                fontSize={12}
                sx={{ textAlign: "left", color: theme.palette.primary.main }}
              >
                until {endDate}
              </Typography>
            </Box>

            {openDatePicker && (
              <Box
                ref={datePickerRef}
                onMouseDown={(event) => event.stopPropagation()}
                sx={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  zIndex: 10,
                  mt: 1,
                  backgroundColor: "white",
                  boxShadow: theme.shadows[3],
                  borderRadius: 1,
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateRangePicker
                    value={selectedDate}
                    style={datePickerStyle}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                      onDateChange(newValue);
                    }}
                    appearance="default"
                    showOneCalendar
                  />
                </LocalizationProvider>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InputWithMap;
