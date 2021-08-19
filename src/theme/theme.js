import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#002F6C",
    },
    secondary: {
      main: "#BA0C2F",
    },
    background: {
      default: "#ededed",
      selected: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "system-ui",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Open Sans",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
      "Source Sans Pro",
    ].join(","),
  },
  overrides: {
    MuiTableCell: {
      root: {
        padding: "4px 8px",
        width: "20px",
      },
    },
  },
});

export default theme;
