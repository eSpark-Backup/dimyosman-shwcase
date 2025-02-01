import { Box, Button, Divider, Stack, Tooltip, Typography } from "@mui/material";
import { calender, comment, like, liked, miniMap, share } from "../../assets";
import { useRef, useState } from "react";
import ReusableModal from "../Modal";
import MapModal from "../MapModal";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { useAddInFavouritesMutation } from "../../services/favourite";
import { toast } from "react-toastify";
import RSVPCalendar from "../rsvp-calendar";
import dayjs from "dayjs";
import { useClickOutside } from "../../utils";
import { useAddRsvpDateMutation } from "../../services/events";

const Details = ({ spaceInquire, details, myProfile }) => {
  const [likeFunc, { isLoading }] = useAddInFavouritesMutation();
  const [likePost, setLikePost] = useState(myProfile?.isFavourite);
  const [openMapModal, setMapModal] = useState(false);
  const { events } = useSelector((state) => state?.event);
  const { brands } = useSelector((state) => state?.brand);
  const { spaces } = useSelector((state) => state?.space);
  // const { spaces } = useSelector((state) => state?.event);
  const location = useLocation();
  const pathname = location.pathname;
  const activity = `/${pathname.split("/")[1]}`;

  if (activity === "/brand") {
    details = brands[0]?.tabs[0]?.props?.details;
  } else if (activity === "/event") {
    details = events[0]?.tabs[0]?.props?.details;
  } else if (activity === "/space") {
    details = spaces[0]?.tabs[0]?.props?.details;
  } else {
    details = null; // Default case if `activity` doesn't match any
  }

  ///these dates will come from backend to render in calendar
  const apiDates = ["2025-02-25", "2025-02-28"];

  const [addRsvp, { isLoading: rsvpLoading }] = useAddRsvpDateMutation();

  const [selectedDates, setSelectedDates] = useState(
    apiDates && apiDates.length > 0 ? apiDates.map((date) => dayjs(date)) : []
  );

  const [openCalendar, setOpenCalendar] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(null);

  const handleOk = () => {
    if (
      tempSelectedDate &&
      !selectedDates.some((d) => d.isSame(tempSelectedDate, "day"))
    ) {
      setSelectedDates([...selectedDates, tempSelectedDate]);
      const dateToSend = tempSelectedDate.format("YYYY-MM-DD");
      const objToSend = {
        id: myProfile?.id,
        credentials: {
          attendanceDates: {
            dateTime: dateToSend,
          },
        },
      };
      addRsvp(objToSend).then(
        (res) => res?.data?.status && toast.success(res?.data?.message)
      );
    }
    setOpenCalendar(false);
  };

  const handleCancel = () => {
    setOpenCalendar(false);
  };

  const modalRef = useRef();
  useClickOutside(modalRef, () => setOpenCalendar(false));

  return (
    <Box>
      <Stack
        component="section"
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
      >
        <Box component="section" sx={{ width: "100%" }}>
          <Typography
            variant="h2"
            fontSize={24}
            sx={{
              textAlign: "left",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {myProfile.type} Overview:
          </Typography>
          {details?.overview?.map((overview) => (
            <Typography
              key={overview}
              fontSize={16}
              sx={{ textAlign: "left", marginTop: 2, fontWeight: 400, wordBreak: "break-word" }}
            >
              {overview}
            </Typography>
          ))}
          {details.feature && (
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                rowGap: "15px",
              }}
            >
              <Typography
                fontSize={12}
                sx={{
                  fontWeight: "600",
                  textAlign: "left",
                  fontSize: "12px",
                  color: theme => theme.palette.primary.dark
                }}
              >
                {details?.feature?.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  rowGap: "15px",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    rowGap: "15px",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between"
                  }}
                >
                  {details?.feature?.points?.map(
                    (item, index) =>
                      index >= 0 &&
                      index <= 2 && (
                        <Box
                          sx={{
                            display: "flex",
                            columnGap: "5px",
                            width: { xs: "100%", md: "150px" },
                          }}
                          key={index}
                        >
                          <img
                            src={item?.icon}
                            alt="Icon"
                            style={{ width: "16px", height: "16px" }}
                          />
                          <Typography
                            sx={{
                              textAlign: "left",
                              fontWeight: "400",
                              fontSize: { xs: "12px", sm: "11px", xl: "12px" },
                              color: theme => theme.palette.primary.dark
                            }}
                          >
                            {item?.description}
                          </Typography>
                        </Box>
                      )
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    rowGap: "15px",
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  {details?.feature?.points?.map(
                    (item, index) =>
                      index >= 3 &&
                      index <= 5 && (
                        <Box
                          sx={{
                            display: "flex",
                            columnGap: "5px",
                            width: { xs: "100%", md: "150px" },
                          }}
                          key={index}
                        >
                          <img
                            src={item?.icon}
                            alt="Icon"
                            style={{ width: "16px", height: "16px" }}
                          />
                          <Typography
                            sx={{
                              textAlign: "left",
                              fontWeight: "400",
                              fontSize: { xs: "12px", sm: "11px", xl: "12px" },
                              color: theme => theme.palette.primary.dark
                            }}
                          >
                            {item?.description}
                          </Typography>
                        </Box>
                      )
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box
          component="section"
          sx={{ marginTop: 1, width: { xs: "100%", md: "max-content" } }}
        >
          <header>
            <Typography
              variant="h3"
              sx={{
                fontSize: "12px",
                fontWeight: "600",
                textAlign: "left",
              }}
            >
              {myProfile?.type === "brand" && !myProfile.owned
                ? "Located at:"
                : myProfile?.type === "brand"
                  ? "Headqarters at:"
                  : "Hosted at:"}
            </Typography>
            {myProfile?.type !== "brand" && (
              <Tooltip title={details?.space?.length > 30 ? details?.space : ""}>
                <Typography
                  textAlign="left"
                  sx={{ fontWeight: 600, cursor: "pointer", fontSize: "16px" }}
                >
                  {details?.space?.length > 30
                    ? `${details?.space.slice(0, 29)}...`
                    : details?.space}
                </Typography>
              </Tooltip>
            )}
            {myProfile?.type !== "brand" && (
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "300",
                  textAlign: "left",
                }}
              >
                {details?.spaceCategory && details?.spaceCategory?.length > 0 && details?.spaceCategory
                  ?.map((item) => item)
                  .filter(Boolean)
                  .join(', ')}
              </Typography>
            )}
          </header>
          <Box
            sx={{
              marginTop: "6px",
              width: { xs: "100%", md: "222px" },
              height: "auto",
            }}
          >
            <figure style={{ width: "100%", height: "100%", cursor: "pointer" }} role="img" aria-labelledby="profile-map" onClick={() => setMapModal(true)}>
              <img width="100%" height="100%" src={miniMap} alt="map" />
              <figcaption
                style={{
                  fontStyle: "normal",
                  fontSize: "12px",
                  fontWeight: "400",
                  textAlign: "left",
                  wordSpacing: "-1px",
                  marginTop: "6px",
                  fontFamily: `"Segoe UI", "sans-serif"`,
                }}
              >
                {details.location}
              </figcaption>
            </figure>
          </Box>
          {myProfile?.type !== "brand" && (
            <>
              <Divider sx={{ marginY: 1 }} />
              <Typography
                variant="h3"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  textAlign: "left",
                  color: (theme) => theme.palette.primary.dark,
                }}
              >
                Staring from:
              </Typography>
              <Typography
                style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  textAlign: "left",
                  lineHeight: "140%",
                }}
              >
                {details?.startingDate}
              </Typography>
              <Typography
                style={{
                  fontSize: "12px",
                  fontWeight: "300",
                  textAlign: "left",
                }}
              >
                until {details?.endingDate}
              </Typography>
              <Divider sx={{ marginTop: 1 }} />
            </>
          )}
        </Box>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        paddingY={2}
        gap={1}
        sx={{ position: "relative" }}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          gap={1}
        >
          <img
            style={{
              padding: "5px",
              cursor: isLoading ? "not-allowed" : "pointer",
              animation: isLoading ? "pulse 1s infinite" : "none",
              opacity: isLoading ? 0.5 : 1,
            }}
            width={32}
            height={32}
            onClick={() => {
              if (!isLoading) {
                likeFunc({
                  entityId: myProfile?.id,
                  entityType: myProfile?.type?.toLocaleUpperCase(),
                }).then((res) => {
                  res?.data?.status &&
                    toast.success(
                      res?.data?.message
                        .replace("Entity", "Post")
                        .replace(" successfully", "")
                    );
                  setLikePost(!likePost);
                });
              }
            }}
            src={likePost ? liked : like}
            className={`like-icon ${isLoading ? "loading" : ""}`}
            alt="like"
          />
          {myProfile.type !== "space" && !myProfile?.owned && (
            <img
              style={{ cursor: "pointer", padding: "5px" }}
              width={32}
              height={32}
              src={comment}
              alt="like"
            />
          )}
          <img
            style={{ cursor: "pointer", padding: "5px" }}
            width={32}
            height={32}
            src={share}
            alt="share"
          />
        </Stack>
        {openCalendar === 2 && myProfile?.type === "event" && (
          <RSVPCalendar
            loading={rsvpLoading}
            modalRef={modalRef}
            tempSelectedDate={tempSelectedDate}
            setTempSelectedDate={setTempSelectedDate}
            selectedDates={selectedDates}
            handleCancel={handleCancel}
            handleOk={handleOk}
          />
        )}
        {(!myProfile?.owned) && (
          <Button
            onClick={() => {
              if (myProfile?.type === "event") {
                setOpenCalendar(2);
              } else {
                spaceInquire ? () => spaceInquire(myProfile?.id) : () => {};
              }
            }}
            sx={{
              background: (theme) => theme.palette.button.secondary,
              color: (theme) => theme.palette.primary.main,
              fontSize: "16px",
              fontWeight: 600,
              width: { xs: "100%", sm: "222px" },
              height: "31px",
              textTransform: "capitalize",
              borderRadius: "3px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              "&:hover": {
                background: (theme) => theme.palette.button.secondary,
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {myProfile?.type === "space" && (
              <img src={calender} alt="Calender Icon" />
            )}
            {myProfile?.type === "brand"
              ? "Follow"
              : myProfile?.type === "event"
                ? "RSVP"
                : "Inquire"}
          </Button>
        )}
      </Stack>
      {details?.expectedPoint && (
        <Box>
          <Typography variant="h2" sx={{ fontSize: "24px", textAlign: "left", fontWeight: 600 }}>
            {details?.expectedPoint?.title}
          </Typography>
          {details?.expectedPoint?.points?.map((point) => (
            <Typography
              key={point}
              fontSize={16}
              sx={{
                textAlign: "left",
                marginTop: 2,
                fontWeight: 400,
                wordBreak: "break-word",
                "& ul, & ol": {
                  paddingLeft: 2,
                },
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                },
              }}
              dangerouslySetInnerHTML={{ __html: point }}
            />
          ))}
          {/* <ul style={{ marginLeft: "16px" }}>
            {details?.expectedPoint?.ulPoints?.map((point) => {
              const newPoints = point.split(":");
              return (
                <li style={{ marginTop: "10px" }} key={point}>
                  <Typography
                    fontSize={16}
                    sx={{
                      display: "inline",
                      textAlign: "left",
                      marginTop: 1,
                      fontWeight: 600,
                    }}
                  >
                    {newPoints[0]}:
                  </Typography>
                  <Typography
                    fontSize={16}
                    sx={{
                      display: "inline",
                      textAlign: "left",
                      marginTop: 1,
                      fontWeight: 400,
                    }}
                  >
                    {newPoints[1]}
                  </Typography>
                </li>
              );
            })}
          </ul> */}
        </Box>
      )}
      {details?.otherPoints && (
        <Box component="article">
          <Typography
            variant="h3"
            sx={{ fontSize: "20px", textAlign: "left", fontWeight: 600 }}
          >
            {details?.otherPoints?.title}
          </Typography>
          {details?.otherPoints?.points?.map((point) => (
            <Typography
              key={point}
              fontSize={16}
              sx={{ textAlign: "left", marginTop: 1, fontWeight: 400 }}
            >
              {point}
            </Typography>
          ))}
        </Box>
      )}
      {details?.overviewImage && (
        <figure style={{ width: "100%", height: "100%" }} role="overview-image" aria-labelledby="overview-image-figcaption">
          <img
            style={{
              borderRadius: "5px",
              margin: "16px 0",
              width: "100%",
              height: "300px",
              objectFit: "cover",
            }}
            src={details?.overviewImage}
            alt="overview-image"
          />
        </figure>
      )}
      {details?.otherPoints2 && (
        <Box component="article">
          <Typography
            variant="h3"
            sx={{ fontSize: "20px", textAlign: "left", fontWeight: 600 }}
          >
            {details?.otherPoints2?.title}
          </Typography>
          {details?.otherPoints2?.points?.map((point) => (
            <Typography
              key={point}
              fontSize={16}
              sx={{ textAlign: "left", marginTop: 1, fontWeight: 400 }}
            >
              {point}
            </Typography>
          ))}
        </Box>
      )}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        paddingTop={2}
        gap={1}
        sx={{ position: "relative" }}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          gap={1}
        >
          <img
            style={{
              padding: "5px",
              cursor: isLoading ? "not-allowed" : "pointer",
              animation: isLoading ? "pulse 1s infinite" : "none",
              opacity: isLoading ? 0.5 : 1,
            }}
            width={32}
            height={32}
            onClick={() => {
              if (!isLoading) {
                likeFunc({
                  entityId: myProfile?.id,
                  entityType: myProfile?.type?.toLocaleUpperCase(),
                }).then((res) => {
                  res?.data?.status &&
                    toast.success(
                      res?.data?.message
                        .replace("Entity", "Post")
                        .replace(" successfully", "")
                    );
                  setLikePost(!likePost);
                });
              }
            }}
            src={likePost ? liked : like}
            className={`like-icon ${isLoading ? "loading" : ""}`}
            alt="like"
          />
          {myProfile.type !== "space" && !myProfile?.owned && (
            <img
              style={{ cursor: "pointer", padding: "5px" }}
              width={32}
              height={32}
              src={comment}
              alt="like"
            />
          )}
          <img
            style={{ cursor: "pointer", padding: "5px" }}
            width={32}
            height={32}
            src={share}
            alt="share"
          />
        </Stack>
        {openCalendar === 1 && myProfile?.type === "event" && (
          <RSVPCalendar
            loading={rsvpLoading}
            modalRef={modalRef}
            tempSelectedDate={tempSelectedDate}
            setTempSelectedDate={setTempSelectedDate}
            selectedDates={selectedDates}
            handleCancel={handleCancel}
            handleOk={handleOk}
          />
        )}
        {(!myProfile?.owned) && (
          <Button
            onClick={() => {
              if (myProfile?.type === "event") {
                setOpenCalendar(1);
              } else {
                spaceInquire ? () => spaceInquire(myProfile?.id) : () => {};
              }
            }}
            sx={{
              background: (theme) => theme.palette.button.secondary,
              color: (theme) => theme.palette.primary.main,
              fontSize: "16px",
              fontWeight: 600,
              width: { xs: "100%", sm: "222px" },
              height: "31px",
              textTransform: "capitalize",
              borderRadius: "3px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              "&:hover": {
                background: (theme) => theme.palette.button.secondary,
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {myProfile?.type === "space" && (
              <img src={calender} alt="Calender Icon" />
            )}
            {myProfile?.type === "brand"
              ? "Follow"
              : myProfile?.type === "event"
                ? "RSVP"
                : "Inquire"}
          </Button>
        )}
      </Stack>
      <ReusableModal open={openMapModal} handleClose={() => setMapModal(false)} heading={"Select Location"}>
        <MapModal activity={activity === "/event" ? "event" : activity === "/brand" ? "brand" : "space"} disabled={true} addressLine={"Selected Address:"} address={"123 Williamsburg Ave, Brooklyn, NY 11211"} handleClose={() => setMapModal(false)} buttonVal={"Select"} initialPosition={[details?.mapLocation?.lat, details?.mapLocation?.long]} instructionValue={details?.mapLocation?.additional} />
      </ReusableModal>
    </Box>
  );
};

export default Details;
