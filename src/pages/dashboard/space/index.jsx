import { Box, Button, Card, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DynamicTable, FilterationTabs } from "../../../components";
import { spaceTableData } from "../../../constant";
import { addIcon, eventIconLight, like, spaceIcon } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { useGetAllSpaceQuery } from "../../../services/space";
import { toast } from "react-toastify";

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
  const [page, setPage] = useState(1)

  const [mySpaceData, setMySpaceData] = useState([]);
  const { data, isError, isLoading, isSuccess, error, isFetching } = useGetAllSpaceQuery({ page, pageSize: 7 }, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });

  const navigate = useNavigate()


  const transformSpaceData = (apiData) => {
    return apiData.map((space, index) => {
      const dayFilter = space?.pricing?.filter((item) => item?.term === "Day");
      return {
        id: space?.id,
        type: "space",
        eventName: space?.spaceName,
        eventImg: space?.spaceImage,
        price: dayFilter?.length > 0 ? dayFilter[0]?.price : "-",
        term: dayFilter?.length > 0 ? dayFilter[0]?.term : "-",
        brand: space?.brand?.brandName,
        brandUrl: `/brand/${space?.brand?.id}`,
        action: "Edit"
      }
    });
  };

  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);


  useEffect(() => {
    if (isError && !hasShownErrorToast) {
      toast.error(error?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMySpaceData([]);
    }

    if (isSuccess) {
      setMySpaceData(transformSpaceData(data?.data?.spaces || []));
      setHasShownErrorToast(false);
    }
  }, [isError, isSuccess, error, hasShownErrorToast, page, data]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const gotoDetail = (item) => {
    //go to detail page functionality
    console.log(item, "item");
    navigate(`/space/${item?.id}`)
  };

  const handleAction = (item, type) => {
    if (type === "edit") {
      //edit functionality
      if (location?.pathname === "/space") {
        navigate(`/space/${item?.id}/edit`)
      }
    } else if (type === "remove") {
      //remove functionality
    } else {
      // other action functionality
    }
  };

  const gotoBrand = (item) => {
    //go to detail page functionality
    navigate(item?.brandUrl)
  };

  const handleAdd = () => {
    //add functionality
    navigate("/new-space")
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
      <Card sx={{ marginY: 2, border: "1px solid rgb(230, 235, 233)" }}>
        <FilterationTabs
          tabs={tabs}
          activeTab={activeTab}
          handleChange={handleChange}
          handleAdd={handleAdd}
        />
        {spaceTableData(gotoDetail, handleAction, mySpaceData, gotoBrand)[activeTab].data.length > 0 ? (
          <DynamicTable
            isLoading={false}
            data={spaceTableData(gotoDetail, handleAction, mySpaceData, gotoBrand)[activeTab].data}
            columns={spaceTableData(gotoDetail, handleAction, mySpaceData, gotoBrand)[activeTab].column}

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
