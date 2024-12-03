import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { DynamicTable, FilterationTabs } from "../../../components";
import { spaceTableData } from "../../../constant";
import { addIcon, eventIconLight, like, spaceIcon } from "../../../assets";

const Space = () => {
  const tabs = [
    {
      label: "My Spaces",
      icon: null,
    },
    {
      label: "Leasing Spaces",
      icon: null,
    },
    {
      label: "Saved Spaces",
      icon: like,
    },
  ];
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const gotoDetail = (item) => {
    //go to detail page functionality
    console.log(item, "item");
  };

  const handleAction = (item, type) => {
    if (type === "edit") {
      //edit functionality
    } else if (type === "remove") {
      //remove functionality
    } else {
      // other action functionality
    }
    console.log(item, "item", type);
  };

  const handleAdd = () => {
    //add functionality
  };
  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end">
        <Box
          sx={{
            width: "48px",
            height: "48px",
            borderRadius: "5px",
            backgroundColor: "rgb(120, 150, 195, 0.3)",

          }}>
          <figure style={{
            width: "100%", height: "100%", display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }} role="space-icon">
            <img src={spaceIcon} alt="event" />
          </figure>
        </Box>
      </Stack>
      <Card sx={{ marginY: 2 }}>
        <FilterationTabs
          tabs={tabs}
          activeTab={activeTab}
          handleChange={handleChange}
          handleAdd={handleAdd}
        />
        {spaceTableData(gotoDetail, handleAction)[activeTab].data.length > 0 ? (
          <DynamicTable
            isLoading={false}
            data={spaceTableData(gotoDetail, handleAction)[activeTab].data}
            columns={spaceTableData(gotoDetail, handleAction)[activeTab].column}
          />
        ) : (
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
            paddingY={4}
          >
            <Typography sx={{ fontWeight: 400 }} color="primary" variant="h5">
              {
                "You don't currently own any spaces. Would you like to add a new one?"
              }
            </Typography>
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
        )}
      </Card>
    </Box>
  );
};

export default Space;
