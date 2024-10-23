import { Box, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getSmallSidebar, sidebarRoutes } from "../constant";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Stack
      justifyContent="flex-start"
      alignItems="center"
      gap={1}
      sx={{
        position: "fixed",
        left: "16px",
        top: "80px",
        backgroundColor: (theme) => theme.palette.secondary.contrastText,
        border: (theme) => `1px solid ${theme.palette.borderColor[0]}`,
        borderRadius: "5px",
        "&:hover > div > p": {
          display: "block",
        },
      }}
    >
      {sidebarRoutes.map((item) => {
        return (
          <Stack
            onClick={() => navigate(item.link)}
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
              "&:hover": {
                backgroundColor: (theme) => theme.palette.secondary.main,
              },
              "&:hover .sidebar-img": {
                backgroundImage: `url(${item.hoverIcon})`,
              },
            }}
          >
            <Box
              sx={{
                backgroundImage: `url(${item.icon})`,
                width: "24px",
                height: "24px",
              }}
              className="sidebar-img"
            ></Box>
            <Typography
              sx={{
                width: "196px",
                display: getSmallSidebar(pathname)
                  ? "none"
                  : { xs: "none", md: "block" },
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
