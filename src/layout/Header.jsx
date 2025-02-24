import { useEffect, useRef, useState } from "react";
import { Box, Button, Drawer, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
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
import { useLocation, useNavigate } from "react-router-dom";
import {
  setCookie,
  getCookie,
  removeActiveNotifications,
  removeNewInquiry,
  useClickOutside,
  logoutAuthUtils,
  deleteCookie,
} from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutFunc } from "../store/slices/auth";
import { removeMychat } from "../store/slices/chat";
import Notification from "../components/Notification";
import Filters from "../components/Filters";
import { emptyGoToMessage, emptyNotification, setFromNotification } from "../store/slices/notification";
import { useAuth0 } from "@auth0/auth0-react";
import { emptyFilters, setSearchQuery, setShouldReturn } from "../store/slices/search";

const Header = ({ isLogin }) => {
  const isLessThan1281 = useMediaQuery("(max-width:1281px)");
  
  const getInquiryCount = getCookie("newInquiry") || 0;
  const getNotificationCount = getCookie("newNotification") || 0;
  const token = localStorage.getItem("token")
  const searchQuery = getCookie("search_query");

  const { count, countInquiry } = useSelector((state) => state.notification);
  const userData = useSelector((state) => state.auth);
  const { search_query } = useSelector((state) => state.search);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const addRef = useRef();
  const profileRef = useRef();
  const guestProfileRef = useRef();
  const notificationRef = useRef();
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const [openGuestProfilePopup, setOpenGuestProfilePopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  useClickOutside(addRef, () => setAddPopup(false));
  useClickOutside(profileRef, () => setOpenProfilePopup(false));
  useClickOutside(guestProfileRef, () => setOpenGuestProfilePopup(false));
  useClickOutside(notificationRef, () => setShowNotification(false));

  const { logout: logoutAuth } = useAuth0();

  // useEffect(() => {
  //   if ((searchQuery || search_query) && isLessThan1281) {
  //     setOpenFilterDrawer(true);
  //   }
  // }, [searchQuery, search_query, isLessThan1281]);

  const handleLogout = () => {
    setCookie("logout", true);
    logoutAuthUtils(logoutAuth)
    
    dispatch(logoutFunc());
    dispatch(removeMychat());
    dispatch(emptyNotification());
    removeActiveNotifications(dispatch);
    removeNewInquiry(dispatch);
    setAddPopup(false);
    setOpenProfilePopup(false);
    setShowNotification(false);
    navigate("/auth?type=login");
  };

  const handleNavigate = (link) => {
    navigate(link);
    setAddPopup(false);
  };

  const handleFilterDrawer = () => {
    setCookie("search_query")
    dispatch(setSearchQuery(true))
    setOpenFilterDrawer(true);
  };

  const handleCloseFilterDrawer = () => {
    deleteCookie("search_query")
    dispatch(setSearchQuery(null))
    dispatch(emptyFilters())
    setOpenFilterDrawer(false)
  };

  const iconClick = (type) => {
    if (type === "chat") {
      navigate("/message");
      removeNewInquiry(dispatch);
    } else {
      removeActiveNotifications(dispatch);
      setShowNotification(true);
    }
  };

    useEffect(() => {
      const sidebarItems = document.querySelectorAll(".sidebar-item");

      sidebarItems.forEach((item) => {
        item.addEventListener("click", handleClick);
      });

      return () => {
        sidebarItems.forEach((item) => {
          item.removeEventListener("click", handleClick);
        });
      };
    }, [pathname]);

    const handleClick = (event) => {
      const clickedItemId = event.target.id;
      if (clickedItemId !== "Messages") {
        dispatch(emptyGoToMessage());
        dispatch(setFromNotification(false));
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
      func: () => handleNavigate("/new-space"),
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

  const guestProfilePopuptabs = [
    {
      img: LoginIcon,
      title: "Log in",
      func: () => {
        setOpenGuestProfilePopup(false)
        navigate("/auth?type=login")
      },
    },
    {
      img: AppRegistrationIcon,
      title: "Sign up",
      func: () => {
        setOpenGuestProfilePopup(false)
        navigate("/auth?type=register")
      },
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
          right: title ? { xs: "120px", sm: "210px" } : 0,
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
                justifyContent={token ? "space-evenly" : "start"}
                gap="12px"
                key={item.title}
                onMouseOver={() => setHovered(item.title)}
                onMouseOut={() => setHovered(false)}
              >
                {token ? (
                  <img
                    width={24}
                    height={24}
                    src={active ? item.hoverImg : item.img}
                    alt="brand"
                  />
                ) : (
                  <item.img sx={{ opacity: active ? 1 : 0.4, width: "24px", height: "24px" }} />
                )}
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
          <div
            className="logo"
            style={{ cursor: isLogin ? "pointer" : "default" }}
            onClick={() => {
              handleCloseFilterDrawer()

              isLogin && navigate("/activity");
            }}
          >
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
                <SearchBar
                  name={"query"}
                  placeholder={"Search..."}
                  // handleFilterDrawer={handleFilterDrawer}
                />
              </div>
            </div>
          )}
          {isLogin ? (
            <ul style={{ position: "relative" }} className="nav-links2">
              <li className="add_filter">
                <Button
                  sx={{
                    backgroundColor: "rgb(0, 20, 28, 0.4)",
                    width: "32px",
                    height: "32px",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "flex",
                    position: "relative",
                    minWidth: "auto",
                  }}
                >
                  <FilterListIcon onClick={() => handleFilterDrawer()} />
                </Button>
              </li>

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
                  count={countInquiry || getInquiryCount}
                />
              </li>
              <li ref={notificationRef}>
                <BadgeComp
                  onClick={() => iconClick("bell")}
                  imageSrc={bellIcon}
                  bg={theme.palette.error.danger}
                  count={count || getNotificationCount}
                />
                <Notification
                  open={showNotification}
                  theme={theme}
                  setShowNotification={setShowNotification}
                />
              </li>
              {userData?.user?.profileImage ? (
                <Box sx={{ width: "50px", height: "50px" }} ref={profileRef}>
                  <img
                    onClick={() => setOpenProfilePopup(true)}
                    src={userData?.user?.profileImage || user}
                    referrerPolicy="no-referrer"
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
            <ul className="nav-links" ref={guestProfileRef}>
              <li>News</li>
              <hr className="nav-items-breaker" />
              <li>About</li>
              <hr className="nav-items-breaker" />
              <li>Help</li>
              <Button
                onClick={() => {
                  pathname === "/share" ? setOpenGuestProfilePopup(true) : null;
                }}
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
              <Popup
                open={openGuestProfilePopup}
                data={guestProfilePopuptabs}
              />
            </ul>
          )}
        </nav>
      </div>

      <Drawer
        anchor="right"
        open={
          (searchQuery || search_query) && isLessThan1281
            ? true
            : openFilterDrawer
        }
        onClose={() => handleCloseFilterDrawer()}
        sx={{
          "& .MuiPaper-root": {
            padding: 0,
          },
        }}
      >
        <Filters handleCloseFilterDrawer={handleCloseFilterDrawer} />
      </Drawer>
    </>
  );
};

export default Header;
