import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { UploadButton } from "./UploadButton";
// import { MapResolutions } from "../MapMenu/MapResolutions";
import { Export } from "./Export";
import theme from "../../theme/theme";
import clsx from "clsx";

import { makeStyles, useTheme } from "@material-ui/core/styles";
const width = 265;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    width: width,
  },
  tab: {
    maxWidth: width / 2,
    width: width / 2,
    minWidth: 50,
    fontSize: 12,
  },
  indicator: {
    backgroundColor: "transparent",
  },
}));

function TabPanel(props) {
  const { children, value, index, hidden, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{
        height: "auto",
        position: "relative",
        right: "0px",
        bottom: "0px",
        backgroundColor: theme.palette.background.selected,
        zIndex: "1000",
        borderBottom: "1.5px solid #FFFFFF",
        borderRight: "1.5px solid #CFCDC9",
        // borderTop: "1.5px solid #CFCDC9",
        borderLeft: "1.5px solid #CFCDC9",
        display: hidden ? "none" : "block",
      }}
      className={classes.root}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  hidden: PropTypes.any,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [hidden, setHidden] = React.useState(true);

  const handleChange = (event, newValue) => {
    if (newValue === value) {
      setHidden(!hidden);
    } else {
      setValue(newValue);
      setHidden(false);
    }
  };

  return (
    <div
      className={classes.root}
      // style={{
      //   minheight: "auto",
      //   position: "absolute",
      //   right: "8px",
      //   bottom: "272px",
      //   zIndex: "1000",
      // }}
    >
      {/* <TabPanel value={value} index={0} dir={theme.direction} hidden={hidden}>
        <MapResolutions /> */}
      {/* </TabPanel> */}
      <TabPanel value={value} index={0} dir={theme.direction} hidden={hidden}>
        <UploadButton />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction} hidden={hidden}>
        <Export />
      </TabPanel>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            indicator: classes.indicator,
          }}
          // textColor="inherit"
          aria-label="Tab box labelled tabs"
          // tabItemContainerStyle={{ width: "300px" }}
        >
          {/* <Tab
            className={classes.tab}
            label="Map Resolutions"
            style={{
              borderLeft: "1.5px solid #CFCDC9",
              borderRight:
                value === 0 && hidden === false ? "1px solid #CFCDC9" : null,
              borderBottom:
                value !== 0 && hidden === false ? "1px solid #CFCDC9" : null,
              backgroundColor:
                value === 0 && hidden === false
                  ? theme.palette.background.selected
                  : theme.palette.background.default,
            }}
            {...a11yProps(0)}
          /> */}
          <Tab
            className={clsx(classes.tab, "tour-upload")}
            label="Upload Communities"
            {...a11yProps(0)}
            style={{
              borderBottom: "1px solid #CFCDC9",
              borderLeft: "1px solid #CFCDC9",
              borderRight:
                value === 0 && hidden === false ? "1px solid #CFCDC9" : null,
              borderTop:
                value !== 0 && hidden === false ? "1px solid #CFCDC9" : null,
              backgroundColor:
                value === 0 && hidden === false
                  ? theme.palette.background.selected
                  : theme.palette.background.default,
            }}
          />
          <Tab
            className={clsx(classes.tab, "tour-export")}
            label="Data Export"
            {...a11yProps(1)}
            style={{
              borderBottom: "1px solid #CFCDC9",
              borderLeft:
                value === 1 && hidden === false ? "1px solid #CFCDC9" : null,
              borderRight: "1px solid #CFCDC9",
              borderTop:
                value !== 1 && hidden === false ? "1px solid #CFCDC9" : null,
              backgroundColor:
                value === 1 && hidden === false
                  ? theme.palette.background.selected
                  : theme.palette.background.default,
            }}
          />
        </Tabs>
      </AppBar>
    </div>
  );
}
