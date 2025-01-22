import { useEffect, useRef, useState } from "react";

import dayjs from "dayjs";

import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Stack, Popper, LinearProgress } from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { bigCalendar, calenderIconLight } from "../../../assets";
import { useGetCalendarQuery } from "../../../services/calendar";

const datePickerStyle = {
  borderRadius: "5px",
  border: "1px solid #D1DBD7 !important",
  zIndex: "10",
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

const Calendar = () => {
  const calendarRef = useRef(null);
  const popperRef = useRef(null);

  const [timeZone, setTimeZone] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const { data, isLoading, isFetching, isError, error, isSuccess } = useGetCalendarQuery({}, { refetchOnMountOrArgChange: true })
  useEffect(() => {
    if (isSuccess && data?.data) {
      const fetchedEvents = data?.data?.map((item) => {
        const now = Date.now();
        // Ensure the end date is correctly set
        const end = new Date(item?.end);
        end.setHours(23, 59, 59, 999);  // Set to end of the day
  
        return {
          start: item?.start,
          end: end, // Use the adjusted end date
          title: item?.title,
          status: now > end.getTime() ? "no" : "yes",
        };
      });
      setEvents(fetchedEvents);
    }
  }, [isSuccess, data]);


  const getEventClassNames = (event) => {
    const { status } = event.extendedProps;
    return status === "yes"
      ? ["event-yes"]
      : status === "no"
        ? ["event-no"]
        : [];
  };

  useEffect(() => {
    const offsetMinutes = new Date().getTimezoneOffset();
    const sign = offsetMinutes > 0 ? "-" : "+";
    const hours = Math.abs(Math.floor(offsetMinutes / 60));
    setTimeZone(`GMT ${sign}${hours}`);
  }, []);

  const handleMonthTitleClick = () => {
    setIsDatePickerOpen(true);
    const titleElement = document.querySelector(".fc-toolbar-title");
    if (titleElement) {
      setAnchorEl(titleElement);
    }
  };

  const dateChunks = (date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return { day, month, dayName };
  };

  const weekDayHeaderContent = (args) => {
    const { day, month, dayName } = dateChunks(args.date);
    return (
      <Box
        sx={{
          textTransform: "capitalize",
          textAlign: "start",
          color: "#00141C",
        }}
      >
        <Box sx={{ fontSize: "24px" }}>{day}</Box>
        <Box
          sx={{ fontSize: "16px", fontWeight: "400" }}
        >{`${month}, ${dayName}`}</Box>
      </Box>
    );
  };

  const dayHeaderContent = (args) => {
    const { day, dayName } = dateChunks(args.date);
    return (
      <Box
        sx={{
          textTransform: "capitalize",
          textAlign: "start",
          color: "#00141C",
        }}
      >
        <Box sx={{ fontSize: "16px", fontWeight: "400" }}>{dayName}</Box>
        <Box sx={{ fontSize: "24px" }}>{day}</Box>
      </Box>
    );
  };

  const handleViewDidMount = () => {
    if (calendarRef.current) {
      const axisFrame = calendarRef.current.elRef.current.querySelector(
        ".fc-timegrid-axis-frame"
      );
      if (axisFrame && timeZone) {
        axisFrame.innerHTML = `<span class="timegrid-gmt">${timeZone}</span>`;
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popperRef.current && !popperRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading || isFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ marginBottom: "50px" }}>
      <Stack alignItems="flex-end" marginBottom={2}>
        <Box
          sx={{
            width: "48px",
            height: "48px",
            borderRadius: "5px",
            backgroundColor: "rgb(0, 20, 28, 0.1)",
          }}
        >
          <figure
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            role="space-icon"
          >
            <img src={calenderIconLight} alt="event" />
          </figure>
        </Box>
      </Stack>

      <Popper
        open={isDatePickerOpen}
        anchorEl={anchorEl}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10],
            },
          },
        ]}
        sx={{
          zIndex: 10,
          marginLeft: "-32px !important",
        }}
        ref={popperRef}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            sx={datePickerStyle}
            onClose={() => setIsDatePickerOpen(false)}
            onChange={(date) => {
              setSelectedDate(date);
            }}
            value={dayjs(selectedDate)}
            onAccept={(date) => {
              if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.gotoDate(date.format("YYYY-MM-DD"));
              }

              setSelectedDate(date);
              setIsDatePickerOpen(false);
            }}
            defaultValue={dayjs(selectedDate) || dayjs()}
          />
        </LocalizationProvider>
      </Popper>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        ref={calendarRef}
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "",
          end: "title",
        }}
        datesSet={() => {
          const titleElement = document.querySelector(".fc-toolbar-title");
          const btnType = document.querySelector(".fc-button-active");

          if (btnType) {
            const type = btnType.classList.value.split("-")[1];
            setCurrentView(type);
          }

          if (titleElement) {
            titleElement.style.cursor = "pointer";
            titleElement.addEventListener("click", handleMonthTitleClick);
          }
        }}
        views={{
          timeGridWeek: {
            allDaySlot: false,
            dayHeaderContent: weekDayHeaderContent,
          },
          timeGridDay: {
            allDaySlot: false,
            dayHeaderContent: dayHeaderContent,
          },
        }}
        events={events}
        editable={false}
        selectable={true}
        dateClick={(info) => console.log(`Clicked on date: ${info.dateStr}`)}
        eventClick={(info) => console.log(`Event: ${info.event.title}`)}
        eventClassNames={(arg) => getEventClassNames(arg.event)}
        viewDidMount={handleViewDidMount}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        dayMaxEvents={3}
        firstDay={1}
        height="auto"
      />
    </Box>
  );
};

export default Calendar;
