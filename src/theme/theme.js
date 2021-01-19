import { createMuiTheme } from "@material-ui/core/styles";

//see
//https://material-ui.com/customization/default-theme/?expand-path=$.palette

const theme = createMuiTheme({
  palette: {
    // type: 'dark',
    primary: {
      main: "#002F6C",
    },
    secondary: {
      main: "#BA0C2F",
    },
    background: {
      default: "#f2f2f2",
      paper: "#f2f2f2"
    }
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
    ].join(","),
  },
  overrides: {
    MuiTableCell: {
        root: {  //This can be referred from Material UI API documentation. 
            padding: '4px 8px',
            width: '20px',
        },
    },
},
});

export default theme;
