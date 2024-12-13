import { useEffect } from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { Input } from "../../../components";
import { Link, useNavigate } from 'react-router-dom'
import { google, facebook, apple } from "../../../assets";
import { useFormik } from "formik";
import { registerSchema } from '../../../validation/validation';
import { useRegisterMutation } from "../../../services/auth";

const Register = () => {
  const [register, { isLoading, isSuccess, isError, error}] =
    useRegisterMutation();
  const theme = useTheme();
  const navigate = useNavigate();
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
        if (isError) {
            toast.error(error?.data?.message);
        }
        if (isSuccess) {
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
                        />
                    </Box>
                </Box>
                <LoadingButton loading={isLoading} type="submit">
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
