import { Box, Button, CircularProgress, Stack } from "@mui/material";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const RSVPCalendar = ({
  loading,
  modalRef,
  tempSelectedDate,
  setTempSelectedDate,
  selectedDates,
  handleCancel,
  handleOk,
}) => {
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
          value={tempSelectedDate}
          onChange={(newDate) => setTempSelectedDate(newDate)}
          slots={{
            day: (props) => {
              const { day, ...other } = props;
              const isHighlighted = selectedDates.some((d) =>
                d.isSame(day, "day")
              );
              return (
                <PickersDay
                  {...props}
                  {...other}
                  sx={{
                    color: isHighlighted ? "#FFF" : "#9E9EA4",
                    backgroundColor: isHighlighted ? "#00141C" : "transparent",
                    borderRadius: "50%",
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
