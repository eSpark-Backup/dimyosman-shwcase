import { useDispatch, useSelector } from "react-redux";
import { BESProfile } from "../../../../components";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetAllBrandsQuery } from "../../../../services/brands";
import { updateBrands } from "../../../../store/slices/brand";
import { brandMain } from "../../../../assets";
import { Box, LinearProgress } from "@mui/material";

const BrandDetails = () => {
  const params = useParams()
  console.log(params)
  const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllBrandsQuery({ page: 1, pageSize: 7, id: params?.id }, { refetchOnMountOrArgChange: true });
  const dispatch = useDispatch()

  console.log(data)

  useEffect(() => {
    if (isSuccess) {

      const brandData = {
        id: data?.data?.id,
        type: "brand",
        owned: true,
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
                location: "123 Williamsburg Ave, Brooklyn, NY 11211",
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
  }, [isSuccess, data, dispatch])


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
