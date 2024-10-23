import { colors, createTheme } from "@mui/material";
export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#00141C",
          background: "#f6f8f7",
          borderRadius: "3px",
          fontSize: "16px",
          fontWeight: "600",
          "&.Mui-selected": {
            background: "#D1DBD7",
          },
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#4D5B60",
          height: "46px",
          borderRadius: "5px",
          color: "white",
          fontSize: "20px",
          fontWeight: "500",
          transition: "background-color 0.5s ease-in-out",
          "&:hover": {
            backgroundColor: "#00141C",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            color: "#9E9EA4",
            fontWeight: "500",
            opacity: 1,
          },
        },

        root: {
          border: "1px dashed #D1DBD7",
          height: "43px",
          width: "100%",
          outline: "none",
          padding: " 0px 15px",
          fontSize: "16px",
          color: "#00141C",
          fontWeight: 100,
          borderRadius: "3px",
          backgroundColor: "rgba(209, 219, 215, 0.2)",
          ":focus": {
            border: "1px dashed #D1DBD7",
          },
          fieldset: {
            border: 0,
          },
        },
      },
    },
  },

  palette: {
    primary: {
      main: "#00141C",
      light: "#263043",
      dark: "#000000",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E2E2E2",
      light: "#E2E2E2",
      dark: "#E2E2E2",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#0CAF60",
      light: "#24B770",
      dark: "#0B9E56",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#2F78EE",
      light: "#4486F0",
      dark: "#2A6CD6",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFDE65",
      light: "#FFE174",
      dark: "#E6C85B",
      contrastText: "#AA8500",
    },
    error: {
      main: "#E03137",
      light: "#E3464B",
      dark: "#CA2C32",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#9E9EA4",
      secondary: "#9E9EA4",
      disabled: "#9E9EA4",
    },
  },
  typography: {
    fontFamily: `"Segoe UI", "sans-serif"`,
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.57,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.5px",
      lineHeight: 2.5,
      textTransform: "uppercase",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66,
    },
    h1: {
      fontWeight: 700,
      fontSize: "32px",
      lineHeight: "140%",
      textAlign: "center",
    },
    h2: {
      fontWeight: 500,
      fontSize: "26px",
      lineHeight: "140%",
      textAlign: "center",
    },
    h3: {
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: "140%",
      textAlign: "center",
    },
    h4: {
      fontWeight: 500,
      fontSize: "18px",
      lineHeight: "140%",
      textAlign: "center",
    },
    h5: {
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "140%",
      textAlign: "center",
    },
    h6: {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "140%",
      textAlign: "center",
    },
  },
});
