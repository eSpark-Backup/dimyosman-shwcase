import { Box, Stack } from "@mui/material";

const Stats = () => {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap={2}
      >
        <Box
          sx={{
            width: "608px",
            height: "409px",
            background: "#D1DBD7",
            opacity: "40%",
          }}
        ></Box>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <Box
            sx={{
              width: "224px",
              height: "195px",
              background: "#D1DBD7",
              opacity: "40%",
            }}
          ></Box>
          <Box
            sx={{
              width: "224px",
              height: "195px",
              background: "#D1DBD7",
              opacity: "40%",
            }}
          ></Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Stats;
