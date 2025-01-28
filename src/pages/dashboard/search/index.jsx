import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Box, Grid, LinearProgress } from "@mui/material";

import { ActivityCard } from "../../../components";
import Filters from "../../../components/Filters";

import { keysForBrandsSapcesEvents } from "../../../utils";

import { useGetGeneralSearchQuery } from "../../../services/general";

const Search = () => {
  const { parameters, skip } = useSelector((state) => state.search);
  const { user } = useSelector((state) => state.auth);

  const {
    data: searchedData,
    isSuccess,
    isLoading,
    isFetching,
  } = useGetGeneralSearchQuery(
    { parameters },
    { skip, refetchOnMountOrArgChange: skip ? false : true }
  );

  const [data, setData] = useState(null);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      if (!skip && searchedData?.data) {
        let updatedData = [];
        const getObject = searchedData?.data;

        if (getObject?.events?.length) {
          const onlyEventData = getObject?.events?.map((event) => {
            return keysForBrandsSapcesEvents(event, "event");
          });

          updatedData = [...updatedData, ...onlyEventData];
        }

        if (getObject?.spaces?.length) {
          const onlySpaceData = getObject?.spaces?.map((space) => {
            
            return space?.brandName
              ? makeBrandsData(space)
              : keysForBrandsSapcesEvents(space, "space");
          });

          updatedData = [...updatedData, ...onlySpaceData];
        }

        setData(updatedData);
      } else {
        setData([]);
      }
      setHasFetchedData(true);
    }
  }, [searchedData?.data, isSuccess, isLoading, isFetching, skip, parameters]);

  const makeBrandsData = (el) => {
    const coverArray =
      el?.coverImages?.map((imageItem) => imageItem?.url || "") || [];

    return {
      brandId: el?.id,
      activity: "brand",
      userName: "user name",
      userImage: user?.profileImage ? user.profileImage : "",
      activityImage: el?.brandImage || "",
      activityName: el?.brandName || "",
      activityMaker:
        el?.brandCategory?.map((item) => item.name).join(",") || "",
      content: [el?.details?.description || ""],
      userRole: "profile",
      slides: coverArray,
      location: el?.location || [],
    };
  };

  if(isLoading || isFetching){
    return (
      <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
    )
  }

  return (
    <>
      <Grid
        container
        sx={{ display: "flex", justifyContent: "space-between" }}
        spacing={2}
      >
        <Grid
          item
          xs={12}
          lg={7}
          sx={{
            maxWidth: "1080px !important",
            margin: { xs: "0", xl: "0  auto !important" },
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "12px",
          }}
        >
          {!skip && data !== null && data.length === 0 && hasFetchedData ? (
            <Box sx={{ width: "100%" }}>
              <h1>No Results Found</h1>
            </Box>
          ) : data?.length ? (
            data?.map((item, index) => (
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
            ))
          ) : skip === true && data === null ? (
            <Box sx={{ width: "100%" }}>
              <h1>Please Select Filters</h1>
            </Box>
          ) : null}
        </Grid>

        <Grid
          item
          xs={12}
          lg={5}
          sx={{
            maxWidth: "1080px !important",
            maxHeight: "calc(100vh - 100px)",
            overflow: "hidden",
            display: { xs: "none", lg: "flex" },
          }}
        >
          <Filters
            allDataLocation={data?.map((loc) => loc.location)?.flat()}
            loadLocation={isLoading || isFetching}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Search;
