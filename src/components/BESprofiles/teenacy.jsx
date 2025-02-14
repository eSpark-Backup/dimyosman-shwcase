import { useState } from "react";
import moment from "moment";
import { Box, Button, Stack, Typography } from "@mui/material";
import ReusableModal from "../Modal";
import ManageInquiry from "../ManageInquiry";
import { convertToSameKeys } from "../../utils";

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

const Tenancy = ({ tenancy }) => {
  const [open, setOpen] = useState(false);
  const [activeTen, setActiveTen] = useState(tenancy[0]);
  const tenancyDetails = activeTen?.contractDetails
    ? JSON.parse(activeTen.contractDetails)
    : "";
  return (
    <Box>
      <Stack
        sx={{ width: "100%", padding: "10px" }}
        gap={2}
        direction={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Stack
          direction="column"
          gap={2}
          sx={{
            width: { xs: "100%", md: "300px" },
            py: "16px",
            maxHeight: { xs: "500px", md: "max-content", overflowY: "auto" },
          }}
        >
          {tenancy?.map((ten, index) => {
            const tenancyDetails = ten?.contractDetails
              ? JSON.parse(ten.contractDetails)
              : "";
            return (
              <Stack
                key={ten?.id}
                onClick={() => setActiveTen(ten)}
                gap={1}
                sx={{
                  background:
                    ten?.id === activeTen.id ? "#D1DBD7" : "transparent",
                  cursor: "pointer",
                  padding: "10px 24px",
                  borderRadius: "3px",
                }}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight={500}>
                  {tenancyDetails?.hostDetails?.host}
                </Typography>
                <Typography fontSize={"12px"}>
                  {moment.utc(ten?.createdAt).format("DD.MM.YYYY.")}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
        <Box sx={{ flex: 1, py: "16px" }}>
          <Stack gap="16px">
            <Typography fontSize="16px" fontWeight={600}>
              Tenancy Details
            </Typography>
            <Typography>
              Tenant:{" "}
              <Typography fontWeight={500} component="span">
                {tenancyDetails?.hostDetails?.host}
              </Typography>
            </Typography>
            <Typography>
              Event:{" "}
              <Typography fontWeight={500} component="span">
                {activeTen?.event ? activeTen?.event?.eventName : "-"}
              </Typography>
            </Typography>
            <Typography>
              by:{" "}
              <Typography fontWeight={500} component="span">
                {tenancyDetails?.hostDetails?.spaceOwner}
              </Typography>
            </Typography>
            <Typography>{tenancyDetails?.description || "-"}</Typography>
            <Stack gap="10px">
              <Typography fontSize="12px">
                Starting:{" "}
                <Typography fontWeight={500} component="span">
                  {tenancyDetails?.leaseInfo?.startDate}.
                </Typography>
              </Typography>
              <Typography fontSize="12px">
                Ending:{" "}
                <Typography fontWeight={500} component="span">
                  {tenancyDetails?.leaseInfo?.endDate}.
                </Typography>
              </Typography>
              <Typography fontSize="12px">
                Lease amount:{" "}
                <Typography fontWeight={500} component="span">
                  {tenancyDetails?.leaseInfo?.leaseTotal}
                </Typography>
              </Typography>
            </Stack>
          </Stack>
          <hr />
          <Button
            onClick={() => setOpen(true)}
            sx={{
              height: "31px",
              fontSize: "16px",
              padding: "0px 24px",
              textTransform: "capitalize",
            }}
          >
            Lease Details
          </Button>
        </Box>
      </Stack>
      <ReusableModal
        hideHeader={true}
        open={open}
        handleClose={() => setOpen(false)}
      >
        <ManageInquiry
          inquiryDetails={tenancyDetails}
          handleModalClose={() => setOpen(false)}
          details={convertToSameKeys(null, {
            ...activeTen,
            contractDetails: tenancyDetails,
          })}
          TopHeading={TopHeading}
          spc={true}
          detailsPage={true}
          ownerSign={activeTen?.ownerSign}
          tenantSign={activeTen?.tenantSign}
          status={activeTen?.status}
          eventName={activeTen?.event?.eventName || "-"}
          activeTab={"Tenant"}
        />
      </ReusableModal>
    </Box>
  );
};

export default Tenancy;
