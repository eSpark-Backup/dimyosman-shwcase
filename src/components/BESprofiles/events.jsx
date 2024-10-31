import { Box, Button, Stack, Typography } from "@mui/material";
import { addIcon, eventBadge } from "../../assets";
import { useState } from "react";

const Events = ({ events }) => {
  const filterEvents = ["All", "Upcoming", "Past"];
  const [activeFilter, setActiveFilter] = useState("All");
  return (
    <Box>
      <Stack
        sx={{ marginRight: "48px" }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Typography sx={{ fontWeight: 300 }} variant="h5">
            Show:{" "}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            {filterEvents.map((filter) => {
              return (
                <Typography
                  variant="h5"
                  sx={{ fontWeight: filter === activeFilter ? 600 : 300 }}
                  onClick={() => setActiveFilter(filter)}
                  key={filter}
                >
                  {filter}
                </Typography>
              );
            })}
          </Stack>
        </Stack>
        <Button
          startIcon={
            <img
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(5%) sepia(29%) saturate(6114%) hue-rotate(176deg) brightness(93%) contrast(102%)",
              }}
              width={16}
              height={16}
              src={addIcon}
              alt="add-icon"
            />
          }
          sx={{
            background: (theme) => theme.palette.button.secondary,
            color: (theme) => theme.palette.primary.main,
            fontSize: "16px",
            fontWeight: 500,
            width: { xs: "100%", sm: "142px" },
            height: "31px",
            textTransform: "capitalize",
            borderRadius: "3px",
            "&:hover": {
              background: (theme) => theme.palette.button.secondary,
              color: (theme) => theme.palette.primary.main,
            },
          }}
        >
          Add New
        </Button>
      </Stack>
      <Stack
        marginTop={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap={4}
        columnGap={2}
      >
        {events.map((event, ind) => {
          return (
            <Box
              sx={{
                width: "328px",
                borderRadius: "5px",
                border: "1px solid #e8ebed",
                position: "relative",
                height: "100%",
              }}
              key={ind}
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
              <Box padding={2}>
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
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Events;
