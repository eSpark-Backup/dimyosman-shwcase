import { useDispatch, useSelector } from "react-redux";
import { BESProfile } from "../../../../components";
import { useGetAllEventsQuery } from "../../../../services/events";
import { useEffect } from "react";
import dayjs from "dayjs";
import { Box, LinearProgress } from "@mui/material";
import { updateEvents } from "../../../../store/slices/event";
import { eventMainImage } from "../../../../assets";
import { useParams } from "react-router-dom";
import { fetchAddressFromCoordinates } from "../../../../utils";
import moment from "moment";

const EventDetails = () => {
  const { id } = useParams();
  const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllEventsQuery({ page: 1, pageSize: 7, id }, { refetchOnMountOrArgChange: true });
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchAddress = async () => {
      if (isSuccess) {
        let address = "";
        if (data?.data?.space?.brand?.location?.lat && data?.data?.space?.brand?.location?.long) {
          address = await fetchAddressFromCoordinates(
            data?.data?.space?.brand?.location?.lat,
            data?.data?.space?.brand?.location?.long
          );
        }
        const updatedEvents = {
          shareableLink: data?.data?.shareableLink,
          isFavourite: data?.data?.isFavourite,
          id: data?.data?.id,
          by: data?.data?.brand?.status === "PUBLISH" && data?.data?.brand?.id,
          type: "event",
          owned: user?.id === data?.data?.user?.id,
          slides: data?.data?.coverImages,
          profilePic: data?.data?.eventImage,
          profileName: data?.data?.eventName,
          category: data?.data?.eventCategory || [],
          details: {
            by: data?.data?.brand?.brandName ? data?.data?.brand?.brandName : "-",
            // starting: dayjs(data?.data?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
            starting: !data?.data?.eventDate ||
              !data?.data?.eventDate[0]?.startDate ||
              !dayjs(data?.data?.eventDate[0]?.startDate).isValid()
              ? "DD.MM.YYYY"
              : dayjs(data?.data?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
            RSVP: data?.data?.rsvpCount,
            saved: data?.data?.likedCount,
          },
          rating: 5,
          ratingBased: "Based on 12345 reviews from 12345 Events",
          tabs: [
            {
              label: "Details",
              props: {
                details: {
                  overview: [data?.data?.details?.description || ""],
                  location: address,
                  space: data?.data?.space?.spaceName,
                  spaceCategory: data?.data?.space?.spaceCategory?.map(item => item.name) || [],
                  startingDate: !data?.data?.eventDate ||
                    !data?.data?.eventDate[0]?.startDate ||
                    !moment(data?.data?.eventDate[0]?.startDate).isValid()
                    ? "DD.MM.YYYY"
                    : moment.utc(data?.data?.eventDate[0]?.startDate).add(1, 'day').format("DD.MM.YYYY"),
                  endingDate: !data?.data?.eventDate ||
                    !data?.data?.eventDate[0]?.endDate ||
                    !moment(data?.data?.eventDate[0]?.endDate).isValid()
                    ? "DD.MM.YYYY"
                    : moment.utc(data?.data?.eventDate[0]?.endDate).add(1, 'day').format("DD.MM.YYYY"),
                  rsvpDates: data?.data?.event_rsvp?.attendanceDates?.rsvpDates
                    ? data?.data?.event_rsvp?.attendanceDates?.rsvpDates.map(item =>
                      moment.utc(item.dateTime).add(1, 'day').format()
                    )
                    : [],
                  startDate: !data?.data?.eventDate ||
                    !data?.data?.eventDate[0]?.startDate ||
                    !moment(data?.data?.eventDate[0]?.startDate).isValid()
                    ? "DD.MM.YYYY"
                    : moment.utc(data?.data?.eventDate[0]?.startDate).add(1, 'day').format(),
                  endDate: !data?.data?.eventDate ||
                    !data?.data?.eventDate[0]?.endDate ||
                    !moment(data?.data?.eventDate[0]?.endDate).isValid()
                    ? "DD.MM.YYYY"
                    : moment.utc(data?.data?.eventDate[0]?.endDate).add(1, 'day').format(),
                  expectedPoint: {
                    title: "What to Expect:",
                    points: [data?.data?.details?.htmlContent || ""],
                  },
                  mapLocation: {
                    lat: data?.data?.space?.brand?.location?.lat,
                    long: data?.data?.space?.brand?.location?.long,
                    additional: data?.data?.space?.brand?.location?.additional,
                  },
                  status: data?.data?.status,
                },
              },
            },
            {
              label: "Stats",
              props: null,
            },
            // {
            //   label: "Reviews",
            //   props: null,
            // },
          ],
        };

        dispatch(updateEvents([updatedEvents]));
      }
    }
    fetchAddress()
  }, [isSuccess, data, dispatch])

  const { events } = useSelector((state) => state?.event);
  if (isLoading || isFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }

  return <BESProfile type="event" data={events} />;
};

export default EventDetails;
