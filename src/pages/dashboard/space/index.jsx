import {
  Box,
  Button,
  Card,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DynamicTable, FilterationTabs } from "../../../components";
import { spaceTableData } from "../../../constant";
import { addIcon, like, spaceIconLight } from "../../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAllSpaceQuery } from "../../../services/space";
import { toast } from "react-toastify";
import ReusableModal from "../../../components/Modal";
import AfterSignature from "../../../components/AfterSignature";
import ManageInquiry from "../../../components/ManageInquiry";
import { convertToSameKeys, getCookie, setCookie, spacesAction } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  setHasPaymentDone,
  setRedirectTab,
  setTabForNotification,
} from "../../../store/slices/space";
import PaymentConfirmation from "../../../components/PaymentConfirmation";
import { useSocket } from "../../../context/SocketContext";
import {
  getNotification,
  getNotificationCount,
} from "../../../store/slices/notification";
import { useGetNotificationDataQuery } from "../../../services/notifications";
import {
  useAddInFavouritesMutation,
  useGetFavouritesQuery,
} from "../../../services/favourite";

const TopHeading = ({ name, size, my = 0 }) => {
  return (
    <Typography
      sx={{
        fontWeight: 600,
        fontSize: size,
        color: "#00141C",
        my,
      }}
    >
      {name}
    </Typography>
  );
};

const leasePaymentText =
  "Please verify your payment for below contract details.";
const tenantPaymentText =
  "By clicking this you verify that Tenant has paid the lease amount for Space";

const Space = () => {
  const { emitEvent, addListener, removeListener } = useSocket();

  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { hasPaymentDone, navigationActiveTab } = useSelector(
    (state) => state.space
  );
  const { activeTabForNotif } = useSelector((state) => state.space);

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
    {
      label: "Tenancy",
      icon: null,
    },
  ];
  const tabsForApi = ["Space", "Lease", "Saved", "Tenant"];
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [showInquiryModal, setShowIinquiryModal] = useState(false);
  const [afterSignature, setAfterSignature] = useState(false);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [refetchTriggered, setRefetchTriggered] = useState(false);
  const [verifyPayModal, setVerifyPayModal] = useState(false);
  const [verifyDetail, setVerifyDetail] = useState(null);

  const [mySpaceData, setMySpaceData] = useState([]);
  const [mySpaceData2, setMySpaceData2] = useState([]);

  useEffect(() => {
    if (navigationActiveTab !== "") {
      const indexOfNav = tabsForApi.findIndex((t) => t === navigationActiveTab);

      if (indexOfNav !== -1) {
        setActiveTab(indexOfNav);
        dispatch(setRedirectTab(""));
      }
    }
  }, [navigationActiveTab]);

  const {
    data: notificationData,
    isSuccess: notificationSuccess,
    refetch: notificationRefetch,
  } = useGetNotificationDataQuery(undefined, { skip: pathname !== "/space" });

  useEffect(() => {
    if (
      notificationData?.data &&
      notificationData?.data?.notifications?.length > 0
    ) {
      dispatch(getNotification(notificationData?.data?.notifications));
    }
  }, [notificationSuccess, notificationData]);

  const { data, isError, isLoading, isSuccess, error, isFetching, refetch } =
    useGetAllSpaceQuery(
      { page, pageSize: 7, tab: tabsForApi[activeTab] },
      {
        skip: tabsForApi[activeTab] === "Saved",
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
      }
    );

  const handleNotificationUpdate = (cookieName, action) => {
    const currentValue = getCookie(cookieName);
    const newCount = currentValue ? parseInt(currentValue) + 1 : 1;

    setCookie(cookieName, newCount);
    dispatch(action(newCount));
  };

  useEffect(() => {
    addListener("NEW_NOTIFICATION", (data) => {
      console.log("NEW_NOTIFICATION EVENT TRIGGERED.");

      if (pathname === "/space") {
        dispatch(setHasPaymentDone(true));
      }

      handleNotificationUpdate("newNotification", getNotificationCount);
      let redName = data.redirect;

      if (pathname === "/space") {
        if (data.redirect === "Lease" && activeTabForNotif !== "Lease") {
          redName = "Lease";
        } else if (
          data.redirect === "Tenant" &&
          activeTabForNotif !== "Tenant"
        ) {
          redName = "Tenant";
        }
      }



      toast.info(data?.name, {
        position: "bottom-right",
        onClick: () => {
          dispatch(setRedirectTab(redName));
          if (pathname !== "/space") {
            navigate("/space");
          }
        },
      });

      notificationRefetch();
    });

    return () => {
      removeListener("NEW_NOTIFICATION");
    };
  }, [addListener, removeListener, emitEvent, activeTab, data?.data]);
  const {
    data: data2,
    isError: isError2,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    error: error2,
    isFetching: isFetching2,
    refetch: refetch2,
  } = useGetFavouritesQuery(
    { page, pageSize: 7, entity: "SPACE" },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      skip:
        tabsForApi[activeTab] === "Space" ||
        tabsForApi[activeTab] === "Lease" ||
        tabsForApi[activeTab] === "Tenant",
    }
  );

  const navigate = useNavigate();

  const transformSpaceData = (apiData) => {
    return apiData.map((space, index) => {
      const dayFilter = space?.pricing?.filter((item) => item?.term === "Day");
      return {
        id: space?.id,
        type: "space",
        eventName: space?.spaceName,
        eventImg: space?.spaceImage,
        price: dayFilter?.length > 0 ? "$" + dayFilter[0]?.price : "-",
        term: dayFilter?.length > 0 ? dayFilter[0]?.term : "-",
        brand: space?.brand?.brandName,
        brandUrl: `/brand/${space?.brand?.id}`,
        action: "Edit",
      };
    });
  };

  const transformSavedSpaceData = (apiData) => {
    return apiData.map(({ space }, index) => {
      return {
        id: space?.id,
        spaceId: space?.id,
        type: "space",
        eventName: space?.spaceName,
        eventImg: space?.spaceImage,
        currently:
          space?.status === "SubmitForSignature"
            ? "Pending Sign"
            : space?.status === "VerifyAndPay" ||
              space?.status === "PendingforApproval"
            ? "Pending Pay"
            : space?.status === "Active"
            ? "Leasing"
            : "Lease Ended",
        price: space?.pricing[0]?.price,
        term: "Daily",
        status: space?.status,
        event: space?.contractDetails?.tenantDetails?.event,
        brand: space?.brand?.brandName,
        eventUrl: "-",
        brandUrl: `/brand/${space?.brand?.id}`,
        action:
          space?.status === "SubmitForSignature"
            ? "Sign"
            : space?.status === "VerifyAndPay"
            ? "Verify Pay 0/2"
            : space?.status === "PendingforApproval"
            ? "Verify Pay 1/2"
            : space?.status === "Active"
            ? "Details"
            : "Review",
      };
    });
  };

  const transformLeaseSpaceData = (apiData) => {
    return apiData.map((space, index) => {
      return {
        id: space?.id,
        spaceId: space?.space?.id,
        type: "space",
        eventName: space?.space?.spaceName,
        eventImg: space?.space?.spaceImage,
        currently:
          space?.status === "SubmitForSignature"
            ? "Pending Sign"
            : space?.status === "VerifyAndPay" ||
              space?.status === "PendingforApproval"
            ? "Pending Pay"
            : space?.status === "Active"
            ? "Leasing"
            : "Lease Ended",
        price: space?.contractDetails?.leaseInfo?.leaseTotal,
        term: "Daily",
        event: space?.contractDetails?.tenantDetails?.event,
        brand: space?.brand?.brandName,
        eventUrl: "-",
        brandUrl: `/brand/${space?.brand?.id}`,
        action:
          space?.status === "SubmitForSignature"
            ? "Sign"
            : space?.status === "VerifyAndPay"
            ? "Verify Pay 0/2"
            : space?.status === "PendingforApproval"
            ? "Verify Pay 1/2"
            : space?.status === "Active"
            ? "Details"
            : "Review",
      };
    });
  };

  const transformTenantSpaceData = (apiData) => {
    return apiData.map((space, index) => {
      return {
        id: space?.id,
        spaceId: space?.space?.id,
        type: "space",
        eventName: space?.space?.spaceName,
        eventImg: space?.space?.spaceImage,
        brand: space?.brand?.brandName,
        owner: space?.owner?.name,
        event: space?.contractDetails?.tenantDetails?.event,
        starting: space?.contractDetails?.leaseInfo?.startDate,
        ending: space?.contractDetails?.leaseInfo?.endDate,
        lease: space?.contractDetails?.leaseInfo?.leaseTotal,
        status:
          space?.status === "SubmitForSignature"
            ? "Pending Sign"
            : space?.status === "VerifyAndPay" ||
              space?.status === "PendingforApproval"
            ? "Pending Pay"
            : space?.status === "Active"
            ? "Leasing"
            : "Lease Ended",
        eventUrl: "-",
        brandUrl: `/brand/${space?.brand?.id}`,
        action:
          space?.status === "SubmitForSignature"
            ? "Message"
            : space?.status === "VerifyAndPay"
            ? "Verify 0/2"
            : space?.status === "PendingforApproval"
            ? "Verify 1/2"
            : space?.status === "Active"
            ? "Details"
            : "Review",
        spaceStatus: space?.status,
        tenant: true,
      };
    });
  };

  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);

  useEffect(() => {
    if (hasPaymentDone) {
      setRefetchTriggered(true);
      if (
        tabsForApi[activeTab] === "Lease" ||
        tabsForApi[activeTab] === "Tenant"
      ) {
        const passObj = { page, pageSize: 7, tab: tabsForApi[activeTab] };

        refetch(passObj).finally(() => {
          dispatch(setHasPaymentDone(false));
        });
      }
    }
  }, [hasPaymentDone, activeTab]);

  useEffect(() => {
    if (isError && !hasShownErrorToast) {
      toast.error(error?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMySpaceData([]);
    }

    if (isError2 && !hasShownErrorToast) {
      toast.error(error2?.data?.message, { toastId: "error-toast" });
      setHasShownErrorToast(true);
      setMySpaceData2([]);
    }

    if (tabsForApi[activeTab] !== "Saved") {
      if (isSuccess) {
        if (data?.data?.spaces?.length) {
          setMySpaceData(transformSpaceData(data?.data?.spaces || []));
        } else if (data?.data?.leaseSpace?.length) {
          setMySpaceData(transformLeaseSpaceData(data?.data?.leaseSpace || []));
        } else {
          setMySpaceData(
            transformTenantSpaceData(data?.data?.tenantSpace || [])
          );
        }
        setHasShownErrorToast(false);
      }
    } else {
      setMySpaceData([]);
    }

    if (isSuccess2) {
      setMySpaceData2(
        transformSavedSpaceData(data2?.data?.savedEntities || [], "fav")
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
    dispatch(setTabForNotification(tabsForApi[newValue]));
    setActiveTab(newValue);
  };

  const gotoDetail = (item, lease = null) => {
    //go to detail page functionality
    let id = null;

    if (lease) {
      id = item.spaceId;
    } else {
      id = item.id;
    }
    navigate(`/space/${id}`);
  };

  const [likeFunc, { isLoading: likeLoading }] = useAddInFavouritesMutation();

  const handleAction = async (item, type) => {
    if (type === "remove") {
      await likeFunc({
        entityId: item?.spaceId,
        entityType: item?.type?.toUpperCase(),
      }).unwrap();
      refetch2();
      return;
    }
    const findLeaseDetails = (type, itemId) => {
      if (type === "Verify Pay 0/2") {
        return data?.data?.leaseSpace?.find((lease) => lease.id === itemId);
      } else if (type === "Verify 1/2") {
        return data?.data?.tenantSpace?.find((tenant) => tenant.id === itemId);
      }
      return null;
    };

    spacesAction(
      item,
      type,
      navigate,
      setTenantDetails,
      setShowIinquiryModal,
      setVerifyPayModal,
      setVerifyDetail,
      data?.data?.leaseSpace,
      data?.data?.tenantSpace,
      findLeaseDetails,
      dispatch
    );
  };

  const handleModalClose = () => {
    setShowIinquiryModal(false);
    setAfterSignature(false);
    setVerifyPayModal(false);
    setTenantDetails(null);
    setVerifyDetail(null);
  };

  const gotoBrand = (item, type = "") => {
    //go to detail page functionality

    if (type === "other") {
      navigate(item?.brandUrl, { state: { other: true } });
    } else {
      navigate(item?.brandUrl);
    }
  };

  const handleAdd = () => {
    //add functionality
    navigate("/new-space");
  };

  if (
    (isLoading2 || isLoading || isFetching2 || isFetching) &&
    !refetchTriggered
  ) {
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
            width: "48px",
            height: "48px",
            borderRadius: "5px",
            backgroundColor: "rgb(120, 150, 195, 0.3)",
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
            <img src={spaceIconLight} alt="event" />
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
        {spaceTableData(gotoDetail, handleAction, mySpaceData, mySpaceData2, gotoBrand)[
          activeTab
        ].data.length > 0 ? (
          <DynamicTable
            isLoading={false}
            data={
              spaceTableData(gotoDetail, handleAction, mySpaceData, mySpaceData2, gotoBrand)[
                activeTab
              ].data
            }
            columns={
              spaceTableData(gotoDetail, handleAction, mySpaceData, mySpaceData2, gotoBrand, likeLoading)[
                activeTab
              ].column
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
                "You don't currently own any spaces. Would you like to add a new one?"
              }
            </Typography>
            {activeTab !== 1 ? (
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
            ) : null}
          </Stack>
        )}
      </Card>

      <ReusableModal
        hideHeader={true}
        open={showInquiryModal}
        handleClose={handleModalClose}
      >
        <ManageInquiry
          handleModalClose={handleModalClose}
          details={convertToSameKeys(null, tenantDetails)}
          setAfterSignature={setAfterSignature}
          TopHeading={TopHeading}
          setShowIinquiryModal={setShowIinquiryModal}
          spc={true}
          ownerSign={tenantDetails?.ownerSign}
          tenantSign={tenantDetails?.tenantSign}
          status={tenantDetails?.status}
          refetch={refetch}
          tabsForApi={tabsForApi}
          activeTab={activeTab}
          page={page}
          setRefetchTriggered={setRefetchTriggered}
        />
      </ReusableModal>

      <ReusableModal
        hideHeader={true}
        open={afterSignature}
        handleClose={handleModalClose}
      >
        <AfterSignature
          image={convertToSameKeys(null, tenantDetails)?.spaceImage}
          alt="SpaceImage"
          activity={"space"}
          TopHeading={TopHeading}
          name={convertToSameKeys(null, tenantDetails)?.space}
          brandName={convertToSameKeys(null, tenantDetails)?.host}
          handleClose={handleModalClose}
          upperPara="Your Signature has been sent."
          lowerPara="From this moment, the Contract is considered active and binding."
        />
      </ReusableModal>

      <ReusableModal
        hideHeader={true}
        open={verifyPayModal}
        handleClose={handleModalClose}
      >
        <PaymentConfirmation
          id={verifyDetail?.id}
          image={convertToSameKeys(null, verifyDetail)?.spaceImage}
          alt="SpaceImage"
          activity={"space"}
          TopHeading={TopHeading}
          name={convertToSameKeys(null, verifyDetail)?.space}
          brandName={convertToSameKeys(null, verifyDetail)?.host}
          contractDetails={verifyDetail?.contractDetails}
          handleClose={handleModalClose}
          upperPara={
            tabsForApi[activeTab] === "Lease"
              ? leasePaymentText
              : tenantPaymentText
          }
          setRefetchTriggered={setRefetchTriggered}
          page={page}
          activeTab={tabsForApi[activeTab]}
          refetch={refetch}
          setVerifyPayModal={setVerifyPayModal}
        />
      </ReusableModal>
    </Box>
  );
};

export default Space;
