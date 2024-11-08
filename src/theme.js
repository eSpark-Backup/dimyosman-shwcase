import { createTheme } from "@mui/material";
export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 601,
      md: 769,
      lg: 1281,
      xl: 1921,
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: "3px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#00141C",
          background: "#f6f8f7",
          fontSize: "16px",
          fontWeight: "600",
          height: "10px",
          minHeight: "31px",
          textTransform: "capitalize",
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
      styleOverrides: {
        root: {
          color: "#00141C",
        },
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          lineHeight: "0px",
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
            color: "#00141C",
            fontWeight: "300",
            opacity: 1,
          },
        },

        root: {
          border: "1px dashed #D1DBD7",
          height: "43px",
          width: "100%",
          outline: "none",
          padding: " 0px 5px",
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
    MuiSelect: {
      styleOverrides: {
        root: {
          border: "1px dashed #D1DBD7",
          borderRadius: "3px",
          backgroundColor: "rgba(209, 219, 215, 0.2)",
          height: "auto",
          width: "100%",
          padding: "0px 5px",
          fontSize: "20px",
          cursor: "pointer",
          color: "#00141C",
          fontWeight: 100,
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-disabled": {
            backgroundColor: "rgba(209, 219, 215, 0.2)",
            border: "1px dashed #D1DBD7",
            cursor: "pointer",
          },
        },
        icon: {
          color: "#00141C",
          "&.Mui-disabled": {
            color: "#00141C",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "5px",
          padding: "16px",
          border: "1px solid #D1DBD7",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: "1px solid #D1DBD7",
          borderRadius: "3px",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#f6f8f7",
          ".MuiTableCell-root": {
            color: "#00141C",
          },
          borderBottom: "none",
          "& .MuiTableCell-root": {
            borderBottom: "none",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: 0.5,
            textTransform: "initial",
            color: "#00141C",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            borderBottom: "none",
            color: "#00141C",
            fontSize: "14px",
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
      main: "#e3e9e7",
      light: "#e3e9e7",
      dark: "#e3e9e7",
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
      danger: "#FF0000"
    },
    text: {
      primary: "#9E9EA4",
      secondary: "#9E9EA4",
      disabled: "#9E9EA4",
    },
    button: {
      secondary: "#edf1ef"
    },
    transparent: "transparent",
    border: {
      primary: '1px solid #D1DBD7',
      borderColor: ["#D1DBD780"],
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
