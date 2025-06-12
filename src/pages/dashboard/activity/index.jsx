import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useInView } from "react-intersection-observer";

import {
  Box,
  Grid,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";

import { ActivityCard } from "../../../components";
import SpaceInquireModal from "../../../components/SpaceInquireModal";
import Filters from "../../../components/Filters";

import { getCookie } from "../../../utils";

import { useGetActivityDataQuery } from "../../../services/activity";
import { setActivityPageNumber } from "../../../store/slices/activity";
import useGeneralSearch from "../../../helper/useGeneralSearch";
import { fetchActivityData } from "../../../helper/fetchActivityData";
import { fetchSearchData } from "../../../helper/fetchSearchData";

const Activity = () => {
  const searchQuery = getCookie("search_query");

  const dispatch = useDispatch();

  const { search_query, generalData, parameters, allData, spaceData } =
    useSelector((state) => state.search);
  const { allActivityData, activitySpaceData, page } = useSelector(
    (state) => state.activity
  );

  const [total, setTotal] = useState(0);

  const { data, isSuccess, isError, error, isFetching, isLoading } =
    useGetActivityDataQuery(
      {
        page,
        pageSize: 10,
      },
      {
        refetchOnMountOrArgChange: searchQuery || search_query ? false : true,
      }
    );

  const { isGeneralDataLoading, isGeneralDataSuccess, isGeneralDataFetching } =
    useGeneralSearch({
      page,
      searchQuery,
    });

  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [openInquiryModal, setOpenInquiryModal] = useState(false);
  const [inquiredDetail, setInquiredDetail] = useState({});
  const scrollContainerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  const andLoadingState = () => {
    if (searchQuery || search_query) {
      return isGeneralDataLoading && isGeneralDataFetching;
    } else {
      return isLoading && isFetching;
    }
  };

  const orLoadingState = () => {
    if (searchQuery || search_query) {
      return isGeneralDataLoading || isGeneralDataFetching;
    } else {
      return isLoading || isFetching;
    }
  };

  const loadingState = () => {
    if (searchQuery || search_query) {
      return isGeneralDataLoading;
    } else {
      return isLoading;
    }
  };

  const fetchingState = () => {
    if (searchQuery || search_query) {
      return isGeneralDataFetching;
    } else {
      return isFetching;
    }
  };

  useEffect(() => {
    const handleFetch = async () => {
      if (!(searchQuery || search_query)) {
        fetchActivityData({
          dispatch,
          data,
          page,
          allActivityData,
          activitySpaceData,
          setTotal,
          setHasMore,
          setHasFetchedData,
          isSuccess,
        });
      }

      if (searchQuery || search_query) {
        fetchSearchData({
          dispatch,
          generalData,
          page,
          allData,
          spaceData,
          setTotal,
          setHasMore,
          setHasFetchedData,
          isGeneralDataSuccess,
          parameters,
        });
      }
    };

    handleFetch(); // Call the async function
  }, [page, data?.data, generalData, searchQuery, search_query, parameters]);

  useEffect(() => {
    const scrollPosition = localStorage.getItem("scrollPosition");
    if (scrollContainerRef.current && scrollPosition) {
      scrollContainerRef.current.scrollTop = parseInt(scrollPosition, 10);
      localStorage.removeItem("scrollPosition");
    }
  }, []);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (fetchingState()) return;

    if (inView && !andLoadingState()) {
      if ((searchQuery || search_query) && allData.length < total) {
        dispatch(setActivityPageNumber(page + 1));
      } else if (allActivityData.length < total) {
        dispatch(setActivityPageNumber(page + 1));
      }
    }
  }, [
    inView,
    andLoadingState(),
    allActivityData.length,
    allData.length,
    total,
    hasMore,
  ]);

  const handleNavigation = () => {
    if (scrollContainerRef.current) {
      localStorage.setItem(
        "scrollPosition",
        scrollContainerRef.current.scrollTop
      );
    }
  };

  if (page === 1 && orLoadingState()) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (
    !(searchQuery || search_query) &&
    hasFetchedData &&
    !isLoading &&
    allActivityData?.length === 0
  ) {
    return (
      <Box sx={{ width: "100%" }}>
        <h1>No Data Found</h1>
      </Box>
    );
  }

  return (
    <>
      <Grid
        container
        sx={{ display: "flex", justifyContent: "space-between" }}
        spacing={!(searchQuery || search_query) ? 0 : 2}
      >
        {hasFetchedData &&
        !isGeneralDataLoading &&
        (searchQuery || search_query) &&
        allData?.length === 0 ? (
          <Grid item xs={12} lg={7}>
            <Box sx={{ width: "100%" }}>
              <h1>No Data Found</h1>
            </Box>
          </Grid>
        ) : (
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
            {[
              ...(searchQuery || search_query ? allData : allActivityData),
            ]?.map((item, index) => (
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
                slides={item?.slides || []}
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

            {((!(searchQuery || search_query) && allActivityData?.length) ||
              ((searchQuery || search_query) && allData?.length)) &&
            hasMore ? (
              <div ref={ref} style={{ minHeight: 10, textAlign: "center" }}>
                {page !== 1 && <CircularProgress />}
              </div>
            ) : null}

            {/* {!andLoadingState() &&
              ((!(searchQuery || search_query) &&
                allActivityData?.length >= total) ||
                ((searchQuery || search_query) && allData?.length >= total)) &&
              hasFetchedData && (
                <Typography fontWeight={700} fontSize={18} textAlign="center">
                  You have seen all!
                </Typography>
              )} */}
          </Grid>
        )}
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
            <Filters loadingStart={page === 1 && (isLoading || isFetching)} />
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
