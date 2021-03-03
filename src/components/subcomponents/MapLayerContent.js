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
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { selectedDistricts } from "../Map";
import InfoOutlinedIcon from "@material-ui/icons/Info";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import theme from "../../theme/theme";
import { Card, CardContent, Button } from "@material-ui/core";
import { SliderNonLinear } from "./SliderNonLinear";

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
      background: "#d8d9e3",
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
    "&:hover": {
      background: theme.palette.background.default,
    },
  },
  input: {
    width: 42,
  },
  collapse: {
    entered: {
      background: "blue",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popover: {
    width: 550,
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 1, 1, 1),
    backgroundColor: theme.palette.background.paper,
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
  const [age, setAge] = React.useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const clickRef = useRef(null);
  const [datasetName, setDatasetName] = useState();
  const [menuBackground, setMenuBackground] = useState();
  const widgetDom = document.querySelector("#countriesWidget");
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  // const [value1, setValue1] = React.useState();
  // const [value0, setValue0] = React.useState();
  const handleClick = (layerIndex) => {
    if (selectedLayer === layerIndex) {
      setselectedLayer("");
      setMenuBackground(theme.palette.background.paper);
    } else {
      setselectedLayer(layerIndex);
      setMenuBackground("#d8d9e3");
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
      mapID: mapID,
      layerIndex: layerIndex,
      filterIndex: filterIndex,
      filter: {
        ...filterStateObject,
        value: newValue,
        scaledValue: scaledValue
      },
    });
  };

  const settlementInfo = {
    name: "Settlement Areas and Estimated Population",
    description:
      "All settlements (areas consisting of multiple households/buildings) were mapped with the combination of two population mapping datasets. The datasets estimate the location of all settlements using satellite imagery. SanPlan combined these together to determine the location and boundary of all settlements. Data from various publicly available sources were then extracted for each settlement. The point layer represented on the SanPlan map represents the geographic center of each settlement areas's estimated boundary.",
    note:
      "DISCLAIMER: Settlements mapped in this manner do not represent administratively recognized communities. It is highly likely that multiple communities in close proximity were combined graphically into a single settlement. As a result, center point locations may appear ‘off’ when compared with satellite imagery or base maps.",
    year: 2020,
    resolution: "30m",
    source: "SanPlan",
    subcategory: "accessibility",
    wsf:
      "An effort headed by the German Aerospace Center which improves upon previous efforts to outline settlements (e.g., Global Urban Footprint) by employing a novel and robust methodology which jointly exploits open-and-free multitemporal optical and radar data.",
    wsf_citation:
      "Marconcini, M., Metz-Marconcini, A., Üreyen, S. et al. Outlining where humans live, the World Settlement Footprint 2015. Sci Data 7, 242 (2020). https://doi.org/10.1038/s41597-020-00580-5",
    wsf_link:
      "https://springernature.figshare.com/collections/Outlining_where_humans_live_-_The_World_Settlement_Footprint_2015/4712852",
    fb:
      "Facebook, in partnership with the Center for International Earth Science Information Network (CIESIN) at Columbia University, utilized state-of-the-art computer vision techniques to identify buildings from publicly accessible mapping services to create population datasets at a 30m resolution.",
    fb_citation:
      "Facebook Connectivity Lab and Center for International Earth Science Information Network - CIESIN - Columbia University. 2016. High Resolution Settlement Layer (HRSL). Source imagery for HRSL © 2016 DigitalGlobe. Accessed 15 Sept. 2020.",
    fb_link: "https://dataforgood.fb.com/tools/population-density-maps/",
    link: "/Datasets/#settle",
  };

  return (
    <>
      <ListItem
        key={"collapseItem" + layerIndex}
        style={{ backgroundColor: menuBackground }}
        className={classes.icon}
      >
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
        <ListItemText
          primary={layer.name}
          onClick={() => handleClick(layerIndex)}
        />
        {(layer.name === "Settlement Areas and Estimated Population (pop.)"||layer.name === "Communities") && (
          <>
            <InfoOutlinedIcon
              fontSize="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPopoverOpen(true);
                // setDatasetName(layer.name);
                // setPopup(null);
              }}
              onMouseEnter={() => {
                setHover(true);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
              style={{
                color: hover ? theme.palette.secondary.main : "#a8a8a8",
              }}
            />
            <Modal
              ref={clickRef}
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={popoverOpen}
              onClose={(e) => {
                setPopoverOpen(false);
              }}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
              elevation={3}
            >
              <Fade in={popoverOpen}>
                <div className={classes.popover}>
                  <Grid
                    container
                    justify="flex-end"
                    pt={2}
                    key={"popoverHeader"}
                  >
                    <CloseIcon
                      key={"popoverClose"}
                      fontSize="small"
                      color="disabled"
                      onClick={(e) => {
                        setPopoverOpen(false);
                      }}
                    />
                    <Card className={classes.root} elevation={0}>
                      <CardContent>
                        <Typography variant="h6" component="h2">
                          {settlementInfo.name}
                        </Typography>
                        {settlementInfo.description}
                        <br></br>
                        <Typography color="textSecondary">
                          {settlementInfo.note}
                        </Typography>
                        <Typography variant="body1">
                          Year: {settlementInfo.year}
                        </Typography>
                        <Typography variant="body1" component="h5">
                          Dataset resolution: {settlementInfo.resolution}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          <strong>{settlementInfo.source}</strong>
                        </Typography>
                        {settlementInfo.source === "SanPlan" && (
                          <Button
                            href={settlementInfo.link}
                            size="small"
                            variant="outlined"
                            color="primary"
                          >
                            More Info on This Layer
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </div>
              </Fade>
            </Modal>
          </>
        )}
        {layerIndex === selectedLayer ? (
          <ExpandLess onClick={() => handleClick(layerIndex)} />
        ) : (
          <ExpandMore
            onClick={() => handleClick(layerIndex)}
            className="tour-expand"
          />
        )}
      </ListItem>
      <Collapse
        in={layerIndex === selectedLayer}
        timeout="auto"
        unmountOnExit
        className={classes.collapse}
      >
        <List
          key={"collapseSubHeader" + layerIndex}
          component="div"
          disablePadding
        >
          {/* {layer.name==="Settlement Areas and Estimated Population (pop.)" &&(
           
          )} */}
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
                          {filter.name} ({filter.unit})
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
              /* non-linear range filter UI implementation */
              case "range_non_linear":
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
                          {filter.name} ({filter.unit})
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <DatasetInfoPopover
                          filter={filter}
                          filterIndex={filterIndex}
                        />
                      </Grid>
                      <Grid item xs={11} key={"sliderGrid" + filterIndex}>       
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
                              layerIndex: layerIndex,
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
