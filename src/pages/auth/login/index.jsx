import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Input } from "../../../components";
import { google, facebook, apple } from "../../../assets";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleChange = (name, value) => {
    setForm((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

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

  return (
    <>
      <Box
        sx={{
          width: { xs: "90%", sm: "85%", md: "70%" },
          display: "flex",
          flexDirection: "column",
          rowGap: "16px",
        }}
      >
        <Input
          onInputChange={handleChange}
          label={"email"}
          name={"email"}
          type={"email"}
          value={form.email}
          placeholder={"Type Your Email"}
        />
        <Input
          onInputChange={handleChange}
          label={"password"}
          name={"password"}
          type="password"
          value={form.password}
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
        <Button>Log In</Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "12px" }}>
        <Typography variant="h6">
          By logging, you are agreeing with our
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
        Don’t have an account?{" "}
        <Link to={"/register"}>
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
