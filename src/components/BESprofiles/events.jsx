import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { addIcon } from "../../assets";
import { useState } from "react";
import EventCard from "../EventCard";
import { toast } from "react-toastify";
import { addHyphenToName } from "../../utils";

const Events = ({ myProfile, addNewEvent, isMyProfile }) => {
  const token = localStorage.getItem("token")
  const navigate = useNavigate();
  const {pathname} = useLocation()
  const filterEvents = isMyProfile ? ["All", "Publish", "Draft", "Archive", "Upcoming", "Past", "Ongoing"] : ["All", "Upcoming", "Past", "Ongoing"];
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredEvents = myProfile?.tabs[1]?.props?.eventData?.filter(event => {
    if (activeFilter === "Publish") return event?.status === "PUBLISH";
    if (activeFilter === "Draft") return event?.status === "DRAFT";
    if (activeFilter === "Archive") return event?.status === "ARCHIVE";
    if (activeFilter === "Upcoming") return event?.eventStatus === "Upcoming";
    if (activeFilter === "Past") return event?.eventStatus === "Ended";
    if (activeFilter === "Ongoing") return event?.eventStatus === "Ongoing";
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
              {isMyProfile && <Button
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
              </Button>}
            </Stack>
            <Stack
              component="section"
              marginTop={2}
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              flexWrap="wrap"
              rowGap={4}
              columnGap={2}
            >
              {filteredEvents?.length === 0 ? (
                <Typography sx={{ width: "100%", textAlign: "center", fontWeight: 600 }}>No {activeFilter} events available</Typography>
              ) : (
                filteredEvents?.map((event, ind) => (
                  <Box
                    key={`event-${ind + 1}`}
                    sx={{
                      width: { xs: "100%", md: "328px" },
                    }}
                  >
                    <EventCard
                      onClick={() => token ? navigate(`${pathname.includes('/brand') ? '/event' : '/my-events'}/${addHyphenToName(event?.profileName)}`, {state: {id: event?.id}}) : toast.error("You need to login first")}
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
