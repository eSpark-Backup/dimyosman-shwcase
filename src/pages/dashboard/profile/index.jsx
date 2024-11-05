import { Box, Stack, Typography, useTheme } from "@mui/material";
import { BrandCard, EventCard, OutlinedTabs, ProfileAboutSection, ProfileCard, ProfileEvents } from "../../../components";
import { brandCardContent, profileAboutSection } from "../../../constant";
import { useSelector } from "react-redux";
import { useState } from "react";

const Profile = () => {
  const theme = useTheme()
  const [selectedChoice, setSelectedChoice] = useState(1)
  const profileTabs = [
    {
      label: "About",
      component: <ProfileAboutSection content={profileAboutSection} />
    },
    {
      label: "Brands",
      component: <BrandCard items={brandCardContent} />
    },
    {
      label: "Events",
      component: <ProfileEvents />
    },

  ]
  return (
    <Box
      sx={{
        marginTop: "120px",
        display: "flex",
        rowGap: "20px",
        flexDirection: "column",
        backgroundColor: "white"
      }}
    >
      <ProfileCard />
      <OutlinedTabs tabs={profileTabs} />
    </Box>
  );
};

export default Profile;
