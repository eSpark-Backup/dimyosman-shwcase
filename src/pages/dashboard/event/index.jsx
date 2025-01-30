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
import { eventTableData } from "../../../constant";
import { addIcon, eventIconLight, like } from "../../../assets";
import { useGetAllEventsQuery } from "../../../services/events";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAddInFavouritesMutation, useGetFavouritesQuery } from "../../../services/favourite";

const Event = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const tabs = [
    {
      label: "My Events",
      icon: null,
    },
    {
      label: "RSVP Events",
      icon: null,
    },
    {
      label: "Saved Events",
      icon: like,
    },
  ];
  const tabsForApi = ["Event", "RSVP", "Saved"];
  const [activeTab, setActiveTab] = useState(0);

  const [myEventData, setMyEventData] = useState([]);
  const { data, isError, isLoading, isSuccess, error, isFetching } =
    useGetAllEventsQuery(
      { page, pageSize: 7, tab: tabsForApi[activeTab] },
      {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        skip: tabsForApi[activeTab] === "Saved",
      }
    );
  const {
    data: data2,
    isError: isError2,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    error: error2,
    isFetching: isFetching2,
    refetch,
  } = useGetFavouritesQuery(
    { page, pageSize: 7, entity: "EVENT" },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      skip:
        tabsForApi[activeTab] === "Event" || tabsForApi[activeTab] === "RSVP",
    }
  );

  const transformEventData = (apiData, type) => {
    let newData;
    type === "fav"
      ? (newData = apiData.map(({event}, index) => ({
          id: event?.id,
          type: "event",
          eventName: event?.eventName,
          eventImg: event?.eventImage,
          brand: event?.brand?.brandName,
          brandUrl: `/brand/${event?.brand?.id}`,
          rsvp: "-",
          startDate: dayjs(event?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
          status: event?.status,
          hostedIn: event?.space?.spaceName,
          spaceUrl: `/space/${event?.space?.id}`,
          action: "Cancel",
          category: event?.eventCategory[0]?.name
        })))
      : (newData = apiData.map((event, index) => ({
          id: event?.id,
          type: "event",
          eventName: event?.eventName,
          eventImg: event?.eventImage,
          brand: event?.brand?.brandName,
          brandUrl: `/brand/${event?.brand?.id}`,
          rsvp: "-",
          startDate: dayjs(event?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
          status: event?.status,
          hostedIn: event?.space?.spaceName,
          spaceUrl: `/space/${event?.space?.id}`,
          action: "Cancel",
        })));
    return newData;
  };

  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);

  useEffect(() => {
    if (isError && !hasShownErrorToast) {
      toast.error(error?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMyEventData([]);
    }

    if (isError2 && !hasShownErrorToast) {
      toast.error(error2?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMyEventData([]);
    }

    if (isSuccess) {
      setMyEventData(transformEventData(data?.data?.events || []));
      setHasShownErrorToast(false);
    }

    if (isSuccess2) {
      setMyEventData(
        transformEventData(data2?.data?.savedEntities || [], "fav")
      );
      setHasShownErrorToast(false);
    }
  }, [
    isError,
    isError2,
    isSuccess,
    isSuccess2,
    error,
    error2,
    hasShownErrorToast,
    page,
    data,
    data2,
  ]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const gotoDetail = (item) => {
    //go to detail page functionality
    navigate(`/event/${item?.id}`);
  };

  const gotoBrand = (item) => {
    //go to detail page functionality
    navigate(item?.brandUrl);
  };

  const gotoSpace = (item) => {
    navigate(item?.spaceUrl);
  };

    const [likeFunc] = useAddInFavouritesMutation();
  

  const handleAction = async (item, type) => {
    if (type === "edit") {
      //edit functionality
      if (location?.pathname === "/event") {
        navigate(`/event/${item?.id}/edit`);
      }
    } else if (type === "remove") {
      await likeFunc({ entityId: item?.id, entityType: item?.type?.toUpperCase() }).unwrap();
      refetch();
      //remove functionality
    } else {
      // other action functionality
    }
  };

  const handleAdd = () => {
    if (location?.pathname === "/event") {
      navigate("/new-event");
    }
  };

  if (isLoading || isLoading2 || isFetching || isFetching2) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent={{ xs: "center", sm: "flex-end" }}>
        <img src={eventIconLight} alt="event" />
      </Stack>
      <Card sx={{ marginY: 2 }}>
        <FilterationTabs
          tabs={tabs}
          activeTab={activeTab}
          handleChange={handleChange}
          handleAdd={handleAdd}
        />
        {eventTableData(
          gotoDetail,
          handleAction,
          myEventData,
          gotoBrand,
          gotoSpace
        )[activeTab].data.length > 0 ? (
          <DynamicTable
            isLoading={false}
            data={
              eventTableData(
                gotoDetail,
                handleAction,
                myEventData,
                gotoBrand,
                gotoSpace
              )[activeTab].data
            }
            columns={
              eventTableData(
                gotoDetail,
                handleAction,
                myEventData,
                gotoBrand,
                gotoSpace
              )[activeTab].column
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
                "You don't currently own any events. Would you like to add a new one?"
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

export default Event;
