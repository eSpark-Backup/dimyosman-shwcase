import { useRef, useState } from "react";

import { useFormik } from "formik";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";

import Input from "../../../components/Setting/SettingInput";
import { CheckBox } from "../../../components";

import {
  apple,
  facebook,
  google,
  profilePicture,
  settingsIcon,
  uploadIcon,
} from "../../../assets";

import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from "../../../validation/validation";

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
  const theme = useTheme();

  const profileImageRef = useRef(null);

  const [changeName, setChangeName] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeImage, setChangeImage] = useState(false);
  const [profileImage, setProfileImage] = useState(profilePicture);
  const [isPublic, setIsPublic] = useState(true);
  const [allowEmail, setAllowEmail] = useState(true);

  const handleisPublic = (event) => {
    setIsPublic(event.target.checked);
  };

  const handleAllowEmail = (event) => {
    setAllowEmail(event.target.checked);
  };

  const formikConfigs = {
    nameInputs: {
      initialValues: { fName: "Emily", lName: "Thompson" },
      validationSchema: nameSchema,
      onSubmit: (values) => {
        console.log(values);
        setChangeName(false);
      },
    },
    emailInput: {
      initialValues: { email: "emily.thompson@gmail.com" },
      validationSchema: emailSchema,
      onSubmit: (values) => {
        console.log(values);
        setChangeEmail(false);
      },
    },
    passwordInputs: {
      initialValues: { password: "Pa$$w0rd!", conPassword: "Pa$$w0rd!" },
      validationSchema: passwordSchema,
      onSubmit: (values) => {
        console.log(values);
        setChangePassword(false);
      },
    },
  };

  const inputsState = {
    fName: useFormik(formikConfigs.nameInputs),
    lName: useFormik(formikConfigs.nameInputs),
    email: useFormik(formikConfigs.emailInput),
    password: useFormik(formikConfigs.passwordInputs),
    conPassword: useFormik(formikConfigs.passwordInputs),
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
  }) => {
    const objItem = inputsState[name];
    return (
      <Input
        theme={theme}
        label={label}
        name={name}
        type={type}
        value={objItem.values[name]}
        onInputChange={objItem.handleChange}
        onBlur={objItem.handleBlur}
        error={objItem.touched[name] && Boolean(objItem.errors[name])}
        helperText={objItem.touched[name] && objItem.errors[name]}
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
            <img src={settingsIcon} alt="event" />
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
          })}

          <Button
            sx={buttonStyle}
            onClick={() =>
              changeName
                ? inputsState.fName.handleSubmit()
                : setChangeName(true)
            }
          >
            {changeName ? "Save Name" : "Change Name"}
          </Button>
        </Box>

        <Box
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
              This account is connected with emily.thompson@gmail.com
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
        </Box>

        <Box
          sx={{ ...formGroupStyle, marginBottom: 1, gap: !changeEmail ? 3 : 1 }}
        >
          {renderInputField({
            label: "email",
            name: "email",
            type: "text",
            placeholder: "Type Your Email",
            textWidth: "240px",
            flexDirection: "row",
            alignItems: "center",
            isEditable: changeEmail,
          })}

          <Button
            sx={buttonStyle}
            onClick={() =>
              changeEmail
                ? inputsState.email.handleSubmit()
                : setChangeEmail(true)
            }
          >
            {changeEmail ? "Verify New Email Address" : "Change Email Address"}
          </Button>
        </Box>

        <Box
          sx={{
            ...formGroupStyle,
            justifyContent: changePassword ? "space-between" : "inherit",
            alignItems: changePassword ? "center" : "end",
            gap: !changePassword ? 3 : 2,
          }}
        >
          {changePassword ? (
            <>
              {renderInputField({
                label: "choose new password",
                name: "password",
                type: "password",
                placeholder: "Type Your Password",
                width: "300px",
                mb: 1,
                isEditable: changePassword,
              })}

              {renderInputField({
                label: "repeat new password",
                name: "conPassword",
                type: "password",
                placeholder: "Repeat Your Password",
                width: "300px",
                mb: 1,
                isEditable: changePassword,
              })}
            </>
          ) : (
            <>
              {renderInputField({
                label: "change password",
                name: "password",
                type: "password",
                placeholder: "Type Your Password",
                width: "300px",
                mb: 1,
                isEditable: false,
              })}
            </>
          )}

          <Button
            sx={buttonStyle}
            onClick={() =>
              changePassword
                ? inputsState.password.handleSubmit()
                : setChangePassword(true)
            }
          >
            {changePassword ? "Save Password" : "Change Password"}
          </Button>
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
                pt: "15px",
                overflow: "hidden",
                mt: 0.3,
              }}
            >
              {profileImage && (
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

          <Button
            sx={buttonStyle}
            onClick={() =>
              changeImage ? setChangeImage(false) : setChangeImage(true)
            }
          >
            {changeImage ? "Save Profile Picture" : "Change Profile Picture"}
          </Button>
        </Box>

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

        <Box display="flex" alignItems="center" marginBottom={1} columnGap={2}>
          <CheckBox checked={allowEmail} onChange={handleAllowEmail} />
          <Typography sx={{ fontWeight: 600 }}>
            Allow SHWcase to send me occasional emails.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Settings;
