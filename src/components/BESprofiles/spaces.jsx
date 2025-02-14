import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Stack, Typography } from "@mui/material";
import SpaceCard from "../SpaceCard";
import { addIcon } from "../../assets";

const Spaces = ({ brandSpaces, isMyProfile }) => {
  const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const filterEvents = ["All", "Publish", "Draft", "Archive"];
    const [activeFilter, setActiveFilter] = useState("All");
  
    const filteredSpaces = brandSpaces?.filter(event => {
      if (activeFilter === "Publish") return event?.status === "PUBLISH";
      if (activeFilter === "Draft") return event?.status === "DRAFT";
      if (activeFilter === "Archive") return event?.status === "ARCHIVE";
      return true;
    });
  return (
    <Box>
      {
        brandSpaces?.length === 0
          ?
          <>
            <Typography>
              There are no spaces associated with this brand.
            </Typography>
          </>
          :
          <>
            {isMyProfile && <Stack
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
                    navigate("/new-space")
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
            </Stack>}
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
              {filteredSpaces?.length === 0 ? (
                <Typography sx={{ width: "100%", textTransform: "capitalize", textAlign: "center", fontWeight: 600 }}>No {activeFilter} spaces available</Typography>
              ) : (
                filteredSpaces?.map((space, ind) => (
                  <Box
                    key={`space-${ind + 1}`}
                    sx={{
                      width: { xs: "100%", md: "328px" },
                    }}
                  >
                    <SpaceCard
                      onClick={() => token ?  navigate(`/space/${space?.id}`) : toast.error("You need to login first")}
                      spaces={space}
                      key={ind}
                    />
                  </Box>
                ))
              )}
            </Stack>
          </>
      }
    </Box>
  )
};

export default Spaces;
