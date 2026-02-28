// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#111827", // deep slate (luxury feel)
    },

    secondary: {
      main: "#6366f1", // soft indigo accent
    },

    background: {
      default: "#f9fafb", // soft grey background
      paper: "#ffffff",
    },

    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },

  typography: {
    fontFamily: "'Inter', 'Poppins', sans-serif",

    h1: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
        },
        containedPrimary: {
          backgroundColor: "#111827",
          "&:hover": {
            backgroundColor: "#000000",
            transform: "translateY(-2px)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
  },
});

export default theme;