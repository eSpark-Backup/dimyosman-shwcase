import { Box, Stack, Typography, useTheme } from "@mui/material";
import { profileBadge, star } from "../../assets";
import CheckBox from "../CheckBox";
import { reviews as allReviews } from "../../constant";

const Reviews = ({ reviews, showApproveBox, onApproveChange }) => {
  const theme = useTheme();
  const myReviews = (reviews && reviews.length > 0) ? reviews : allReviews
  const handleCheckboxChange = (ind) => (event) => {
    const isChecked = event.target.checked;
    onApproveChange(ind, isChecked);
  };
  
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      {myReviews.map((review, ind) => (
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
              <Typography fontWeight={400} variant="h5">
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
              <Typography variant="h2" fontSize={24} fontWeight={600}>
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
            sx={{ marginTop: "10px", color: theme.palette.primary.main }}
            textAlign="left"
            variant="h5"
            fontWeight={350}
          >
            {review?.message}
          </Typography>
          {showApproveBox && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: "5px"
              }}
            >
              <Box
                sx={{
                  height: "40px",
                  width: "243px",
                  border: "1px dashed rgb(0, 20, 28, 0.4)",
                  backgroundColor: "rgb(209, 219, 215, 0.2)",
                  borderRadius: "3px",
                  px: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ textAlign: "left", fontWeight: "600", color: theme.palette.primary.main }}
                >
                  Review approved?
                </Typography>
                <CheckBox
                  checked={review.approved}
                  onChange={handleCheckboxChange(ind)}
                />
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default Reviews;
