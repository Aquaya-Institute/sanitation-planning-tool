import * as React from "react";
import { MapContext } from "../../state/MapState";
import Slider from "@material-ui/core/Slider";
import { Grid, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import FormGroup from "@material-ui/core/FormGroup";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DatasetInfoPopover from "./DatasetInfoPopover";
import { SliderNonLinear } from "./SliderNonLinear";

// const accessCountNames_1 = [];
// const accessCountNames_2 = [];
// const socioCountNames_2 = [];
// const washCountNames_2 = [];
// const healthCountNames_2 = [];
// const accessCountNames_3 = [];
// const socioCountNames_3 = [];
// const washCountNames_3 = [];
// const healthCountNames_3 = [];
// let accessCounts_1 = new Set(null);
// let accessCounts_2 = new Set(null);
// let washCounts_2 = new Set(null);
// let socioCounts_2 = new Set(null);
// let healthCounts_2 = new Set(null);
// let accessCounts_3 = new Set(null);
// let washCounts_3 = new Set(null);
// let socioCounts_3 = new Set(null);
// let healthCounts_3 = new Set(null);

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(3),
    "&:hover": {
      background: "#FFFFFF",
    },
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

const MapLayerContent = ({ cat, layerID }) => {
  const [{ maps, currentMapID }, dispatch] = React.useContext(MapContext);
  const [mapID, setMapID] = useState("ghana");
  const classes = useStyles();

  useEffect(() => {
    if (currentMapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID]);

  const updateFilter = ({
    layerIndex,
    filterIndex,
    newValue,
    scaledValue,
    filterStateObject,
    categoryFilterIndex,
  }) => {
    /* 
      TODO: instead of layerindex use layerID 
      since layers can be visually ordered in 
      the future and using index will not work 
      */

    // if (layerIndex === "1") {
    //   if (filterStateObject.subcategory === "accessibility") {
    //     accessCountNames_1.push(filterStateObject.name);
    //     accessCounts_1 = [...new Set(accessCountNames_1)];
    //   }
    // } else if (layerIndex === "2") {
    //   if (filterStateObject.subcategory === "accessibility") {
    //     accessCountNames_2.push(filterStateObject.name);
    //     accessCounts_2 = [...new Set(accessCountNames_2)];
    //   } else if (filterStateObject.subcategory === "wash") {
    //     washCountNames_2.push(filterStateObject.name);
    //     washCounts_2 = [...new Set(washCountNames_2)];
    //   } else if (filterStateObject.subcategory === "socioeconomic") {
    //     socioCountNames_2.push(filterStateObject.name);
    //     socioCounts_2 = [...new Set(socioCountNames_2)];
    //   } else if (filterStateObject.subcategory === "health") {
    //     healthCountNames_2.push(filterStateObject.name);
    //     healthCounts_2 = [...new Set(healthCountNames_2)];
    //   }
    // } else if (layerIndex === "3") {
    //   if (filterStateObject.subcategory === "accessibility") {
    //     accessCountNames_3.push(filterStateObject.name);
    //     accessCounts_3 = [...new Set(accessCountNames_3)];
    //   } else if (filterStateObject.subcategory === "wash") {
    //     washCountNames_3.push(filterStateObject.name);
    //     washCounts_3 = [...new Set(washCountNames_3)];
    //   } else if (filterStateObject.subcategory === "socioeconomic") {
    //     socioCountNames_3.push(filterStateObject.name);
    //     socioCounts_3 = [...new Set(socioCountNames_3)];
    //   } else if (filterStateObject.subcategory === "health") {
    //     healthCountNames_3.push(filterStateObject.name);
    //     healthCounts_3 = [...new Set(healthCountNames_3)];
    //   }
    // }

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
      layerIndex: layerID,
      filterIndex: filterIndex,
      filter: {
        ...filterStateObject,
        value: newValue,
        scaledValue: scaledValue,
      },
      // accessCounter: layer.accessCounter,
      // accessCounter_1: accessCounts_1.length,
      // accessCounter_2: accessCounts_2.length,
      // washCounter_2: washCounts_2.length,
      // socioCounter_2: socioCounts_2.length,
      // healthCounter_2: healthCounts_2.length,
      // accessCounter_3: accessCounts_3.length,
      // washCounter_3: washCounts_3.length,
      // socioCounter_3: socioCounts_3.length,
      // healthCounter_3: healthCounts_3.length,
    });
  };

  return (
    <>
      {maps[mapID].layers[layerID].filters.map((filter, filterIndex) => (
        <>
          {filter.subcategory === cat && (
            <List>
              {filter.type === "categorical" ? (
                <ListItem key={"cat" + filterIndex} className={classes.nested}>
                  <Grid
                    container
                    spacing={0}
                    key={"catSubHeader" + filterIndex}
                  >
                    <Grid item xs={11} key={"catSubHeader2" + filterIndex}>
                      <Typography
                        variant="subtitle2"
                        key={"catSubHeader3" + filterIndex}
                      >
                        {filter.name} {filter.unit}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} key={"catSubHeader4" + filterIndex}>
                      <DatasetInfoPopover
                        filter={filter}
                        filterIndex={filterIndex}
                      />
                    </Grid>
                    <Grid item xs={12} key={"catFilter" + filterIndex}>
                      <FormGroup key={"catFilter2" + filterIndex}>
                        {filter.value.map((category, cat_filter_index) => (
                          <FormControlLabel
                            key={cat_filter_index}
                            control={
                              <Checkbox
                                key={cat_filter_index + "box"}
                                checked={category.checked}
                                name={category.name}
                                onChange={(e, newval) => {
                                  updateFilter({
                                    layerIndex: layerID,
                                    filterIndex: filterIndex,
                                    filterStateObject: filter,
                                    newValue: newval,
                                    categoryFilterIndex: cat_filter_index,
                                  });
                                }}
                                icon={
                                  <CheckBoxOutlineBlankIcon fontSize="small" />
                                }
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
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
              ) : filter.type === "range" ? (
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
                    <Grid item xs={11} key={"rangeSubHeader2" + filterIndex}>
                      <Typography
                        variant="subtitle2"
                        key={"rangeSubHeader3" + filterIndex}
                      >
                        {filter.name} ({filter.unit})
                      </Typography>
                    </Grid>
                    <Grid item xs={1} key={"rangeSubHeader4" + filterIndex}>
                      <DatasetInfoPopover
                        filter={filter}
                        filterIndex={filterIndex}
                      />
                    </Grid>
                    <Grid item xs={11} key={"sliderGrid" + filterIndex}>
                      <Slider
                        id={filterIndex}
                        key={"slider" + filterIndex}
                        value={[
                          Number(filter.value[0]),
                          Number(filter.value[1]),
                        ]}
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
                            layerIndex: layerID,
                            filterIndex: filterIndex,
                            newValue: newval,
                            filterStateObject: filter,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              ) : (
                <ListItem
                  key={"NLrange" + filterIndex}
                  button
                  className={classes.nested}
                >
                  <Grid
                    container
                    spacing={0}
                    key={"NLrangeSubHeader" + filterIndex}
                  >
                    <Grid item xs={11} key={"NLrangeSubHeader2" + filterIndex}>
                      <Typography
                        variant="subtitle2"
                        key={"NLrangeSubHeader3" + filterIndex}
                      >
                        {filter.name} ({filter.unit})
                      </Typography>
                    </Grid>
                    <Grid item xs={1} key={"NLrangeSubHeader4" + filterIndex}>
                      <DatasetInfoPopover
                        filter={filter}
                        filterIndex={filterIndex}
                      />
                    </Grid>
                    <Grid item xs={11} key={"NLsliderGrid" + filterIndex}>
                      <SliderNonLinear
                        id={filterIndex}
                        key={"slider" + filterIndex}
                        value={[
                          Number(filter.value[0]),
                          Number(filter.value[1]),
                        ]}
                        min={filter.min}
                        max={filter.max}
                        aria-labelledby="non-linear-input-slider"
                        valueLabelDisplay="auto"
                        marks={filter.marks}
                        callback={(e, newval, scaledVal) => {
                          updateFilter({
                            layerIndex: layerID,
                            filterIndex: filterIndex,
                            newValue: newval,
                            scaledValue: scaledVal,
                            filterStateObject: filter,
                          });
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              )}
            </List>
          )}
        </>
      ))}
    </>
  );
};
export default MapLayerContent;
