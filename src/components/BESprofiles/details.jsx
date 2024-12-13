import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { calender, comment, like, miniMap, share } from "../../assets";

const Details = ({ spaceInquire, details, myProfile }) => {
  return (
    <Box>
      <Stack
        component="section"
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
      >
        <Box component="section">
          <Typography
            variant="h2"
            fontSize={24}
            sx={{
              textAlign: "left",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {myProfile.type} Overview:
          </Typography>
          {details?.overview?.map((overview) => (
            <Typography
              key={overview}
              fontSize={16}
              sx={{ textAlign: "left", marginTop: 2, fontWeight: 400, wordBreak:"break-word" }}
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
                fontSize={12}
                sx={{
                  fontWeight: "600",
                  textAlign: "left",
                  fontSize: "12px",
                  color: theme => theme.palette.primary.dark
                }}
              >
                {details?.feature?.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  rowGap: "15px",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    rowGap: "15px",
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  {details?.feature?.points?.map(
                    (item, index) =>
                      index >= 0 &&
                      index <= 2 && (
                        <Box
                          sx={{
                            display: "flex",
                            columnGap: "5px",
                            width: { xs: "100%", md: "150px" },
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
                              color: theme => theme.palette.primary.dark
                            }}
                          >
                            {item?.description}
                          </Typography>
                        </Box>
                      )
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    rowGap: "15px",
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  {details?.feature?.points?.map(
                    (item, index) =>
                      index >= 3 &&
                      index <= 5 && (
                        <Box
                          sx={{
                            display: "flex",
                            columnGap: "5px",
                            width: { xs: "100%", md: "150px" },
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
                              color: theme => theme.palette.primary.dark
                            }}
                          >
                            {item?.description}
                          </Typography>
                        </Box>
                      )
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box
          component="section"
          sx={{ marginTop: 1, width: { xs: "100%", md: "max-content" } }}
        >
          <header>
            <Typography
              variant="h3"
              sx={{
                fontSize: "12px",
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
                sx={{
                  fontSize: "16px",
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                {details?.space}
              </Typography>
            )}
            {myProfile?.type !== "brand" && (
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "300",
                  textAlign: "left",
                }}
              >
                {details?.spaceCategory}
              </Typography>
            )}
          </header>
          <Box
            sx={{
              marginTop: "6px",
              width: { xs: "100%", md: "222px" },
              height: "auto",
            }}
          >
            <figure style={{ width: "100%", height: "100%" }} role="img" aria-labelledby="profile-map">
              <img width="100%" height="100%" src={miniMap} alt="map" />
              <figcaption
                style={{
                  fontStyle: "normal",
                  fontSize: "12px",
                  fontWeight: "400",
                  textAlign: "left",
                  wordSpacing: "-1px",
                  marginTop: "6px",
                  fontFamily: `"Segoe UI", "sans-serif"`,
                }}
              >
                {details.location}
              </figcaption>
            </figure>
          </Box>
          {myProfile?.type !== "brand" && (
            <>
              <Divider sx={{ marginY: 1 }} />
              <Typography
                variant="h3"
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  textAlign: "left",
                  color: (theme) => theme.palette.primary.dark,
                }}
              >
                Staring from:
              </Typography>
              <Typography
                style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  textAlign: "left",
                  lineHeight: "140%",
                }}
              >
                {details?.startingDate}
              </Typography>
              <Typography
                style={{
                  fontSize: "12px",
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
            onClick={spaceInquire ? () => spaceInquire(myProfile?.id) : () => { }}
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
          <Typography variant="h2" sx={{ fontSize: "24px", textAlign: "left", fontWeight: 600 }}>
            {details?.expectedPoint?.title}
          </Typography>
          {details?.expectedPoint?.points?.map((point) => (
            <Typography
              key={point}
              fontSize={16}
              sx={{
                textAlign: "left",
                marginTop: 2,
                fontWeight: 400,
                wordBreak:"break-word",
                "& ul, & ol": {
                  paddingLeft: 2, 
                },
              }}
              dangerouslySetInnerHTML={{ __html: point }}
            />
          ))}
          <ul style={{ marginLeft: "16px" }}>
            {details?.expectedPoint?.ulPoints?.map((point) => {
              const newPoints = point.split(":");
              return (
                <li style={{ marginTop: "10px" }} key={point}>
                  <Typography
                    fontSize={16}
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
                    fontSize={16}
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
        <Box component="article">
          <Typography
            variant="h3"
            sx={{ fontSize: "20px", textAlign: "left", fontWeight: 600 }}
          >
            {details?.otherPoints?.title}
          </Typography>
          {details?.otherPoints?.points?.map((point) => (
            <Typography
              key={point}
              fontSize={16}
              sx={{ textAlign: "left", marginTop: 1, fontWeight: 400 }}
            >
              {point}
            </Typography>
          ))}
        </Box>
      )}
      {details?.overviewImage && (
        <figure style={{ width: "100%", height: "100%" }} role="overview-image" aria-labelledby="overview-image-figcaption">
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
        </figure>
      )}
      {details?.otherPoints2 && (
        <Box component="article">
          <Typography
            variant="h3"
            sx={{ fontSize: "20px", textAlign: "left", fontWeight: 600 }}
          >
            {details?.otherPoints2?.title}
          </Typography>
          {details?.otherPoints2?.points?.map((point) => (
            <Typography
              key={point}
              fontSize={16}
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
        paddingTop={2}
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
            onClick={spaceInquire ? () => spaceInquire(myProfile?.id) : () => { }}
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
