import { Box, LinearProgress } from "@mui/material";
import { BrandCard, OutlinedTabs, ProfileAboutSection, ProfileCard, ProfileEvents, ProfileSpaces } from "../../../components";
import { profileContent } from "../../../constant";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserProfileQuery } from "../../../services/user";
import dayjs from "dayjs";
import { useGetAllBrandsQuery } from "../../../services/brands";
import { useGetAllEventsQuery } from "../../../services/events";

const Profile = () => {
  const [profileData, setProfileData] = useState(profileContent)
  const { events } = useSelector((state) => state.event);
  const { data, isLoading, isSuccess, isError, error, isFetching } = useGetUserProfileQuery({}, { refetchOnFocus: true, refetchOnMountOrArgChange: true })
  const [brands, setBrands] = useState([])
  const [myEvents, setMyEvents] = useState([])

  const [currentIndex, setCurrentIndex] = useState(0);
  const [forceRender, setForceRender] = useState(false);

  const { data: brandData, isError: isBrandError, isLoading: isBrandLoading, isSuccess: isBrandSuccess, error: brandError, isFetching: isBrandFetching } =
    useGetAllBrandsQuery(
      { pageSize: 100 },
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  const { data: eventData, isError: isEventError, isLoading: isEventLoading, isSuccess: isEventSuccess, error: eventError, isFetching: isEventFetchhing } =
    useGetAllEventsQuery(
      { pageSize: 100, tab: "Group" },
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  useEffect(() => {
    if (isBrandSuccess) {
      const brands = brandData?.data?.groupedBrands?.allBrands?.map((item) => ({
        profileImage: item?.brandImage,
        brandName: item?.brandName,
        brandCategory: item?.brandCategory?.map(category => category.name) || [],
        description: item?.details?.description,
        id: item?.id,
        brandImage: item?.coverImages[0]?.url
      }));

      setBrands(brands)
    }
  }, [isBrandSuccess, brandData]);

  useEffect(() => {
    if (isEventSuccess) {
      const eventsData = eventData?.data?.groupedEvents?.allEvents?.map((item) => ({
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
          by: item?.user?.name,
          starting: dayjs.utc(item?.eventDate?.[0]?.startDate).add(1, "day").startOf("day").local().format("DD.MM.YYYY"),
          RSVP: item?.rsvpCount
        }
      }));

      setMyEvents(eventsData)
    }
  }, [isEventSuccess, eventData]);

  const [myProfileData, setMyProfileData] = useState({
    cover: [],
    profile: null,
    profileName: "",
    profileAbout: "",
    profileStats: []
  })

  useEffect(() => {
    if (isSuccess && data) {
      setMyProfileData({
        cover: data?.data?.coverImages,
        profile: data?.data?.profileImage,
        profileName: data?.data?.name,
        profileAbout: data?.data?.about?.about,
        profileStats: [
          {
            name: "Brands:",
            value: data?.data?.brandsCount
          },
          {
            name: "Events:",
            value: data?.data?.eventsCount
          },
          {
            name: "Spaces:",
            value: data?.data?.spacesCount
          },
          {
            name: "Member since:",
            value: dayjs(data?.data?.createdAt).format("MM.YYYY.")
          }
        ]
      });

      setForceRender((prev) => !prev);
    }
  }, [isSuccess, data]);

  const HandleSlideChange = (index) => {
    if (index >= 0 && index <= brandData.cover.length) {
      setCurrentIndex(index);
    }
  };

  const profileTabs = [
    {
      label: profileData[0].tabs[0],
      component: <ProfileAboutSection content={myProfileData?.profileAbout} />
    },
    {
      label: profileData[0].tabs[1],
      component: <BrandCard items={brands} filter1={"All"} filter2={"Published"} filter3={"Draft"} />
    },
    {
      label: profileData[0].tabs[2],
      component: <ProfileEvents filter1={"All"} filter2={"Upcoming"} filter3={"Past"} cardsData={myEvents} />
    },
    {
      label: profileData[0].tabs[3],
      component: <ProfileSpaces cardsData={profileData[0].spaceSection} filter1={"All"} filter2={"Upcoming"} filter3={"Past"} />
    },

  ]
  if (isLoading || isFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }
  return (
    <Box
      sx={{
        marginTop: { xs: "0px", md: "90px" },
        display: "flex",
        rowGap: "20px",
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: "5px",
        marginBottom: "40px"
      }}
    >
      <ProfileCard
        userProfileImg={myProfileData?.profile}
        userName={myProfileData?.profileName}
        editImage={
          myProfileData.cover[currentIndex]?.url
            ?
            myProfileData.cover[currentIndex]?.url
            :
            myProfileData.cover[currentIndex] ?
              URL.createObjectURL(myProfileData.cover[currentIndex])
              :
              null
        }
        cover={myProfileData?.cover}
        HandleSlideChange={HandleSlideChange}
        currentIndex={currentIndex}
        profileStats={myProfileData?.profileStats}
      />
      <OutlinedTabs key={forceRender} tabs={profileTabs} />
    </Box>
  );
};

export default Profile;
