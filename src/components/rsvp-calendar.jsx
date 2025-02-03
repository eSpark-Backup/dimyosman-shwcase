import { Box, Button, CircularProgress, Stack } from "@mui/material";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const RSVPCalendar = ({
  loading,
  modalRef,
  selectedDates,
  setSelectedDates,
  startDate,
  endDate,
  handleCancel,
  handleOk,
}) => {
  const localStartDate = dayjs.utc(startDate).startOf("day").local().add(1, "day");
  const localEndDate = dayjs.utc(endDate).startOf("day").local().add(1, "day");

  const handleDateSelect = (newDate) => {
    const localNewDate = dayjs(newDate).format("YYYY-MM-DD");

    setSelectedDates((prevDates) =>
      prevDates.includes(localNewDate)
        ? prevDates.filter((date) => date !== localNewDate)
        : [...prevDates, localNewDate]
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        ref={modalRef}
        className="calendar"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          position: "absolute",
          right: "0px",
          bottom: "45px",
          zIndex: 9,
        }}
      >
        <DateCalendar
          value={null}
          onChange={handleDateSelect}
          shouldDisableDate={(date) => {
            const localDate = dayjs(date).startOf("day");
            return !localDate.isBetween(
              localStartDate,
              localEndDate,
              "day",
              "[]"
            );
          }}
          slots={{
            day: (props) => {
              const { day, ...other } = props;
              const localDay = dayjs(day).startOf("day");

              const isHighlighted = selectedDates.some((d) =>
                dayjs(d).isSame(localDay, "day")
              );

              const isInRange = localDay.isBetween(
                localStartDate,
                localEndDate,
                "day",
                "[]"
              );

              return (
                <PickersDay
                  {...props}
                  {...other}
                  disabled={!isInRange}
                  sx={{
                    color: isHighlighted
                      ? "#FFF"
                      : isInRange
                      ? "#00141C"
                      : "#9E9EA4",
                    backgroundColor: isHighlighted
                      ? "#00141C"
                      : isInRange
                      ? "#D1E8FF"
                      : "transparent",
                    borderRadius: "50%",
                    opacity: isInRange ? 1 : 0.5,
                    pointerEvents: isInRange ? "auto" : "none",
                    ":hover": {
                      color: isHighlighted
                        ? "#FFF"
                        : isInRange
                        ? "#00141C"
                        : "#9E9EA4",
                      backgroundColor: isHighlighted
                        ? "#00141C"
                        : isInRange
                        ? "#D1E8FF"
                        : "transparent",
                    },
                    ":focus": {
                      color: isHighlighted
                        ? "#FFF"
                        : isInRange
                        ? "#00141C"
                        : "#9E9EA4",
                      backgroundColor: isHighlighted
                        ? "#00141C"
                        : isInRange
                        ? "#D1E8FF"
                        : "transparent",
                    },
                  }}
                />
              );
            },
          }}
        />
        <Stack
          sx={{ width: "100%" }}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              button: {
                fontSize: "12px",
                fontWeight: 500,
                color: "#00141C",
                background: "transparent",

                ":hover": {
                  color: "#00141C",
                  background: "transparent",
                },
              },
            }}
          >
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              sx={{ fontWeight: "700 !important" }}
              onClick={!loading ? handleOk : () => {}}
            >
              {loading ? <CircularProgress size={20} /> : "OK"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default RSVPCalendar;
