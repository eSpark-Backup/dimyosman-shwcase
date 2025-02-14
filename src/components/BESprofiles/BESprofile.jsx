import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Button, LinearProgress, Modal, Stack, Tooltip, Typography } from "@mui/material";
import DynamicPaginationSwiper from "../Slider";
import OutlinedTabs from "../outlinedTabs";
import Details from "./details";
import Events from "./events";
import Stats from "./stats";
import Reviews from "./reviews";
import Spaces from "./spaces";
import Tenancy from "./teenacy";
import { brandBadge, eventBadge, spaceBadge, star } from "../../assets";

const BESProfile = ({ spaceInquire, type, data }) => {
  const [openSliderModal, setOpenSliderModal] = useState(false);
  const handleCloseModal = () => setOpenSliderModal(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const editProfile = () => {
    navigate(`/${type}/${id}/edit`);
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
    Tenancy,
  };

  const mapTabsToComponents = (myProfile, tabs) => {
    return tabs?.map((tab) => ({
      label: tab.label,
      show: tab?.props === false ? false : true,
      component: () => {
        const Component = componentsMap[tab.label];
        return (
          <Component
            {...tab.props}
            myProfile={myProfile}
            addNewEvent={addNewEvent}
            spaceInquire={spaceInquire}
          />
        );
      },
    }));
  };

  const filteredProfile = data.find((profile) => (profile.id === id) || profile);
  const myProfile = {
    ...filteredProfile,
    tabs: mapTabsToComponents(filteredProfile, filteredProfile?.tabs),
  };

  const transformedSlides = Array.isArray(myProfile?.slides)
    ? myProfile.slides.map((slide) => slide.url)
    : [];

  console.log(transformedSlides)


  if (!filteredProfile) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }

  console.log(myProfile.profilePic)

  return (
    <>
      <Box
        sx={{
          position: "relative",
          background: "#fff",
          borderRadius: "5px",
          border: "1px solid #e8ebed",
          marginBottom: 2,
          ".swiper": {
            borderRadius: "5px 5px 0 0",
            height:
              myProfile.type === "brand"
                ? "300px !important"
                : "500px !important",
          },
          ".slide-content": {
            height:
              myProfile.type === "brand"
                ? "300px !important"
                : "500px !important",
          },
        }}
      >
        {myProfile?.owned && (
          <Box
            sx={{
              position: "sticky",
              top: "16px",
              marginRight: "16px",
              zIndex: 2,
            }}
            className="buttons-box"
          >
            {state?.other && state?.other === true ? null : (
              <Button
                onClick={editProfile}
                sx={{
                  padding: "10px 24px",
                  fontSize: "16px",
                  fontWeight: 600,
                  width: "77px",
                  height: "31px",
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  zIndex: 9,
                  textTransform: "capitalize",
                }}
              >
                Edit
              </Button>
            )}
          </Box>
        )}
        <Box
          sx={{
            width: "100%",
          }}
        >
          <DynamicPaginationSwiper
            onClick={() => setOpenSliderModal(true)}
            slides={transformedSlides}
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
            component="section"
            direction={{ xs: "row", md: "row" }}
            justifyContent="center"
            alignItems={{ xs: "flex-start", md: "center" }}
            gap="10px"
            alignSelf="flex-start"
          >
            <Box
              sx={{
                borderRadius: "5px",
                width: { xs: "69px", md: "96px" },
                height: { xs: "69px", md: "96px" },
                position: "relative",
                flexShrink: 0,
                backgroundColor: !myProfile.profilePic && "rgb(209, 219, 215, 0.4)"
              }}
            >
              <figure
                style={{ width: "100%", height: "100%" }}
                role="profile-image"
                aria-labelledby="profile-image-figcaption"
              >
                {myProfile.profilePic && <img
                  style={{ width: "100%", height: "100%" }}
                  src={myProfile.profilePic}
                  alt="brand-profile"
                />}
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
                  alt={`${type}-badge`}
                />
              </figure>
            </Box>
            <Stack
              component="header"
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Tooltip
                title={
                  myProfile?.profileName?.length > 30
                    ? myProfile?.profileName
                    : ""
                }
              >
                <Typography
                  textAlign="left"
                  sx={{
                    lineHeight: "normal",
                    fontWeight: 600,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  variant="h1"
                >
                  {myProfile?.profileName?.length > 30
                    ? `${myProfile.profileName.slice(0, 29)}...`
                    : myProfile?.profileName}
                </Typography>
              </Tooltip>

              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 300,
                }}
              >
                {filteredProfile?.category
                  ?.map((item) => item?.name)
                  .filter(Boolean)
                  .join(", ")}
              </Typography>

              <Stack
                component="section"
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                columnGap={"16px"}
                rowGap={"5px"}
                flexWrap={{ xs: "wrap", md: "nowrap" }}
              >
                {Object.entries(myProfile?.details).map(
                  ([key, values], ind) => {
                    return (
                      <Typography
                        onClick={
                          myProfile?.by && key === "by"
                            ? () => {
                              navigate(
                                `/${type === "brand"? "profile" : "brand"}/${myProfile?.by
                                }`
                              );
                            }
                            : () => { }
                        }
                        key={ind}
                        fontSize={12}
                        sx={{
                          cursor:
                            myProfile?.by && key === "by"
                              ? "pointer"
                              : "default",
                          fontWeight: 300,
                          textTransform: "capitalize",
                        }}
                      >
                        {key}:{" "}
                        <span
                          style={{
                            display: "inline-block",
                            fontWeight: 600,
                            textTransform: "none",
                          }}
                        >
                          {values}
                        </span>
                      </Typography>
                    );
                  }
                )}
              </Stack>
            </Stack>
          </Stack>
          {/* <Stack
            component="section"
            direction="column"
            justifyContent="center"
            alignItems="flex-end"
            gap="10px"
            alignSelf="flex-end"
          >
            <Typography
              sx={{
                lineHeight: "100%",
                fontWeight: 600,
                fontSize: "32px",
              }}
            >
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

            <Typography
              sx={{
                textAlign: "right",
                fontWeight: 300,
                fontSize: "12px",
              }}
            >
              {myProfile?.ratingBased}
            </Typography>
          </Stack> */}
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
            width: { xs: "90%", md: "65%" },
            ".swiper": {
              height: "80vh !important",
            },
            ":focus-visible": {
              outline: "none !important",
            },
            ".slide-content": {
              height: "100% !important",
              img: {
                height: "100%",
                width: "auto",
                objectFit: "cover",
                borderRadius: "10px",
              },
            },
          }}
        >
          <DynamicPaginationSwiper slides={transformedSlides} />
        </Box>
      </Modal>
    </>
  );
};

export default BESProfile;
