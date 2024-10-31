import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { calender, comment, like, miniMap, share } from "../../assets";

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
          {details.feature && (
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                rowGap: "15px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  textAlign: "left",
                }}
                variant="h6"
              >
                {details?.feature?.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  rowGap: "15px",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                {details?.feature?.points?.map((item, index) => (
                  <Box
                    sx={{
                      display: "flex",
                      columnGap: "5px",
                      width: { xs: "100%", md: "33%" },
                    }}
                    key={index}
                  >
                    <img
                      src={item?.icon}
                      alt="Icon"
                      style={{ width: "16px", height: "16px" }}
                    />
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontWeight: "400",
                        fontSize: { xs: "12px", sm: "11px", xl: "12px" },
                      }}
                      variant="h6"
                    >
                      {item?.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ marginTop: 1, width: { xs: "100%", md: "max-content" } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            {myProfile?.type === "brand" && !myProfile.owned
              ? "Located at:"
              : myProfile?.type === "brand"
              ? "Headqarters at:"
              : "Hosted at:"}
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
          {myProfile.type !== "space" && !myProfile?.owned && (
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
        {(myProfile.type === "space" || !myProfile?.owned) && (
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              "&:hover": {
                background: (theme) => theme.palette.button.secondary,
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {myProfile?.type === "space" && (
              <img src={calender} alt="Calender Icon" />
            )}
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
            {details?.expectedPoint?.title}
          </Typography>
          {details?.expectedPoint?.points?.map((point) => (
            <Typography
              key={point}
              variant="h5"
              sx={{ textAlign: "left", marginTop: 1, fontWeight: 400 }}
            >
              {point}
            </Typography>
          ))}
          <ul style={{ marginLeft: "16px" }}>
            {details?.expectedPoint?.ulPoints?.map((point) => {
              const newPoints = point.split(":");
              return (
                <li style={{ marginTop: "10px" }} key={point}>
                  <Typography
                    variant="h5"
                    sx={{
                      display: "inline",
                      textAlign: "left",
                      marginTop: 1,
                      fontWeight: 600,
                    }}
                  >
                    {newPoints[0]}:
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      display: "inline",
                      textAlign: "left",
                      marginTop: 1,
                      fontWeight: 400,
                    }}
                  >
                    {newPoints[1]}
                  </Typography>
                </li>
              );
            })}
          </ul>
        </Box>
      )}
      {details?.otherPoints && (
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
      )}
      {details?.overviewImage && (
        <img
          style={{
            borderRadius: "5px",
            margin: "16px 0",
            width: "100%",
            height: "300px",
            objectFit: "cover",
          }}
          src={details?.overviewImage}
          alt="overview-image"
        />
      )}
      {details?.otherPoints2 && (
        <Box>
          <Typography variant="h3" sx={{ fontSize: "20px", textAlign: "left" }}>
            {details?.otherPoints2?.title}
          </Typography>
          {details?.otherPoints2?.points?.map((point) => (
            <Typography
              key={point}
              variant="h5"
              sx={{ textAlign: "left", marginTop: 1, fontWeight: 400 }}
            >
              {point}
            </Typography>
          ))}
        </Box>
      )}
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
          {myProfile.type !== "space" && !myProfile?.owned && (
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
        {(myProfile.type === "space" || !myProfile?.owned) && (
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              "&:hover": {
                background: (theme) => theme.palette.button.secondary,
                color: (theme) => theme.palette.primary.main,
              },
            }}
          >
            {myProfile?.type === "space" && (
              <img src={calender} alt="Calender Icon" />
            )}
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
