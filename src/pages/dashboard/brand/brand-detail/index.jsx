import { useDispatch, useSelector } from "react-redux";
import { BESProfile } from "../../../../components";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetAllBrandsQuery } from "../../../../services/brands";
import { updateBrands } from "../../../../store/slices/brand";
import { brandMain } from "../../../../assets";
import { Box, LinearProgress } from "@mui/material";
import { fetchAddressFromCoordinates } from "../../../../utils";
import dayjs from "dayjs";

const BrandDetails = () => {
  const params = useParams()
  const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllBrandsQuery({ page: 1, pageSize: 7, id: params?.id }, { refetchOnMountOrArgChange: true });
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchAddress = async () => {
      if (isSuccess && data?.data) {

        let address = "";
        if (data?.data?.location?.lat && data?.data?.location?.long) {
          address = await fetchAddressFromCoordinates(
            data.data.location.lat,
            data.data.location.long
          );
        }

        const eventData = data?.data?.brandEvents?.map((item) => ({
          slides: [item?.coverImages?.[0]?.url],
          profileName: item?.eventName,
          category: item?.eventCategory?.map(category => category.name) || [],
          id: item?.id,
          status: item?.eventStatus,
          tabs: [
            {
              props: {
                details: {
                  overview: item?.details?.description || null
                }
              }
            }
          ],
          details: {
            by: data?.data?.brandName,
            starting: dayjs.utc(item?.eventDate?.[0]?.startDate).add(1, "day").startOf("day").local().format("DD.MM.YYYY"),
            RSVP: item?.rsvpCount
          }
        }));


        const brandData = {
          shareableLink: data?.data?.shareableLink,
          isFollowed: data?.data?.isFollowed,
          isFavourite: data?.data?.isFavourite,
          id: data?.data?.id,
          type: "brand",
          owned: user?.id === data?.data?.user?.id,
          slides: data?.data?.coverImages,
          profilePic: data?.data?.brandImage,
          profileName: data?.data?.brandName,
          category: data?.data?.brandCategory,
          details: {
            by: data?.data?.user?.name,
            events: data?.data?.totalEventsCount,
            followers: data?.data?.followedCount,
            saved: data?.data?.likedCount,
          },
          rating: 0,
          ratingBased: "Based on 12345 reviews from 12345 Events",
          tabs: [
            {
              label: "Details",
              props: {
                details: {
                  overview: [data?.data?.details?.description || ""],
                  location: address,
                  mapLocation: { lat: data?.data?.location?.lat, long: data?.data?.location?.long, additional: data?.data?.location?.additional },
                  expectedPoint: {
                    title: "What to Expect:",
                    points: [
                      data?.data?.details?.htmlContent
                      ||
                      ""],
                  },
                },
              },
            },
            {
              label: "Events",
              props: {
                eventData
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

        dispatch(updateBrands([brandData]));
      }
    }
    fetchAddress()
  }, [isSuccess, data, dispatch, params])


  const { brands } = useSelector((state) => state.brand);
  if (isLoading || isFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }
  return <BESProfile type="brand" data={brands} />;
};

export default BrandDetails;
