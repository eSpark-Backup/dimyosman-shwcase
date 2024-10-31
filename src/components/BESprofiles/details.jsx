import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { comment, like, miniMap, share } from "../../assets";

const Details = ({ details, myProfile }) => {
  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{ textAlign: "left", textTransform: "capitalize" }}
          >
            {myProfile.type} Overview:
          </Typography>
          {details?.overview?.map((overview) => (
            <Typography
              key={overview}
              variant="h5"
              sx={{ textAlign: "left", marginTop: 1, fontWeight: 400 }}
            >
              {overview}
            </Typography>
          ))}
        </Box>
        <Box sx={{ marginTop: 1, width: { xs: "100%", md: "max-content" } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            {myProfile?.type === "brand" ? "Headqarters at:" : "Hosted at:"}
          </Typography>
          {myProfile?.type !== "brand" && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: "600",
                textAlign: "left",
              }}
            >
              {details?.space}
            </Typography>
          )}
          {myProfile?.type !== "brand" && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "300",
                textAlign: "left",
              }}
            >
              {details?.spaceCategory}
            </Typography>
          )}
          <Box
            sx={{
              marginTop: "6px",
              width: { xs: "100%", md: "222px" },
              height: { xs: "auto", md: "75px" },
            }}
          >
            <img width="100%" height="100%" src={miniMap} alt="map" />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "400",
              textAlign: "left",
              wordSpacing: "-1px",
              marginTop: "6px",
            }}
          >
            {details.location}
          </Typography>
          {myProfile?.type !== "brand" && (
            <>
              <Divider sx={{ marginY: 1 }} />
              <Typography
                variant="h6"
                style={{
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                Staring from:
              </Typography>
              <Typography
                variant="h1"
                style={{
                  fontWeight: "600",
                  textAlign: "left",
                  lineHeight: "140%",
                }}
              >
                {details?.startingDate}
              </Typography>
              <Typography
                variant="h6"
                style={{
                  fontWeight: "300",
                  textAlign: "left",
                }}
              >
                until {details?.endingDate}
              </Typography>
              <Divider sx={{ marginTop: 1 }} />
            </>
          )}
        </Box>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        paddingY={2}
        gap={1}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          gap={1}
        >
          <img
            style={{ cursor: "pointer", padding: "5px" }}
            width={32}
            height={32}
            src={like}
            alt="like"
          />
          {!myProfile?.owned && (
            <img
              style={{ cursor: "pointer", padding: "5px" }}
              width={32}
              height={32}
              src={comment}
              alt="like"
            />
          )}
          <img
            style={{ cursor: "pointer", padding: "5px" }}
            width={32}
            height={32}
            src={share}
            alt="share"
          />
        </Stack>
        {!myProfile?.owned && (
          <Button
            sx={{
              background: (theme) => theme.palette.button.secondary,
              color: (theme) => theme.palette.primary.main,
              fontSize: "16px",
              fontWeight: 600,
              width: { xs: "100%", sm: "222px" },
              height: "31px",
              textTransform: "capitalize",
              borderRadius: "3px",
              "&:hover": {
                background: (theme) => theme.palette.button.secondary,
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {myProfile?.type === "brand"
              ? "Follow"
              : myProfile?.type === "event"
              ? "RSVP"
              : "Inquire"}
          </Button>
        )}
      </Stack>
      {details?.expectedPoint && (
        <Box>
          <Typography variant="h3" sx={{ textAlign: "left" }}>
            What to Expect:
          </Typography>
          {details?.expectedPoint?.map((point) => (
            <Typography
              key={point}
              variant="h5"
              sx={{ textAlign: "left", marginTop: 1, fontWeight: 400 }}
            >
              {" "}
              In an industry where trends come and go, EcoLux Designs stands out
              by creating fashion with a purpose. As a trailblazer in the world
              of sustainable luxury, this brand is redefining high-end fashion
              by merging style with eco-friendly practices. Every piece in the
              EcoLux collection is crafted with the utmost care, using organic
              fabrics, recycled materials, and responsible manufacturing
              processes.
            </Typography>
          ))}
        </Box>
      )}
      {details?.overviewImage && (
        <img
          style={{ borderRadius: "5px", margin: "16px 0", width: "100%" }}
          src={details?.overviewImage}
          alt="overview-image"
        />
      )}
      <Box>
        <Typography variant="h3" sx={{ fontSize: "20px", textAlign: "left" }}>
          {details?.otherPoints?.title}
        </Typography>
        {details?.otherPoints?.points?.map((point) => (
          <Typography
            key={point}
            variant="h5"
            sx={{ textAlign: "left", marginTop: 1, fontWeight: 400 }}
          >
            {point}
          </Typography>
        ))}
      </Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        paddingY={2}
        gap={1}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          gap={1}
        >
          <img
            style={{ cursor: "pointer", padding: "5px" }}
            width={32}
            height={32}
            src={like}
            alt="like"
          />
          {!myProfile?.owned && (
            <img
              style={{ cursor: "pointer", padding: "5px" }}
              width={32}
              height={32}
              src={comment}
              alt="like"
            />
          )}
          <img
            style={{ cursor: "pointer", padding: "5px" }}
            width={32}
            height={32}
            src={share}
            alt="share"
          />
        </Stack>
        {!myProfile?.owned && (
          <Button
            sx={{
              background: (theme) => theme.palette.button.secondary,
              color: (theme) => theme.palette.primary.main,
              fontSize: "16px",
              fontWeight: 600,
              width: { xs: "100%", sm: "222px" },
              height: "31px",
              textTransform: "capitalize",
              borderRadius: "3px",
              "&:hover": {
                background: (theme) => theme.palette.button.secondary,
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {myProfile?.type === "brand"
              ? "Follow"
              : myProfile?.type === "event"
              ? "RSVP"
              : "Inquire"}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Details;
