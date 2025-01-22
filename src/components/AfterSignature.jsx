import { Box, Stack, Typography, useTheme } from "@mui/material";

import ActivityType from "./Message/ActivityType";

import { close } from "../assets";

const AfterSignature = ({
  image,
  alt,
  activity,
  TopHeading,
  name,
  brandName,
  handleClose,
  upperPara,
  lowerPara,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        padding: "16px",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(209, 219, 215, 0.5)",
        boxShadow: "0px 0px 20px rgba(0, 20, 28, 0.2)",
        borderRadius: "5px",
        position: "relative",
      }}
    >
      <Box>
        <Stack flexDirection="row" alignItems="center">
          <Box
            sx={{
              width: "64px",
              height: "64px",
              border: "1px solid rgba(209, 219, 215, 0.4)",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            <img
              src={image}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />

            <ActivityType type={activity} theme={theme} />
          </Box>

          <Box sx={{ ml: 2 }}>
            <TopHeading name={name} size="24px" />
            <TopHeading name={brandName} size="12px" my={0.5} />
          </Box>
        </Stack>

        <img
          src={close}
          alt="Close Icon"
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "16px",
            top: "16px",
            width: "24px",
          }}
          onClick={handleClose}
        />
      </Box>

      <Box my={"28px"} textAlign="center">
        <Typography>{upperPara}</Typography>
        <Typography>{lowerPara}</Typography>
      </Box>

      <Box textAlign="center">
        <TopHeading name="Thank You!" size="24px" />
      </Box>
    </Box>
  );
};

export default AfterSignature;
