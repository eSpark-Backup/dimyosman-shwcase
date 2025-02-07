import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useInView } from "react-intersection-observer";

import moment from "moment/moment";

import { Box, Grid, Typography, LinearProgress, CircularProgress } from "@mui/material";

import { ActivityCard } from "../../../components";
import SpaceInquireModal from "../../../components/SpaceInquireModal";

import { useGetActivityDataQuery } from "../../../services/activity";
import { setActivityPageNumber, setAllActivityData, setSpaceData } from "../../../store/slices/activity";

const Activity = () => {
const dispatch = useDispatch();

const { allActivityData, activitySpaceData, page } = useSelector((state) => state.activity);

  const [total, setTotal] = useState(0);

  const { data, isSuccess, isError, error, isFetching, isLoading } = useGetActivityDataQuery({
    page, pageSize: 10
  }, { refetchOnMountOrArgChange: allActivityData?.length ? false : true })

  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [openInquiryModal, setOpenInquiryModal] = useState(false);
  const [inquiredDetail, setInquiredDetail] = useState({});
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isSuccess) {
      if (!data?.data && page === 1) {
        dispatch(setAllActivityData([]));
        setHasFetchedData(true); 
        return;
      }
      if (data?.data) {
        const updatedData = data.data.activity?.map((item) => {
          const filterPrice = item?.pricing?.filter((pricingItem) => pricingItem?.term === "Day") || [];
          const spaceFeatures = item?.amenity?.map((amenityItem) => ({
            icon: amenityItem?.iconUrl || "",
            description: amenityItem?.name || ""
          })) || [];
          const coverArray = item?.coverImages?.map((imageItem) => imageItem?.url || "") || [];
          const category = item?.type === "brand" ? item?.brandCategory : item?.type === "event" ? item?.eventCategory : item?.spaceCategory
        
          return {
            shareableLink: item?.shareableLink,
            profileId: item?.type === "brand" ? item?.user?.id : item?.brand?.id,
            activity: item?.type,
            id: item?.id || "",
            userName: item?.type === "event" ? item?.brand?.brandName : item?.type === "brand" ? item?.user?.name : item?.brand?.brandName || "",
            activityName: item?.type === "event" ? item?.eventName : item?.type === "brand" ? item?.brandName : item?.spaceName || "",
            activityMaker: category[0]?.name || "",
            content: [item?.details?.description || ""],
            activityLocation: item?.type === "event" ? item?.space?.spaceName : item?.brand?.brandName || "",
            activityLocationId: item?.type === "event" ? item?.space?.id : "",
            activityLocation2: item?.type === "event" ? item?.brand?.brandName : "",
            activityAddress: "123 Williamsburg Ave, Brooklyn, NY 11211",
            value: item?.type === "event" ? moment.utc(new Date(item?.eventDate[0]?.startDate)).add(1, 'day').format("DD.MM.YYYY.") : filterPrice[0]?.price ? `$${filterPrice[0]?.price}/day` : "N/A",
            deadline: item?.type === "event" ? moment.utc(new Date(item?.eventDate[0]?.endDate)).add(1, 'day').format("DD.MM.YYYY.") : filterPrice[0]?.minimum ? `minimum lease: ${filterPrice[0]?.minimum} days` : "N/A",
            userImage: item?.type === "event" ? item?.brand?.brandImage : item?.type === "brand" ? item?.user?.profileImage : item?.brand?.brandImage || "",
            activityImage: item?.type === "event" ? item?.eventImage : item?.type === "brand" ? item?.brandImage : item?.spaceImage || "",
            features: spaceFeatures,
            userRole: item?.type === "brand" ? "user" : item?.type === "space" ? "brand" : "brand",
            slides: coverArray,
            isFavourite: item?.isFavourite,
            rsvpDates: item.event_rsvp?.attendanceDates?.rsvpDates ? item.event_rsvp?.attendanceDates?.rsvpDates?.map(item => item.dateTime) : [],
            startDate: item?.type === "event" && item?.eventDate[0]?.startDate || "",
            endDate: item?.type === "event" && item?.eventDate[0]?.endDate || "",
          };
        }) || [];
        const mergedData = [...allActivityData, ...updatedData];

        const mergedSapcesData = [...activitySpaceData, ...data.data.activity].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.id === item?.id)
        );
  
        const uniqueData = Array.from(
          new Map(mergedData.map((item) => [item.id, item])).values()
        );
        dispatch(setAllActivityData(uniqueData));
        dispatch(setSpaceData(mergedSapcesData))
        setTotal(data?.data?.pagination?.totalItems);
      }
      setHasFetchedData(true); 
    }
  }, [isSuccess, data, page]);


  useEffect(() => {
    const scrollPosition = localStorage.getItem("scrollPosition");
    if (scrollContainerRef.current && scrollPosition) {
      scrollContainerRef.current.scrollTop = parseInt(scrollPosition, 10);
      localStorage.removeItem("scrollPosition"); 
    }
  }, []);

  const { ref, inView } = useInView({ threshold: 0.5 });
  useEffect(() => {

    if (inView && !isLoading && !isFetching && allActivityData.length < total) {
      dispatch(setActivityPageNumber(page + 1));
    }

  }, [inView, isLoading, isFetching, allActivityData.length, total]);

  const handleNavigation = () => {
    if (scrollContainerRef.current) {
      localStorage.setItem(
        "scrollPosition",
        scrollContainerRef.current.scrollTop
      );
    }
  };

  if (page === 1 && (isLoading || isFetching)) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }

  if (hasFetchedData && !isLoading && allActivityData?.length === 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <h1>No Data Found</h1>
      </Box>
    )
  }

  return (
    <>
      <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
        <Grid
          item
          xs={12}
          lg={8}
          sx={{
            // pb: "10px",
            maxWidth: "1080px !important",
            margin: { xs: "0", xl: "0  auto !important" },
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "12px",
            // border:"1px solid red"
          }}
          ref={scrollContainerRef}
        >
          {allActivityData?.map((item, index) => (
            <ActivityCard
              isFavourite={item?.isFavourite}
              key={index}
              fullItem={item}
              id={item?.profileId}
              activityId={item?.id}
              activity={item?.activity}
              userName={item?.userName}
              userImage={item?.userImage}
              mainImage={item?.mainImage}
              activityImage={item?.activityImage}
              activityName={item?.activityName}
              activityMaker={item?.activityMaker}
              content={item?.content}
              activityLocation={item?.activityLocation}
              activityLocation2={item?.activityLocation2}
              activityLocationId={item?.activityLocationId}
              activityAddress={item?.activityAddress}
              value={item?.value}
              deadline={item?.deadline}
              userRole={item?.userRole}
              slides={item?.slides}
              shareableLink={item?.shareableLink}
              features={item?.features}
              rsvpDates={item?.rsvpDates}
              startDate={item?.startDate}
              endDate={item?.endDate}
              handleNavigation={handleNavigation}
              handleAction={(fullItem) => {
                if (fullItem.activity === "space") {
                  const detail = activitySpaceData?.find(
                    (spc) => spc.id === fullItem.id
                  );
                  setInquiredDetail(detail);
                  setOpenInquiryModal(true);
                }
              }}
            />
          ))}
          <div ref={ref} style={{ minHeight: 10, textAlign: "center" }}>
            {isFetching && <CircularProgress />}
          </div>
          {!isFetching && !isLoading && allActivityData.length >= total &&
            <Typography fontWeight={700} fontSize={18} textAlign="center">
              You have seen all!
            </Typography>
          }
        </Grid>
        <Grid
          item
          xs={12}
          lg={3.8}
          sx={{
            height: "70vh",
            overflow: "hidden",
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              background: "white",
              height: "49%",
              width: "100%",
              borderRadius: "5px",
            }}
          ></Box>
          <Box
            sx={{
              background: "white",
              height: "49%",
              width: "100%",
              borderRadius: "5px",
            }}
          ></Box>
        </Grid>
      </Grid>

      <SpaceInquireModal
        open={openInquiryModal}
        handleClose={() => setOpenInquiryModal(false)}
        spaceName={inquiredDetail?.spaceName}
        brandName={inquiredDetail?.brand?.brandName}
        spaceImage={inquiredDetail?.spaceImage}
        bookedDates={inquiredDetail?.calendarEvents}
        pricing={inquiredDetail?.pricing}
        spaceId={inquiredDetail?.id}
        brandId={inquiredDetail?.brand?.id}
      />
    </>
  );
};

export default Activity;
