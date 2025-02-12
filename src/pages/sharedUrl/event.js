import dayjs from "dayjs";
import moment from "moment";

export const fetchedEventData = (
  data,
  address,
  sharableTabDetailData,
  sharableParentData
) => {
  return {
    ...sharableParentData(data),
    by: 1,
    profilePic: data?.eventImage,
    profileName: data?.eventName,
    category: data?.eventCategory || [],
    details: {
      by: data?.brand?.brandName,
      starting: dayjs(data?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
      RSVP: data?.rsvpCount,
      saved: data?.likedCount,
    },
    rating: 5,
    ratingBased: "Based on 12345 reviews from 12345 Events",
    tabs: [
      {
        label: "Details",
        props: {
          details: {
            ...sharableTabDetailData(data, address),
            space: data?.space?.spaceName,
            spaceCategory:
              data?.space?.spaceCategory?.map((item) => item.name) || [],
            startingDate: moment
              .utc(data?.eventDate[0]?.startDate)
              .add(1, "day")
              .format("DD.MM.YYYY"),
            endingDate: moment
              .utc(data?.eventDate[0]?.endDate)
              .add(1, "day")
              .format("DD.MM.YYYY"),
            rsvpDates: data?.event_rsvp?.attendanceDates?.rsvpDates
              ? data?.event_rsvp?.attendanceDates?.rsvpDates.map((item) =>
                  moment.utc(item.dateTime).add(1, "day").format()
                )
              : [],
            startDate: moment
              .utc(data?.eventDate[0]?.startDate)
              .add(1, "day")
              .format(),
            endDate: moment
              .utc(data?.eventDate[0]?.endDate)
              .add(1, "day")
              .format(),
            mapLocation: {
              lat: data?.space?.brand?.location?.lat,
              long: data?.space?.brand?.location?.long,
              additional: data?.space?.brand?.location?.additional,
            },
          },
        },
      },
      {
        label: "Stats",
        props: null,
      },
    ],
  };
};
