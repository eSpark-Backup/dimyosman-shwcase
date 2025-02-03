import { useRef, useState } from "react";

import { useFormik } from "formik";

import { CircularProgress, Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";

import Input from "../../../components/Setting/SettingInput";
import { CheckBox } from "../../../components";

import {
  apple,
  eye,
  facebook,
  google,
  settingsIconLight,
  uploadIcon,
} from "../../../assets";

import {
  nameSchema,
  passwordSchema,
} from "../../../validation/validation";
import { useDispatch, useSelector } from "react-redux";
import {
  useChangeProfileImageMutation,
  useChangePwMutation,
  useUpdateProfileMutation,
} from "../../../services/auth";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { updateUser } from "../../../store/slices/auth";

const buttonStyle = {
  background:
    "linear-gradient(0deg, rgba(0, 20, 28, 0.7), rgba(0, 20, 28, 0.7)), #FFFFFF",
  borderRadius: "5px",
  padding: "10px 24px",
  lineHeight: "21px",
  letterSpacing: "-0.01em",
  textTransform: "capitalize",
  height: "31px",
  fontSize: "16px",
  fontWeight: 600,
};

const flexItemCenter = { display: "flex", alignItems: "center" };
const flexContentCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formGroupStyle = {
  ...flexItemCenter,
  width: "100%",
  alignItems: { xs: "flex-start", sm: "center"},
  flexDirection: { xs: "column", sm: "row" }
};

const authBtnStyle = {
  ...flexContentCenter,
  width: { xs: "90%", md: "110px" },
  height: "50px",
  borderRadius: "10px",
  border: "2px solid #DDDDDD",
  backgroundColor: "#F8F8F8",
  "&:hover": {
    backgroundColor: "#F8F8F8",
  },
};

const labelStyle = {
  fontSize: "12px",
  fontStyle: "italic",
  textAlign: "left",
  fontWeight: 300,
  lineHeight: "17px",
  color: "#00141C",
  marginRight: 1,
};

const Settings = () => {
  const [updateProfile] = useUpdateProfileMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [changePw, { isLoading: loading }] = useChangePwMutation();
  const [changeProfileImage, { isLoading: imgLoading }] =
    useChangeProfileImageMutation();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const fullName = user?.name?.split(" ");
  const fName = fullName && fullName[0];
  const lName = fullName && fullName[1];

  const profileImageRef = useRef(null);

  const [changeName, setChangeName] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeImage, setChangeImage] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [image, setImage] = useState(null);
  const [isPublic, setIsPublic] = useState(user?.profile);
  const [allowEmail, setAllowEmail] = useState(user?.sendEmails);
  const dispatch = useDispatch();

  const handleisPublic = (event) => {
    setIsProfileLoading(true);
    updateProfile({ profile: event.target.checked, firstName: fName, lastName: lName }).then(
      (res) => {
        if (res?.data) {
          dispatch(updateUser(res?.data?.data));
          setIsPublic(res?.data?.data?.profile);
        }
        setIsProfileLoading(false);
      }
    );
  };

  const handleAllowEmail = (event) => {
    setIsEmailLoading(true);
    updateProfile({ sendEmails: event.target.checked, firstName: fName, lastName: lName }).then(
      (res) => {
        if (res?.data) {
          dispatch(updateUser(res?.data?.data));
          setAllowEmail(res?.data?.data?.sendEmails);
        }
        setIsEmailLoading(false);
      }
    );
  };

  const nameFormik = useFormik({
    initialValues: { fName, lName },
    enableReinitialize: true,
    validationSchema: nameSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      const objToSend = {
        firstName: values?.fName,
        lastName: values?.lName,
      };
      updateProfile(objToSend).then((res) => {
        dispatch(updateUser(res?.data?.data));
        if (res?.data) {
          toast.success("Profile name updated successfully");
          setIsLoading(false);
          setChangeName(false);
        }
      });
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      conPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values, { resetForm }) => {
      const objToSend = {
        oldPassword: values?.oldPassword,
        newPassword: values?.password,
      };
      changePw(objToSend).then((res) => {
        if (res?.error) {
          toast.error(res?.error?.data?.message || "something went wrong");
        }
        if (res?.data) {
          toast.success("Password updated successfully");
          setChangePassword(false);
          resetForm();
        }
      });
    },
  });

  const handleChangeProfileImage = () => {
    if (changeImage) {
      if (image) {
        const formdata = new FormData();
        formdata.append("image", image);
        changeProfileImage(formdata).then((res) => {
          if (res?.error) {
            toast.error(res?.error?.data?.message || "something went wrong");
          }
          if (res?.data) {
            dispatch(updateUser(res?.data?.data));
            setChangeImage(false);
          }
        });
      } else {
        toast.error("Please select the image first");
      }
    } else {
      setChangeImage(true);
    }
  };

  const renderInputField = ({
    label,
    name,
    type,
    placeholder,
    width,
    textWidth,
    flex,
    flexDirection,
    alignItems,
    mb,
    isEditable,
    formik,
  }) => {
    return (
      <Input
        theme={theme}
        label={label}
        name={name}
        type={type}
        value={formik.values[name]}
        onInputChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
        placeholder={placeholder}
        stackStyle={{
          flexDirection,
          alignItems,
          width: width ? width : "auto",
          flex,
          "& label": {
            mb,
          },
        }}
        textFieldStyle={{
          width: textWidth,
        }}
        labelStyle={labelStyle}
        isEditable={isEditable}
      />
    );
  };

  const handleImgClick = () => {
    profileImageRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Stack alignItems="flex-end" marginBottom={2}>
        <Box
          sx={{
            width: "48px",
            height: "48px",
            borderRadius: "5px",
            backgroundColor: "rgb(0, 20, 28, 0.1)",
          }}
        >
          <figure
            style={{
              width: "100%",
              height: "100%",
              ...flexContentCenter,
            }}
            role="space-icon"
          >
            <img src={settingsIconLight} alt="event" />
          </figure>
        </Box>
      </Stack>

      <Box
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          bgcolor: "#ffffff",
          border: "1px solid rgba(209, 219, 215, 0.5)",
          borderRadius: "5px",
          mb: 3.125,
        }}
      >
        <Button
          sx={{
            bgcolor: "rgba(209, 219, 215, 0.6) !important",
            padding: "0px 24px",
            height: "31px",
            ...flexItemCenter,
            borderRadius: "3px",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "capitalize",
            color: "#00141C",
            cursor: "default",
          }}
          disableRipple
        >
          My Account
        </Button>

        <Box sx={{ ...formGroupStyle, gap: 2 }}>
          {renderInputField({
            label: "first name",
            name: "fName",
            type: "text",
            placeholder: "Type Your First Name",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            isEditable: changeName,
            formik: nameFormik,
          })}

          {renderInputField({
            label: "last name",
            name: "lName",
            type: "text",
            placeholder: "Type Your Last Name",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            isEditable: changeName,
            formik: nameFormik,
          })}

          <LoadingButton
            loading={isLoading}
            disabled={isLoading}
            sx={buttonStyle}
            onClick={() =>
              changeName
                ? nameFormik.handleSubmit()
                : setChangeName(true)
            }
          >
            {changeName ? "Save Name" : "Change Name"}
          </LoadingButton>
        </Box>

        {/* <Box
          sx={{
            marginBottom: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography component="label" sx={labelStyle}>
              SSO
            </Typography>

            <Typography
              fontSize={"16px"}
              fontWeight={600}
              lineHeight={"22px"}
              mb={0.6}
              sx={{ color: theme.palette.primary.main }}
            >
              This account is connected with {user?.email}
            </Typography>

            <Box
              sx={{
                display: "flex",
                columnGap: "12px",
                flexDirection: {
                  xs: "column",
                  md: "row",
                  width: "100%",
                  alignItems: "center",
                  rowGap: "10px",
                },
              }}
            >
              <Button sx={authBtnStyle}>
                <img src={google} alt="Google Logo" />
              </Button>
              <Button sx={authBtnStyle}>
                <img src={facebook} alt="Facebook Logo" />
              </Button>
              <Button sx={authBtnStyle}>
                <img src={apple} alt="Apple Logo" />
              </Button>
            </Box>
          </Box>
          <Button sx={{ ...buttonStyle, marginTop: "10px" }}>Edit SSO</Button>
        </Box> */}

        <Box
          sx={{
            ...formGroupStyle,
            justifyContent: changePassword ? "space-between" : "inherit",
            alignItems: changePassword && "flex-start",
            gap: !changePassword ? 3 : 2,
            display: changePassword ? "flex" : "block",
            ".MuiStack-root": {
              width: "280px",
            },
          }}
        >
          {changePassword ? (
            <>
              {renderInputField({
                label: "type old password",
                name: "oldPassword",
                type: "password",
                placeholder: "Type Your Old Password",
                width: "300px",
                mb: 1,
                isEditable: changePassword,
                formik: passwordFormik,
              })}

              {renderInputField({
                label: "choose new password",
                name: "password",
                type: "password",
                placeholder: "Type Your Password",
                width: "300px",
                mb: 1,
                isEditable: changePassword,
                formik: passwordFormik,
              })}

              {renderInputField({
                label: "repeat new password",
                name: "conPassword",
                type: "password",
                placeholder: "Repeat Your Password",
                width: "300px",
                mb: 1,
                isEditable: changePassword,
                formik: passwordFormik,
              })}
            </>
          ) : (
            <>
              <Typography component="label" sx={labelStyle}>
                change password
              </Typography>

              <Box
                sx={{
                  display: "flex",   
                  alignItems: { xs: "flex-start", sm: "center"},
                  flexDirection: { xs: "column", sm: "row" }
                }}
              >
                <Typography
                  style={{
                    fontWeight: 300,
                    lineHeight: "22px",
                    fontFamily: `"Segoe UI", "sans-serif"`,
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    opacity: 0.5,
                    height: "50px",
                    width: "300px",
                  }}
                >
                  {"**********"}

                  <IconButton
                    sx={{
                      margin: 0,
                      padding: 0,
                      cursor: "default",
                      bgcolor: "transparent",
                    }}
                    disableRipple
                  >
                    <img src={eye} alt="eye" />
                  </IconButton>
                </Typography>

                <LoadingButton
                  loading={loading}
                  disabled={loading}
                  sx={buttonStyle}
                  onClick={() =>
                    changePassword
                      ? passwordFormik.handleSubmit()
                      : setChangePassword(true)
                  }
                >
                  {changePassword ? "Save Password" : "Change Password"}
                </LoadingButton>
              </Box>
            </>
          )}

          {changePassword ? (
            <LoadingButton
              loading={loading}
              disabled={loading}
              sx={{ ...buttonStyle, height: "auto", padding: "5px 23px", marginTop: "24px" }}
              onClick={() =>
                changePassword
                  ? passwordFormik.handleSubmit()
                  : setChangePassword(true)
              }
            >
              {changePassword ? "Save Password" : "Change Password"}
            </LoadingButton>
          ) : null}
        </Box>

        <Box sx={{ ...formGroupStyle, marginBottom: 1, gap: 4 }}>
          <Box>
            <Typography component="label" sx={labelStyle}>
              profile picture
            </Typography>

            <Box
              sx={{
                position: "relative",
                height: "96px",
                width: "96px",
                borderRadius: "5px",
                border: "1px dashed rgb(0, 20, 28, 0.4)",
                backgroundColor: "rgb(209, 219, 215, 0.2)",
                ...flexContentCenter,
                pt: changeImage ? "15px" : "",
                overflow: "hidden",
                mt: 0.3,
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Preview"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: changeImage ? 0.5 : 1,
                    borderRadius: "5px",
                  }}
                />
              ) : !profileImage && !changeImage ? (
                "No image"
              ) : (
                ""
              )}
              {changeImage ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "0px",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                  onClick={handleImgClick}
                >
                  <Typography
                    component="label"
                    sx={{
                      fontSize: "14px",
                      fontWeight: "300",
                      color: theme.palette.primary.main,
                      fontStyle: "italic",
                    }}
                  >
                    upload image:
                  </Typography>
                  <img src={uploadIcon} alt="Icon" />
                  <input
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    ref={profileImageRef}
                    onChange={handleImageChange}
                  />
                </Box>
              ) : null}
            </Box>
          </Box>

          <LoadingButton
            loading={imgLoading}
            disabled={imgLoading}
            sx={buttonStyle}
            onClick={handleChangeProfileImage}
          >
            {changeImage ? "Save Profile Picture" : "Change Profile Picture"}
          </LoadingButton>
        </Box>

        {isProfileLoading ? (
          <CircularProgress size={20} />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={1}
            columnGap={2}
            sx={{
              "& img": { width: "18px !important", height: "18px !important" },
            }}
          >
            <CheckBox checked={isPublic} onChange={handleisPublic} />
            <Typography sx={{ fontWeight: 600 }}>
              Display My profile publicly and allow search engines to index it.
            </Typography>
          </Box>
        )}

        {isEmailLoading ? (
          <CircularProgress size={20} />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={1}
            columnGap={2}
          >
            <CheckBox checked={allowEmail} onChange={handleAllowEmail} />
            <Typography sx={{ fontWeight: 600 }}>
              Allow SHWcase to send me occasional emails.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Settings;
