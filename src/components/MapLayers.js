import * as React from "react";
import { MapContext } from "../state/MapState";
import Slider from "@material-ui/core/Slider";
// import { MapSelector } from "./MapSelector";
import { Container, Grid, Box, Typography } from "@material-ui/core";

import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
// import Button from '@material-ui/core/Button';

// import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";

import MapLayerContent from "./subcomponents/MapLayerContent"
/* Toggle button overrides */
const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
    width: "100%",
  },
  selected: {
    backgroundColor: "unset!important",
    color: theme.palette.primary.main + "!important",
  },
  sizeSmall: {
    padding: "10px",
    marginLeft: "-10px",
  },
  icon: {
    background: "",
    "&:hover": {
      background: "#f1f1f1",
    },
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
  const classes = useStyles();
  useEffect(() => {
    if (currentMapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID]);

  

  return (
      <div >
      
        <Box>
          {/* needs rework to work with routers */}
          {/* <MapSelector /> */}
        </Box>

        <Paper
          style={{ maxHeight: "91vh", overflow: "auto"}}
          elevation={0}
          key={"drawerPaper"}
          
        >
          <Box mt={3} p={1}>
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
      </div>
    // </div>
  );
};
