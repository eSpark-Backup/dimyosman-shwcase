import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import { Box, LinearProgress } from "@mui/material";
import { fetchAddressFromCoordinates } from "../../../../utils";

import SpaceInquireModal from "../../../../components/SpaceInquireModal";
import { BESProfile } from "../../../../components";

import { useGetAllSpaceQuery } from "../../../../services/space";

import { updateSpace } from "../../../../store/slices/space";

const SpaceDetails = () => {
  const { name } = useParams()
  const { state } = useLocation();
  const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllSpaceQuery({ page: 1, pageSize: 7, id: state?.id }, { refetchOnMountOrArgChange: true });
  const { user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAddress = async () => {
      if (isSuccess) {
        const filterPrice =
        data?.data?.pricing?.filter((pricingItem) => pricingItem?.term === "Day") || [];
        const amenities = data?.data?.amenity?.map((item) => ({
          description: item?.name,
          icon: item?.iconUrl
        }))
        let address = "";
        if (data?.data?.brand?.location?.lat && data?.data?.brand?.location?.long) {
          address = await fetchAddressFromCoordinates(
            data?.data?.brand?.location?.lat,
            data?.data?.brand?.location?.long
          );
        }
        const updatedSpace = {
          shareableLink: data?.data?.shareableLink,
          isFavourite: data?.data?.isFavourite,
          id: data?.data?.id,
          type: "space",
          owned: user?.id === data?.data?.user?.id ? true : false,
          slides: data?.data?.coverImages,
          profilePic: data?.data?.spaceImage,
          profileName: data?.data?.spaceName,
          category: data?.data?.spaceCategory,
          // by: data?.data?.user?.profile && data?.data?.user?.id,
          by: data?.data?.brand?.status === "PUBLISH" && data?.data?.brand?.id,
          details: {
            by: data?.data?.brand?.brandName,
            saved: data?.data?.likedCount,
          },
          rating: 5,
          ratingBased: "Based on 12345 reviews from 12345 Leases",
          tabs: [
            {
              label: "Details",
              props: {
                details: {
                  overview: [data?.data?.details?.description],
                  feature: {
                    title: "Ammenities & Features:",
                    points: amenities,
                  },
                  location: address,
                  space: data?.data?.brand?.brandName,
                  spaceCategory: data?.data?.brand?.brandCategory?.map(
                    (item) => item.name
                  ),
                  startingDate: filterPrice[0]?.price
                    ? `$${filterPrice[0]?.price}/day`
                    : "N/A",
                  endingDate: filterPrice[0]?.minimum
                    ? `minimum lease: ${filterPrice[0]?.minimum} days`
                    : "N/A",
                  expectedPoint: {
                    title: "What to Expect:",
                    points: [data?.data?.details?.htmlContent || ""],
                  },
                  mapLocation: {
                    lat: data?.data?.brand?.location?.lat,
                    long: data?.data?.brand?.location?.long,
                    additional: data?.data?.brand?.location?.additional,
                  },
                  status: data?.data?.status,
                },
              },
            },
            // {
            //   label: "Stats",
            //   props: null,
            // },
            {
              label: "Tenancy",
              props:
                data?.data?.tenantSpaceDetail?.length > 0
                  ? { tenancy: data?.data?.tenantSpaceDetail }
                  : false,
            },
            // {
            //   label: "Reviews",
            //   props: null,
            // },
          ],
        };
        dispatch(updateSpace([updatedSpace]));
      }
    }
    fetchAddress();
  }, [isSuccess, data])

  const { spaces } = useSelector((state) => state.space);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const spaceInquire = (id) => {
    setId(id);
    setOpen(true);
  };
  const handleSave = () => {
    ///save functionality
    console.log(id, "save");
    setOpen(false);
  };

  if (isLoading || isFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <>
      <BESProfile spaceInquire={spaceInquire} type="space" data={spaces} />
      <SpaceInquireModal
        open={open}
        handleClose={() => setOpen(false)}
        handleSave={handleSave}
        spaceName={data?.data?.spaceName}
        brandName={data?.data?.brand?.brandName}
        spaceImage={data?.data?.spaceImage}
        bookedDates={data?.data?.calendarEvents}
        pricing={data?.data?.pricing}
        spaceId={data?.data?.id}
        brandId={data?.data?.brand?.id}
      />
    </>
  );
};

export default SpaceDetails;
