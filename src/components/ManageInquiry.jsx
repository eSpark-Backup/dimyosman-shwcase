import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import ActivityType from "./Message/ActivityType";
import Input from "./input";
import CheckBox from "./CheckBox";

import { close } from "../assets";

import { separateRawData } from "../utils";

import { useLeaseSpaceInquireMutation, useTenantSignMutation } from "../services/space";

const Heading = ({ name, mb = 0, mt = 0, onClick = () => {}, cursor = "default" }) => {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        letterSpacing: "-0.011em",
        color: "#1E1E1E",
        mb,
        mt,
        cursor
      }}
      onClick={onClick}
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

const EditableInput = ({ value, onInputChange }) => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "rgba(209, 219, 215, 0.2)",
        border: "1px dashed rgba(0, 20, 28, 0.4)",
        borderRadius: "3px",
        padding: 2,
        display: "flex",
        alignItems: "baseline",
        marginTop: "20px",
      }}
    >
      <label style={{ marginRight: "8px", fontWeight: 600 }}>
        Additional Info:
      </label>
      <Input
        multiline={true}
        value={value}
        flex="auto"
        placeholder="Add aditional info here"
        sx={{
          height: "auto",
          fontWeight: "400",
          backgroundColor: "transparent",
          border: "none",
          padding: 0,
        }}
        onInputChange={onInputChange}
      />
    </Box>
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

const ManageInquiry = ({
  handleModalClose,
  details,
  setAfterSignature,
  TopHeading,
  setShowIinquiryModal,
  spc = false,
  ownerSign = null,
  tenantSign = null,
  status = null,
  refetch = null,
  tabsForApi = [],
  activeTab = null,
  page = null,
  setRefetchTriggered = null,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [leaseSpace, { isLoading }] = useLeaseSpaceInquireMutation();
  const [tenantSpace, { isLoading: isTenantLoading }] = useTenantSignMutation();

  const profileImageRef = useRef(null);

  const [imageWithPreview, setImageWithPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [checked, setChecked] = useState(false);
  const [inquiryDetails, setInquiryDetails] = useState({
    spaceId: "",
    chatId: "",
    tenantId: "",
    brandId: "",
    contractDetails: {
      hostDetails: {
        host: "",
        space: "",
        spaceOwner: "",
        additionalInfo: "",
      },
      tenantDetails: {
        tenant: "",
        event: "",
        tenantOwner: "",
        additionalInfo: "",
      },
      leaseInfo: {},
      description: "",
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageWithPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBoxClick = () => {
    profileImageRef.current.click();
  };

  useEffect(() => {
    if (details) {
      setInquiryDetails((prev) => ({
        ...prev,
        spaceId: details?.spaceId,
        chatId: details?.chatId,
        tenantId: details?.tenantId,
        brandId: details?.brandId,
        contractDetails: {
          hostDetails: {
            host: details?.host,
            space: details?.space,
            spaceOwner: details?.spaceOwner,
            additionalInfo: details?.hostAdditionalInfo || "",
          },
          tenantDetails: {
            tenant: details?.tenant,
            event: details?.events || "Ecolux Chic Pop-Up",
            tenantOwner: details?.tenantOwner,
            additionalInfo: details?.tenantAdditionalInfo || "",
          },
          leaseInfo: spc
            ? details?.leaseInfo
            : separateRawData(details?.leaseInfo),
          description: details?.contractDescription || "",
        },
      }));
    }
  }, [details]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const onSubmit = () => {
    if (!checked) {
      toast.error("Please accept terms and conditions");
      return;
    }

    if (!imageWithPreview) {
      toast.error("Signature is required");
      return;
    }

    const updateInquiryObject = {
      ...inquiryDetails,
      image,
    };
    if (spc) {
      const passObj = { page, pageSize: 7, tab: tabsForApi[activeTab] };

      const tenantDetails = {
        id: inquiryDetails.tenantId,
        image,
      };

      tenantSpace({ data: tenantDetails }).then((res) => {
        if (res?.error) {
          toast.error(res?.error?.data?.message || "something went wrong");
        }

        if (res?.data) {
          setRefetchTriggered(true);

          setShowIinquiryModal(false);
          setChecked(false);
          setImageWithPreview(null);
          setImage(null);
          setAfterSignature(true);
          refetch(passObj);
        }
      });
    } else {
      leaseSpace({ data: updateInquiryObject }).then((res) => {
        if (res?.error) {
          toast.error(res?.error?.data?.message || "something went wrong");
        }
        if (res?.data) {
          setShowIinquiryModal(false);
          // toast.success(res?.data?.message || "Lease Contract Sent Successfully");
          setInquiryDetails((prevState) => ({
            ...prevState,
            contractDetails: {
              ...prevState.contractDetails,
              hostDetails: {
                ...prevState.contractDetails.hostDetails,
                additionalInfo: "",
              },
              tenantDetails: {
                ...prevState.contractDetails.tenantDetails,
                additionalInfo: "",
              },
              description: "",
            },
          }));
          setChecked(false);
          setImageWithPreview(null);
          setImage(null);
          setAfterSignature(true);
        }
      });
    }
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

        "@media only screen and (min-height: 0px)": {
          height: "90vh",
        },

        "@media only screen and (min-height: 1100px)": {
          height: "62vh",
        },
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
              src={details?.spaceImage}
              alt="SpaceImage"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />

            <ActivityType type={details?.activity} theme={theme} />
          </Box>

          <Box sx={{ ml: 2 }}>
            <TopHeading name={details?.space} size="24px" />
            <TopHeading name={details?.host} size="12px" my={0.5} />
            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              By: <strong>{details?.spaceOwner}</strong>
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
          overflowY: "auto",
          border: "1px solid rgba(209, 219, 215, 0.5)",
          borderRadius: "5px",

          "@media only screen and (min-height: 0px)": {
            height: "50vh",
          },

          "@media only screen and (min-height: 1100px)": {
            height: "35vh",
          },
        }}
      >
        {/* HOST DETAILS */}
        <Box sx={{ width: "100%" }}>
          <Heading name="Host Details" />
          <SubHeading
            name="Host"
            subtitle={inquiryDetails?.contractDetails?.hostDetails?.host}
          />
          <SubHeading
            name="Space"
            subtitle={inquiryDetails?.contractDetails?.hostDetails?.space}
          />
          <SubHeading
            name="Owner"
            subtitle={inquiryDetails?.contractDetails?.hostDetails?.spaceOwner}
          />
          {!spc ? (
            <EditableInput
              value={inquiryDetails.contractDetails.hostDetails.additionalInfo}
              onInputChange={(event) =>
                setInquiryDetails((prevState) => ({
                  ...prevState,
                  contractDetails: {
                    ...prevState.contractDetails,
                    hostDetails: {
                      ...prevState.contractDetails.hostDetails,
                      additionalInfo: event.target.value,
                    },
                  },
                }))
              }
            />
          ) : (
            inquiryDetails.contractDetails.hostDetails.additionalInfo && (
              <Box
                sx={{
                  padding: 2,
                  marginTop: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 300,
                    color: "#00141C",
                  }}
                >
                  <strong>Addional notes:</strong>
                  <span style={{ paddingLeft: "5px", wordBreak: "break-all" }}>
                    {inquiryDetails.contractDetails.hostDetails.additionalInfo}
                  </span>
                </Typography>
              </Box>
            )
          )}
        </Box>

        {/* TENENCY DETAILS */}
        <Box sx={{ width: "100%", mt: "20px" }}>
          <Heading name="Tenancy Details" />
          <SubHeading
            name="Tenant"
            subtitle={inquiryDetails?.contractDetails?.tenantDetails?.tenant}
          />
          <SubHeading
            name="Event"
            subtitle={inquiryDetails?.contractDetails?.tenantDetails?.event}
          />
          <SubHeading
            name="Owner"
            subtitle={
              inquiryDetails?.contractDetails?.tenantDetails?.tenantOwner
            }
          />
          {!spc ? (
            <EditableInput
              value={
                inquiryDetails.contractDetails.tenantDetails.additionalInfo
              }
              onInputChange={(event) =>
                setInquiryDetails((prevState) => ({
                  ...prevState,
                  contractDetails: {
                    ...prevState.contractDetails,
                    tenantDetails: {
                      ...prevState.contractDetails.tenantDetails,
                      additionalInfo: event.target.value,
                    },
                  },
                }))
              }
            />
          ) : (
            inquiryDetails.contractDetails.tenantDetails.additionalInfo && (
              <Box
                sx={{
                  padding: 2,
                  marginTop: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 300,
                    color: "#00141C",
                  }}
                >
                  <strong>Addional notes:</strong>
                  <span style={{ paddingLeft: "5px", wordBreak: "break-all" }}>
                    {
                      inquiryDetails.contractDetails.tenantDetails
                        .additionalInfo
                    }
                  </span>
                </Typography>
              </Box>
            )
          )}
          <Box
            sx={{
              width: "fit-content",
              backgroundColor: !spc && "rgba(209, 219, 215, 0.2)",
              border: !spc && "1px dashed rgba(0, 20, 28, 0.4)",
              borderRadius: "3px",
              mt: "20px",
              padding: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <DetailHeading name="Starting:" weight={300} />
              <DetailHeading
                name={inquiryDetails.contractDetails.leaseInfo?.startDate}
                weight={600}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <DetailHeading name="Ending:" weight={300} />
              <DetailHeading
                name={inquiryDetails.contractDetails.leaseInfo?.endDate}
                weight={600}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <DetailHeading name="Lease amount:" weight={300} />
              <DetailHeading
                name={inquiryDetails.contractDetails.leaseInfo?.leaseTotal}
                weight={600}
              />
            </Box>
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: "rgba(209, 219, 215, 0.4)",
            mb: "50px",
            mt: "36px",
          }}
        />
        {/* CONTRACT DETAILS */}
        {inquiryDetails.contractDetails.description && (
          <Box
            sx={{
              backgroundColor: !spc && "rgba(209, 219, 215, 0.2)",
              border: !spc && "1px dashed rgba(0, 20, 28, 0.4)",
              borderRadius: "3px",
              padding: 2,
            }}
          >
            <Heading name="Contract No: 0123454566536562" />
            {!spc ? (
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
                placeholder="Add contract description here"
                value={inquiryDetails.contractDetails.description}
                onInputChange={(event) =>
                  setInquiryDetails((prevState) => ({
                    ...prevState,
                    contractDetails: {
                      ...prevState.contractDetails,
                      description: event.target.value,
                    },
                  }))
                }
              />
            ) : (
              <Typography
                sx={{
                  fontWeight: 300,
                  color: "#00141C",
                  wordBreak: "break-all",
                }}
              >
                {inquiryDetails.contractDetails.description}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* CHECKBOX SECTION */}
      <Box mt={2}>
        <Box
          display="flex"
          alignItems="center"
          sx={{ width: "100%", marginBottom: "10px", columnGap: 1 }}
        >
          <CheckBox
            checked={spc && status === "Active" ? true : checked}
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
                backgroundColor: !spc && "rgba(209, 219, 215, 0.2)",
                width: { xs: "100%", lg: "200px", xl: "278px" },
                padding: !spc ? (imageWithPreview ? 0 : "32px 0px") : 0,
                border: !spc && "1px dashed rgba(0, 20, 28, 0.4)",
                borderRadius: "3px",
                textAlign: "center",
                cursor: !spc && "pointer",
              }}
              onClick={!spc ? handleBoxClick : null}
            >
              {spc && ownerSign ? (
                <img
                  src={ownerSign}
                  alt="Preview"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              ) : imageWithPreview ? (
                <img
                  src={imageWithPreview}
                  alt="Preview"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              ) : (
                "Sign here"
              )}
            </Box>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={profileImageRef}
              onChange={handleImageChange}
            />
          </Box>

          <Box sx={{ textAlign: "left" }}>
            <Heading name="Tenant Signature" mb="10px" />
            {!spc ? (
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
            ) : (
              <>
                <Box
                  sx={{
                    backgroundColor: "rgba(209, 219, 215, 0.2)",
                    width: { xs: "100%", lg: "200px", xl: "278px" },
                    padding: !tenantSign
                      ? imageWithPreview
                        ? 0
                        : "32px 0px"
                      : 0,
                    border: !tenantSign && "1px dashed rgba(0, 20, 28, 0.4)",
                    borderRadius: "3px",
                    textAlign: "center",
                    cursor: !tenantSign && "pointer",
                  }}
                  onClick={handleBoxClick}
                >
                  {spc && tenantSign ? (
                    <img
                      src={tenantSign}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  ) : imageWithPreview ? (
                    <img
                      src={imageWithPreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "Sign here"
                  )}
                </Box>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={profileImageRef}
                  onChange={handleImageChange}
                />
              </>
            )}
          </Box>
        </Stack>

        {status && status === "Active" ? null : (
          <Box display="flex" justifyContent="end" mt={2}>
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
              onClick={onSubmit}
              loading={isLoading || isTenantLoading}
              loadingIndicator={
                <CircularProgress size={15} sx={{ color: "#ffffff" }} />
              }
            >
              {spc ? "Submit" : "Submit for Signature"}
            </LoadingButton>
          </Box>
        )}
        <Heading
          name="Go to Message History"
          mt="16px"
          cursor="pointer"
          onClick={() => {
            if (pathname === "/message") {
              setShowIinquiryModal(false);
              setChecked(false);
              setImageWithPreview(null);
              setImage(null);
            } else {
              navigate("/message", {
                state: {
                  brandName: details.tenant,
                  chatId: details.chatId,
                },
              });
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default ManageInquiry;
