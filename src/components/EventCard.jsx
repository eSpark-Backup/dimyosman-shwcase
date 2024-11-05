import React from 'react'
import { eventBadge } from '../assets'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

const EventCard = ({ onClick, event, showBtn }) => {
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
            <img
                style={{ borderRadius: "5px 5px 0 0 " }}
                width="100%"
                height="100%"
                src={event?.eventimage}
                alt="event-img"
            />
            <img
                style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
                src={eventBadge}
                alt="event-badge"
            />
            <Box padding={2} sx={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                <Typography textAlign="left" fontSize={20} fontWeight={600}>
                    {event?.eventName}
                </Typography>
                <Typography textAlign="left" fontWeight={300} variant="h5">
                    {event?.eventCategory}
                </Typography>
                <Typography textAlign="left" fontWeight={400} variant="h6">
                    {event?.eventMessage}
                </Typography>
                <Typography fontWeight={300} variant="h6" textAlign="left">
                    By: <span style={{ fontWeight: 600 }}>{event?.by}</span>
                </Typography>
                <Typography fontWeight={300} variant="h2" textAlign="left">
                    Starting:{" "}
                    <span style={{ fontWeight: 600 }}>{event?.startingDate}</span>
                </Typography>
                <Typography fontWeight={300} variant="h6" textAlign="left">
                    RSVP: <span style={{ fontWeight: 600 }}>{event?.rsvp}</span>
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
                        "&:hover": {
                            backgroundColor: "rgb(209, 219, 215, 0.4)"
                        }
                    }}
                    onClick={() => navigate(`/event/${event?.id}/edit`)}
                >
                    RSVP
                </Button>
            }
        </Box>
    )
}

export default EventCard
