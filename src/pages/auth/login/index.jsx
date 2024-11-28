import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Input } from "../../../components";
import { google, facebook, apple } from "../../../assets";
import { useFormik } from "formik";
import { loginSchema } from "../../../validation/validation";
import { useTheme } from "@emotion/react";
import { useLoginMutation } from "../../../services/auth";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
    const [login, { isLoading: loginLoading, isSuccess, isError, error: loginError }] = useLoginMutation();
    const theme = useTheme();
    const navigate = useNavigate();
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

    useEffect(() => {
        if (isError) {
            toast.error(loginError?.data?.message);
        }
        if (isSuccess) {
            navigate("/activity");
        }
    }, [isError, isSuccess, navigate, loginError]);

    const { loginWithRedirect, logout, user, isAuthenticated, error, isLoading } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            console.log("User authenticated:", user);
        }
    }, [isAuthenticated, user]);



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

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

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
                />
                <Typography
                    sx={{
                        fontSize: "12px",
                        fontWeight: "500",
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: theme.palette.primary.main
                    }}
                >
                    Forgot Password?
                </Typography>
                <LoadingButton
                    loading={loginLoading}
                    type="submit"
                    sx={{ textTransform: "none" }}
                >
                    Log In
                </LoadingButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", rowGap: "12px" }}>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                    By logging, you are agreeing with our
                </Typography>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                    <span style={{ textDecoration: "underline", cursor: "pointer" }}>Terms of Use </span>
                    and
                    <span style={{ textDecoration: "underline", cursor: "pointer" }}> Privacy Policy</span>
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "12px",
                    width: "100%",
                }}
            >
                <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>Or connect via</Typography>
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
                    <Button sx={authBtnStyle} onClick={() => loginWithRedirect({ connection: "google-oauth2" })}>
                        <img src={google} alt="Google Logo" />
                    </Button>
                    <Button sx={authBtnStyle} onClick={() => loginWithRedirect({ connection: "facebook" })}>
                        <img src={facebook} alt="Facebook Logo" />
                    </Button>
                    <Button sx={authBtnStyle} onClick={() => loginWithRedirect({ connection: "apple" })}>
                        <img src={apple} alt="Apple Logo" />
                    </Button>
                </Box>
            </Box>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                Don’t have an account?{" "}
                <Link to={"/auth?type=register"}>
                    <span
                        style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            color: "#00141C",
                        }}
                    >
                        Sign Up!
                    </span>
                </Link>
            </Typography>
        </>
    );
};

export default Login;
