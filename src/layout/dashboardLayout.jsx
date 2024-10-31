import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import { getSmallSidebar } from "../constant";

const DashboardLayout = () => {
  const { pathname } = useLocation();
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
                  xl: "1440px",
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
