import { useDispatch, useSelector } from "react-redux";
import { BESProfile } from "../../../../components";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetAllBrandsQuery } from "../../../../services/brands";
import { updateBrands } from "../../../../store/slices/brand";
import { brandMain } from "../../../../assets";
import { Box, LinearProgress } from "@mui/material";
import { fetchAddressFromCoordinates } from "../../../../utils";

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

        const brandData = {
          shareableLink: data?.data?.shareableLink,
          isFavourite: data?.data?.isFavourite,
          id: data?.data?.id,
          type: "brand",
          owned: user?.id === data?.data?.user?.id,
          slides: data?.data?.coverImages,
          profilePic: data?.data?.brandImage,
          profileName: data?.data?.brandName,
          category: data?.data?.brandCategory,
          details: {
            by: "Emily Thompson",
            events: "1234",
            followes: "234566",
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
              props: null,
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
