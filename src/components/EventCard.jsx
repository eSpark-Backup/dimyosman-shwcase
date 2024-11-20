import { eventBadge } from '../assets'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const EventCard = ({ edit, onClick, event, showBtn }) => {
    const theme = useTheme()
    const navigate = useNavigate()
  return (
    <Box
      onClick={onClick ? onClick : () => {}}
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
          height="100%"
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
          {event?.tabs[0]?.props?.details?.overview[0]}
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
          onClick={() => navigate(`/event/${event?.id}/edit`)}
        >
          {edit ? "Edit" : "RSVP"}
        </Button>
      }
    </Box>
  )
}

export default EventCard
