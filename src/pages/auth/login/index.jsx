import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Input } from "../../../components";
import { google, facebook, apple } from "../../../assets";
import { useFormik } from "formik";
import { loginSchema } from "../../../validation/validation";

const Login = () => {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {
            window.localStorage.setItem("token", "token");
            console.log("Form Submitted", values);
        },
    });

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
                    width: { xs: "90%", sm: "85%", md: "70%" },
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "16px",
                }}
                component={"form"}
                onSubmit={formik.handleSubmit}
            >
                <Input
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
                        color: "Forgot Password?",
                        fontSize: "12px",
                        fontWeight: "500",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    Forgot Password?
                </Typography>
                <Button type="submit">Log In</Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", rowGap: "12px" }}>
                <Typography variant="h6">
                    By logging, you are agreeing with our
                </Typography>
                <Typography variant="h6">
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
                <Typography variant="h6">Or connect via</Typography>
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
            <Typography variant="h6">
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
