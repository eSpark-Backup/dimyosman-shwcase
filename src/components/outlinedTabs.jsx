import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

const OutlinedTabs = ({ tabs, onTabChange }) => {
  const visibleTabs = tabs.filter((tab) => tab.show !== false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedTab = visibleTabs[selectedIndex];

  const handleTabChange = (index) => {
    setSelectedIndex(index);
    if (onTabChange) onTabChange(visibleTabs[index]);
  };

  return (
    <Box>
      <Stack
        paddingX={2}
        direction="row"
        justifyContent={{ xs: "flex-start", md: "space-between" }}
        alignItems="center"
        sx={{ overflowX: "auto" }}
      >
        {visibleTabs.map((tab, index) => {
          const active = index === selectedIndex;
          return (
            <Box
              key={tab.label}
              onClick={() => handleTabChange(index)}
              sx={{
                width: { xs: "150px", md: `${100 / visibleTabs.length}%` },
                flexShrink: 0,
                textAlign: "center",
                cursor: "pointer",
                padding: "10px 0",
                border: active ? "1px solid #D1DBD7" : "",
                borderBottom: active ? "none" : "1px solid #D1DBD7",
                borderRadius: active ? "5px 5px 0 0" : "0",
                ":hover": {
                  border: "1px solid #D1DBD7",
                  borderBottom: "none",
                  borderRadius: "5px 5px 0 0",
                },
              }}
            >
              <Typography fontWeight={600} fontSize={16}>
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      <Box marginY={2} paddingX={2}>
        {/* 👇 Always fresh component render */}
        {typeof selectedTab.component === "function" ? (
          <selectedTab.component {...selectedTab.props} />
        ) : (
          selectedTab.component
        )}
      </Box>
    </Box>
  );
};

export default OutlinedTabs;
