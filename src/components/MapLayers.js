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
import Tour from "../utils/Tour";
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

function createMarks(array) {
  var obj, i, value, label;
  var returnedTarget = [];
  for (i = 0; i < array.length; i++) {
    obj = {};
    value = array[i];
    label = array[i].toString();
    obj["value"] = value;
    obj["label"] = label;
    returnedTarget.push(obj);
  }
  return returnedTarget;
}
// function log10(x) {
//   return Math.log(x) / Math.log(10);
// }

// function pow10(x) {
//   return Math.pow(10, x);
// }

// function valueLabelFormat(x) {
//   const [coefficient, exponent] = x
//     .toExponential()
//     .split('e')
//     .map(item => Number(item));
//   return `${Math.round(coefficient)}e^${exponent}`;
// }
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
  const [selectedLayer, setselectedLayer] = React.useState("");
  const [value1, setValue1] = React.useState();
  const [value0, setValue0] = React.useState();
  const handleClick = (layerIndex) => {
    if (selectedLayer === layerIndex) {
      setselectedLayer("");
    } else {
      setselectedLayer(layerIndex);
    }
  };
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
    categoryFilterIndex,
  }) => {
    /* 
    TODO: instead of layerindex use layerID 
    since layers can be visually ordered in 
    the future and using index will not work 
    */
    if (
      filterStateObject.type === "categorical" &&
      categoryFilterIndex !== undefined
    ) {
      let new_cat_obj = {
        ...filterStateObject.value[categoryFilterIndex],
        checked: newValue,
      };
      newValue = [...filterStateObject.value];
      setValue0(newValue[0])
      setValue0(newValue[1])
      newValue[categoryFilterIndex] = new_cat_obj;
    }
    dispatch({
      type: "layer.filter",
      mapID: mapID,
      layerIndex: layerIndex,
      filterIndex: filterIndex,
      filter: {
        ...filterStateObject,
        value: newValue,
      },
    });
  };

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
            <Tour />
          </Box>
          <Divider />
          {maps[mapID].layers.map((layer, layerIndex) => (
            <List key={"collapseHeader" + layerIndex} disablePadding>
              {(layer.name==="Estimated Settlements and Communities (pop.)" || layer.name==="Districts") ? 
                <div className="tour-comm-dist">
                  <ListItem key={"collapseItem" + layerIndex}>
                    <ListItemIcon key={"listItemIcon"}>
                      {
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
                          <VisibilityIcon className='tour-visibility'/>
                        </ToggleButton>
                      }
                    </ListItemIcon>
                    <ListItemText primary={layer.name} />
                    {layerIndex === selectedLayer ? (
                      <ExpandLess
                        onClick={() => handleClick(layerIndex)}
                        className={classes.icon}
                      />
                    ) : (
                      <ExpandMore
                        onClick={() => handleClick(layerIndex)}
                        className='tour-expand'
                      />
                    )}
                  </ListItem>
                  <Collapse
                    in={layerIndex === selectedLayer}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      key={"collapseSubHeader" + layerIndex}
                      component="div"
                      disablePadding
                    >
                      {layer.source ? (
                        <Box fontStyle="italic">
                          
                          <Link href={'/Datasets/#publicData'}>{layer.source} ({layer.year})
                          </Link>
                        </Box>
                      ):(
                        <Link href={'/Datasets/#customData'}>
                          Learn more about custom maps
                        </Link>
                      )}
                      
                      {layer.filters.map((filter, filterIndex, filter_c) => {
                        switch (filter.type) {
                          /* you can implement category filter UI here */
                          case "categorical":
                            return (
                              <ListItem
                                key={"cat" + filterIndex}
                                className={classes.nested}
                              >
                                <FormGroup>
                                  {filter.value.map(
                                    (category, cat_filter_index) => (
                                      <FormControlLabel
                                        key={cat_filter_index}
                                        control={
                                          <Checkbox
                                            checked={category.checked}
                                            name={category.name}
                                            onChange={(e, newval) => {
                                              updateFilter({
                                                layerIndex: layerIndex,
                                                filterIndex: filterIndex,
                                                filterStateObject: filter,
                                                newValue: newval,
                                                categoryFilterIndex: cat_filter_index,
                                              });
                                            }}
                                            icon={
                                              <CheckBoxOutlineBlankIcon fontSize="small" />
                                            }
                                            checkedIcon={
                                              <CheckBoxIcon fontSize="small" />
                                            }
                                          />
                                        }
                                        label={
                                          <Typography variant="body2">
                                            {category.name}
                                          </Typography>
                                        }
                                        size="small"
                                      />
                                    )
                                  )}
                                </FormGroup>
                              </ListItem>
                            );
                          /* range filter UI implementation */
                          case "range":
                            return (
                              <ListItem
                                key={"range" + filterIndex}
                                button
                                className={classes.nested}
                              >
                                <Grid
                                  item
                                  xs={12}
                                  key={"rangeSubHeader" + filterIndex}
                                >
                                  <Typography variant="subtitle2">
                                    {filter.name}
                                  </Typography>
                                  <Grid
                                    item
                                    xs={12}
                                    key={"sliderGrid" + filterIndex}
                                  >
                                    {/* <Grid item>
                                      <Input
                                        key="input_lower"
                                        id="input_lower"
                                        className={classes.input}
                                        value={value0}
                                        margin="dense"
                                        onChange={(event) => {
                                          setValue1(event.target.value === '' ? '' : Number(event.target.value));
                                        }}
                                        onBlur={() => {
                                          if (value0 < filter.min) {
                                            setValue1(filter.min);
                                          } else if (value0 > filter.max) {
                                            setValue1(filter.max);
                                          }
                                        }}
                                        inputProps={{
                                          // step: 10,
                                          min: filter.min,
                                          max: filter.max,
                                          type: 'number',
                                          'aria-labelledby': 'input-slider',
                                        }}
                                      />
                                    </Grid> */}
                                    <Slider
                                      id={filterIndex}
                                      key={"slider" + filterIndex}
                                      value={[
                                        Number(filter.value[0]),
                                        Number(filter.value[1]),
                                      ]}
                                      // value={[(typeof value0 === 'number' ? value0 : Number(filter.value[0])),
                                      // (typeof value1 === 'number' ? value1 : Number(filter.value[1]))
                                      // ]}
                                      min={filter.min}
                                      max={filter.max}
                                      aria-labelledby="input-slider"
                                      valueLabelDisplay="auto"
                                      marks={createMarks([
                                        Number(filter.min),
                                        Number(filter.max),
                                      ])}
                                      onChange={(e, newval) => {
                                        updateFilter({
                                          layerIndex: layerIndex,
                                          filterIndex: filterIndex,
                                          newValue: newval,
                                          filterStateObject: filter,
                                        });
                                      }}
                                      // step={x => log10(x)}
                                      // scale={x => log10(x)}
                                      // getAriaValueText={valueLabelFormat}
                                      // valueLabelFormat={valueLabelFormat}
                                    />
                                    {/* <Button
                                      onClick={(e) => {
                                        // filter[filterIndex].resetFilters();
                                      }}
                                    >
                                      RESET
                                    </Button> */}
                                    {/* <Grid item>
                                      <Input
                                        key="input_upper"
                                        id="input_upper"
                                        className={classes.input}
                                        value={value1}
                                        margin="dense"
                                        onChange={(event) => {
                                          setValue1(event.target.value === '' ? '' : Number(event.target.value));
                                        }}
                                        onBlur={() => {
                                          if (value1 < filter.min) {
                                            setValue1(filter.max);
                                          } else if (value1 > filter.max) {
                                            setValue1(filter.max);
                                          }
                                        }}
                                        inputProps={{
                                          // step: 10,
                                          min: filter.min,
                                          max: filter.max,
                                          type: 'number',
                                          'aria-labelledby': 'input-slider',
                                        }}
                                      />
                                    </Grid> */}
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
                </div>
              :
                <div>
                  <ListItem key={"collapseItem" + layerIndex}>
                    <ListItemIcon key={"listItemIcon"}>
                      {
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
                          <VisibilityIcon className='tour-visibility'/>
                        </ToggleButton>
                      }
                    </ListItemIcon>
                    <ListItemText primary={layer.name} />
                    {layerIndex === selectedLayer ? (
                      <ExpandLess
                        onClick={() => handleClick(layerIndex)}
                        className={classes.icon}
                      />
                    ) : (
                      <ExpandMore
                        onClick={() => handleClick(layerIndex)}
                        className='tour-expand'
                      />
                    )}
                  </ListItem>
                  <Collapse
                    in={layerIndex === selectedLayer}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      key={"collapseSubHeader" + layerIndex}
                      component="div"
                      disablePadding
                    >
                      {layer.source ? (
                        <Box fontStyle="italic">
                          
                          <Link href={'/Datasets/#publicData'}>{layer.source} ({layer.year})
                          </Link>
                        </Box>
                      ):(
                        <Link href={'/Datasets/#customData'}>
                          Learn more about custom maps
                        </Link>
                      )}
                      
                      {layer.filters.map((filter, filterIndex, filter_c) => {
                        switch (filter.type) {
                          /* you can implement category filter UI here */
                          case "categorical":
                            return (
                              <ListItem
                                key={"cat" + filterIndex}
                                className={classes.nested}
                              >
                                <FormGroup>
                                  {filter.value.map(
                                    (category, cat_filter_index) => (
                                      <FormControlLabel
                                        key={cat_filter_index}
                                        control={
                                          <Checkbox
                                            checked={category.checked}
                                            name={category.name}
                                            onChange={(e, newval) => {
                                              updateFilter({
                                                layerIndex: layerIndex,
                                                filterIndex: filterIndex,
                                                filterStateObject: filter,
                                                newValue: newval,
                                                categoryFilterIndex: cat_filter_index,
                                              });
                                            }}
                                            icon={
                                              <CheckBoxOutlineBlankIcon fontSize="small" />
                                            }
                                            checkedIcon={
                                              <CheckBoxIcon fontSize="small" />
                                            }
                                          />
                                        }
                                        label={
                                          <Typography variant="body2">
                                            {category.name}
                                          </Typography>
                                        }
                                        size="small"
                                      />
                                    )
                                  )}
                                </FormGroup>
                              </ListItem>
                            );
                          /* range filter UI implementation */
                          case "range":
                            return (
                              <ListItem
                                key={"range" + filterIndex}
                                button
                                className={classes.nested}
                              >
                                <Grid
                                  item
                                  xs={12}
                                  key={"rangeSubHeader" + filterIndex}
                                >
                                  <Typography variant="subtitle2">
                                    {filter.name}
                                  </Typography>
                                  <Grid
                                    item
                                    xs={12}
                                    key={"sliderGrid" + filterIndex}
                                  >
                                    {/* <Grid item>
                                      <Input
                                        key="input_lower"
                                        id="input_lower"
                                        className={classes.input}
                                        value={value0}
                                        margin="dense"
                                        onChange={(event) => {
                                          setValue1(event.target.value === '' ? '' : Number(event.target.value));
                                        }}
                                        onBlur={() => {
                                          if (value0 < filter.min) {
                                            setValue1(filter.min);
                                          } else if (value0 > filter.max) {
                                            setValue1(filter.max);
                                          }
                                        }}
                                        inputProps={{
                                          // step: 10,
                                          min: filter.min,
                                          max: filter.max,
                                          type: 'number',
                                          'aria-labelledby': 'input-slider',
                                        }}
                                      />
                                    </Grid> */}
                                    <Slider
                                      id={filterIndex}
                                      key={"slider" + filterIndex}
                                      value={[
                                        Number(filter.value[0]),
                                        Number(filter.value[1]),
                                      ]}
                                      // value={[(typeof value0 === 'number' ? value0 : Number(filter.value[0])),
                                      // (typeof value1 === 'number' ? value1 : Number(filter.value[1]))
                                      // ]}
                                      min={filter.min}
                                      max={filter.max}
                                      aria-labelledby="input-slider"
                                      valueLabelDisplay="auto"
                                      marks={createMarks([
                                        Number(filter.min),
                                        Number(filter.max),
                                      ])}
                                      onChange={(e, newval) => {
                                        updateFilter({
                                          layerIndex: layerIndex,
                                          filterIndex: filterIndex,
                                          newValue: newval,
                                          filterStateObject: filter,
                                        });
                                      }}
                                      // step={x => log10(x)}
                                      // scale={x => log10(x)}
                                      // getAriaValueText={valueLabelFormat}
                                      // valueLabelFormat={valueLabelFormat}
                                    />
                                    {/* <Button
                                      onClick={(e) => {
                                        // filter[filterIndex].resetFilters();
                                      }}
                                    >
                                      RESET
                                    </Button> */}
                                    {/* <Grid item>
                                      <Input
                                        key="input_upper"
                                        id="input_upper"
                                        className={classes.input}
                                        value={value1}
                                        margin="dense"
                                        onChange={(event) => {
                                          setValue1(event.target.value === '' ? '' : Number(event.target.value));
                                        }}
                                        onBlur={() => {
                                          if (value1 < filter.min) {
                                            setValue1(filter.max);
                                          } else if (value1 > filter.max) {
                                            setValue1(filter.max);
                                          }
                                        }}
                                        inputProps={{
                                          // step: 10,
                                          min: filter.min,
                                          max: filter.max,
                                          type: 'number',
                                          'aria-labelledby': 'input-slider',
                                        }}
                                      />
                                    </Grid> */}
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
                </div>
              }

            </List>
          ))}
        </Paper>
      </Container>
    // </div>
  );
};
