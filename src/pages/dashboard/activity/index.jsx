import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useInView } from "react-intersection-observer";

import moment from "moment/moment";

import { Box, Grid, Typography, LinearProgress, CircularProgress } from "@mui/material";

import { ActivityCard } from "../../../components";
import SpaceInquireModal from "../../../components/SpaceInquireModal";
import Filters from "../../../components/Filters";

import { fetchAddressFromCoordinates, getCookie } from "../../../utils";

import { useGetActivityDataQuery } from "../../../services/activity";
import { setActivityPageNumber, setAllActivityData, setSpaceData } from "../../../store/slices/activity";

const Activity = () => {
  const searchQuery = getCookie("search_query")
  
  const dispatch = useDispatch();
  
  const {search_query} = useSelector(state => state.search)
  const { allActivityData, activitySpaceData, page } = useSelector((state) => state.activity);

  const [total, setTotal] = useState(0);

  const { data, isSuccess, isError, error, isFetching, isLoading } = useGetActivityDataQuery({
    page, pageSize: 10
  }, { refetchOnMountOrArgChange: allActivityData?.length ? false : true })

  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [openInquiryModal, setOpenInquiryModal] = useState(false);
  const [inquiredDetail, setInquiredDetail] = useState({});
  const scrollContainerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isSuccess) return;

      if (!data?.data && page === 1) {
        dispatch(setAllActivityData([]));
        setHasFetchedData(true);
        return;
      }

      if (data?.data) {
        const updatedData = await Promise.all(
          data.data.activity?.map(async (item) => {
            const filterPrice =
              item?.pricing?.filter((pricingItem) => pricingItem?.term === "Day") || [];
            const spaceFeatures =
              item?.amenity?.map((amenityItem) => ({
                icon: amenityItem?.iconUrl || "",
                description: amenityItem?.name || "",
              })) || [];
            const coverArray =
              item?.coverImages?.map((imageItem) => imageItem?.url || "") || [];
            const category =
              item?.type === "brand"
                ? item?.brandCategory
                : item?.type === "event"
                  ? item?.eventCategory
                  : item?.spaceCategory;

            let address = "";
            if (item?.type === "event") {
              address = await fetchAddressFromCoordinates(
                item?.space?.brand?.location?.lat,
                item?.space?.brand?.location?.long
              );
            }
            else if (item?.type === "space") {
              address = await fetchAddressFromCoordinates(
                item?.brand?.location?.lat,
                item?.brand?.location?.long
              );
            }

            return {
              shareableLink: item?.shareableLink,
              profileId:
                item?.type === "brand" ? item?.user?.id : item?.brand?.id,
              activity: item?.type,
              id: item?.id || "",
              userName:
                item?.type === "event"
                  ? item?.brand?.brandName
                  : item?.type === "brand"
                  ? item?.user?.name
                  : item?.brand?.brandName || "",
              activityName:
                item?.type === "event"
                  ? item?.eventName
                  : item?.type === "brand"
                  ? item?.brandName
                  : item?.spaceName || "",
              activityMaker: category[0]?.name || "",
              content: [item?.details?.description || ""],
              activityLocation:
                item?.type === "event"
                  ? item?.space?.spaceName
                  : item?.brand?.brandName || "",
              activityLocationId: item?.type === "event" ? item?.space?.id : "",
              activityLocation2:
                item?.type === "event" ? item?.brand?.brandName : "",
              activityAddress: address || "",
              value:
                item?.type === "event"
                  ? moment
                    .utc(new Date(item?.eventDate[0]?.startDate))
                    .add(1, "day")
                    .format("DD.MM.YYYY.")
                  : filterPrice[0]?.price
                    ? `$${filterPrice[0]?.price}/day`
                    : "N/A",
              deadline:
                item?.type === "event"
                  ? moment
                    .utc(new Date(item?.eventDate[0]?.endDate))
                    .add(1, "day")
                    .format("DD.MM.YYYY.")
                  : filterPrice[0]?.minimum
                    ? `minimum lease: ${filterPrice[0]?.minimum} days`
                    : "N/A",
              userImage:
                item?.type === "event"
                  ? item?.brand?.brandImage
                  : item?.type === "brand"
                  ? item?.user?.profileImage
                  : item?.brand?.brandImage || "",
              activityImage:
                item?.type === "event"
                  ? item?.eventImage
                  : item?.type === "brand"
                  ? item?.brandImage
                  : item?.spaceImage || "",
              features: spaceFeatures,
              userRole:
                item?.type === "brand"
                  ? "user"
                  : item?.type === "space"
                  ? "brand"
                  : "brand",
              slides: coverArray,
              isFavourite: item?.isFavourite,
              isFollowed: item?.isFollowed,
              rsvpDates: item.event_rsvp?.attendanceDates?.rsvpDates
                ? item.event_rsvp?.attendanceDates?.rsvpDates?.map(
                    (item) => item.dateTime
                  )
                : [],
              startDate:
                (item?.type === "event" && item?.eventDate[0]?.startDate) || "",
              endDate:
                (item?.type === "event" && item?.eventDate[0]?.endDate) || "",
              isDraftedBrandOwner:
                (item?.type === "event" || item?.type === "space") &&
                item?.brand?.status === "DRAFT"
                  ? item?.brand?.user?.id
                  : null,
              publicProfile: item?.user?.profile,
              brandStatus:
                (item?.type === "event" || item?.type === "space") &&
                item?.brand?.status,
              isDraftedSpaceOwner:
                item?.type === "event" && item?.space?.status === "DRAFT"
                  ? item?.space?.user?.id
                  : null,
              spaceStatus: item?.type === "event" ? item?.space?.status : null,
              location: item?.type === "event" ? item?.space?.brand?.location : item?.type === "space" ? item?.brand?.location : item?.location
            };
          }) || []
        );

        const mergedData = [...allActivityData, ...updatedData];

        const mergedSpacesData = [...activitySpaceData, ...data.data.activity].filter(
          (item, index, self) => index === self.findIndex((t) => t?.id === item?.id)
        );

        const uniqueData = Array.from(new Map(mergedData.map((item) => [item.id, item])).values());

        dispatch(setAllActivityData(uniqueData));
        dispatch(setSpaceData(mergedSpacesData));
        setTotal(data?.data?.pagination?.totalItems);
        setHasMore(
          data?.data?.pagination?.currentPage <
          data?.data?.pagination?.totalPages
        );
      }

      setHasFetchedData(true);
    };

    fetchData(); // Call the async function
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

  }, [inView, isLoading, isFetching, allActivityData.length, total, hasMore]);

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
      <Grid
        container
        sx={{ display: "flex", justifyContent: "space-between" }}
        spacing={!(searchQuery || search_query) ? 0 : 2}
      >
        <Grid
          item
          xs={12}
          lg={!(searchQuery || search_query) ? 8 : 7}
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
              publicProfile={item?.publicProfile}
              isFollowed={item?.isFollowed}
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
              brandStatus={item?.brandStatus}
              handleNavigation={handleNavigation}
              isDraftedBrandOwner={item?.isDraftedBrandOwner}
              isDraftedSpaceOwner={item?.isDraftedSpaceOwner}
              spaceStatus={item?.spaceStatus}
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

          {allActivityData?.length && hasMore ? (
            <div ref={ref} style={{ minHeight: 10, textAlign: "center" }}>
              {page !== 1 && <CircularProgress />}
            </div>
          ) : null}

          {!isFetching &&
            !isLoading &&
            allActivityData?.length >= total &&
            hasFetchedData && (
              <Typography fontWeight={700} fontSize={18} textAlign="center">
                You have seen all!
              </Typography>
            )}
          {/* {!isFetching && !isLoading && allActivityData.length >= total &&
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          } */}
        </Grid>
        {!(searchQuery || search_query) ? (
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
        ) : (
          <Grid
            item
            xs={12}
            lg={5}
            sx={{
              maxHeight: "calc(100vh - 130px)",
              overflowY: "hidden",
              display: { xs: "none", lg: "flex" },
            }}
          >
            <Filters
              // setHasMore={setHasMore}
              // setLoadingStart={setLoadingStart}
              loadingStart={page === 1 && (isLoading || isFetching)}
            />
          </Grid>
        )}
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
