import { Box, Stack, Typography } from "@mui/material";
import { profileBadge, star } from "../../assets";

const Reviews = ({ reviews }) => {
  return (
    <Stack
      paddingY={2}
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      {reviews.map((review, ind) => {
        return (
          <Box key={ind + 1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                gap={1}
              >
                <Box sx={{ width: 48, height: 48, position: "relative" }}>
                  <img
                    width="100%"
                    height="100%"
                    src={review?.reviewerPRofile}
                    alt="profile"
                  />
                  <img
                    style={{ position: "absolute", bottom: 0, right: 0 }}
                    width={16}
                    height={16}
                    src={profileBadge}
                    alt="profile-badge"
                  />
                </Box>
                <Typography fontWeight={300} variant="h5">
                  <span style={{ fontWeight: 600 }}>
                    {review?.reviewerName}
                  </span>{" "}
                  rated{" "}
                  <span style={{ fontWeight: 600 }}>{review?.profileName}</span>
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                gap={1}
              >
                <Typography variant="h2" fontWeight={600}>
                  {review?.rating?.toFixed(1)}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  gap={1}
                >
                  {Array.from({ length: 6 }, (_, ind) => (
                    <img
                      key={ind + 4}
                      width={13}
                      height={12}
                      src={star}
                      alt="star"
                    />
                  ))}
                </Stack>
              </Stack>
            </Stack>
            <Typography
              sx={{ marginTop: "10px" }}
              textAlign="left"
              variant="h5"
              fontWeight={300}
            >
              {review?.message}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
};

export default Reviews;
