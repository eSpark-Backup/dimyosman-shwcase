import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Button, Stack, Typography } from "@mui/material";
import { addIcon } from "../../assets";
import { useState } from "react";
import EventCard from "../EventCard";
import { profileContent } from "../../constant";
import { toast } from "react-toastify";

const Events = ({ myProfile, addNewEvent }) => {
  const token = localStorage.getItem("token")
  const navigate = useNavigate();
  const filterEvents = ["All", "Upcoming", "Past"];
  const [activeFilter, setActiveFilter] = useState("All");
  const { events } = useSelector((state) => state?.event);
  const myEvents = events.filter((event) => event.owned && event.by === myProfile.id);

  const filteredEvents = myProfile?.tabs[1]?.props?.eventData?.filter(event => {
    if (activeFilter === "Upcoming") return event?.status === "Upcoming";
    if (activeFilter === "Past") return event?.status === "Ended";
    return true; // If activeFilter is "All", show all events
  });

  return (
    <Box>
      {
        myProfile?.tabs[1]?.props?.eventData?.length === 0
          ?
          <>
            <Typography>
              There are no events associated with this brand.
            </Typography>
          </>
          :
          <>
            <Stack
              sx={{ marginRight: { xs: "0px", md: "48px" } }}
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              justifyContent="space-between"
              rowGap={1}
            >
              <Stack
                component="section"
                direction="row"
                alignItems="center"
                justifyContent="center"
                gap={2}
              >
                <Typography sx={{ fontWeight: 300 }} fontSize={16}>
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
                        fontSize={16}
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
                onClick={() => {
                  if(!token){
                    toast.error("You need to log in first")
                  } else {
                    addNewEvent()
                  }
                } 
              }
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
              component="section"
              marginTop={2}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              rowGap={4}
              columnGap={2}
            >
              {filteredEvents?.length === 0 ? (
                <Typography>No {activeFilter} events available</Typography>
              ) : (
                filteredEvents?.map((event, ind) => (
                  <Box
                    key={`event-${ind + 1}`}
                    sx={{
                      width: { xs: "100%", md: "328px" },
                    }}
                  >
                    <EventCard
                      onClick={() => navigate(`/event/${event?.id}`)}
                      event={event}
                      key={ind}
                    />
                  </Box>
                ))
              )}
            </Stack>
          </>
      }
    </Box>
  );
};

export default Events;
