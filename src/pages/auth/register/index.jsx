import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Box, Button, Typography, useTheme } from '@mui/material'
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { Input } from "../../../components";
import { Link, useNavigate } from 'react-router-dom'
import { google, facebook, apple } from "../../../assets";
import { useFormik } from "formik";
import { registerSchema } from '../../../validation/validation';
import { useRegisterMutation } from "../../../services/auth";
import { useGetMyChatsQuery } from '../../../services/chats';
import { logout as logoutFunc } from '../../../store/slices/auth';
import { removeMychat } from '../../../store/slices/chat';
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import GoogleButton from "../../../components/SocialButtons/GoogleButton";
import { deleteCookie, getCookie, logoutAuthUtils, removeActiveNotifications, removeNewInquiry } from "../../../utils";
import { emptyNotification } from '../../../store/slices/notification';

const AUTH0_APP_DOMAIN = import.meta.env.VITE_AUTH0_APP_DOMAIN;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_AUTH0_GOOGLE_APP_CLIENT_ID;

const Register = () => {
  const [register, { isLoading, isSuccess, isError, error}] =
    useRegisterMutation();
    const { refetch } = useGetMyChatsQuery(undefined, {
      skip: !localStorage.getItem("token"),
    });

  const { logout } = useAuth0();
  const [authLoading, setAuthLoading] = useState(false)
  
  const logoutSession = getCookie("logout");
  const socialType = getCookie("social_type");

  useEffect(() => {
    if (logoutSession && socialType) {
        logoutAuthUtils(logout)

      setTimeout(() => {
        deleteCookie("logout");
        deleteCookie("social_type");
      }, 10);
    }
  }, [logoutSession, socialType]);

  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      fName: "",
      lName: "",
      email: "",
      password: "",
      conPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      register({
        firstName: values.fName,
        lastName: values.lName,
        email: values.email,
        password: values.password,
        loginType: "local",
        isSocialLogin: false,
        role: "user",
      });
    },
  });

  useEffect(() => {
    dispatch(logoutFunc());
    dispatch(removeMychat());
    dispatch(emptyNotification());
    removeActiveNotifications(dispatch);
    removeNewInquiry(dispatch);
  }, []);

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message);
        }
        if (isSuccess) {
            refetch()
            navigate("/activity");
        }
    }, [isError, isSuccess, navigate, error]);

    const authBtnStyle = {
        width: { xs: "90%", md: "110px" },
        height: "50px",
        borderRadius: "10px",
        border: "2px solid #DDDDDD",
        backgroundColor: "#F8F8F8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
            backgroundColor: "#F8F8F8"
        }
    };
    return (
        <>
            <Box
                sx={{
                    width: { xs: "90%", sm: "85%", md: "80%" },
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "16px",
                }}
                component={"form"}
                onSubmit={formik.handleSubmit}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", md: "row" },
                        width: "100%",
                        rowGap: "16px"
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: "100%", md: "47%" },
                        }}
                    >
                        <Input
                            login
                            label={"first name"}
                            name={"fName"}
                            type={"text"}
                            value={formik.values.fName}
                            onInputChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fName && Boolean(formik.errors.fName)}
                            helperText={formik.touched.fName && formik.errors.fName}
                            placeholder={"Type Your First Name"}
                            disabled={authLoading}
                        />
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", md: "47%" },
                        }}
                    >
                        <Input
                            login
                            label={"last name"}
                            name={"lName"}
                            type={"text"}
                            value={formik.values.lName}
                            onInputChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lName && Boolean(formik.errors.lName)}
                            helperText={formik.touched.lName && formik.errors.lName}
                            placeholder={"Type Your Last Name"}
                            disabled={authLoading}
                        />
                    </Box>

                </Box>
                <Input
                    login
                    label={"email"}
                    name={"email"}
                    type={"email"}
                    value={formik.values.email}
                    onInputChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    placeholder={"Type Your Email"}
                    disabled={authLoading}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", md: "row" },
                        width: "100%",
                        rowGap: "16px"
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: "100%", md: "47%" },
                        }}
                    >
                        <Input
                            login
                            label={"choose password"}
                            name={"password"}
                            type={"password"}
                            value={formik.values.password}
                            onInputChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            placeholder={"Type Your Password"}
                            disabled={authLoading}
                        />
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", md: "47%" },
                        }}
                    >
                        <Input
                            login
                            label={"repeat password"}
                            name={"conPassword"}
                            type={"password"}
                            value={formik.values.conPassword}
                            onInputChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.conPassword && Boolean(formik.errors.conPassword)}
                            helperText={formik.touched.conPassword && formik.errors.conPassword}
                            placeholder={"Type Your Password"}
                            disabled={authLoading}
                        />
                    </Box>
                </Box>
                <LoadingButton loading={isLoading || authLoading} type="submit" sx={{ textTransform: "none", color: "#fff" }}>
                    Sign Up
                </LoadingButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <Link
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#00141C",
                  fontFamily: "'Segoe UI'",
                  display: "inline-block",
                }}
                to={"/auth?type=register"}
              >
                Terms of Use
              </Link>
              <Typography
                fontSize={12}
                fontWeight={500}
                textAlign="center"
                sx={{ display: "inline-block" }}
              >
                and
              </Typography>
              <Link
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#00141C",
                  fontFamily: "'Segoe UI'",
                  display: "inline-block",
                }}
                to={"/auth?type=register"}
              >
                Privacy Policy
              </Link>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "12px",
                    width: "100%",
                }}
            >
                <Typography fontSize={12} fontWeight={500} textAlign="center" sx={{ color: theme.palette.primary.main }}>Or connect via</Typography>
                <Box
                    sx={{
                        display: "flex",
                        columnGap: "12px",
                        flexDirection: {
                            xs: "column",
                            md: "row",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            rowGap: "10px",
                        },
                    }}
                >
                    <Auth0Provider
                        domain={AUTH0_APP_DOMAIN}
                        clientId={GOOGLE_CLIENT_ID}
                        authorizationParams={{
                            redirect_uri: window.location.origin,
                        }}
                    >
                        <GoogleButton 
                            authBtnStyle={authBtnStyle}
                            register={register}
                            isSuccessRegister={isSuccess}
                            isErrorRegister={isError}
                            errorRegister={error}
                            setAuthLoading={setAuthLoading}
                        />
                    </Auth0Provider>
                    
                    <Button sx={authBtnStyle}>
                        <img src={facebook} alt="Facebook Logo" />
                    </Button>
                    <Button sx={authBtnStyle}>
                        <img src={apple} alt="Apple Logo" />
                    </Button>
                </Box>
            </Box>
            <Typography fontSize={12} fontWeight={500} textAlign="center" sx={{ color: theme.palette.primary.main }}>
                Already have an account? {" "}
                <Link to={"/auth?type=login"}
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "#00141C",
                    fontFamily: "'Segoe UI'",
                  }}
                >
                    Log in
                </Link>
            </Typography>
        </>
    )
}

export default Register;
