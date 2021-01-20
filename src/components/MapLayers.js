import * as React from "react";
import { MapContext } from "../state/MapState";
import Slider from "@material-ui/core/Slider";
// import { MapSelector } from "./MapSelector";
import { Container, Grid, Box, Typography } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import FormGroup from "@material-ui/core/FormGroup";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
// import Drawer from '@material-ui/core/Drawer';
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
// import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Datasets from "../views/Datasets";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
// import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";

import MapLayerContent from "../utils/MapLayerContent"
// const drawerWidth = 200;
/* Toggle button overrides */
const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
    // backgroundColor: "#ffffff",
    borderRadius: "50px",
    width: "100%",
    flexGrow: 1,
    display: "flex",
  },
  selected: {
    backgroundColor: "unset!important",
    color: theme.palette.primary.main + "!important",
  },
  sizeSmall: {
    padding: "10px",
    marginLeft: "-10px",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  icon: {
    background: "",
    "&:hover": {
      background: "#f1f1f1",
    },
  },
  drawerContainer: {
    maxHeight: "100%",
    overflow: "auto",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  input: {
    width: 42,
  },
}));


export const MapLayers = () => {
  //pick specific states (and dispatcher) we need from mapstate
  const [{ maps, currentMapID }, dispatch] = React.useContext(MapContext);
  const [mapID, setMapID] = useState("ghana");

  useEffect(() => {
    if (currentMapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID]);

  

  return (
    // <div className={classes.root}>
      <Container
        anchor="left"
        // style={{ width: "100%" }}
        key={"drawerLeft"}
      >
        <Box>
          {/* needs rework to work with routers */}
          {/* <MapSelector /> */}
        </Box>

        <Paper
          style={{ maxHeight: "91vh", overflow: "auto", width: "100%" }}
          elevation={0}
          key={"drawerPaper"}
        >
          <Box mt={3}>
            {mapID && (
              <Typography variant="h5" color="secondary">
                <strong>{maps[mapID].name}</strong>
              </Typography>
            )}
            
          </Box>
          <Divider />
          {maps[mapID].layers.map((layer, layerIndex) => (
            <List key={"collapseHeader" + layerIndex} disablePadding>
              {layer.name==="Estimated Settlements and Communities (pop.)" ? 
                <div className="tour-comm">
                  <MapLayerContent layer={layer} layerIndex={layerIndex}/>
                </div>
              : layer.name==="Districts" ?
                <div className="tour-dist">
                  <MapLayerContent layer={layer} layerIndex={layerIndex}/>
                </div>
              : 
                <div>
                  <MapLayerContent layer={layer} layerIndex={layerIndex}/>
                </div>
              }

            </List>
          ))}
        </Paper>
      </Container>
    // </div>
  );
};
