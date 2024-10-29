import { Button, Stack, Tab, Tabs } from "@mui/material";
import { addIcon } from "../assets";

const FilterationTabs = ({ tabs, activeTab, handleChange, handleAdd }) => {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "center" }}
      gap={2}
      marginBottom={2}
    >
      <Tabs
        sx={{
          width: "100%",
          minHeight: "31px",
          ".MuiTabs-flexContainer": {
            flexDirection: { xs: "column", sm: "row" },
          },
          button: {
            minWidth: { xs: "100%", sm: "auto" },
          },
        }}
        value={activeTab}
        onChange={handleChange}
        indicatorColor="transparent"
      >
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              icon={
                tab?.icon && (
                  <img width={20} height={18} src={tab?.icon} alt="like-icon" />
                )
              }
              iconPosition="start"
              label={tab.label}
            />
          );
        })}
      </Tabs>
      <Button
        onClick={handleAdd}
        startIcon={
          <img
            style={{
              filter:
                "brightness(0) saturate(100%) invert(5%) sepia(29%) saturate(6114%) hue-rotate(176deg) brightness(93%) contrast(102%)",
            }}
            width={16}
            height={16}
            src={addIcon}
            alt="add-icon"
          />
        }
        sx={{
          background: (theme) => theme.palette.button.secondary,
          color: (theme) => theme.palette.primary.main,
          fontSize: "16px",
          fontWeight: 500,
          width: { xs: "100%", sm: "142px" },
          height: "31px",
          textTransform: "capitalize",
          borderRadius: "3px",
          "&:hover": {
            background: (theme) => theme.palette.button.secondary,
            color: (theme) => theme.palette.primary.main,
          },
        }}
      >
        Add New
      </Button>
    </Stack>
  );
};

export default FilterationTabs;
