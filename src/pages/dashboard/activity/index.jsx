import { Box, Grid } from "@mui/material";
import { eventMain, eventActivityImage, eventUserImage, spaceActivityImage, spaceUserImage, spaceMain, brandMain, brandUserImage, brandActivityImage } from "../../../assets";
import { ActivityCard } from "../../../components";
import { spaceFeatures } from "../../../constant";

const Activity = () => {
  return (
    <>

      <Grid container sx={{ display: 'flex', justifyContent: "space-between" }} spacing={{ xs: 1, lg: 0 }}>
        <Grid
          item
          xs={12}
          lg={8}
          sx={{
            pb: "10px",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "12px"
          }}
        >
          <ActivityCard
            activity={"event"}
            mainImage={eventMain}
            userName={"EcoLux Designs"}
            activityName={"Ecolux Chic Pop-Up"}
            activityMaker={"Sustainable Fashion"}
            content={[
              "A limited-time clothing pop-up store featuring EcoLux Designs' latest collection of eco-friendly luxury fashion.",
              "Shoppers can explore exclusive, high-end pieces crafted from organic and recycled materials, combining sustainability with modern style.",
              "The event will also include workshops on sustainable fashion and personal styling sessions."
            ]}
            activityLocation={"Urban Pop-Up Studio 3B"}
            activityLocation2={"Urban Pop-Up Pavilion"}
            activityAddress={"123 Williamsburg Ave, Brooklyn, NY 11211"}
            value={"28.02.2025."}
            deadline={"until 15.4.2025."}
            userImage={eventUserImage}
            activityImage={eventActivityImage}
            userRole={"event"}
          />
          <ActivityCard
            activity={"space"}
            mainImage={spaceMain}
            userName={"EcoLux Designs"}
            activityName={"Ecolux Chic Pop-Up"}
            activityMaker={"Sustainable Fashion"}
            content={[
              "Urban Pop-Up Studio 3B is an 800 sq. ft. venue, designed for intimate retail pop-ups, small art installations, or product launches.",
              "With natural lighting, flexible space, Wi-Fi, and security services, it’s perfect for brands looking to host a smaller, impactful event.",
            ]}
            activityLocation={"Urban Pop-Up Pavilion"}
            activityAddress={"123 Williamsburg Ave, Brooklyn, NY 11211"}
            value={"$200/day"}
            deadline={"miniumum lease: 7 days"}
            userImage={spaceUserImage}
            activityImage={spaceActivityImage}
            features={spaceFeatures}
            userRole={"brand"}
          />
          <ActivityCard
            activity={"brand"}
            userName={"Emily Thompson"}
            userImage={brandUserImage}
            mainImage={brandMain}
            activityImage={brandActivityImage}
            activityName={"EcoLux Designs"}
            activityMaker={"Sustainable Fashion"}
            content={["EcoLux Designs is a sustainable fashion brand that merges luxury with eco-friendly materials. It specializes in creating high-end clothing and accessories made from organic and recycled materials."]}
            userRole={"account"}
          />

        </Grid>
        <Grid
          item
          xs={12}
          lg={3}
          sx={{
            height: "70vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
          <Box
            sx={{
              background: "white",
              height: "49%",
              width: "100%"
            }}
          ></Box>
          <Box
            sx={{
              background: "white",
              height: "49%",
              width: "100%"
            }}
          ></Box>
        </Grid>
      </Grid>


    </>
  );
};

export default Activity;
