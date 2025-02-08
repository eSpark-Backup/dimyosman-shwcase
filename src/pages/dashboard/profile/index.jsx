import { Box, LinearProgress } from "@mui/material";
import { BrandCard, OutlinedTabs, ProfileAboutSection, ProfileCard, ProfileEvents, ProfileSpaces } from "../../../components";
import { profileContent } from "../../../constant";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserProfileQuery } from "../../../services/user";
import dayjs from "dayjs";

const Profile = () => {
  const [profileData, setProfileData] = useState(profileContent)
  const { events } = useSelector((state) => state.event);
  const { data, isLoading, isSuccess, isError, error, isFetching } = useGetUserProfileQuery({}, { refetchOnFocus: true, refetchOnMountOrArgChange: true })

  const [currentIndex, setCurrentIndex] = useState(0);
  const [forceRender, setForceRender] = useState(false);


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
            value: 1234
          },
          {
            name: "Events:",
            value: 1234
          },
          {
            name: "Spaces:",
            value: 1234
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
      component: <BrandCard items={profileData[0].brandSection} filter1={"All"} filter2={"Published"} filter3={"Draft"} />
    },
    {
      label: profileData[0].tabs[2],
      component: <ProfileEvents filter1={"All"} filter2={"Upcoming"} filter3={"Past"} cardsData={profileData[0].eventSection} />
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
