import { Box, Stack, Typography, useMediaQuery } from "@mui/material";

import { star } from "../../assets";

const MessageHeader = ({ selectedGroup, theme, ActivityType, GroupDetail }) => {
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");
  const isLessThan1100 = useMediaQuery("(max-width:1100px)");

  const truncateTo13Characters = (str) => {
    if (!str) return ''; 
    return `${str.slice(0, 24)}...`;
  };

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        padding: isLessThan1280 ? 1.5 : 2,
        fontFamily: '"Segoe UI", "sans-serif"',
        border: "1px solid rgba(209, 219, 215, 0.5)",
        borderRadius: "5px",
      }}
    >
      <Box display={"flex"}>
        <Box display={"flex"}>
          <Box
            sx={{
              width: isLessThan1100 ? "76px" : isLessThan1280 ? "86px" : "96px",
              height: isLessThan1100
                ? "76px"
                : isLessThan1280
                ? "86px"
                : "96px",
              position: "relative",
            }}
          >
            {selectedGroup?.messageGroup?.receiverSpace?.spaceImage ? (
              <img
                src={selectedGroup?.messageGroup?.receiverSpace.spaceImage}
                alt="Message Icon"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                  border: "1px solid rgba(209, 219, 215, 0.4)",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0, 28, 20, 0.4)",
                  borderRadius: "5px",
                }}
              />
            )}

            <ActivityType
              type={selectedGroup?.messageGroup?.activity}
              theme={theme}
            />
          </Box>

          <Box marginLeft={"10px"}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 600,
                fontSize: isLessThan1100
                  ? "24px"
                  : isLessThan1280
                  ? "28px"
                  : "32px",
                lineHeight: isLessThan1280 ? "34px" : "45px",
                textAlign: "left",
              }}
            >
              {/* {truncateTo13Characters(selectedGroup?.messageGroup?.chatName)} */}
              {selectedGroup?.messageGroup?.receiverSpace?.spaceName}
            </Typography>

            <Typography
              sx={{
                fontWeight: 300,
                fontSize: isLessThan1100 ? "16px" : "20px",
                lineHeight: isLessThan1100 ? "18px" : "28px",
              }}
            >
              {selectedGroup?.messageGroup?.brandName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                columnGap: isLessThan1100 ? 1 : 2,
              }}
            >
              {selectedGroup?.messageGroup?.creator && (
                <GroupDetail
                  withColon="By"
                  text={selectedGroup?.messageGroup?.creator}
                />
              )}

              <GroupDetail
                withColon="Spaces"
                text={selectedGroup?.group?.spaces}
              />

              <GroupDetail
                withColon="Followers"
                text={selectedGroup?.group?.followers}
              />

              <GroupDetail
                withColon="Saved"
                text={selectedGroup?.group?.saved}
              />

              {isLessThan1100 ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "12px",
                      lineHeight: "17px",
                      marginRight: 0.8,
                    }}
                  >
                    {selectedGroup?.group?.rating.toFixed(1)}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {Array.from(
                      { length: selectedGroup?.group?.rating },
                      (_, ind) => {
                        return (
                          <img
                            key={ind}
                            width={10}
                            height={10}
                            src={star}
                            alt="star"
                          />
                        );
                      }
                    )}
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>

        {!isLessThan1100 ? (
          <Stack sx={{ flex: 1, alignItems: "end" }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: isLessThan1100
                  ? "24px"
                  : isLessThan1280
                  ? "28px"
                  : "32px",
                lineHeight: isLessThan1280 ? "34px" : "45px",
                color: "rgba(0, 20, 28, 0.8)",
              }}
            >
              {selectedGroup?.group?.rating.toFixed(1)}
            </Typography>

            <Box>
              {Array.from(
                { length: selectedGroup?.group?.rating },
                (_, ind) => {
                  return (
                    <img
                      key={ind}
                      width={21}
                      height={20}
                      src={star}
                      alt="star"
                    />
                  );
                }
              )}
            </Box>

            <Typography
              sx={{
                fontWeight: 300,
                fontSize: "12px",
                lineHeight: "17px",
              }}
            >{`Based on ${selectedGroup?.group?.reviews} reviews from ${selectedGroup?.group?.leases} Leases`}</Typography>
          </Stack>
        ) : null}
      </Box>
    </Box>
  );
};

export default MessageHeader;
