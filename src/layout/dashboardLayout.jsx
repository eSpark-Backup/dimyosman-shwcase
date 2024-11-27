import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import SplashScreen from "./splash";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { getSmallSidebar } from "../constant";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    if (!token) {
      navigate("/auth?type=login");
    }
  }, []);
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <Box
      sx={{
        padding: "80px 16px 0 16px",
        display:
          getSmallSidebar(pathname) && pathname !== "/message"
            ? "flex"
            : "block",
        justifyContent: { xs: "flex-end", md: "center" },
        alignItems: "flex-start",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "calc(100vh - 80px)",
          padding:
            getSmallSidebar(pathname) && pathname === "/message"
              ? "0 0 0 105px"
              : getSmallSidebar(pathname)
              ? "0"
              : { xs: "0 0 0 105px", md: "0 0 0 320px" },
          "::-webkit-scrollbar": { display: "none" },
          maxWidth:
            getSmallSidebar(pathname) && pathname !== "/message"
              ? {
                  xs: "calc(100% - 111px)",
                  md: "80%",
                  lg: "1080px",
                  xl: "1280px",
                }
              : "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
