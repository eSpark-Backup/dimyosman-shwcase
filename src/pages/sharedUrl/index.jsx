import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { BESProfile } from "../../components";

import SplashScreen from "../../layout/splash";

import { fetchAddressFromCoordinates, useQuery } from "../../utils";

import { useGetSharableLinkQuery } from "../../services/notifications";

import { fetchedBrandData } from "./brand";
import { fetchedSpaceData } from "./space";
import { fetchedEventData } from "./event";
import SpaceInquireModal from "../../components/SpaceInquireModal";

const baseUrl = window.location.origin;
const token = window.localStorage.getItem("token");

const SharedPage = () => {
  const query = useQuery();
  const data2 = encodeURIComponent(query.get("data"));

  const { data, isSuccess, isFetching, isLoading } = useGetSharableLinkQuery({
    data: data2,
  });

  const [sharedData, setSharedData] = useState({
    brand: null,
    space: null,
    event: null,
  });
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

  const sharableParentData = (data) => {
    return {
      shareableLink: data?.shareableLink,
      isFavourite: data?.isFavourite,
      id: data?.id,
      type: data?.type,
      owned: false,
      slides: data?.coverImages,
    };
  };

  const sharableTabDetailData = (data, address) => {
    return {
      overview: [data?.details?.description || ""],
      location: address,
      expectedPoint: {
        title: "What to Expect:",
        points: [data?.details?.htmlContent || ""],
      },
    };
  };

  useEffect(() => {
    if (token) {
      if(isSuccess) {
        const url = `${baseUrl}/${data?.data?.type}/${data?.data?.id}`;
        window.location.href = url;
      }
    } else {
      const singleEventData = async () => {
        if (isSuccess) {
          if (data?.data?.type === "event") {
            let address = "";
            if (
              data?.data?.space?.brand?.location?.lat &&
              data?.data?.space?.brand?.location?.long
            ) {
              address = await fetchAddressFromCoordinates(
                data?.data?.space?.brand?.location?.lat,
                data?.data?.space?.brand?.location?.long
              );
            }

            const updatedEvent = fetchedEventData(
              data?.data,
              address,
              sharableTabDetailData,
              sharableParentData
            );

            setSharedData((prevStates) => ({
              ...prevStates,
              event: updatedEvent,
            }));
          } else if (data?.data?.type === "brand") {
            let address = "";
            if (data?.data?.location?.lat && data?.data?.location?.long) {
              address = await fetchAddressFromCoordinates(
                data.data.location.lat,
                data.data.location.long
              );
            }

            const updatedBrand = fetchedBrandData(
              data?.data,
              address,
              sharableTabDetailData,
              sharableParentData
            );

            setSharedData((prevStates) => ({
              ...prevStates,
              brand: updatedBrand,
            }));
          } else if (data?.data?.type === "space") {
            let address = "";
            if (
              data?.data?.brand?.location?.lat &&
              data?.data?.brand?.location?.long
            ) {
              address = await fetchAddressFromCoordinates(
                data?.data?.brand?.location?.lat,
                data?.data?.brand?.location?.long
              );
            }

            const updatedSpace = fetchedSpaceData(
              data?.data,
              address,
              sharableTabDetailData,
              sharableParentData
            );

            setSharedData((prevStates) => ({
              ...prevStates,
              space: updatedSpace,
            }));
          }
        }
      };

      singleEventData();
    }
  }, [isSuccess, data]);

  if (
    isFetching ||
    isLoading ||
    !(sharedData?.brand || sharedData?.space || sharedData?.event)
  ) {
    return <SplashScreen />;
  }

  return (
    <Box
      sx={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 80px)",
        padding: { xs: "0px", sm: "0 0 0 105px" },
        margin: "0px auto",
        "::-webkit-scrollbar": { display: "none" },
        maxWidth: {
          xs: "100%",
          md: "80%",
          lg: "1080px",
          xl: "1280px",
        },
      }}
    >
      <BESProfile
        type={data?.data?.type}
        data={[sharedData[data?.data?.type]]}
      />
    </Box>
  );
};

export default SharedPage;
