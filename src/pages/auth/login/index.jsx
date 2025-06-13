import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Input } from "../../../components";
import { google, facebook, apple } from "../../../assets";
import { useFormik } from "formik";
import { loginSchema } from "../../../validation/validation";
import { useTheme } from "@emotion/react";
import { useLoginMutation, useRegisterMutation } from "../../../services/auth";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useGetMyChatsQuery } from "../../../services/chats";
import { logout as logoutFunc } from "../../../store/slices/auth";
import { removeMychat } from "../../../store/slices/chat";
import GoogleButton from "../../../components/SocialButtons/GoogleButton";
import { deleteCookie, getCookie, logoutAuthUtils, removeActiveNotifications, removeNewInquiry, setCookie } from "../../../utils";
import { emptyNotification } from "../../../store/slices/notification";
import { setAllGeneralData, setAllSearchData, setName, setSearch, setSearchQuery, setSpaceSearchData } from "../../../store/slices/search";
import { setActivityPageNumber, setActivityRecall } from "../../../store/slices/activity";

const AUTH0_APP_DOMAIN = import.meta.env.VITE_AUTH0_APP_DOMAIN;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_AUTH0_GOOGLE_APP_CLIENT_ID;

const Login = () => {
    const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
    const [register, { isSuccess: isSuccessRegister, isError: isErrorRegister, error: errorRegister, }] = useRegisterMutation();
    const { refetch } = useGetMyChatsQuery(undefined, {
      skip: !localStorage.getItem("token"),
    });
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {
          login(values);
        },
  });
  const { logout } = useAuth0();
  const [authLoading, setAuthLoading] = useState(false)

  const logoutSession = getCookie("logout");
  const socialType = getCookie("social_type");

  useEffect(() => {
    if (logoutSession && socialType) {
      logoutAuthUtils(logout);

      setTimeout(() => {
        deleteCookie("logout");
        deleteCookie("social_type");
        deleteCookie("search_query");
        deleteCookie("isCalled");
        removeForSearch();
      }, 10);
    }
  }, [logoutSession, socialType]);

  useEffect(() => {
    deleteCookie("search_query");
    deleteCookie("isCalled");
    removeForSearch();

    dispatch(logoutFunc());
    dispatch(removeMychat());
    dispatch(emptyNotification());
    removeActiveNotifications(dispatch);
    removeNewInquiry(dispatch);
  }, []);

  const removeForSearch = () => {
    dispatch(setSearchQuery(null));
    dispatch(setAllSearchData([]));
    dispatch(setSpaceSearchData([]));
    dispatch(setAllGeneralData([]));
    dispatch(setSearch(""));
    dispatch(setName(""));
  };

  useEffect(() => {
    if (isError) {
        toast.error(error?.data?.message);
    }
    if (isSuccess) {
      refetch()
      dispatch(setActivityRecall(Date.now()))
      dispatch(setActivityPageNumber(1))
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
                <Input
                    login
                    label={"password"}
                    name={"password"}
                    type="password"
                    value={formik.values.password}
                    onInputChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    placeholder={"Type Your Password"}
                    disabled={authLoading}
                />
                <Link
                    style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#00141C",
                        fontFamily: "'Segoe UI'",
                    }}
                    to={"/forgot-password"}
                >
                    Forgot Password?
                </Link>
                <LoadingButton
                    loading={isLoading || authLoading}
                    type="submit"
                    sx={{ textTransform: "none", color: "#fff" }}
                >
                    Log In
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
                to={"/auth?type=login"}
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
                to={"/auth?type=login"}
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
                <Typography textAlign="center" fontSize={12} fontWeight={500} sx={{ color: theme.palette.primary.main }}>Or connect via</Typography>
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
                      isSuccessRegister={isSuccessRegister}
                      isErrorRegister={isErrorRegister}
                      errorRegister={errorRegister}
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
            <Typography fontSize={12} fontWeight={500} sx={{ color: theme.palette.primary.main }}>
                Don’t have an account?{" "}
                <Link to={"/auth?type=register"}
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    color: "#00141C",
                    fontFamily: "'Segoe UI'",
                  }}
                >
                        Sign Up!
                </Link>
            </Typography>
        </>
    );
};

export default Login;
