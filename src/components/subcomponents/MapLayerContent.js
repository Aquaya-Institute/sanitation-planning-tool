import * as React from "react";
import { MapContext } from "../../state/MapState";
import Slider from "@material-ui/core/Slider";
// import { MapSelector } from "./MapSelector";
import { Container, Grid, Box, Typography } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useState, useRef } from "react";
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
import Input from "@material-ui/core/Input";
import Datasets from "../../views/Datasets";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
// import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import DatasetInfoPopover from "./DatasetInfoPopover";

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
      background: "#e3e3e3",
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

const MapLayerContent = ({ layer, layerIndex }) => {
  const [{ maps, currentMapID }, dispatch] = React.useContext(MapContext);
  const [mapID, setMapID] = useState("ghana");
  const classes = useStyles();
  const [selectedLayer, setselectedLayer] = React.useState("");

  // const [value1, setValue1] = React.useState();
  // const [value0, setValue0] = React.useState();
  const handleClick = (layerIndex) => {
    if (selectedLayer === layerIndex) {
      setselectedLayer("");
    } else {
      setselectedLayer(layerIndex);
    }
  };

  const toggleLayerVisibility = (layerID) => {
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      layerID: layerID,
    });
  };

  const stepFunc = (name, min, max, input) => {
    if (name === "Population Estimate") {
      var intervals = [250, 500, 1000, 5000, 10000, 100000, 1000000];
      let distributions = intervals.length;
      let descretePoints = Math.ceil(
        (max - min) /
          intervals.reduce((total, step) => total + step / distributions, 0)
      );

      return (
        // descretePoints,input,
        // (input) => {
        //     let stepTransforms = intervals.map((s, i) => {
        //       let setCount = Math.min(Math.ceil(input - (descretePoints * i / distributions)), Math.round(descretePoints / distributions));
        //       console.log('input',input)
        //       return setCount > 0 ? setCount * s : 0;
        //     });

        //     let lastStep = 0;
        //     let out = Math.round(stepTransforms.reduce((total, num, i) => {
        //       if (num) {
        //         lastStep = i;
        //       }
        //       return total + num;
        //     })) + min;
        //     console.log("out", out)

        //     let currentUnit = intervals[lastStep];
        //     return Math.min(
        //       Math.round((out / currentUnit)) * currentUnit,  //round to nearest step
        //       max
        //     );
        // }
        [250, 500, 1000, 5000, 10000, 100000, 1000000]
      );
    }
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
    <>
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
              <VisibilityIcon className="tour-visibility" />
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
            className="tour-expand"
            className={classes.icon}
          />
        )}
      </ListItem>
      <Collapse in={layerIndex === selectedLayer} timeout="auto" unmountOnExit>
        <List
          key={"collapseSubHeader" + layerIndex}
          component="div"
          disablePadding
        >
          {layer.filters.map((filter, filterIndex) => {
            switch (filter.type) {
              /* you can implement category filter UI here */
              case "categorical":
                return (
                  <ListItem
                    key={"cat" + filterIndex}
                    className={classes.nested}
                  >
                    <Grid
                      container
                      spacing={0}
                      key={"catSubHeader" + filterIndex}
                    >
                      <Grid item xs={11}>
                        <Typography variant="subtitle2">
                          {filter.name} {filter.unit}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <DatasetInfoPopover
                          filter={filter}
                          filterIndex={filterIndex}
                        />
                      </Grid>
                      <Grid item xs={12} key={"catSubHeader" + filterIndex}>
                        <FormGroup>
                          {filter.value.map((category, cat_filter_index) => (
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
                                  color="primary"
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  {category.name}
                                </Typography>
                              }
                              size="small"
                            />
                          ))}
                        </FormGroup>
                      </Grid>
                    </Grid>
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
                      container
                      spacing={0}
                      key={"rangeSubHeader" + filterIndex}
                    >
                      <Grid item xs={11}>
                        <Typography variant="subtitle2">
                          {filter.name} {filter.unit}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <DatasetInfoPopover
                          filter={filter}
                          filterIndex={filterIndex}
                        />
                      </Grid>
                      <Grid item xs={11} key={"sliderGrid" + filterIndex}>
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
                          // marks={stepFunc(filter.name, filter.min, filter.max, [
                          //     Number(filter.value[0]),
                          //     Number(filter.value[1]),
                          // ])}
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
    </>
  );
};
export default MapLayerContent;
