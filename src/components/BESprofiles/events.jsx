import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Button, Stack, Typography } from "@mui/material";
import { addIcon } from "../../assets";
import { useState } from "react";
import EventCard from "../EventCard";

const Events = ({ myProfile, addNewEvent }) => {
  const navigate = useNavigate();
  const filterEvents = ["All", "Upcoming", "Past"];
  const [activeFilter, setActiveFilter] = useState("All");
  const { events } = useSelector((state) => state?.event);
  const myEvents = events.filter((event) => event.owned && event.by === myProfile.id);
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
                  sx={{ fontWeight: filter === activeFilter ? 600 : 300, cursor: "pointer" }}
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
          onClick={addNewEvent}
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
        {myEvents.map((event, ind) => {
          return (
            <Box
              sx={{
                width: "328px"
              }}
            >
              <EventCard
              //  onClick={() => navigate(`/event/${event?.id}`)} 
               event={event} key={ind} />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Events;
