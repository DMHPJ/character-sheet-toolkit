import { alpha, createTheme } from "@mui/material/styles";

const primary = "#3fa17b";
const secondary = "#d1ab57";
const danger = "#d96c6c";
const warning = "#d3a14d";
const info = "#6e9dd6";
const background = "#0d1110";
const paper = "#171d1b";

export const appTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: { main: primary },
    secondary: { main: secondary },
    error: { main: danger },
    warning: { main: warning },
    info: { main: info },
    background: {
      default: background,
      paper,
    },
    text: {
      primary: "#e1ebe6",
      secondary: "#9caea6",
    },
    divider: alpha("#d8efe5", 0.1),
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Noto Sans SC', system-ui, sans-serif",
    h1: {
      fontFamily: "'Cinzel', 'Noto Sans SC', serif",
      fontWeight: 700,
      letterSpacing: "0.08em",
    },
    h2: {
      fontFamily: "'Cinzel', 'Noto Sans SC', serif",
      fontWeight: 600,
      letterSpacing: "0.06em",
    },
    h3: {
      fontFamily: "'Cinzel', 'Noto Sans SC', serif",
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.03em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          backgroundImage: [
            "radial-gradient(circle at top left, rgba(63, 161, 123, 0.12), transparent 28%)",
            "radial-gradient(circle at top right, rgba(209, 171, 87, 0.08), transparent 24%)",
            "linear-gradient(180deg, #101514 0%, #0d1110 100%)",
          ].join(","),
        },
        "body::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(circle at center, black 45%, transparent 100%)",
          opacity: 0.22,
        },
        a: {
          color: "inherit",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${alpha("#d8efe5", 0.08)}`,
          boxShadow: `0 20px 50px ${alpha("#000000", 0.2)}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#0d1110", 0.56),
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(primary, 0.5),
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${primary}, ${secondary})`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha("#d8efe5", 0.08),
        },
        head: {
          color: "#e1ebe6",
          fontWeight: 700,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});