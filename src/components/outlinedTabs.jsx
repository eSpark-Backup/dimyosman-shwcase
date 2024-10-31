import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

const OutlinedTabs = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const [renderedComponent, setRenderedComponent] = useState(null);

  useEffect(() => {
    if (typeof tabs[0].component === "function") {
      if (selectedTab && selectedTab.component) {
        setRenderedComponent(<selectedTab.component {...selectedTab.props} />);
      }
    } else {
      setRenderedComponent(selectedTab.component);
    }
  }, [selectedTab]);

  return (
    <Box>
      <Stack
        paddingX={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {tabs.map((tab) => {
          const active = tab.label === selectedTab.label;
          return (
            <Box
              sx={{
                width: `${100 / tabs.length}%`,
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
              onClick={() => setSelectedTab(tab)}
              key={tab.label}
            >
              <Typography variant="h5">{tab.label}</Typography>
            </Box>
          );
        })}
      </Stack>
      <Box marginY={2} paddingX={2}>
        {renderedComponent}
      </Box>
    </Box>
  );
};

export default OutlinedTabs;
