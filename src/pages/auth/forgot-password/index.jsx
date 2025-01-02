import { Box, Typography } from "@mui/material";
import { logo } from "../../../assets";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { Input } from "../../../components";
import { emailSchema } from "../../../validation/validation";

const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      console.log("test", values);
    },
  });

  return (
    <div className="auth-main">
      <div className="auth-box">
        <img src={logo} alt="Logo" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{ color: (theme) => theme.palette.primary.main }}
          >
            Forgot Password
          </Typography>
          <Typography
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontWeight: 500,
              fontSize: "18px",
              textAlign: "center",
              width: { xs: "90%", md: "70%" },
            }}
          >
            Please enter your email. We will be sending an email to verify your
            account to reset your password.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            rowGap: "32px",
          }}
        >
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
            <LoadingButton
              loading={false}
              disabled={false}
              type="submit"
              sx={{ textTransform: "none" }}
            >
              Send email
            </LoadingButton>
          </Box>
          <Typography
            fontSize={12}
            fontWeight={500}
            sx={{ color: (theme) => theme.palette.primary.main }}
          >
            <Link
              to={"/auth?type=login"}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "#00141C",
                fontFamily: "'Segoe UI'",
              }}
            >
              Go back to login
            </Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default ForgotPassword;
