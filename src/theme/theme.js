import { createTheme } from "@material-ui/core/styles";

//see
//https://material-ui.com/customization/default-theme/?expand-path=$.palette

const theme = createTheme({
  palette: {
    // type: 'dark',
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
        //This can be referred from Material UI API documentation.
        padding: "4px 8px",
        width: "20px",
        // "&$selected": {
        //   backgroundColor: "red",
        //   "&:hover": {
        //     backgroundColor: "orange",
        //   },
        // },
      },
    },
    // MuiListItem: {
    //   root: {
    //     "&$selected": {
    //       backgroundColor: "red",
    //       "&:hover": {
    //         backgroundColor: "orange",
    //       },
    //     },
    //   },
    //   button: {
    //     "&:hover": {
    //       backgroundColor: "yellow",
    //     },
    //   },
    // },
  },
});

export default theme;
