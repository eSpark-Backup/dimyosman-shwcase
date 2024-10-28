import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getSmallSidebar, sidebarRoutes } from "../constant";

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme()

  return (
    <Stack
      justifyContent="flex-start"
      alignItems="center"
      gap={1}
      sx={{
        zIndex: 999,
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
              backgroundColor: item?.title.toLowerCase().includes(pathname.slice(1)) ? theme.palette.secondary.main : "transparent",
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
                backgroundImage: item?.title.toLowerCase().includes(pathname.slice(1)) ? `url(${item.hoverIcon})` : `url(${item.icon})`,
                width: "24px",
                height: "24px",
              }}
              className="sidebar-img"
            >
            </Box>
            <Typography
              sx={{
                width: "196px",
                color:theme.palette.primary.main,
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
