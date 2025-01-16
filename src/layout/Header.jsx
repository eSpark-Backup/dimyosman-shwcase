import { useRef, useState } from "react";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import {
  brand,
  brandHover,
  event,
  eventHover,
  logoIcon,
  logoText,
  logout,
  logoutHover,
  settings,
  settingsHover,
  space,
  spaceHover,
  user,
} from "../assets";
import { BadgeComp, SearchBar } from "../components";
import { addIcon, chatIcon, bellIcon } from "../assets";
import { useNavigate } from "react-router-dom";
import { deleteCookie, getCookie, useClickOutside } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutFunc } from "../store/slices/auth";
import { removeMychat } from "../store/slices/chat";
import Notification from "../components/Notification";
import { useGetNotificationDataQuery } from "../services/notifications";
import { emptyNotificationCount } from "../store/slices/notification";

const Header = ({ isLogin }) => {
  const {
    data: notificationData,
    isSuccess,
    error,
    isLoading,
    isFetching,
  } = useGetNotificationDataQuery(
    {
      page: 1,
      pageSize: 10,
    },
    { skip: !localStorage.getItem("token") },
    { refetchOnMountOrArgChange: true }
  );
  const getRequestCount = getCookie("newRequest") || 0;

  const { count } = useSelector((state) => state.notification);
  const userData = useSelector((state) => state.auth);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addRef = useRef();
  const profileRef = useRef();
  const notificationRef = useRef();
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  useClickOutside(addRef, () => setAddPopup(false));
  useClickOutside(profileRef, () => setOpenProfilePopup(false));
  useClickOutside(notificationRef, () => setShowNotification(false));

  const handleLogout = () => {
    dispatch(logoutFunc());
    dispatch(removeMychat());
    setAddPopup(false);
    setOpenProfilePopup(false);
    navigate("/auth?type=login");
  };

  const handleNavigate = (link) => {
    navigate(link);
    setAddPopup(false);
  };

  const iconClick = (type) => {
    dispatch(emptyNotificationCount());
    deleteCookie("newRequest");

    if (type === "chat") {
      navigate("/message");
    } else {
      setShowNotification(true);
    }
  };

  const addPopuptabs = [
    {
      img: brand,
      hoverImg: brandHover,
      title: "Brand",
      func: () => handleNavigate("/new-brand"),
    },
    {
      img: event,
      hoverImg: eventHover,
      title: "Event",
      func: () => handleNavigate("/new-event"),
    },
    {
      img: space,
      hoverImg: spaceHover,
      title: "Space",
      // func: () => handleNavigate("/new-space"),
    },
  ];

  const profilePopuptabs = [
    {
      img: settings,
      hoverImg: settingsHover,
      title: "Settings",
      func: () => handleNavigate("/settings"),
    },
    {
      img: logout,
      hoverImg: logoutHover,
      title: "Log Out",
      func: handleLogout,
    },
  ];

  const Popup = ({ title, data, open }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Box
        sx={{
          opacity: open ? 1 : 0,
          display: open ? "block" : "none",
          position: "absolute",
          top: "58px",
          right: title ? "210px" : 0,
          border: "1px solid #D1DBD7",
          background: "#fff",
          borderRadius: "0px 0px 5px 5px",
          padding: "16px",
        }}
      >
        {title && (
          <Typography
            fontSize={16}
            fontWeight={400}
            color="#000"
            textAlign="left"
            sx={{ marginBottom: "8px" }}
          >
            {title}
          </Typography>
        )}
        <Stack gap="4px">
          {data.map((item) => {
            const active = hovered === item.title;
            return (
              <Stack
                onClick={item?.func}
                sx={{
                  width: "129px",
                  padding: "4px 14px",
                  cursor: "pointer",
                  borderRadius: "3px",
                  background: (theme) =>
                    active ? theme.palette.secondary.main : "transparent",
                }}
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                gap="12px"
                key={item.title}
                onMouseOver={() => setHovered(item.title)}
                onMouseOut={() => setHovered(false)}
              >
                <img
                  width={24}
                  height={24}
                  src={active ? item.hoverImg : item.img}
                  alt="brand"
                />
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  sx={{ width: "max-content" }}
                >
                  {item.title}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <div className="header">
        <nav>
          <div className="logo">
            <img width={42} height={42} src={logoIcon} alt="Icon" />
            <img
              className="text-icon"
              src={logoText}
              alt="Icon"
              style={{ height: "22px" }}
            />
          </div>
          {isLogin && (
            <div className="search-bar">
              <div className="search-box">
                <SearchBar name={"query"} placeholder={"Search..."} />
              </div>
            </div>
          )}
          {isLogin ? (
            <ul style={{ position: "relative" }} className="nav-links2">
              <li ref={addRef}>
                <BadgeComp
                  onClick={() => setAddPopup(true)}
                  imageSrc={addIcon}
                  bg={theme.palette.transparent}
                />
                <Popup open={addPopup} title="Add New:" data={addPopuptabs} />
              </li>
              <li>
                <BadgeComp
                  onClick={() => iconClick("chat")}
                  imageSrc={chatIcon}
                  bg={theme.palette.error.danger}
                  count={count || getRequestCount}
                />
              </li>
              <li ref={notificationRef}>
                <BadgeComp
                  onClick={() => iconClick("bell")}
                  imageSrc={bellIcon}
                  bg={theme.palette.error.danger}
                  count={count || getRequestCount}
                />
                <Notification
                  open={showNotification}
                  data={notificationData?.data?.notifications || []}
                  theme={theme}
                />
              </li>
              {userData?.user?.profileImage ? (
                <Box sx={{ width: "50px", height: "50px" }} ref={profileRef}>
                  <img
                    onClick={() => setOpenProfilePopup(true)}
                    src={userData?.user?.profileImage}
                    alt="User"
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      borderRadius: "4px",
                    }}
                  />
                  <Popup open={openProfilePopup} data={profilePopuptabs} />
                </Box>
              ) : (
                <Box sx={{ width: "32px", height: "32px" }} ref={profileRef}>
                  <Button
                    onClick={() => setOpenProfilePopup(true)}
                    className="user-btn1"
                    sx={{
                      minWidth: "32px",
                      height: "32px",
                      backgroundColor: "rgba(0, 20, 28, 0.8)",
                      ":hover": {
                        backgroundColor: "rgba(0, 20, 28, 0.8)",
                      },
                    }}
                  >
                    <img src={user} alt="User" />
                  </Button>
                  <Popup open={openProfilePopup} data={profilePopuptabs} />
                </Box>
              )}
            </ul>
          ) : (
            <ul className="nav-links">
              <li>News</li>
              <hr className="nav-items-breaker" />
              <li>About</li>
              <hr className="nav-items-breaker" />
              <li>Help</li>
              <Button
                onClick={() => (isLogin ? setOpenProfilePopup(true) : () => {})}
                className="user-btn1"
                sx={{
                  minWidth: "32px",
                  height: "32px",
                  backgroundColor: "rgba(0, 20, 28, 0.8)",
                  ":hover": {
                    backgroundColor: "rgba(0, 20, 28, 0.8)",
                  },
                }}
              >
                <img src={user} alt="User" />
              </Button>
            </ul>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
