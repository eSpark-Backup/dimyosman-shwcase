import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

const MessageItem = ({
  message,
  theme,
  expanded,
  onChange,
  setSelectedGroup,
  selectedGroup,
  ActivityType,
  setSelectedChatId,
}) => {
  return (
    <Accordion
      sx={{
        bgcolor: "#ffffff",
        marginBottom: 2,
        borderRadius: "3px",
        border: "none",
        boxShadow: "none",
        padding: 0,
        "&:before": {
          display: "none",
        },
        "&:last-child": {
          marginBottom: 0,
        },
      }}
      expanded={message?.messageGroups?.length ? expanded : false}
      onChange={message?.messageGroups?.length ? onChange : null}
    >
      <AccordionSummary
        sx={{
          padding: 1,
          display: "flex",
          minHeight: "auto !important",
          alignItems: "center",
          margin: "0px !important",
          position: "relative",

          "& .MuiAccordionSummary-content": {
            alignItems: "center",
            margin: "0px !important",
          },
        }}
      >
        <Box
          sx={{
            width: "32px",
            height: "32px",
            marginRight: 2,
            borderRadius: "5px",
            position: "relative",
          }}
        >
          {message.brandImage ? (
            <img
              src={message.brandImage}
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

          <ActivityType type={message.activity} theme={theme} />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            lineHeight: "22px",
            fontSize: "16px",
            textAlign: "left",
          }}
        >
          {message.brandName}
        </Typography>

        {message.read && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: theme.palette.error.danger,
              position: "absolute",
              top: "-4px",
              right: "0px",
            }}
          />
        )}
      </AccordionSummary>

      <AccordionDetails
        sx={{
          padding: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {message?.messageGroups?.length
          ? message.messageGroups.map((el, i) => {
              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: el?.creator ? "center" : "unset",
                    padding: 1,
                    bgcolor:
                      selectedGroup?.messageGroup?.chatId === el?.chatId
                        ? "rgba(209, 219, 215, 0.6)"
                        : "#ffffff",
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: "3px",
                  }}
                  onClick={() => {
                    setSelectedChatId(el?.chatId);
                    setSelectedGroup({ messageGroup: el, group: message });
                  }}
                >
                  <Box
                    sx={{
                      width: "48px",
                      height: "48px",
                      marginRight: 2,
                      borderRadius: "5px",
                      position: "relative",
                    }}
                  >
                    { (el?.receiverSpace?.spaceImage || el?.senderBrand?.brandImage) ? (
                      <img
                        src={el?.isInquiryRole === 'sender' ?  el?.receiverSpace?.spaceImage : el?.senderBrand?.brandImage}
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

                    <ActivityType type={el.activity} theme={theme} />
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 600,
                        lineHeight: "22px",
                        fontSize: "16px",
                        textAlign: "left",
                      }}
                    >
                      {el?.isInquiryRole === 'sender' ?  el?.receiverSpace?.spaceName : el?.senderBrand?.brandName}
                      {/* {el?.receiverSpace?.spaceName} */}
                    </Typography>

                    {el?.creator && (
                      <Typography
                        sx={{
                          fontWeight: 300,
                          fontSize: "12px",
                          lineHeight: "17px",
                        }}
                      >
                        {el.creator}
                      </Typography>
                    )}

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 300,
                          fontSize: "10px",
                          lineHeight: "14px",
                        }}
                      >
                        {el?.date}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 300,
                          fontSize: "10px",
                          lineHeight: "14px",
                        }}
                      >
                        {el?.time}
                      </Typography>
                    </Box>
                  </Box>

                  {el.read && (
                    <Box
                      sx={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: theme.palette.error.danger,
                        position: "absolute",
                        top: "-4px",
                        right: "-3px",
                      }}
                    />
                  )}
                </Box>
              );
            })
          : null}
      </AccordionDetails>
    </Accordion>
  );
};

export default MessageItem;
