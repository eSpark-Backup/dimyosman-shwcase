import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { BESProfile } from "../../components";

import SplashScreen from "../../layout/splash";

import { addHyphenToName, fetchAddressFromCoordinates, setCookie, useQuery } from "../../utils";

import { useGetSharableLinkQuery } from "../../services/notifications";

import { fetchedBrandData } from "./brand";
import { fetchedSpaceData } from "./space";
import { fetchedEventData } from "./event";
import SpaceInquireModal from "../../components/SpaceInquireModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import SharedProfile from "./profile";

const baseUrl = window.location.origin;
const token = window.localStorage.getItem("token");

const SharedPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const data2 = encodeURIComponent(query.get("data"));

  const { data, isSuccess, isFetching, isLoading, isError, error } = useGetSharableLinkQuery({
    data: data2,
  });

  const [sharedData, setSharedData] = useState({
    brand: null,
    space: null,
    event: null,
    user: null,
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

  const returnURL = (role, type, mainName) => {
    setCookie("navId", data?.data?.id);
    return`${baseUrl}/${role === "user" ? "profile" : type}/${addHyphenToName(mainName)}`;
  }

  useEffect(() => {
    if (token) {
      if(isSuccess) {
        const role = data?.data?.role;
        const type = data?.data?.type;
        const mainName = role ? data?.data?.name : type === "brand" ? data?.data?.brandName : type === "event" ? data?.data?.eventName : data?.data?.spaceName
     
        window.location.href = returnURL(role, type, mainName);
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
          } else if (data?.data?.role === "user") {
            setSharedData((prevStates) => ({
              ...prevStates,
              user: {
                id: data?.data?.id,
                cover: data?.data?.coverImages || [],
                profile: data?.data?.profileImage,
                profileName: data?.data?.name,
                profileAbout: data?.data?.about?.about,
                shareableLink: data?.data?.shareableLink,
                profileStats: [
                  {
                    name: "Brands:",
                    value: data?.data?.brandsCount || 0,
                  },
                  {
                    name: "Events:",
                    value: data?.data?.eventsCount || 0,
                  },
                  {
                    name: "Spaces:",
                    value: data?.data?.spacesCount || 0,
                  },
                  {
                    name: "Member since:",
                    value: dayjs(data?.data?.createdAt).format("MM.YYYY."),
                  },
                ],
              },
            }));
          }
        }
      };

      singleEventData();
    }
    if (error?.status === 404) {
      toast.error("You are not authorized to view this profile.");
      navigate("/auth?type=login");
    }
  }, [isSuccess, data, isError, error]);


  if (
    isFetching ||
    isLoading ||
    !(sharedData?.brand || sharedData?.space || sharedData?.event || sharedData?.user)
  ) {
    return <SplashScreen />;
  }

  return (
    <Box
      sx={{
        marginTop: "80px !important",
        overflowY: "auto",
        maxHeight: "calc(100vh - 80px)",
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
      {data?.data?.role === "user" ? (
        <SharedProfile user={sharedData?.user} />
      ) : (
        <BESProfile
          type={data?.data?.type}
          data={[sharedData[data?.data?.type]]}
        />
      )}
    </Box>
  );
};

export default SharedPage;
