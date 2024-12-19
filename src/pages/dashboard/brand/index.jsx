import { useEffect, useState } from "react";
import { Box, Button, Card, LinearProgress, Stack, Typography } from "@mui/material";
import { DynamicTable, FilterationTabs } from "../../../components";
import { brandTableData } from "../../../constant";
import { addIcon, brandIconlight, brandMain, eventMain, eventUserImage, like } from "../../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllBrandsQuery } from "../../../services/brands";
import { toast } from "react-toastify";

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
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const gotoDetail = (item) => {
    //go to detail page functionality
    if (location?.pathname === "/brand") {
      navigate(`/brand/${item?.id}`)
    }
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
  };

  const handleAdd = () => {
    //add functionality
    if (location?.pathname === "/brand") {
      navigate("/new-brand")
    }

  };
  const [myBrandData, setMyBrandData] = useState([]);
  const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllBrandsQuery({ page, pageSize: 7 }, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });


  const transformBrandData = (apiData) => {
    return apiData.map((brand, index) => ({
      id: brand?.id,
      type: "brand",
      brandName: brand.brandName || "N/A",
      brandImg: brand.brandImage || "",
      brandCategory: brand.brandCategory && brand.brandCategory.length > 0
        ? brand.brandCategory.map(item => item.name).join(", ")
        : "N/A",
      events: brand.events || "-",
      followers: brand.followers || "-",
      status: brand.status || "N/A",
      colHeader1: "Table cell",
      colHeader2: "Table cell",
      colHeader3: "Table cell",
      colHeader4: "Table cell",
      colHeader5: "Table cell",
      colHeader6: "Table cell",
      colHeader7: "Table cell",
    }));
  };

  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);

  useEffect(() => {
    if (isError && !hasShownErrorToast) {
      toast.error(error?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMyBrandData([]);
    }

    if (isSuccess) {
      setMyBrandData(transformBrandData(data?.data?.groupedBrands?.publishedBrands || []));
      setHasShownErrorToast(false);
    }
  }, [isError, isSuccess, error, hasShownErrorToast, page, data]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading || isFetching) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    )
  }

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
        {brandTableData(gotoDetail, handleAction, myBrandData)[activeTab].data.length > 0 ? (
          <DynamicTable
            isLoading={isLoading || isFetching}
            data={brandTableData(gotoDetail, handleAction, myBrandData)[activeTab].data}
            columns={brandTableData(gotoDetail, handleAction, myBrandData)[activeTab].column}
            total={data && data?.data?.pagination?.totalItems}
            handlePageChange={handlePageChange}
            page={page}
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
