import { useEffect, useState } from "react";

import { Box, Grid, Typography, LinearProgress, CircularProgress } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { ActivityCard } from "../../../components";
import SpaceInquireModal from "../../../components/SpaceInquireModal";

import { useGetActivityDataQuery } from "../../../services/activity";
import moment from "moment/moment";

const Activity = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { data, isSuccess, isError, error, isFetching } = useGetActivityDataQuery({
    page, pageSize: 10
  }, { refetchOnMountOrArgChange: true })

  const [activityData, setActivityData] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [openInquiryModal, setOpenInquiryModal] = useState(false);
  const [inquiredDetail, setInquiredDetail] = useState({});
  const [saveAllActivity,setSaveAllSapces] = useState([])

  useEffect(() => {
    setIsLoading(true);
    if (isSuccess) {
      if (!data?.data && page === 1) {
        setActivityData([]);
        setHasFetchedData(true); 
        setIsLoading(false);
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
            profileId: 2,
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
            value: item?.type === "event" ? moment.utc(new Date(item?.eventDate[0]?.startDate)).format("DD.MM.YYYY.") : filterPrice[0]?.price ? `$${filterPrice[0]?.price}/day` : "N/A",
            deadline: item?.type === "event" ? moment.utc(new Date(item?.eventDate[0]?.endDate)).format("DD.MM.YYYY.") : filterPrice[0]?.minimum ? `minimum lease: ${filterPrice[0]?.minimum} days` : "N/A",
            userImage: item?.type === "event" ? item?.brand?.brandImage : item?.type === "brand" ? item?.user?.profileImage : item?.brand?.brandImage || "",
            activityImage: item?.type === "event" ? item?.eventImage : item?.type === "brand" ? item?.brandImage : item?.spaceImage || "",
            features: spaceFeatures,
            userRole: item?.type === "brand" ? "user" : item?.type === "space" ? "brand" : "brand",
            slides: coverArray,
            isFavourite: item?.isFavourite
          };
        }) || [];
        const mergedData = [...activityData, ...updatedData];

        const mergedSapcesData = [...saveAllActivity, ...data.data.activity].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.id === item?.id)
        );
  
        const uniqueData = Array.from(
          new Map(mergedData.map((item) => [item.id, item])).values()
        );
        setActivityData(uniqueData);
        setSaveAllSapces(mergedSapcesData)
        setTotal(data?.data?.pagination?.totalItems);
      }
      setHasFetchedData(true); 
      setIsLoading(false);
    }
  }, [isSuccess, data, page]);

  const { ref, inView } = useInView({ threshold: 0.5 });
  useEffect(() => {
    if (inView && !isLoading && !isFetching && activityData.length < total) {
      setPage((prev) => prev + 1);
    }
  }, [inView, isLoading, isFetching, activityData.length, total]);

  if ((isLoading && page === 1)) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }

  if (hasFetchedData && !isLoading && activityData?.length === 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <h1>No Data Found</h1>
      </Box>
    )
  }

  return (
    <>

      <Grid container sx={{ display: 'flex', justifyContent: "space-between" }}>
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
        >
          {activityData?.map((item, index) => (
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
              features={item?.features}
              handleAction={(fullItem) => {
                const detail = saveAllActivity?.find(
                  (spc) => spc.id === fullItem.id
                );
                setInquiredDetail(detail);
                setOpenInquiryModal(true);
              }}
            />
          ))}
          <div ref={ref} style={{ minHeight: 10, textAlign: "center" }}>
            {isFetching && <CircularProgress />}
          </div>
          {!isFetching && !isLoading && activityData.length >= total &&
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
          }}>
          <Box
            sx={{
              background: "white",
              height: "49%",
              width: "100%",
              borderRadius: "5px"
            }}
          ></Box>
          <Box
            sx={{
              background: "white",
              height: "49%",
              width: "100%",
              borderRadius: "5px"
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
