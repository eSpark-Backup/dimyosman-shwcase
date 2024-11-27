import { useState } from "react";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { DynamicTable, FilterationTabs } from "../../../components";
import { brandTableData } from "../../../constant";
import { addIcon, brandIconlight, like } from "../../../assets";
import { useLocation, useNavigate } from "react-router-dom";

const Brand = () => {
  const tabs = [
    {
      label: "My Brands",
      icon: null,
    },
    {
      label: "Following Brands",
      icon: null,
    },
    {
      label: "Saved Brands",
      icon: like,
    },
  ];
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate()

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
      if (location?.pathname === "/brand") {
        navigate(`/brand/${item?.id}/edit`)
      }
    } else if (type === "unfollow") {
      //unfollow functionality
    } else if (type === "remove")
      [
        //remove functionality
      ];
    console.log(item, "item", type);
  };

  const handleAdd = () => {
    //add functionality
    if (location?.pathname === "/brand") {
      navigate("/new-brand")
    }

  };

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end">
        <img src={brandIconlight} alt="brand" />
      </Stack>
      <Card sx={{ marginY: 2 }}>
        <FilterationTabs
          tabs={tabs}
          activeTab={activeTab}
          handleChange={handleChange}
          handleAdd={handleAdd}
        />
        {brandTableData(gotoDetail, handleAction)[activeTab].data.length > 0 ? (
          <DynamicTable
            isLoading={false}
            data={brandTableData(gotoDetail, handleAction)[activeTab].data}
            columns={brandTableData(gotoDetail, handleAction)[activeTab].column}
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
                "You don't currently own any brand. Would you like to add a new one?"
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

export default Brand;
