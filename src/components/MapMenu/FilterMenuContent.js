import * as React from "react";
import { MapContext } from "../../state/MapState";
import Slider from "@material-ui/core/Slider";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import FormGroup from "@material-ui/core/FormGroup";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DatasetInfoPopover from "./DatasetInfoPopover";
import { SliderNonLinear } from "../subcomponents/SliderNonLinear";

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

const FilterMenuContent = ({ cat, layerID }) => {
  const [{ maps, currentMapID }, dispatch] = React.useContext(MapContext);
  // const [mapID, setMapID] = useState(null);
  const classes = useStyles();

  // useEffect(() => {
  //   if (currentMapID) {
  //     console.log(currentMapID);
  //     setMapID(currentMapID);
  //   }
  // }, [currentMapID]);

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
      mapID: currentMapID,
      layerIndex: layerID,
      filterIndex: filterIndex,
      filter: {
        ...filterStateObject,
        value: newValue,
        scaledValue: scaledValue,
      },
    });
  };

  return (
    <React.Fragment key="filterListDiv">
      {maps[currentMapID].layers[layerID].filters.map((filter, filterIndex) => (
        <React.Fragment key={"filterListDiv" + filterIndex}>
          {filter.subcategory === cat && filter.type !== "none" && (
            <List key="filterList">
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
                      <FormGroup
                        key={"catFilter2" + filterIndex}
                        aria-labelledby={
                          filter.name + " categorical checkbox filter"
                        }
                      >
                        {filter.value.map((category, cat_filter_index) => (
                          <FormControlLabel
                            key={cat_filter_index + "formcontrol"}
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
                                    newValue: !category.checked,
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
                              <Typography
                                key="filterListItemLabel"
                                variant="body2"
                              >
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
                        aria-labelledby={filter.name + " range slider"}
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
                        aria-labelledby={filter.name + " non-linear slider"}
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
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
export default FilterMenuContent;
