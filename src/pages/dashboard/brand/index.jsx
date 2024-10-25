import { useState } from "react";
import { Box, Card, Stack } from "@mui/material";
import { DynamicTable, FilterationTabs } from "../../../components";
import { brandTableData } from "../../../constant";
import { brandIconlight } from "../../../assets";

const Brand = () => {
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
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end">
        <img src={brandIconlight} alt="brand" />
      </Stack>
      <Card sx={{ marginY: 2 }}>
        <FilterationTabs
          activeTab={activeTab}
          handleChange={handleChange}
          handleAdd={handleAdd}
        />
        <DynamicTable
          isLoading={false}
          data={brandTableData(gotoDetail, handleAction)[activeTab].data}
          columns={brandTableData(gotoDetail, handleAction)[activeTab].column}
        />
      </Card>
    </Box>
  );
};

export default Brand;
