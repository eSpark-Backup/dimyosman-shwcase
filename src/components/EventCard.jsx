import { eventBadge } from '../assets'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import RSVPCalendar from './rsvp-calendar'
import { useRef, useState } from 'react'
import { useClickOutside } from '../utils'
import { useAddRsvpDateMutation } from '../services/events'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const EventCard = ({ edit, onClick, event, showBtn }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [openCalendar, setOpenCalendar] = useState(false);
  const [addRsvp, { isLoading: rsvpLoading }] = useAddRsvpDateMutation();
  
  const [selectedDates, setSelectedDates] = useState(
    event?.rsvpDates && event?.rsvpDates?.length > 0 ? event?.rsvpDates?.map((date) => dayjs(date).format("YYYY-MM-DD")) : []
  );

  const handleCancel = () => {
    setOpenCalendar(false);
  };
  
  const modalRef = useRef();
  useClickOutside(modalRef, () => handleCancel());

  const handleOk = () => {
      const newRsvpDates = selectedDates.map(item => {return { dateTime: item }})
        const objToSend = {
          id: event?.id,
          credentials: {
            attendanceDates: {
              dateTime: "string",
              rsvpDates: newRsvpDates,
            },
          },
        };
        addRsvp(objToSend).then((res) => {
          if (res?.data?.status) {
            toast.success(res?.data?.message);
            setOpenCalendar(false);
          }
        });
    };
  return (
    <Box
      onClick={onClick ? onClick : () => { }}
      sx={{
        width: "100%",
        borderRadius: "5px",
        border: "1px solid #e8ebed",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pb: "10px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <figure style={{ width: "100%", height: "100%" }} role="event-image" aria-labelledby="event-image-figcaption">
        <img
          style={{ borderRadius: "5px 5px 0 0 " }}
          width="100%"
          height="170px"
          src={event?.slides[0]}
          alt="event-img"
        />
        <img
          style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
          src={eventBadge}
          alt="event-badge"
        />
      </figure>
      <Box component="section" padding={2} sx={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
        <Typography textAlign="left" fontSize={20} fontWeight={600}>
          {event?.profileName}
        </Typography>
        <Typography textAlign="left" fontWeight={300} fontSize={16}>
          {event?.category}
        </Typography>
        <Typography textAlign="left" fontWeight={400} fontSize={12}>
          {event?.tabs[0]?.props?.details?.overview?.length > 636 ? event?.tabs[0]?.props?.details?.overview?.slice(0, 637) + "..." : event?.tabs[0]?.props?.details?.overview}
        </Typography>
        <Typography fontWeight={300} fontSize={12} textAlign="left">
          By: <span style={{ fontWeight: 400 }}>{event?.details?.by}</span>
        </Typography>
        <Typography fontWeight={300} fontSize={24} textAlign="left">
          Starting:{" "}
          <span style={{ fontWeight: 600 }}>{event?.details?.starting}</span>
        </Typography>
        <Typography fontWeight={300} fontSize={12} textAlign="left">
          RSVP: <span style={{ fontWeight: 600 }}>{event?.details?.RSVP}</span>
        </Typography>

      </Box>
      {showBtn &&
        <Button
          sx={{
            width: "90%",
            backgroundColor: "rgb(209, 219, 215, 0.4)",
            fontSize: "16px",
            fontWeight: "700",
            color: theme.palette.primary.main,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgb(209, 219, 215, 0.4)"
            }
          }}
          onClick={edit ? () => navigate(`/event/${event?.id}/edit`) : () => setOpenCalendar(true)}
        >
          {edit ? "Edit" : "RSVP"}
        </Button>
      }
      {openCalendar && !edit && (
        <RSVPCalendar
          loading={rsvpLoading}
          modalRef={modalRef}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          handleCancel={handleCancel}
          handleOk={handleOk}
          startDate={event?.startDate}
          endDate={event?.endDate}
          isDetails={true}
        />
        )}
    </Box>
  )
}

export default EventCard
