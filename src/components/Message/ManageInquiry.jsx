import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import Input from "../input";
import CheckBox from "../CheckBox";

import { close } from "../../assets";
import ActivityType from "./ActivityType";
import { useState } from "react";

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
const Heading = ({ name, mb = 0, mt = 0 }) => {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        letterSpacing: "-0.011em",
        color: "#1E1E1E",
        mb,
        mt,
      }}
    >
      {name}
    </Typography>
  );
};

const SubHeading = ({ name, subtitle }) => {
  return (
    <Typography
      sx={{
        fontWeight: 300,
        color: "#000000",
      }}
    >
      {name}: <strong style={{ fontWeight: 600 }}>{subtitle}</strong>
    </Typography>
  );
};

const EditableInput = ({ value }) => {
  return (
    <Input
      multiline={true}
      value={value}
      sx={{
        height: "auto",
        fontWeight: "400",
        py: "10px",
        px: "10px",
        mt: "20px",
      }}
    />
  );
};

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

const ManageInquiry = ({ handleModalClose, details }) => {
  const theme = useTheme();

  const { chatGroup, group } = details;

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        position: "relative",
        padding: "16px 16px 32px",
        border: "1px solid rgba(209, 219, 215, 0.5)",
        boxShadow: "0px 0px 20px rgba(0, 20, 28, 0.2)",
        borderRadius: "5px",
        overflowY: "auto",
        height: "90vh",
      }}
    >
      <Box marginBottom={2}>
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
              src={group?.parentImage}
              alt="SpaceImage"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />

            <ActivityType type={group?.parentActivity} theme={theme} />
          </Box>

          <Box sx={{ ml: 2 }}>
            <TopHeading name={group?.parentName} size="24px" />
            <TopHeading
              name={chatGroup?.receiverbrandName}
              size="12px"
              my={0.5}
            />
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              By: <strong>{group?.ownerDetails?.name}</strong>
            </Typography>
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
          onClick={handleModalClose}
        />
      </Box>

      <Box
        sx={{
          padding: "16px",
          height: "50vh",
          overflowY: "auto",
          border: "1px solid rgba(209, 219, 215, 0.5)",
          borderRadius: "5px",
        }}
      >
        {/* HOST DETAILS */}
        <Box sx={{ width: "100%" }}>
          <Heading name="Host Details" />
          <SubHeading name="Host" subtitle={chatGroup?.receiverbrandName} />
          <SubHeading name="Space" subtitle={group?.parentName} />
          <SubHeading name="Host" subtitle={group?.ownerDetails?.name} />
          <EditableInput
            value={
              "Additional notes: ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi."
            }
          />
        </Box>

        {/* TENENCY DETAILS */}
        <Box sx={{ width: "100%", mt: "20px" }}>
          <Heading name="Tenancy Details" />
          <SubHeading
            name="Tenant"
            subtitle={chatGroup?.senderBrand?.brandName}
          />
          <SubHeading name="Event" subtitle="Ecolux Chic Pop-Up" />
          <SubHeading
            name="Owner"
            subtitle={chatGroup?.senderBrand?.user?.name}
          />
          <EditableInput
            value={
              "Additional notes: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi."
            }
          />
          <Box
            sx={{
              width: "fit-content",
              backgroundColor: "rgba(209, 219, 215, 0.2)",
              border: "1px dashed rgba(0, 20, 28, 0.4)",
              borderRadius: "3px",
              mt: "20px",
              padding: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <DetailHeading name="Starting:" weight={300} />
              <DetailHeading name="28.02.2025" weight={600} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <DetailHeading name="Ending:" weight={300} />
              <DetailHeading name="15.04.2025" weight={600} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <DetailHeading name="Lease amount:" weight={300} />
              <DetailHeading name="$2000" weight={600} />
            </Box>
          </Box>
        </Box>

        {/* CONTRACT DETAILS */}
        <Box
          sx={{
            backgroundColor: "rgba(209, 219, 215, 0.2)",
            border: "1px dashed rgba(0, 20, 28, 0.4)",
            borderRadius: "3px",
            mt: 5,
            padding: 2,
          }}
        >
          <Heading name="Contract No: 0123454566536562" />
          <Input
            multiline={true}
            sx={{
              height: "auto",
              backgroundColor: "transparent",
              border: "none",
              padding: 0,
              "& input": {
                fontWeight: 600,
              },
            }}
            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
        </Box>
      </Box>

      {/* CHECKBOX SECTION */}
      <Box mt={2}>
        <Box
          display="flex"
          alignItems="center"
          sx={{ width: "100%", marginBottom: "10px", columnGap: 1 }}
        >
          <CheckBox
            checked={checked}
            onChange={handleChange}
          />
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            I verify that I have read the Contract and that I accept all Terms
            and Conditions.
          </Typography>
        </Box>

        {/* SIGNATURE SECTION */}
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          sx={{ display: { xs: "block", lg: "flex" } }}
        >
          <Box sx={{ textAlign: "left", mb: { xs: 2, lg: 0 } }}>
            <Heading name="Host Signature" mb="10px" />
            <Box
              sx={{
                backgroundColor: "rgba(209, 219, 215, 0.2)",
                width: { xs: "100%", lg: "200px", xl: "278px" },
                padding: "32px 0px",
                border: "1px dashed rgba(0, 20, 28, 0.4)",
                borderRadius: "3px",
                textAlign: "center",
              }}
            >
              Sign here
            </Box>
          </Box>

          <Box sx={{ textAlign: "left" }}>
            <Heading name="Tenant Signature" mb="10px" />
            <Box
              sx={{
                width: { xs: "100%", lg: "200px", xl: "278px" },
                padding: "32px 0px",
                borderRadius: "3px",
                textAlign: "center",
              }}
            >
              Signature Pending
            </Box>
          </Box>
        </Stack>

        <Box display="flex" justifyContent="end" mt={1}>
          <Button
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
          >
            Submit for Signature
          </Button>
        </Box>
        <Heading name="Go to Message History" mt="16px" />
      </Box>
    </Box>
  );
};

export default ManageInquiry;
