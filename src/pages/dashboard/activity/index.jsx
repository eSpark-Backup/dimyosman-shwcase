import { Box, Grid } from "@mui/material";
import { ActivityCard } from "../../../components";
import { activityItems } from "../../../constant";

const Activity = () => {
  return (
    <>

      <Grid container sx={{ display: 'flex', justifyContent: "space-between" }}>
        <Grid
          item
          xs={12}
          lg={8}
          sx={{
            // pb: "10px",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            rowGap: "12px"
          }}
        >

          {activityItems.map((item, index) => (
            <ActivityCard
              key={index}
              id={item?.id}
              activity={item?.activity}
              userName={item?.userName}
              userImage={item?.userImage}
              mainImage={item?.mainImage}
              activityImage={item?.activityImage}
              activityName={item?.activityName}
              activityMaker={item?.activityMaker}
              content={item?.content}
              activityLocation={item?.activityLocation}
              activityLocation2={item?.activityLocation2}
              activityAddress={item?.activityAddress}
              value={item?.value}
              deadline={item?.deadline}
              userRole={item?.userRole}
              slides={item?.slides}
              features={item?.features}
            />
          ))}
        </Grid>
        <Grid
          item
          xs={12}
          lg={3}
          sx={{
            height: "70vh",
            overflow: "hidden",
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
          <Box
            sx={{
              background: "white",
              height: "49%",
              width: "100%",
              borderRadius: "5px"
            }}
          ></Box>
          <Box
            sx={{
              background: "white",
              height: "49%",
              width: "100%",
              borderRadius: "5px"
            }}
          ></Box>
        </Grid>
      </Grid>


    </>
  );
};

export default Activity;
