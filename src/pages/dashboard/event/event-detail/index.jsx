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
        if (data?.data?.space?.location?.lat && data?.data?.space?.location?.long) {
          address = await fetchAddressFromCoordinates(
            data?.data?.space?.location?.lat,
            data?.data?.space?.location?.long
          );
        }
        const updatedEvents = {
          isFavourite: data?.data?.isFavourite,
          id: data?.data?.id,
          by: 1,
          type: "event",
          owned: user?.id === data?.data?.user?.id,
          slides: data?.data?.coverImages,
          profilePic: data?.data?.eventImage,
          profileName: data?.data?.eventName,
          category: data?.data?.eventCategory || [],
          details: {
            by: "EcoLux Designs ",
            starting: dayjs(data?.data?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
            RSVP: "234566",
            saved: "789k",
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
                  startingDate: moment.utc(data?.data?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
                  endingDate: moment.utc(data?.data?.eventDate[0]?.endDate).format("DD.MM.YYYY"),
                  rsvpDates: data?.data?.event_rsvp?.attendanceDates?.rsvpDates ? data?.data?.event_rsvp?.attendanceDates?.rsvpDates?.map(item => item.dateTime) : [],
                  startDate: data?.data?.eventDate[0]?.startDate || "",
                  endDate: data?.data?.eventDate[0]?.endDate || "",
                  expectedPoint: {
                    title: "What to Expect:",
                    points: [data?.data?.details?.htmlContent || ""],
                  },
                  mapLocation: { lat: data?.data?.space?.brand?.location?.lat, long: data?.data?.space?.brand?.location?.long, additional: data?.data?.space?.brand?.location?.additional }
                },
              },
            },
            {
              label: "Stats",
              props: null,
            },
            {
              label: "Reviews",
              props: null,
            },
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
