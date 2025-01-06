import { Box, Typography } from "@mui/material";
import { logo } from "../../../assets";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { Input } from "../../../components";
import { resetPasswordSchema } from "../../../validation/validation";

const ResetPassword = () => {
  const formik = useFormik({
    initialValues: {
      password: "",
      conPassword: "",
    },
    validationSchema: resetPasswordSchema,
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
            Reset Password
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
            Please enter your new password and confirm it to reset your account password.
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
              label={"new password"}
              name={"password"}
              type={"password"}
              value={formik.values.password}
              onInputChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password && Boolean(formik.errors.password)
              }
              helperText={
                formik.touched.password && formik.errors.password
              }
              placeholder={"Type Your New Password"}
            />
            <Input
              login
              label={"confirm password"}
              name={"conPassword"}
              type={"password"}
              value={formik.values.conPassword}
              onInputChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.conPassword &&
                Boolean(formik.errors.conPassword)
              }
              helperText={
                formik.touched.conPassword && formik.errors.conPassword
              }
              placeholder={"Re-Type Your New Password"}
            />
            <LoadingButton
              loading={false}
              disabled={false}
              type="submit"
              sx={{ textTransform: "none" }}
            >
              Reset Password
            </LoadingButton>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ResetPassword;
