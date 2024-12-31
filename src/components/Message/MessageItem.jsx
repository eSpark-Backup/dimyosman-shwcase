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
        {message.messageGroups.length
          ? message.messageGroups.map((el, i) => {
              const lastElInd = el.messages.length - 1;
              const lastEl = el.messages[lastElInd];

              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: lastEl?.creator ? "center" : "unset",
                    padding: 1,
                    bgcolor:
                      selectedGroup?.messageGroup?.chatId === el?.chatId
                        ? "rgba(209, 219, 215, 0.6)"
                        : "#ffffff",
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: "3px",
                  }}
                  onClick={() =>
                    setSelectedGroup({ messageGroup: el, group: message })
                  }
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
                    {el.brandImage ? (
                      <img
                        src={el.brandImage}
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
                      {el.brandName}
                    </Typography>

                    {lastEl?.creator && (
                      <Typography
                        sx={{
                          fontWeight: 300,
                          fontSize: "12px",
                          lineHeight: "17px",
                        }}
                      >
                        {lastEl.creator}
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
                        {lastEl?.date}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 300,
                          fontSize: "10px",
                          lineHeight: "14px",
                        }}
                      >
                        {lastEl?.time}
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
