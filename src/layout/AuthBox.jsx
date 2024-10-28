import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { Login, Register } from "../pages";
import { useQuery } from "../utils";
import { logo } from "../assets";

const AuthBox = () => {
  const theme = useTheme();
  const query = useQuery();
  const pathType = query.get("type");
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(pathType === "register" ? 1 : 0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(newValue === 0 ? "/auth?type=login" : "/auth?type=register");
  };

  useEffect(() => {
    setActiveTab(pathType === "register" ? 1 : 0);
    console.log(pathType)
  }, [pathType]);

  const tabs = [
    {
      component: <Login />,
      title: "Welcome back!",
      subTitle: "Enter your credentials to continue.",
    },
    {
      component: <Register />,
      title: "Create account!",
      subTitle: "Enter your info to continue.",
    },
  ];

  return (
    <div className="auth-main">
      <div className="auth-box">
        <img src={logo} alt="Logo" />
        <Tabs
          value={activeTab}
          onChange={handleChange}
          indicatorColor="transparent"
        >
          <Tab label="Login" sx={{ width: "100px" }} />
          <Tab label="Signup" sx={{ width: "100px" }} />
        </Tabs>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" sx={{ color: theme.palette.primary.main }}>{tabs[activeTab].title}</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>{tabs[activeTab].subTitle}</Typography>
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
          {tabs[activeTab].component}
        </Box>
      </div>
    </div>
  );
};

export default AuthBox;
