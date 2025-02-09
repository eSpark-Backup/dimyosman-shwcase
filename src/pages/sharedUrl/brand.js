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

  const eventData = data?.brandEvents?.map((item) => ({
    slides: [item?.coverImages?.[0]?.url],
    profileName: item?.eventName,
    category: item?.eventCategory?.map((category) => category.name) || [],
    id: item?.id,
    status: item?.eventStatus,
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
        props: getTabProps(eventData),
      },
      {
        label: "Stats",
        props: null,
      },
    ],
  };
};
