import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { UploadButton } from "./UploadButton";
import { MapResolutions } from "./MapResolutions";
import theme from "../../theme/theme";
import clsx from "clsx";

import { makeStyles, useTheme } from "@material-ui/core/styles";
const width = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    width: width,
  },
  tab: {
    maxWidth: width / 3,
    width: width / 3,
    minWidth: 50,
    fontSize: 12,
  },
  indicator: {
    backgroundColor: "white",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{
        height: "auto",
        position: "absolute",
        right: "0px",
        backgroundColor: theme.palette.background.selected,
        zIndex: "1000",
        borderBottom: "1.5px solid #CFCDC9",
        borderRight: "1.5px solid #CFCDC9",
        borderLeft: "1.5px solid #CFCDC9",
      }}
      className={classes.root}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      className={classes.root}
      style={{
        height: "auto",
        position: "absolute",
        right: "0px",
        zIndex: "1000",
      }}
    >
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            indicator: classes.indicator,
          }}
          textColor="secondary"
          aria-label="full width tabs example"
          // tabItemContainerStyle={{ width: "300px" }}
        >
          <Tab
            className={classes.tab}
            label="Map Resolutions"
            style={{
              borderLeft: "1.5px solid #CFCDC9",
              borderRight: value === 0 ? "1px solid #CFCDC9" : null,
              borderBottom: value !== 0 ? "1px solid #CFCDC9" : null,
              backgroundColor:
                value === 0
                  ? theme.palette.background.selected
                  : theme.palette.background.default,
            }}
            {...a11yProps(0)}
          />
          <Tab
            className={clsx(classes.tab, "tour-upload")}
            label="Upload Communities"
            {...a11yProps(1)}
            style={{
              borderLeft: value === 1 ? "1px solid #CFCDC9" : null,
              borderRight: value === 1 ? "1px solid #CFCDC9" : null,
              borderBottom: value !== 1 ? "1px solid #CFCDC9" : null,
              backgroundColor:
                value === 1
                  ? theme.palette.background.selected
                  : theme.palette.background.default,
            }}
          />
          <Tab
            className={clsx(classes.tab, "tour-export")}
            label="Data Export"
            {...a11yProps(2)}
            style={{
              borderLeft: value === 2 ? "1px solid #CFCDC9" : null,
              // borderRight: value === 0 ? "1px solid #CFCDC9" : null,
              borderBottom: value !== 2 ? "1px solid #CFCDC9" : null,
              backgroundColor:
                value === 2
                  ? theme.palette.background.selected
                  : theme.palette.background.default,
            }}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <MapResolutions />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <UploadButton />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        Coming soon!
      </TabPanel>
    </div>
  );
}
