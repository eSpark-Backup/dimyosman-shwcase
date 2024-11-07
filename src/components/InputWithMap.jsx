import { Box, Divider, Typography, useTheme } from '@mui/material';
import React, { act, useEffect, useState } from 'react';
import { add, arrowDown, miniMap, subtract } from '../assets';
import Input from './input';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../utils';
import CheckBox from './CheckBox';

const InputWithMap = ({ inputLabel, inputValue, setInputValue, handleClick, mapDescription, activity, eventName, eventAddress, defaultDate, mapInstruction, categories, HandleCategoryChange, handleModalOpen }) => {
  const theme = useTheme();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  useEffect(() => {
    if (defaultDate) {
      if (defaultDate === "dd.mm.yyyy.") {
        setSelectedDate(defaultDate);
      } else {
        const parsedDate = parseDateString(defaultDate);
        if (parsedDate) {
          setSelectedDate(formatDate(parsedDate));
        } else {
          console.error("Invalid date format");
        }
      }
    }
  }, [defaultDate]);

  const parseDateString = (dateString) => {
    const parts = dateString.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (parts) {
      const day = parseInt(parts[1], 10);
      const month = parseInt(parts[2], 10) - 1;
      const year = parseInt(parts[3], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(formatDate(date));
      setOpenDatePicker(false);
    }
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
      <Box sx={{ width: { xs: "100%", md: "65%" }, display: "flex", flexDirection: "column", rowGap: "20px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "3px" }}>
          <Typography variant='h3' sx={{ textAlign: "left", color: theme.palette.primary.main, fontWeight: "600" }}>
            {inputLabel}
          </Typography>
          <Input value={inputValue} onInputChange={(e) => setInputValue(e.target.value)} multiline={true} sx={{ height: "auto", fontWeight: "400", py: "10px", px: "10px" }} />
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
                      <CheckBox checked={cat.selected} onChange={() => HandleCategoryChange(index)} />
                      <Box sx={{ display: "flex", columnGap: "8px" }}>
                        <img src={cat.icon} alt="" />
                        <Typography sx={{ fontSize: "12px", fontWeight: "300", color: theme.palette.primary.main }}>{cat.name}</Typography>
                      </Box>
                    </Box>
                  ))
              ) : (
                <Typography>No categories selected.</Typography>
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
          <Box sx={{ width: "100%", height: "60px", border: "1px dashed rgba(0, 20, 28, 0.4)", borderRadius: "3px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(209, 219, 215, 0.2)", px: "10px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", rowGap: "5px", alignItems: activity === "space" && "center" }}>
              <Typography variant='h5' sx={{ textAlign: "left", fontWeight: "600", color: theme.palette.primary.dark }}>
                {eventName}
              </Typography>
              {
                eventAddress && <Typography variant='h6' sx={{ textAlign: "left", fontWeight: "300", color: theme.palette.primary.main }}>
                  {eventAddress}
                </Typography>
              }
            </Box>
            <img src={arrowDown} alt="Down Arrow" />
          </Box>
        )}
        {(activity === "space" || activity === "brand") &&
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "300",
              fontStyle: "italic",
              color: theme.palette.primary.main
            }}
          >
            {mapInstruction}
          </Typography>
        }
        <img src={miniMap} alt="Map" onClick={handleClick} style={{ cursor: "pointer" }} />
        <Typography variant='h6' sx={{ textAlign: "left", fontWeight: "300", fontStyle: "italic" }}>
          {mapDescription}
        </Typography>

        {(activity === "event" || activity === "space") && (
          <Box sx={{ position: "relative", display: "flex", flexDirection: "column", rowGap: "5px" }}>
            <Divider />
            <Typography variant='h6' sx={{ textAlign: "left" }}>
              {activity === "event" ? "Starting from:" : "Lease from"}
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
              <Typography variant='h1' sx={{ color: theme.palette.primary.main, textAlign: "left", fontSize: { xs: "24px", lg: "32px" } }}>
                {selectedDate}
              </Typography>
              <Typography variant='h6' sx={{ textAlign: "left", color: theme.palette.primary.main }}>
                {activity === "event" ? "until 15.4.2025." : "minimum lease: X days"}
              </Typography>
            </Box>

            {openDatePicker && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  zIndex: 10,
                  mt: 1,
                  backgroundColor: "white",
                  boxShadow: theme.shadows[3],
                  borderRadius: 1,
                }}
              >
                <DatePicker
                  onChange={handleDateChange}
                  value={parseDateString(selectedDate)} // Ensure you pass a Date object
                  onCalendarClose={() => setOpenDatePicker(false)}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default InputWithMap;