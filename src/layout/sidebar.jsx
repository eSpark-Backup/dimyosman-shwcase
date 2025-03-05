import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSmallSidebar, sidebarRoutes } from "../constant";
import { setActivityPageNumber, setAllActivityData, setSpaceData } from "../store/slices/activity";
import { addHyphenToName, deleteCookie, getCookie } from "../utils";
import { emptyFilters, setSearchQuery, setShouldReturn } from "../store/slices/search";
import { setFromSidebar } from "../store/slices/chat";

const Sidebar = () => {
  const searchQuery = getCookie("search_query")
  
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch()
  const splittedPath = `/${pathname.split("/")[1]}`;
  const splittedSubPath = splittedPath.split("-");
  const currentPath =
    splittedSubPath.length > 1 ? `/${splittedSubPath[1]}` : splittedSubPath[0];
  const [hovered, setHovered] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const {search_query} = useSelector(state => state.search)

  return (
    <Stack
      justifyContent="flex-start"
      alignItems="center"
      gap={1}
      sx={{
        display: { xs: "none", sm: "block" },
        zIndex: 11,
        position: "fixed",
        left: "16px",
        top: "80px",
        backgroundColor: (theme) => theme.palette.secondary.contrastText,
        border: (theme) => `1px solid ${theme.palette.border.borderColor[0]}`,
        borderRadius: "5px",
        padding: "15px 16px",
        "&:hover > div > p": {
          display: "block",
        },
      }}
    >
      {sidebarRoutes.map((item, ind) => {
        const active = item?.subLink?.includes(currentPath);
        const hover = hovered === ind;
        return (
          <Stack
            className="sidebar-item"
            id={item.title}
            onClick={() => {
              deleteCookie("search_query")
              dispatch(setSearchQuery(null))
              dispatch(setShouldReturn(false))
              dispatch(emptyFilters());

              if (item.title === "Profile") {
                navigate(`/profile/${addHyphenToName(user?.name)}`, { state: { id: user?.id } });
                return;  // <== Stops further execution
              }
              
              if (item.title !== "Activity") {
                localStorage.removeItem("scrollPosition");
                dispatch(setAllActivityData([]));
                dispatch(setSpaceData([]));
                dispatch(setActivityPageNumber(1));
              }


              localStorage.removeItem("searchScrollPosition");
              navigate(item.link);
              if(item.title === "Messages"){
                dispatch(setFromSidebar(true))
              } else {
                dispatch(setFromSidebar(false))
              }

            }}
            onMouseOver={() => setHovered(ind)}
            onMouseOut={() => setHovered(false)}
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
              transition: "all 0.5s ease",
              backgroundColor: (theme) =>
                hover || active ? theme.palette.secondary.main : "transparent",
            }}
          >
            <img
              width={24}
              height={24}
              src={hover || active ? item.hoverIcon : item.icon}
              alt={item.title}
            />
            <Typography
              sx={{
                width: "196px",
                color: (theme) => theme.palette.primary.main,
                display:
                  getSmallSidebar(pathname) || pathname === "/message" || (searchQuery || search_query)
                    ? "none"
                    : { xs: "none", lg: "block" },
              }}
            >
              {item.title}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default Sidebar;
