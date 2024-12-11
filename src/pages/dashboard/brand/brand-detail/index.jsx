import { useDispatch, useSelector } from "react-redux";
import { BESProfile } from "../../../../components";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetAllBrandsQuery } from "../../../../services/brands";
import { updateBrands } from "../../../../store/slices/brand";
import { brandMain } from "../../../../assets";
import { Box, LinearProgress } from "@mui/material";

const BrandDetails = () => {
  const { data, isError, isLoading, isSuccess, error } = useGetAllBrandsQuery({ page: 1, pageSize: 7 });
  console.log(data)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isSuccess) {
      const updatedBrands = data?.data?.groupedBrands?.publishedBrands.map((fetchedBrand) => ({
        id: fetchedBrand?.id,
        type: "brand",
        owned: true,
        slides: fetchedBrand?.coverImages,
        profilePic: fetchedBrand?.brandImage,
        profileName: fetchedBrand?.brandName,
        category: fetchedBrand?.brandCategory,
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
                overview: [fetchedBrand?.details?.description || ""],
                location: "123 Williamsburg Ave, Brooklyn, NY 11211",
                expectedPoint: {
                  title: "What to Expect:",
                  points: [
                    fetchedBrand?.details?.htmlContent
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
      }));

      console.log(updatedBrands)


      dispatch(updateBrands(updatedBrands));
    }
  }, [isSuccess])


  const { brands } = useSelector((state) => state.brand);
  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }
  return <BESProfile type="brand" data={brands} />;
};

export default BrandDetails;
