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

const InputWithMap = ({ inputLabel, inputValue, setInputValue, handleClick, mapDescription, activity, eventName, eventAddress, defaultDate, mapInstruction, categories, HandleCategoryChange, handleModalOpen, defaultPrice, HandlePriceModal, edit }) => {
  const theme = useTheme();
  const datePickerRef = useRef(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultDate && defaultDate);
  const [dateToShow, setDateToShow] = useState("");

  useClickOutside(datePickerRef, () => setOpenDatePicker(false));

  useEffect(() => {
    if (typeof selectedDate === "string") {
      if (edit) {
        var splitedDate = selectedDate.split("-");
        const formattedDate = `${splitedDate[2]}.${splitedDate[1]}.${splitedDate[0]}`;
        setDateToShow(formattedDate);
      } else {
        setDateToShow(selectedDate);
      }
    } else {
      setDateToShow(selectedDate?.format("DD.MM.YYYY"));
    }
  }, [selectedDate]);

  const datePickerStyle = {
    borderRadius: "5px",
    border: "1px solid #D1DBD7 !important",
    ".Mui-selected": {
      color: "#00141C !important",
      backgroundColor: "#e3e9e7 !important",
    },
    ".Mui-selected:hover": {
      color: "#00141C !important",
      backgroundColor: "#e3e9e7 !important",
    },
    ".MuiPickersLayout-toolbar": {
      display: "none",
    },
    ".MuiDialogActions-root>:not(style)~:not(style)": {
      fontWeight: 700,
    },
    button: {
      background: "transparent",
      color: (theme) => theme.palette.primary.main,
      fontSize: "12px",
      ":hover": {
        background: "transparent",
      },
    },
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
          <Box sx={{ width: "100%", minHeight: "60px", border: "1px dashed rgba(0, 20, 28, 0.4)", borderRadius: "3px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(209, 219, 215, 0.2)", px: "10px" }}>
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
            <img
              style={{ marginTop: "7px" }}
              src={arrowDown}
              alt="Down Arrow"
            />
          </Box>
        )}
        {
          mapInstruction && <Typography style={{
            fontStyle: "italic",
            fontSize: "12px",
            fontWeight: "300",
            textAlign: "left",
            fontFamily: `"Segoe UI", "sans-serif"`,
          }}>
            {mapInstruction}
          </Typography>
        }
        <figure style={{ width: "100%", height: "100%" }} role="img" aria-labelledby="profile-map">
          <img width="100%" height="100%" src={miniMap} alt="map" />
          <figcaption
            style={{
              fontStyle: "italic",
              fontSize: "12px",
              fontWeight: "300",
              textAlign: "left",
              fontFamily: `"Segoe UI", "sans-serif"`,
            }}
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
            >
              <Typography
                fontSize={32}
                fontWeight={700}
                sx={{ color: theme.palette.primary.main, textAlign: "left" }}
              >
                {defaultDate ? dateToShow + "." : defaultPrice}
              </Typography>
              <Typography
                fontSize={12}
                sx={{ textAlign: "left", color: theme.palette.primary.main }}
              >
                until 15.4.2025.
              </Typography>
            </Box>

            {openDatePicker && (
              <Box
                ref={datePickerRef}
                sx={{
                  position: "absolute",
                  top: "-380px",
                  right: "0px",
                  zIndex: 10,
                  mt: 1,
                  backgroundColor: "white",
                  boxShadow: theme.shadows[3],
                  borderRadius: 1,
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <StaticDatePicker
                    sx={datePickerStyle}
                    onClose={() => setOpenDatePicker(false)}
                    onChange={(date) => setSelectedDate(date)}
                    defaultValue={dayjs(selectedDate) || dayjs()}
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
