import { Box } from "@mui/material";
import { BrandCard, OutlinedTabs, ProfileAboutSection, ProfileCard, ProfileEvents, ProfileSpaces } from "../../../components";
import { profileContent } from "../../../constant";
import { useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const [profileData, setProfileData] = useState(profileContent)
  const { events } = useSelector((state) => state.event);
  const profileTabs = [
    {
      label: profileData[0].tabs[0],
      component: <ProfileAboutSection content={profileData[0].aboutSection} />
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
        userProfileImg={profileData[0].userImage}
        userName={profileData[0]?.name}
        editImage={profileData[0].bannerImage}
      />
      <OutlinedTabs tabs={profileTabs} />
    </Box>
  );
};

export default Profile;
