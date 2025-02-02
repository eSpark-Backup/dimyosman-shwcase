import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, CircularProgress, Grid, LinearProgress } from "@mui/material";

import { ActivityCard } from "../../../components";
import Filters from "../../../components/Filters";
import SpaceInquireModal from "../../../components/SpaceInquireModal";

import { keysForBrandsSapcesEvents } from "../../../utils";

import { useGetGeneralSearchQuery } from "../../../services/general";

import { setAllLocations, setPageNumber } from "../../../store/slices/search";

const Search = () => {
  const dispatch = useDispatch();

  const { parameters, skip, page } = useSelector((state) => state.search);

  const pageSize = 7;
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const [loadingStart, setLoadingStart] = useState(false);
  const [openInquiryModal, setOpenInquiryModal] = useState(false);
  const [inquiredDetail, setInquiredDetail] = useState({});
  const [saveAllSpaces, setSaveAllSpaces] = useState([]);

  const {
    data: searchedData,
    isSuccess,
    isLoading,
    isFetching,
  } = useGetGeneralSearchQuery(
    { page, pageSize, parameters },
    { skip, refetchOnMountOrArgChange: skip ? false : true }
  );

  const [data, setData] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      if (!skip && searchedData?.data) {
        let updatedData = [];
        const getObject = searchedData?.data;

        if (getObject?.brands?.length) {
          updatedData = [
            ...updatedData,
            ...getObject.brands.map(makeBrandsData),
          ];
        }

        if (getObject?.events?.length) {
          updatedData = [
            ...updatedData,
            ...getObject.events.map((event) =>
              keysForBrandsSapcesEvents(event, "event")
            ),
          ];
        }

        if (getObject?.spaces?.length) {
          updatedData = [
            ...updatedData,
            ...getObject.spaces.map((space) =>
              keysForBrandsSapcesEvents(space, "space")
            ),
          ];

          const mergedSapcesData = [...saveAllSpaces, ...getObject?.spaces].filter(
            (item, index, self) =>
              index === self.findIndex((t) => t?.id === item?.id)
          );
          setSaveAllSpaces(mergedSapcesData);
        }

        updatedData?.sort((a, b) => {
          const dateA = new Date(a?.createdAt);
          const dateB = new Date(b?.createdAt);
          return dateB - dateA;
        });

        if (page === 1) {
          setData(updatedData);

          const locations = updatedData?.map((loc) => loc.location)?.flat();
          dispatch(setAllLocations(locations));
        } else {
          const mergedData = [...data, ...updatedData].filter(
            (item, index, self) =>
              index === self.findIndex((t) => t?.id === item?.id)
          );

          const locations = mergedData?.map((loc) => loc.location)?.flat();
          dispatch(setAllLocations(locations));

          setData(mergedData);
        }

        setHasMore(
          searchedData?.data?.pagination?.currentPage <
            searchedData?.data?.pagination?.totalPages
        );
        setLoadingStart(false);
      } else {
        setData([]);
      }
      setHasFetchedData(true);
    }
  }, [searchedData?.data, isSuccess, isLoading, isFetching, skip, parameters]);

  useEffect(() => {
    if (
      !hasMore ||
      skip ||
      isFetching ||
      page === searchedData?.data?.pagination?.totalPages
    )
      return;

    setLoadingStart(true);

    let timeoutId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!isFetching) {
            timeoutId = setTimeout(() => {
              // setPage((prevPage) => prevPage + 1);
              dispatch(setPageNumber(page + 1));
            }, 300);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasMore, skip, isFetching, data.length]);

  const makeBrandsData = (el) => {
    const coverArray =
      el?.coverImages?.map((imageItem) => imageItem?.url || "") || [];

    return {
      isFavourite: el?.isFavourite,
      id: el?.id,
      brandId: el?.id,
      activity: "brand",
      userName: el?.user?.name,
      userImage: el?.user?.profileImage || "",
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

  if (page === 1 && (isLoading || isFetching)) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
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
          {!skip && data.length === 0 && hasFetchedData ? (
            <Box sx={{ width: "100%" }}>
              <h1>No Results Found</h1>
            </Box>
          ) : data?.length ? (
            data?.map((item, index) => {
              return (
                <ActivityCard
                  key={index}
                  fullItem={item}
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
                  search={true}
                  isFavourite={item?.isFavourite}
                  rsvpDates={item?.rsvpDates}
                  startDate={item?.startDate}
                  endDate={item?.endDate}
                  handleAction={(fullItem) => {
                    if(fullItem?.activity === "space"){
                      const detail = saveAllSpaces?.find(
                        (spc) => spc.id === fullItem.id
                      );

                      setInquiredDetail(detail);
                      setOpenInquiryModal(true);
                    }
                  }}
                />
              );
            })
          ) : skip === true && data.length === 0 ? (
            <Box sx={{ width: "100%" }}>
              <h1>Please Select Filters</h1>
            </Box>
          ) : null}

          {data?.length > 0 && hasMore && (
            <div
              ref={observerRef}
              style={{ minHeight: 10, textAlign: "center" }}
            >
              {loadingStart && <CircularProgress />}
            </div>
          )}
        </Grid>

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
            allDataLocation={data?.map((loc) => loc.location)?.flat()}
            setHasMore={setHasMore}
            setLoadingStart={setLoadingStart}
            setData={setData}
            data={data}
            loadingStart={isFetching || isLoading}
          />
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

export default Search;
