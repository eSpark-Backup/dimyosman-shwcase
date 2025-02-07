import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { DynamicTable, FilterationTabs } from "../../../components";
import { brandTableData } from "../../../constant";
import {
  addIcon,
  brandIcon,
  brandIconlight,
  brandMain,
  eventMain,
  eventUserImage,
  like,
} from "../../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllBrandsQuery } from "../../../services/brands";
import { toast } from "react-toastify";
import { useAddInFavouritesMutation, useGetFavouritesQuery } from "../../../services/favourite";
import moment from "moment";
import { useFollowMutation, useGetFollowBrandsQuery } from "../../../services/follower";

const Brand = () => {
  const tabs = [
    {
      label: "My Brands",
      icon: null,
      error: "You don't currently own any brand. Would you like to add a new one?"
    },
    {
      label: "Following Brands",
      icon: null,
      error: "You don't currently have following brand."
    },
    {
      label: "Saved Brands",
      icon: like,
      error: "You don't currently have saved brand."
    },
  ];
  const [page, setPage] = useState(1);
  const [savedId, setSavedId] = useState(null);
  const [followId, setFollowId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const gotoDetail = (item) => {
    //go to detail page functionality
    if (location?.pathname === "/brand") {
      navigate(`/brand/${item?.id}`);
    }
  };

  const {
    data: data2,
    isError: isError2,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    error: error2,
    isFetching: isFetching2,
    refetch,
  } = useGetFavouritesQuery(
    { page, pageSize: 7, entity: "BRAND" },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      skip: activeTab !== 2,
    }
  );

  const {
    data: data3,
    isError: isError3,
    isLoading: isLoading3,
    isSuccess: isSuccess3,
    error: error3,
    isFetching: isFetching3,
    refetch: refetch3,
  } = useGetFollowBrandsQuery(
    { page, pageSize: 7, entity: "BRAND" },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      skip: activeTab !== 1,
    }
  );

  const [likeFunc, { isLoading: likeLoading }] = useAddInFavouritesMutation();
  const [follow, { isLoading: followLoading }] = useFollowMutation();

  const handleAction = async (item, type) => {
    if (type === "edit") {
      //edit functionality
      if (location?.pathname === "/brand") {
        navigate(`/brand/${item?.id}/edit`);
      }
    } else if (type === "unfollow") {
      setFollowId(item?.id);
      await follow({ entityId: item?.id, entityType: item?.type?.toUpperCase() }).unwrap();
      refetch3();
      setFollowId(null);
    } else if (type === "remove") {
      setSavedId(item?.id);
      await likeFunc({ entityId: item?.id, entityType: item?.type?.toUpperCase() }).unwrap();
      refetch();
      setSavedId(null);
    }
  };

  const handleAdd = () => {
    //add functionality
    if (location?.pathname === "/brand") {
      navigate("/new-brand");
    }
  };
  const [myBrandData, setMyBrandData] = useState([]);
  const [myBrandData2, setMyBrandData2] = useState([]);
  const [myBrandData3, setMyBrandData3] = useState([]);
  const { data, isError, isLoading, isSuccess, error, isFetching } =
    useGetAllBrandsQuery(
      { page, pageSize: 7 },
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        skip: activeTab !== 0,
      }
    );

  const transformBrandData = (apiData, type) => {
    let newData;
    type === "fav"
      ? (newData = apiData.map(({ brand, createdAt, eventsCount, followerCount }, index) => ({
        id: brand?.id,
        type: "brand",
        brandName: brand.brandName || "N/A",
        brandImg: brand.brandImage || "",
        brandCategory:
          brand.brandCategory && brand.brandCategory.length > 0
            ? brand.brandCategory.map((item) => item.name).join(", ")
            : "N/A",
        events: eventsCount || "-",
        followers: followerCount || "-",
        status: brand.status || "N/A",
        savedDate: moment(new Date(createdAt)).format("DD.MM.YYYY.") || "-",
        colHeader1: "Table cell",
        colHeader2: "Table cell",
        colHeader3: "Table cell",
        colHeader4: "Table cell",
        colHeader5: "Table cell",
        colHeader6: "Table cell",
        colHeader7: "Table cell",
      })))
      : (newData = apiData.map((brand, index) => ({
        id: brand?.id,
        type: "brand",
        brandName: brand.brandName || "N/A",
        brandImg: brand.brandImage || "",
        brandCategory:
          brand.brandCategory && brand.brandCategory.length > 0
            ? brand.brandCategory.map((item) => item.name).join(", ")
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
      })));
    return newData;
  };

  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);

  useEffect(() => {
    if (isError && !hasShownErrorToast) {
      toast.error(error?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMyBrandData([]);
    }

    if (isError2 && !hasShownErrorToast) {
      toast.error(error2?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMyBrandData2([]);
    }

    if (isError3 && !hasShownErrorToast) {
      toast.error(error3?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMyBrandData3([]);
    }

    if (isSuccess) {
      setMyBrandData(
        transformBrandData(data?.data?.groupedBrands?.publishedBrands || [])
      );
      setHasShownErrorToast(false);
    }

    if (isSuccess2) {
      setMyBrandData2(
        transformBrandData(data2?.data?.savedEntities || [], "fav")
      );
      setHasShownErrorToast(false);
    }

    if (isSuccess3) {
      setMyBrandData3(
        transformBrandData(data3?.data?.followedEntities || [], "fav")
      );
      setHasShownErrorToast(false);
    }
  }, [
    isError,
    isError2,
    isError3,
    isSuccess,
    isSuccess2,
    isSuccess3,
    error,
    error2,
    error3,
    hasShownErrorToast,
    page,
    data,
    data2,
    data3,
  ]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading2 || isLoading || isFetching2 || isFetching || isFetching3 || isLoading3) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent={{ xs: "center", sm: "flex-end" }}>
        <Box
          sx={{
            cursor: "pointer",
            background: "rgba(196, 119, 127, 0.2)",
            width: "48px",
            height: "48px",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <figure
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            role="space-icon"
          >
            <img
              src={brandIcon}
              alt=""
            />
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
        {brandTableData(gotoDetail, handleAction, myBrandData, myBrandData2, myBrandData3)[activeTab].data
          .length > 0 ? (
          <DynamicTable
            isLoading={isLoading || isFetching}
            data={
              brandTableData(gotoDetail, handleAction, myBrandData, myBrandData2, myBrandData3)[activeTab]
                .data
            }
            columns={
              brandTableData(gotoDetail, handleAction, myBrandData, myBrandData2, myBrandData3, likeLoading, savedId, followLoading, followId)[activeTab]
                .column
            }
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
                tabs[activeTab].error
              }
            </Typography>
            {activeTab === 0 && <Button
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
            </Button>}
          </Stack>
        )}
      </Card>
    </Box>
  );
};

export default Brand;
