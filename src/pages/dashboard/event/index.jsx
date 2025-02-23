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
import { addIcon, eventIconLight, flag, like } from "../../../assets";
import { useCancelRsvpMutation, useGetAllEventsQuery } from "../../../services/events";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAddInFavouritesMutation, useGetFavouritesQuery } from "../../../services/favourite";
import { addHyphenToName } from "../../../utils";

const Event = () => {
  const [page, setPage] = useState(1);
  const [savedId, setSavedId] = useState(null);
  const [rsvpId, setRsvpId] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    {
      label: "My Events",
      icon: null,
      error: "You don't currently own any events. Would you like to add a new one?"
    },
    {
      label: "RSVP Events",
      icon: null,
      error: "You don't currently have RSVP events."
    },
    {
      label: "Saved Events",
      icon: like,
      error: "You don't currently have saved events."
    },
  ];
  const tabsForApi = ["Event", "RSVP", "Saved"];
  const [activeTab, setActiveTab] = useState(0);

  const [myEventData, setMyEventData] = useState([]);
  const [myEventData2, setMyEventData2] = useState([]);
  const { data, isError, isLoading, isSuccess, error, isFetching, refetch } =
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
    refetch: refetch2,
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
      ? (newData = apiData.map(({ event }, index) => ({
        id: event?.id,
        type: "event",
        eventName: event?.eventName,
        eventImg: event?.eventImage,
        brand: event?.brand?.brandName,
        brandUrl: `/brand/${addHyphenToName(event?.brand?.brandName)}`,
        brandId: event?.brand?.id,
        rsvp: "-",
        startDate: !event?.eventDate ||
          !event?.eventDate[0]?.startDate ||
          !dayjs(event?.eventDate[0]?.startDate).isValid()
          ? "-"
          : dayjs(event?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
        status: event?.status,
        hostedIn: event?.space?.spaceName,
        spaceUrl: `/space/${addHyphenToName(event?.space?.spaceName)}`,
        spaceId: event?.space?.id,
        action: "Cancel",
        category: event?.eventCategory[0]?.name
      })))
      : (newData = apiData.map((event, index) => ({
        id: event?.id,
        rsvpId: event?.rsvpId,
        type: "event",
        eventName: event?.eventName,
        eventImg: event?.eventImage,
        brand: event?.brand?.brandName,
        brandUrl: event?.brand ? `/my-brands/${addHyphenToName(event?.brand?.brandName)}` : null,
        brandId: event?.brand?.id,
        rsvp: event?.rsvpCount,
        startDate: !event?.eventDate || !event?.eventDate[0]?.startDate || dayjs(event?.eventDate[0]?.startDate).isValid() === false
          ? "-"
          : dayjs(event?.eventDate[0]?.startDate).format("DD.MM.YYYY"),
        status: event?.eventStatus || event?.status,
        hostedIn: event?.space?.spaceName || "-",
        spaceUrl: `/my-spaces/${addHyphenToName(event?.space?.spaceName)}`,
        spaceId: event?.space?.id,
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
      setMyEventData2([]);
    }

    if (isSuccess) {
      if (tabsForApi[activeTab] === "RSVP") {
        setMyEventData(transformEventData(data?.data?.map(({ event, ...rest }) => ({ ...rest, ...event, rsvpId: rest?.id })) || []));
      } else {
        setMyEventData(transformEventData(data?.data?.events || []));
      }
      setHasShownErrorToast(false);
    }

    if (isSuccess2) {
      setMyEventData2(
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

  const gotoDetail = (item, other = null) => {
    let url = "";

    if(other) {
      url = "/event"
    } else {
      url = "/my-events"
    }

    navigate(`${url}/${addHyphenToName(item?.eventName)}`, {
      state: { id: item?.id },
    });
  };

  const gotoBrand = (item, other = null) => {
    let url = "";

    if(other) {
      url = "/brand"
    } else {
      url = "/my-brands"
    }

    navigate(`${url}/${addHyphenToName(item?.brand)}`, {
      state: { id: item?.brandId },
    });
  };

  const gotoSpace = (item, other = null) => {
    let url = "";

    if(other) {
      url = "/space"
    } else {
      url = "/my-spaces"
    }

    navigate(`${url}/${addHyphenToName(item?.hostedIn)}`, {
      state: { id: item?.spaceId },
    });
  };

  const [likeFunc, { isLoading: likeLoading }] = useAddInFavouritesMutation();
  const [cancelRsvp, { isLoading: rsvpLoading }] = useCancelRsvpMutation();


  const handleAction = async (item, type) => {
    if (type === "edit") {
      //edit functionality
      // if (location?.pathname === "/event") {
        navigate(`/my-events/${addHyphenToName(item?.eventName)}/edit`, {
          state: { id: item?.id },
        });
      // }
    } else if (type === "remove") {
      setSavedId(item?.id);
      likeFunc({
        entityId: item?.id,
        entityType: item?.type?.toUpperCase(),
      }).then((res) => {
        if (res?.data?.status) {
          toast.success(
            res?.data?.message
              .replace("Entity", "Post")
              .replace(" successfully", "")
          );
          refetch2();
          setSavedId(null);
        }
      });
      //remove functionality
    } else if (type === "Cancel") {
      //cancel rsvp functionality
      setRsvpId(item?.rsvpId);
      cancelRsvp({ id: item?.rsvpId }).then((res) => {
        if (res?.data?.status) {
          toast.success(res?.data?.message);
          refetch();
          setRsvpId(null);
        }
      });
    } else {
      // other action functionality
    }
  };

  const handleAdd = () => {
    // if (location?.pathname === "/event") {
      navigate("/new-event");
    // }
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
        <Box
          sx={{
            background: "rgba(148, 185, 134, 0.3)",
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
              src={flag}
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
        {eventTableData(
          gotoDetail,
          handleAction,
          myEventData,
          myEventData2,
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
                myEventData2,
                gotoBrand,
                gotoSpace
              )[activeTab].data
            }
            columns={
              eventTableData(
                gotoDetail,
                handleAction,
                myEventData,
                myEventData2,
                gotoBrand,
                gotoSpace,
                likeLoading,
                rsvpLoading,
                savedId,
                rsvpId,
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

export default Event;
