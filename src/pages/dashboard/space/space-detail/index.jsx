import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BESProfile } from "../../../../components";
import SpaceInquireModal from "./space-inquire-modal";
import { useGetAllSpaceQuery } from "../../../../services/space";
import { useParams } from "react-router-dom";
import { spaceMain3 } from "../../../../assets";
import { updateSpace } from "../../../../store/slices/space";
import { spaceFeatures } from "../../../../constant";
import { Box, LinearProgress } from "@mui/material";

const SpaceDetails = () => {
  const { id: spaceId } = useParams()
  const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllSpaceQuery({ page: 1, pageSize: 7, id: spaceId }, { refetchOnMountOrArgChange: true });

  const dispatch = useDispatch()

  useEffect(() => {
    if (isSuccess) {
      const amenities = data?.data?.amenity?.map((item) => ({
        description: item?.name,
        icon: item?.iconUrl
      }))
      const updatedSpace = {
        id: data?.data?.id,
        type: "space",
        owned: true,
        slides: data?.data?.coverImages,
        profilePic: data?.data?.spaceImage,
        profileName: data?.data?.spaceName,
        category: data?.data?.spaceCategory,
        details: {
          by: data?.data?.user?.name,
          saved: "789k",
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
                location: "123 Williamsburg Ave, Brooklyn, NY 11211",
                space: data?.data?.spaceName,
                spaceCategory: data?.data?.spaceCategory?.map(item => item.name),
                startingDate: "28.02.2025.",
                endingDate: "15.4.2025.",
                expectedPoint: {
                  title: "What to Expect:",
                  points: [data?.data?.details?.htmlContent || ""],
                },
                mapLocation: { lat: data?.data?.location?.lat, long: data?.data?.location?.long, additional: data?.data?.location?.additional }
              },
            },
          },
          {
            label: "Stats",
            props: null,
          },
          {
            label: "Teenacy",
            props: {
              teenacy: [
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
                {
                  tenat: "EcoLux Designs",
                  event: "Ecolux Chic Pop-Up",
                  by: "Emily Thompson",
                  message:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi.",
                  starting: "28.02.2025.",
                  ending: "15.04.2025.",
                  leaseAmount: 2000,
                },
              ],
            },
          },
          {
            label: "Reviews",
            props: null,
          },
        ],
      }
      dispatch(updateSpace([updatedSpace]));
    }
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
      />
    </>
  );
};

export default SpaceDetails;
