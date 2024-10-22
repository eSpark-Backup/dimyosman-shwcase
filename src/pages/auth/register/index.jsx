import React, { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Input } from "../../../components";
import { Link } from 'react-router-dom'
import { google, facebook, apple } from "../../../assets";
import { useFormik } from "formik";
import { registerSchema } from '../../../validation/validation';

const Register = () => {
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
    };
    const HandleSubmit = (values) => {
        console.log(values)
    }
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
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: "100%", md: "47%" },
                        }}
                    >
                        <Input
                            label={"first name"}
                            name={"fName"}
                            type={"text"}
                            value={formik.values.fName}
                            onInputChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fName && Boolean(formik.errors.fName)}
                            helperText={formik.touched.fName && formik.errors.fName}
                            placeholder={"Type Your First Name"}
                        />
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", md: "47%" },
                        }}
                    >
                        <Input
                            label={"last name"}
                            name={"lName"}
                            type={"text"}
                            value={formik.values.lName}
                            onInputChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lName && Boolean(formik.errors.lName)}
                            helperText={formik.touched.lName && formik.errors.lName}
                            placeholder={"Type Your Last Name"}
                        />
                    </Box>

                </Box>
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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", md: "row" },
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: "100%", md: "47%" },
                        }}
                    >
                        <Input
                            label={"choose password"}
                            name={"password"}
                            type={"password"}
                            value={formik.values.password}
                            onInputChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            placeholder={"Type Your Password"}
                        />
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", md: "47%" },
                        }}
                    >
                        <Input
                            label={"repeat password"}
                            name={"conPassword"}
                            type={"password"}
                            value={formik.values.conPassword}
                            onInputChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.conPassword && Boolean(formik.errors.conPassword)}
                            helperText={formik.touched.conPassword && formik.errors.conPassword}
                            placeholder={"Type Your Password"}
                        />
                    </Box>
                </Box>
                <Button type='submit'>Sign Up</Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", rowGap: "12px" }}>
                <Typography variant="h6">
                    By signing, you are agreeing with our
                </Typography>
                <Typography variant="h6">
                    <span style={{ textDecoration: "underline" }}>Terms of Use </span>
                    and
                    <span style={{ textDecoration: "underline" }}> Privacy Policy</span>
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
                Already have an account? {" "}
                <Link to={"/register"}>
                    <span
                        style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            color: "#00141C",
                        }}
                    >
                        Log in
                    </span>
                </Link>
            </Typography>
        </>
    )
}

export default Register;
