import { useEffect, useRef, useState } from "react";
import { Box, Button, Drawer, Stack, Typography, useTheme } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
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
  deleteAllCookiesExcept,
} from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutFunc } from "../store/slices/auth";
import { removeMychat } from "../store/slices/chat";
import Notification from "../components/Notification";
import Filters from "../components/Filters";
import { emptyGoToMessage, emptyNotification, setFromNotification } from "../store/slices/notification";
import { useAuth0 } from "@auth0/auth0-react";

const Header = ({ isLogin }) => {
  const getInquiryCount = getCookie("newInquiry") || 0;
  const getNotificationCount = getCookie("newNotification") || 0;

  const { count, countInquiry } = useSelector((state) => state.notification);
  const userData = useSelector((state) => state.auth);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const addRef = useRef();
  const profileRef = useRef();
  const notificationRef = useRef();
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openProfilePopup, setOpenProfilePopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  useClickOutside(addRef, () => setAddPopup(false));
  useClickOutside(profileRef, () => setOpenProfilePopup(false));
  useClickOutside(notificationRef, () => setShowNotification(false));

  const { logout: logoutAuth } = useAuth0();


  const handleLogout = () => {
    setCookie("logout", true);
    logoutAuth({ returnTo: window.location.origin, openUrl: false });
    deleteAllCookiesExcept(["unreadChatIds", "newNotification", "newInquiry"]);
    
    dispatch(logoutFunc());
    dispatch(removeMychat());
    dispatch(emptyNotification());
    setAddPopup(false);
    setOpenProfilePopup(false);
    setShowNotification(false);
    navigate("/auth?type=login");
  };

  const handleNavigate = (link) => {
    navigate(link);
    setAddPopup(false);
  };

  const handleFilterDrawer = (link) => {
    setOpenFilterDrawer(true);
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
                <SearchBar
                  name={"query"}
                  placeholder={"Search..."}
                  handleFilterDrawer={handleFilterDrawer}
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

      <Drawer
        anchor="right"
        open={openFilterDrawer}
        onClose={() => setOpenFilterDrawer(false)}
        sx={{
          "& .MuiPaper-root": {
            padding: 0,
          },
        }}
      >
        <Filters setOpenFilterDrawer={setOpenFilterDrawer} />
      </Drawer>
    </>
  );
};

export default Header;
