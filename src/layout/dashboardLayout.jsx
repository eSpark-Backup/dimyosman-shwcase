import { Box, Typography, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SplashScreen from "./splash";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { getFullSidebar, getSmallSidebar, sidebarRoutes } from "../constant";
import { useClickOutside } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { setActivityPageNumber, setAllActivityData, setSpaceData } from "../store/slices/activity";

const DashboardLayout = ({ isTokenChecking }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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

  const sidebarRef = useRef();
  useClickOutside(sidebarRef, () => setActive(false));
  const [active, setActive] = useState(false);

  const splittedPath = `/${pathname.split("/")[1]}`;
  const splittedSubPath = splittedPath.split("-");
  const currentPath =
    splittedSubPath.length > 1 ? `/${splittedSubPath[1]}` : splittedSubPath[0];

  const activeIcon = sidebarRoutes.find((item) => (!item?.link && item.title === "Profile") || (item?.link === currentPath));

  if (loading || isTokenChecking) {
    return <SplashScreen />;
  }
  return (
    <Box
      sx={{
        padding: "80px 16px 0 16px",
        display:
          getSmallSidebar(pathname) || getFullSidebar(pathname)
            ? "flex"
            : "block",
        justifyContent: {
          xs: "flex-end",
          md: "center",
        },
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
            getSmallSidebar(pathname) ||
            getFullSidebar(pathname) ||
            pathname === "/message"
              ? { xs: "0px", sm: "0 0 0 105px" }
              : getSmallSidebar(pathname)
              ? "0"
              : { xs: "0 0 0 0", sm: "0 0 0 105px", lg: "0 0 0 320px" },
          "::-webkit-scrollbar": { display: "none" },
          maxWidth:
            getSmallSidebar(pathname) || getFullSidebar(pathname)
              ? {
                  xs: "100%",
                  md: "80%",
                  lg: "1080px",
                  xl: "1280px",
                }
              : "auto",
        }}
      >
        <Outlet />
        <Box
          sx={{
            zIndex: 9,
            position: "fixed",
            bottom: "10px",
            right: 0,
            width: "72px",
            height: "72px",
            border: "1px solid #d1dbd780",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "6px 0 0 6px",
            borderRight: 0,
            display: { xs: "flex", sm: "none" },
            "> img": {
              width: "56px",
              height: "56px",
              padding: "16px",
              background: "#d1dbd780",
              borderRadius: "6px",
            },
          }}
        >
          <img
            width={24}
            height={24}
            src={activeIcon?.hoverIcon}
            onClick={() => setActive(!active)}
          />
          <Stack
            ref={sidebarRef}
            justifyContent="flex-start"
            alignItems="center"
            gap={1}
            sx={{
              width: "284px",
              right: 0,
              bottom: "72px",
              left: "auto",
              top: "auto",
              gap: "8px",
              zIndex: 9,
              position: "absolute",
              display: active ? "flex" : "none",
              backgroundColor: (theme) => theme.palette.secondary.contrastText,
              border: (theme) =>
                `1px solid ${theme.palette.border.borderColor[0]}`,
              borderRadius: "5px 0 0 5px",
              padding: "16px 16px",
              "div > p": {
                display: "block",
              },
            }}
          >
            {sidebarRoutes.map((item) => {
              const activetab = (!item?.link && item.title === "Profile") || (item?.link === currentPath);
              return (
                <Stack
                  onClick={() => {
                    if (item.title === "Profile") {
                      navigate(`/profile/${user?.id}`);
                      setActive(false);
                      return;
                    }

                    if (item.title !== "Activity") {
                      localStorage.removeItem("scrollPosition");
                      dispatch(setAllActivityData([]));
                      dispatch(setSpaceData([]));
                      dispatch(setActivityPageNumber(1));
                    }

                    localStorage.removeItem("searchScrollPosition");
                    navigate(item.link);
                    setActive(false);
                  }}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap={2}
                  key={item.title}
                  sx={{
                    borderRadius: "3px",
                    cursor: "pointer",
                    padding: 2,
                    width: "100%",
                    backgroundColor: (theme) =>
                      activetab ? theme.palette.secondary.main : "transparent",
                  }}
                >
                  <img
                    width={24}
                    height={24}
                    src={activetab ? item.hoverIcon : item.icon}
                    alt={item.title}
                  />
                  <Typography
                    sx={{
                      width: "196px",
                      color: (theme) => theme.palette.primary.main,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
