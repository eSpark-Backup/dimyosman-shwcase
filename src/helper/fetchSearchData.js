import moment from "moment";

import { fetchAddressFromCoordinates } from "../utils";
import {
  setAllGeneralData,
  setAllSearchData,
  setLocationStart,
  setSpaceSearchData,
} from "../store/slices/search";

export const fetchSearchData = async ({
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
}) => {
  const generalKeys = {
    BRAND: generalData?.brands,
    SPACE: generalData?.spaces,
    EVENT: generalData?.events,
  };

  if (!isGeneralDataSuccess) return;
  const updateGeneralData = generalKeys[parameters.entity]?.map((items) => {
    return { ...items, type: parameters?.entity?.toLowerCase() };
  });

  if (!updateGeneralData && page === 1) {
    dispatch(setAllSearchData([]));
    dispatch(setSpaceSearchData([]));
    dispatch(setAllGeneralData([]));
    setHasFetchedData(true);
    return;
  }

  if (updateGeneralData) {
    const updatedData = await Promise.all(
      updateGeneralData?.map(async (item) => {
        const filterPrice =
          item?.pricing?.filter((p) => p?.term === "Day") || [];
        const spaceFeatures =
          item?.amenity?.map((a) => ({
            icon: a?.iconUrl || "",
            description: a?.name || "",
          })) || [];
        const coverArray = item?.coverImages?.map((i) => i?.url || "") || [];
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
        } else if (item?.type === "space") {
          address = await fetchAddressFromCoordinates(
            item?.brand?.location?.lat,
            item?.brand?.location?.long
          );
        }

        return {
          shareableLink: item?.shareableLink,
          profileId: item?.type === "brand" ? item?.user?.id : item?.brand?.id,
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
          activityMaker: category ? category[0]?.name : "",
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
          rsvpDates:
            item?.event_rsvp?.attendanceDates?.rsvpDates?.map(
              (r) => r.dateTime
            ) || [],
          startDate: item?.eventDate?.[0]?.startDate || "",
          endDate: item?.eventDate?.[0]?.endDate || "",
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
          location:
            item?.type === "event"
              ? item?.space?.brand?.location
              : item?.type === "space"
              ? item?.brand?.location
              : item?.location,
        };
      })
    );

    dispatch(setLocationStart(false));

    if (page === 1) {
      dispatch(setAllSearchData(updatedData));
      dispatch(setSpaceSearchData(updateGeneralData));
    } else {
      const mergedData = [...allData, ...updatedData];

      if (parameters.entity === "SPACE") {
        const mergedSpacesData = [...spaceData, ...updateGeneralData].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.id === item?.id)
        );
        dispatch(setSpaceSearchData(mergedSpacesData));
      }

      const uniqueData = Array.from(
        new Map(mergedData.map((item) => [item.id, item])).values()
      );

      dispatch(setAllSearchData(uniqueData));
    }

    setTotal(generalData?.totalResults);
    setHasMore(
      generalData?.pagination?.currentPage < generalData?.pagination?.totalPages
    );
  }

  setHasFetchedData(true);
};
