import { Box, Divider, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { arrowDown, miniMap } from '../assets';
import Input from './input';
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
  onSpaceSelect,
  selectedValue
}) => {
  const theme = useTheme();
  const datePickerRef = useRef(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  // Format start and end dates
  const formatStartDate = (dateRange) =>
    dateRange && dateRange[0] ? dayjs(dateRange[0]).format("DD.MM.YYYY") : "dd.mm.yyyy";

  const formatEndDate = (dateRange) =>
    dateRange && dateRange[1] ? dayjs(dateRange[1]).format("DD.MM.YYYY") : "dd.mm.yyyy";

  const startDate = formatStartDate(selectedDate);
  const endDate = formatEndDate(selectedDate);

  const datePickerStyle = {
    borderRadius: "5px",
    border: "1px solid #D1DBD7",
    ".rs-picker-toggle": {
      color: "#00141C !important",
      backgroundColor: "#e3e9e7 !important",
      borderRadius: "5px",
      fontSize: "14px",
    },
    ".rs-picker-toggle:hover": {
      color: "#00141C !important",
      backgroundColor: "#e3e9e7 !important",
    },
    ".rs-picker-toolbar": {
      display: "none",
    },
    ".rs-btn": {
      background: "transparent",
      color: "#00141C",
      fontSize: "12px",
      ":hover": {
        background: "transparent",
      },
    },
  };
  const handleSelectChange = (selectedOption) => {
    onSpaceSelect(selectedOption.target.value)
  };
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
      <Box sx={{ width: { xs: "100%", md: "70%" } }}>
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
      </Box>

      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
        }}
      >
        <Typography variant="h3" fontSize={12} fontWeight={600} sx={{ textAlign: "left" }}>
          {activity === "brand" ? "Headquarters at:" : "Hosted at:"}
        </Typography>

        {activity === "event" && (
          <Dropdown
            options={options}
            onChange={handleSelectChange}
            value={selectedValue}
            placeholder={"Select Space"}
          />
        )}
        {(activity === "brand" && !edit) &&
          <Typography fontSize={14} fontWeight={300} sx={{ fontStyle: "italic" }}>Click on the map to select Address.</Typography>
        }
        <figure role="img" aria-labelledby="profile-map" onClick={selectedValue !== "" && handleClick} style={{ cursor: selectedValue !== "" ? "pointer" : "not-allowed" }}>
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
        {activity === "event" && (
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
              onClick={() => setOpenDatePicker(!openDatePicker)}
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
            >
              <Typography
                fontSize={32}
                fontWeight={700}
                sx={{ color: theme.palette.primary.main, textAlign: "left" }}
              >
                {startDate}
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
