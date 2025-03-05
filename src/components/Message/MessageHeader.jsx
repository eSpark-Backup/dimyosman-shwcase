import { useDispatch } from "react-redux";

import { Box, Stack, Typography, useMediaQuery } from "@mui/material";

// import { star } from "../../assets";

import { emptyGoToMessage } from "../../store/slices/notification";

const MessageHeader = ({
  selectedGroup,
  theme,
  ActivityType,
  GroupDetail,
  onlineUsers,
  setSelectedChatId,
  setInitialChatId,
}) => {
  const isLessThan1280 = useMediaQuery("(max-width:1280px)");
  const isLessThan1100 = useMediaQuery("(max-width:1100px)");
  const isLessThan768 = useMediaQuery("(max-width:768px)");

  const dispatch = useDispatch();

  const { chatGroup, group } = selectedGroup;
  const isDirect = group?.directUserChat?.userToUser;

  const childImage = isDirect ? group?.parentImage : chatGroup?.childImage;

  const members = isDirect
    ? group?.directUserChat?.members
    : chatGroup?.members;

  const activity = isDirect ? group?.parentActivity : chatGroup?.activity;
  const saved = isDirect ? group?.directUserChat?.chatGroup?.saved : chatGroup?.saved;
  const spaces = isDirect ? group?.directUserChat?.chatGroup?.spaces : chatGroup?.spaces;

  const followers = isDirect
    ? group?.directUserChat?.chatGroup?.followers
    : chatGroup?.followers;

  const creator = isDirect
    ? group?.directUserChat?.chatGroup?.creator
    : chatGroup?.creator;

  const brandName = isDirect
    ? group?.directUserChat?.chatGroup?.brandName
    : chatGroup?.receiverBrand?.brandName ||
      chatGroup?.receiverEvent?.brand?.brandName;

  const isInquiryRole = !isDirect ? chatGroup?.isInquiryRole : null;
  const childName = isDirect ? group?.parentName : chatGroup?.childName;

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
      <Box gap={"10px"} display={"flex"}>
        <Box sx={{ width: { xs: "100%", md: "auto" } }} display={"flex"}>
          <Box
            sx={{
              width: isLessThan1100 ? "76px" : isLessThan1280 ? "86px" : "96px",
              height: isLessThan1100
                ? "76px"
                : isLessThan1280
                ? "86px"
                : "96px",
              minWidth: isLessThan1100
                ? "76px"
                : isLessThan1280
                ? "86px"
                : "96px",
              minHeight: isLessThan1100
                ? "76px"
                : isLessThan1280
                ? "86px"
                : "96px",
              position: "relative",
            }}
          >
            {childImage ? (
              <img
                src={childImage}
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

            <ActivityType type={activity} theme={theme} />

            {onlineUsers?.length
              ? members?.some((member) => onlineUsers?.includes(member)) && (
                  <Box
                    sx={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: "#00FF00",
                      position: "absolute",
                      top: "-4px",
                      right: "-3px",
                    }}
                  />
                )
              : null}
          </Box>

          <Box
            marginLeft={"10px"}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent:
                isInquiryRole === "sender" && activity !== "brand"
                  ? "normal"
                  : "center",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
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
                  textTransform: "capitalize",
                }}
              >
                {childName}
              </Typography>
              {isLessThan768 && (
                <Typography
                  onClick={() => {
                    dispatch(emptyGoToMessage());
                    setSelectedChatId(null);
                    setInitialChatId(null);
                  }}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: isLessThan1100 ? "16px" : "20px",
                    lineHeight: isLessThan1100 ? "18px" : "28px",
                  }}
                >
                  Back
                </Typography>
              )}
            </Stack>

            {isInquiryRole === "sender" && activity !== "brand" && (
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: isLessThan1100 ? "16px" : "20px",
                  lineHeight: isLessThan1100 ? "18px" : "28px",
                }}
              >
                {brandName}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                columnGap: isLessThan1100 ? 1 : 2,
              }}
            >
              {creator && <GroupDetail withColon="By" text={creator} />}

              {activity === "brand" ? (
                <GroupDetail withColon="Spaces" text={spaces} />
              ) : null}

              <GroupDetail withColon="Followers" text={followers} />

              <GroupDetail withColon="Saved" text={saved} />

              {/* {isLessThan1100 ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "12px",
                      lineHeight: "17px",
                      marginRight: 0.8,
                    }}
                  >
                    {group?.rating?.toFixed(1)}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {Array.from({ length: group?.rating }, (_, ind) => {
                      return (
                        <img
                          key={ind}
                          width={10}
                          height={10}
                          src={star}
                          alt="star"
                        />
                      );
                    })}
                  </Box>
                </Box>
              ) : null} */}
            </Box>
          </Box>
        </Box>

        {/* {!isLessThan1100 ? (
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
              {group?.rating?.toFixed(1)}
            </Typography>

            <Box>
              {Array.from({ length: group?.rating }, (_, ind) => {
                return (
                  <img key={ind} width={21} height={20} src={star} alt="star" />
                );
              })}
            </Box>

            <Typography
              sx={{
                fontWeight: 300,
                fontSize: "12px",
                lineHeight: "17px",
              }}
            >{`Based on ${group?.reviews} reviews from ${group?.leases} Leases`}</Typography>
          </Stack>
        ) : null} */}
      </Box>
    </Box>
  );
};

export default MessageHeader;
