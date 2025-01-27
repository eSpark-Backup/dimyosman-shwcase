import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import ActivityType from "./Message/ActivityType";

import { close } from "../assets";

import { usePaymentVerificationMutation } from "../services/space";

const DetailHeading = ({ name, weight }) => {
  return (
    <>
      <Typography
        sx={{
          fontWeight: weight,
          color: "#000000",
        }}
      >
        {name}
      </Typography>
    </>
  );
};

const PaymentConfirmation = ({
  id,
  image,
  alt,
  activity,
  TopHeading,
  name,
  brandName,
  contractDetails,
  handleClose,
  upperPara,
  setRefetchTriggered,
  page,
  activeTab,
  refetch,
  setVerifyPayModal,
}) => {
  const theme = useTheme();

  const [paymentVerification, { isLoading }] = usePaymentVerificationMutation();

  const handlePayment = () => {
    const passObj = { page, pageSize: 7, tab: activeTab };

    paymentVerification({ id }).then((res) => {
      if (res?.error) {
        toast.error(res?.error?.data?.message || "something went wrong");
      }

      if (res?.data) {
        setRefetchTriggered(true);
        
        setVerifyPayModal(false);
        refetch(passObj);
      }
    });
  };

  return (
    <Box
      sx={{
        padding: "16px",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(209, 219, 215, 0.5)",
        boxShadow: "0px 0px 20px rgba(0, 20, 28, 0.2)",
        borderRadius: "5px",
        position: "relative",
      }}
    >
      <Box>
        <Stack flexDirection="row" alignItems="center">
          <Box
            sx={{
              width: "64px",
              height: "64px",
              border: "1px solid rgba(209, 219, 215, 0.4)",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            <img
              src={image}
              alt={alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />

            <ActivityType type={activity} theme={theme} />
          </Box>

          <Box sx={{ ml: 2 }}>
            <TopHeading name={name} size="24px" />
            <TopHeading name={brandName} size="12px" my={0.5} />
          </Box>
        </Stack>

        <img
          src={close}
          alt="Close Icon"
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "16px",
            top: "16px",
            width: "24px",
          }}
          onClick={handleClose}
        />
      </Box>

      <Box my={"20px"} textAlign="center">
        <Typography>{upperPara}</Typography>

        <Box
          sx={{
            width: "100%",
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <DetailHeading name="Starting:" weight={300} />
            <DetailHeading
              name={contractDetails?.leaseInfo?.startDate}
              weight={600}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <DetailHeading name="Ending:" weight={300} />
            <DetailHeading
              name={contractDetails?.leaseInfo?.endDate}
              weight={600}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <DetailHeading name="Lease amount:" weight={300} />
            <DetailHeading
              name={contractDetails?.leaseInfo?.leaseTotal}
              weight={600}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <LoadingButton
          sx={{
            padding: "0px 24px",
            height: "31px",
            textTransform: "capitalize",
            background:
              "linear-gradient(0deg, rgba(0, 20, 28, 0.7), rgba(0, 20, 28, 0.7)), #FFFFFF",
            borderRadius: "5px",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "21px",
            letterSpacing: "-0.01em",
          }}
          onClick={handlePayment}
          loading={isLoading}
          loadingIndicator={
            <CircularProgress size={15} sx={{ color: "#ffffff" }} />
          }
        >
          Verify Payment
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default PaymentConfirmation;
