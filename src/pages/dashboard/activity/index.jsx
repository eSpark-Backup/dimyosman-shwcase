import { Box, Grid, LinearProgress } from "@mui/material";
import { ActivityCard } from "../../../components";
import { activityItems } from "../../../constant";
import { useGetActivityDataQuery } from "../../../services/activity";
import { useEffect, useState } from "react";

const Activity = () => {
  const { data, isSuccess, isError, error, isLoading, isFetching } = useGetActivityDataQuery({
    page: 1, pageSize: 10
  }, { refetchOnMountOrArgChange: true })

  const [activityData, setActivityData] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      if (data?.data) {
        const updatedData = data.data.spaces?.map((item) => {
          const filterPrice = item?.pricing?.filter((pricingItem) => pricingItem?.term === "Day") || [];
          const spaceFeatures = item?.amenity?.map((amenityItem) => ({
            icon: amenityItem?.iconUrl || "",
            description: amenityItem?.name || ""
          })) || [];
          const coverArray = item?.coverImages?.map((imageItem) => imageItem?.url || "") || [];
        
          return {
            profileId: 2,
            activity: "space",
            spaceId: item?.id || "",
            userName: item?.brand?.brandName || "",
            activityName: item?.spaceName || "",
            activityMaker: item?.brand?.brandName || "",
            content: [item?.details?.description || ""],
            activityLocation: item?.brand?.brandName || "",
            activityAddress: "123 Williamsburg Ave, Brooklyn, NY 11211",
            value: filterPrice[0]?.price ? `$${filterPrice[0]?.price}/day` : "N/A",
            deadline: filterPrice[0]?.minimum ? `minimum lease: ${filterPrice[0]?.minimum} days` : "N/A",
            userImage: item?.brand?.brandImage || "",
            activityImage: item?.spaceImage || "",
            features: spaceFeatures,
            userRole: "brand",
            slides: coverArray
          };
        }) || [];
        setActivityData(updatedData);
      } else {
        setActivityData([]);
      }
      setHasFetchedData(true); 
    }
  }, [isSuccess, data]);
  

  if (isLoading || isFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }

  if (hasFetchedData && activityData?.length === 0) {
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
              key={index}
              id={item?.profileId}
              activityId={
                item?.activity === "event"
                  ? item?.eventId
                  : item?.activity === "space"
                    ? item?.spaceId
                    : item?.brandId
              }
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
            />
          ))}
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


    </>
  );
};

export default Activity;
