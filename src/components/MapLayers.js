import * as React from "react";
import { MapContext } from "../state/MapState";
import Slider from "@material-ui/core/Slider";
import { MapSelector } from "./MapSelector";
import { Container, Grid, Box, Typography } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

/* Toggle button overrides */
const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
    backgroundColor: "unset!important",
    borderRadius: "50px"
  },
  selected: {
    backgroundColor: "unset!important",
    color: theme.palette.primary.main + "!important",
  },
  sizeSmall: {
    padding: "10px",
    marginLeft: "-10px",  
  }
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

  const toggleLayerVisibility = (layerID) => {
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      layerID: layerID,
    });
  };

  const updateFilter = ({
    layerIndex,
    filterIndex,
    newValue,
    filterStateObject,
  }) => {
    /* 
    TODO: instead of layerindex use layerID 
    since layers can be visually ordered in 
    the future and using index will not work 
    */
    dispatch({
      type: "layer.filter",
      mapID: mapID,
      layerIndex: layerIndex,
      filterIndex: filterIndex,
      filter: { ...filterStateObject, value: newValue },
    });
  };

  return (
    <Container>
      <Box style={{ background: "" }}>
        <Box>
          {/* needs rework to work with routers */}
          {/* <MapSelector /> */}
        </Box>

        <Box mt={2}>
          {mapID && (
            <Typography variant="h5" color="secondary">
              {maps[mapID].name}
            </Typography>
          )}
        </Box>

        <Box>
          {maps[mapID].layers.map((layer, layerIndex) => (
            <Box key={layerIndex}>
              <Grid container alignItems="center">
                <Grid item>
                  <Box>
                    <ToggleButton
                      value={layer.visible}
                      selected={layer.visible}
                      onClick={() => toggleLayerVisibility(layerIndex)}
                      size="small"
                      classes={{
                        root: classes.root,
                        selected: classes.selected,
                        sizeSmall: classes.sizeSmall,
                      }}
                    >
                      <VisibilityIcon />
                    </ToggleButton>
                  </Box>
                </Grid>
                <Grid item xs={10}>
                  <Box>
                    <Typography noWrap={true}>{layer.name}</Typography>
                  </Box>
                </Grid>
              </Grid>
              {layer.filters.map((filter, filterIndex) => {
                switch (filter.type) {
                  /* you can implement category filter UI here */
                  case "categorical":
                    return null;

                  /* range filter UI implementation */
                  case "range":
                    return (
                      <Box mx={0} key={filterIndex}>
                        <Typography variant="subtitle2">
                          {filter.name}
                        </Typography>
                        <Box mx={0.8}>
                          <Slider
                            value={[
                              Number(filter.value[0]),
                              Number(filter.value[1]),
                            ]}
                            min={filter.min}
                            max={filter.max}
                            aria-labelledby="range-slider"
                            onChange={(e, newval) => {
                              updateFilter({
                                layerIndex: layerIndex,
                                filterIndex: filterIndex,
                                newValue: newval,
                                filterStateObject: filter,
                              });
                            }}
                          />
                        </Box>
                      </Box>
                    );

                  default:
                    return null;
                }
              })}
            </Box>
          ))}
        </Box>

        <Box>
          {/*
          <pre style={{ fontSize: "8px" }}>
            {JSON.stringify(maps[currentMapID], null, 1)}
          </pre>
          */}
        </Box>
      </Box>
    </Container>
  );
};
