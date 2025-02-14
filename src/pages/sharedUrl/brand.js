import dayjs from "dayjs";
import moment from "moment";

export const fetchedBrandData = (
  data,
  address,
  sharableTabDetailData,
  sharableParentData
) => {
  const getTabProps = (eveData) => ({
    eventData: eveData || null,
  });

  const brandSpaces = data?.brandSpaces?.map((item) => {
    const dayPricing = item?.pricing?.find((priceItem) => priceItem.term === "Day");
    return {
      spacePic: item?.coverImages?.[0]?.url,
      spaceName: item?.spaceName,
      spaceAddress: item?.brand?.brandName,
      spaceDescription: item?.details?.description,
      spacePrice: dayPricing ? `$${dayPricing.price}/day` : "N/A",
      spaceDeadline: dayPricing ? `miniumum lease: ${dayPricing?.minimum} days` : "N/A",
      id: item?.id,
      status: item?.status
    }
  });

  const eventData = data?.brandEvents?.map((item) => ({
    slides: [item?.coverImages?.[0]?.url],
    profileName: item?.eventName,
    category: item?.eventCategory?.map((category) => category.name) || [],
    id: item?.id,
    eventStatus: item?.eventStatus,
    tabs: [
      {
        props: {
          details: {
            overview: item?.details?.description || null,
          },
        },
      },
    ],
    details: {
      by: data?.brandName,
      starting: dayjs
        .utc(item?.eventDate?.[0]?.startDate)
        .add(1, "day")
        .startOf("day")
        .local()
        .format("DD.MM.YYYY"),
      RSVP: item?.rsvpCount,
    },
  }));

  return {
    ...sharableParentData(data),
    profilePic: data?.brandImage,
    profileName: data?.brandName,
    category: data?.brandCategory || [],
    details: {
      by: data?.user?.name,
      events: data?.totalEventsCount,
      followes: data?.followedCount,
      saved: data?.likedCount,
    },
    rating: 0,
    ratingBased: "Based on 12345 reviews from 12345 Events",
    tabs: [
      {
        label: "Details",
        props: {
          details: {
            ...sharableTabDetailData(data, address),
            mapLocation: {
              lat: data?.location?.lat,
              long: data?.location?.long,
              additional: data?.location?.additional,
            },
          },
        },
      },
      {
        label: "Events",
        props: eventData?.length > 0 ? { eventData, isMyProfile: false } : false
      },
      {
        label: "Spaces",
        props: brandSpaces?.length > 0 ? { brandSpaces, isMyProfile: false } : false
      },
      {
        label: "Stats",
        props: null,
      },
    ],
  };
};
