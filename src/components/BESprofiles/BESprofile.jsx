import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { profiles } from "../../constant";
import DynamicPaginationSwiper from "../Slider";
import OutlinedTabs from "../outlinedTabs";
import Details from "./details";
import Events from "./events";
import Stats from "./stats";
import Reviews from "./reviews";
import Spaces from "./spaces";
import Teenacy from "./teenacy";
import { brandBadge, eventBadge, spaceBadge, star } from "../../assets";

const BESProfile = () => {
  const [openSliderModal, setOpenSliderModal] = useState(false);
  const handleCloseModal = () => setOpenSliderModal(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const editProfile = () => {
    navigate(`/brand/${id}/edit`);
  };

  const addNewEvent = () => {
    navigate("/new-event");
  };

  const componentsMap = {
    Details,
    Events,
    Stats,
    Reviews,
    Spaces,
    Teenacy,
  };

  const mapTabsToComponents = (myProfile, tabs) => {
    return tabs.map((tab) => ({
      label: tab.label,
      component: () => {
        const Component = componentsMap[tab.label];
        return (
          <Component
            {...tab.props}
            myProfile={myProfile}
            addNewEvent={addNewEvent}
          />
        );
      },
    }));
  };

  const filteredProfile = profiles.find((profile) => profile.id === Number(id));
  const myProfile = {
    ...filteredProfile,
    tabs: mapTabsToComponents(filteredProfile, filteredProfile.tabs),
  };

  return (
    <>
      <Box
        sx={{
          background: "#fff",
          borderRadius: "5px",
          border: "1px solid #e8ebed",
          marginBottom: 2,
          ".swiper": {
            borderRadius: "5px 5px 0 0",
          height: myProfile.type === "brand" ? "300px !important" : "500px !important",
          },
          ".slide-content": {
          height: myProfile.type === "brand" ? "300px !important" : "500px !important",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            position: "relative",
          }}
        >
          {myProfile?.owned && (
            <Button
              onClick={editProfile}
              sx={{
                padding: "10px 24px",
                fontSize: "16px",
                fontWeight: 600,
                width: "77px",
                height: "31px",
                position: "absolute",
                top: "8px",
                right: "16px",
                zIndex: 9,
              }}
            >
              Edit
            </Button>
          )}
          <DynamicPaginationSwiper
            onClick={() => setOpenSliderModal(true)}
            slides={myProfile?.slides}
          />
        </Box>
        <Stack
          paddingX={2}
          paddingY={4}
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems={{ xs: "flex-start", md: "center" }}
            gap="10px"
            alignSelf="flex-start"
          >
            <Box
              sx={{
                borderRadius: "5px",
                minWidth: "96px",
                height: "96px",
                position: "relative",
              }}
            >
              <img
                style={{ width: "100%", height: "100%" }}
                src={myProfile.profilePic}
                alt="brand-profile"
              />
              <img
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "16px",
                  height: "16px",
                  zIndex: 99,
                }}
                src={
                  myProfile?.type === "brand"
                    ? brandBadge
                    : myProfile?.type === "event"
                    ? eventBadge
                    : spaceBadge
                }
                alt="brand-badge"
              />
            </Box>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Typography
                textAlign="left"
                sx={{ lineHeight: "100%" }}
                variant="h1"
              >
                {myProfile?.profileName}
              </Typography>
              <Typography sx={{ fontSize: "20px", fontWeight: 200 }}>
                {myProfile?.category}
              </Typography>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                gap="16px"
                flexWrap={{ xs: "wrap", md: "nowrap" }}
              >
                {Object.entries(myProfile?.details).map(([key, values], ind) => {
                    return (
                      <Typography
                        key={ind}
                        variant="h6"
                        sx={{ fontWeight: 200, textTransform: "capitalize" }}
                      >
                        {key}:{" "}
                        <span style={{ fontWeight: 600, textTransform: "none" }}>
                          {values}
                        </span>
                      </Typography>
                    );
                  })}
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-end"
            gap="10px"
            alignSelf="flex-end"
          >
            <Typography sx={{ lineHeight: "100%" }} variant="h1">
              {myProfile?.rating.toFixed(1)}
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap="10px"
            >
              {Array.from({ length: 5 }, (_, ind) => {
                return (
                  <img
                    key={ind + 3}
                    width={21}
                    height={20}
                    src={star}
                    alt="star"
                  />
                );
              })}
            </Stack>
            <Typography sx={{ textAlign: "right", fontWeight: 200 }} variant="h6">
              {myProfile?.ratingBased}
            </Typography>
          </Stack>
        </Stack>
        <OutlinedTabs tabs={myProfile?.tabs} />
      </Box>
      <Modal open={openSliderModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "65%",
            ":focus-visible": {
              outline: "none !important",
            },
            ".slide-content": {
              height: "100% !important",
              img: {
                borderRadius: "10px",
              },
            },
          }}
        >
          <DynamicPaginationSwiper slides={myProfile?.slides} />
        </Box>
      </Modal>
    </>
  );
};

export default BESProfile;
