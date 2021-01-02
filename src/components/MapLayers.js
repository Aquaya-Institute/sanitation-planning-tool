import * as React from "react";
import { MapContext } from "../state/MapState";
import Slider from "@material-ui/core/Slider";
import { MapSelector } from "./MapSelector";
import { Container, Grid, Box, Typography } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FormGroup from '@material-ui/core/FormGroup';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';

const drawerWidth = 200;
/* Toggle button overrides */
const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
    backgroundColor: "#ffffff",
    borderRadius: "50px",
    width: '100%',
    flexGrow: 1,
    display: 'flex',
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
    '&:hover': {
       background: "#f1f1f1",
    },
  },
  drawerContainer: {
    maxHeight: '100%',
    overflow: 'auto',
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
}));

export const MapLayers = () => {
  //pick specific states (and dispatcher) we need from mapstate
  const [{ maps, currentMapID }, dispatch] = React.useContext(MapContext);
  const [mapID, setMapID] = useState("ghana");
  // const [checked, setChecked] = useState({
  //   a: true,
  //   b: false,
  //   c: false,
  // });
  const classes = useStyles();
  const [selectedLayer, setselectedLayer] = React.useState("")

  const handleClick = layerIndex => {
    if (selectedLayer === layerIndex) {
      setselectedLayer("")
    } else {
      setselectedLayer(layerIndex)
    }
  }
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
    <div className={classes.root}>
      <Container
        anchor="left"
        style={{background: '#ffffff', width:'100%'}}
      >
        <Box>
          {/* needs rework to work with routers */}
          {/* <MapSelector /> */}
        </Box>

        
        <Paper style={{maxHeight: '91vh', overflow: 'auto', width:'100%'}} elevation={0}>
          <Box mt={3}>
            {mapID && (
              <Typography variant="h5" color="secondary">
                <strong>{maps[mapID].name}</strong>
              </Typography>
            )}
          </Box>
          <Divider />
          {maps[mapID].layers.map((layer, layerIndex) => (
            <List disablePadding >
              <ListItem >
                <ListItemIcon>{
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
                }</ListItemIcon>
                <ListItemText primary={layer.name} />
                {layerIndex === selectedLayer ? <ExpandLess key={layerIndex} onClick={() => handleClick(layerIndex)} className={classes.icon}/> : <ExpandMore key={layerIndex} onClick={() => handleClick(layerIndex)} className={classes.icon}/>}
              </ListItem>
              <Collapse in={layerIndex === selectedLayer} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                {layer.filters.map((filter, filterIndex, filter_c) => {
                  switch (filter.type) {
                    /* you can implement category filter UI here */
                    case "categorical":
                      return (
                        <ListItem button className={classes.nested}>
                          <FormGroup key={filterIndex}>
                            <FormControlLabel
                              control={<Checkbox 
                                checked={true} 
                                onChange={(e, newval) => {
                                  updateFilter({
                                    layerIndex: layerIndex,
                                    filterIndex: filterIndex,
                                    filterStateObject: filter_c,
                                  });
                                }}
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                name="1" />}
                              label={<Typography variant="body2">Rural remote</Typography>}
                              size="small"
                            />
                            <FormControlLabel
                              control={<Checkbox 
                                checked={false} 
                                onChange={(e, newval) => {
                                  updateFilter({
                                    layerIndex: layerIndex,
                                    filterIndex: filterIndex,
                                    filterStateObject: filter_c,
                                  });
                                }}
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                name="2" />}
                              label={<Typography variant="body2">Rural on-road</Typography>}
                            />
                            <FormControlLabel
                              control={<Checkbox 
                                checked={true} 
                                onChange={(e, newval) => {
                                  updateFilter({
                                    layerIndex: layerIndex,
                                    filterIndex: filterIndex,
                                    filterStateObject: filter_c,
                                  });
                                }}
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                name="3" />}
                              label={<Typography variant="body2">Rural mixed</Typography>}
                            />
                          </FormGroup>
                        </ListItem>
                      );
                    /* range filter UI implementation */
                    case "range":
                      return (
                        <ListItem button className={classes.nested}>
                          <Grid item xs={12} key={filterIndex}>
                            <Typography variant="subtitle2">
                              {filter.name}
                            </Typography>
                          <Grid item xs={12}>
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
                          </Grid>
                          </Grid>
                        </ListItem>
                      );
                    default:
                      return null;
                  }
                })}
              </List>
              </Collapse>
            </List>
          ))}
        </Paper>
      </Container>
    </div>
  );
};
