import { useState, useEffect, useContext, useRef, Fragment } from "react";
import { MapContext } from "../state/MapState";
import Carto from "@carto/carto.js";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Typography,
  Link,
  Grid,
  Divider,
  Button,
  Box,
} from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import "../App.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import { positions } from "@material-ui/system";
import theme from "../theme/theme";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
// import { AggregationTypes } from '@carto/react/widgets';
// import { FormulaWidget } from '@carto/react/widgets';
const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
  },
  grid: {
    height: 40,
    width: 40,
  },
  gridlabel: {
    height: 10,
    width: 100,
  },
  paper: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    width: "20px",
    height: "20px",
    opacity: 1,
    position: "absolute",
    bottom: "12px",
    left: "50px",
    // marginbottom: '6px',
  },
  button: {
    margin: theme.spacing(1),
  },
  element: {
    // ...theme.typography.overline,
    textTransform: "none",
    color: theme.palette.text.secondary,
    // padding: theme.spacing(0.25, 0),
  },
  dot: {
    // flex: "0 0 auto",
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
  },
  popover: {
    width: 400,
  },
}));

function transformArray(array) {
  var obj, i, variable, value, cat;
  var returnedTarget = [];
  for (i = 0; i < array.length; i++) {
    obj = {};
    variable = array[i][0];
    value = array[i][1];
    cat = array[i][2];
    obj["Name"] = variable;
    obj["Value"] = value;
    obj["Category"] = cat;
    returnedTarget.push(obj);
  }
  return returnedTarget;
}

export const Map = () => {
  const [{ currentMapID, maps }, dispatch] = useContext(MapContext);
  const [mapID, setMapID] = useState();
  const [layerID, setlayerID] = useState();
  const [visibleLayers, setVisibleLayers] = useState();
  const [currentMapState, setCurrentMapState] = useState();
  const [leaflet, setLeaflet] = useState();
  const [cartoClient, setCartoClient] = useState();
  const [popup, setPopup] = useState();
  const [multiPopup, setMultiPopup] = useState();
  const [popupData, setPopupData] = useState();
  const [popover, setPopover] = useState(null);
  const [buckets, setBuckets] = useState([]);
  const openPopper = Boolean(popup);
  const openPopover = Boolean(popover);
  const idPopper = openPopper ? "transitions-popper" : undefined;
  const idPopover = openPopover ? "simple-popover" : undefined;
  // const arrowRef = useRef();
  const classes = useStyles();
  const clickRef = useRef(null);
  // const legend = $("#legend-content");
  // const legend_title = $("#legend-title");
  // const mapRef = useRef();
  // const [latLng, setLatLng] = useState([31, 55]);
  const cat = ["accessibility", "wash", "health", "socioeconomic"];
  var dat_popup = [];
  //click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickRef.current && !clickRef.current.contains(event.target)) {
        setPopup(null);
        console.log("clicked outside");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  //set mapID
  useEffect(() => {
    console.log("currentMapID", currentMapID);
    if (currentMapID) {
      setMapID(currentMapID);
    }
  }, [currentMapID]);
  //clean up
  useEffect(() => {
    if (mapID) {
      return function cleanup() {
        dispatch({
          type: "map.select",
          mapID: null,
        });
        dispatch({
          type: "layer.removeCartoLayers",
        });
      };
    }
  }, [mapID]);

  useEffect(() => {
    console.log("load");

    if (leaflet !== undefined) {
      //https://github.com/Leaflet/Leaflet/issues/3962#issuecomment-568678650
      console.log("remove map renderer");
      leaflet.remove();
    }

    const client = new Carto.Client({
      apiKey: process.env.REACT_APP_CARTO_DEV_API_KEY,
      username: process.env.REACT_APP_CARTO_USERNAME,
    });

    const map = L.map("map").setView(
      // maps[mapID].view ?? "[8.059229627200192, -1.0546875000000002], 7"
      // latLng,7
      [8.059229627200192, -1.0546875000000002],
      7
    );
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
      {
        maxZoom: 22,
      }
    ).addTo(map);

    setLeaflet((prevmap) => {
      if (!prevmap) {
        return map;
      } else {
        return prevmap;
      }
    });

    setCartoClient(client);
    client.getLeafletLayer().addTo(map);
    dispatch({
      type: "map.addCartoClient",
      carto_client: client,
    });
  }, []);

  /* 
  check if map state should be updated, such as on
  selection of a different country from the map selector 
  dropdown.
  Remove any previous layers from cartoClient
  */
  useEffect(() => {
    if (mapID) {
      setCurrentMapState((prevMap) => {
        if (prevMap && prevMap.name === maps[mapID].name) {
          return prevMap;
        } else {
          //user has selected different country
          return maps[mapID];
        }
      });
    }
  }, [maps, mapID, cartoClient]);

  /* 
  When map state is updated run this effect.
  Instantiate carto layers using map state and store 
  the carto layer objects in global state (mapstate.js) so that we 
  can later run operations on the layers - such as 
  filtering, toggling visibility 
  */
  useEffect(() => {
    console.log("Selected Map Changed", currentMapState);

    if (cartoClient && currentMapState) {
      console.log("Creating Carto Layers");
      const _mapID = currentMapState.mapID;
      // map.setView(new L.LatLng(34.5333, 69.1333),7);
      // setLatLng(currentMapState.view)
      // mapRef.current.setView(latLng,7)
      // mapRef.current.setView(new L.latLng(currentMapState.view),7)
      var buckets_list = [];

      currentMapState.layers.forEach((layer, index) => {
        const _source = new Carto.source.SQL(
          `SELECT * FROM ${layer.carto_tableName}`
        );
        const _style = new Carto.style.CartoCSS(layer.carto_style);
        const _filters = [];
        const _columns = [];
        layer.filters.forEach((filter, filter_c) => {
          switch (filter.type) {
            case "range":
              const _filter = new Carto.filter.Range(filter.column_name, {
                gte: filter.value[0],
                lte: filter.value[1],
              });
              _filters.push(_filter);
              _columns.push(filter.column_name);
              break;
            case "categorical":
              let col_vals_tofilter = [];
              //on init get the category filter state and create
              //an array of checked=true col values to filter by
              filter.value.forEach((category) => {
                if (category.checked === true)
                  col_vals_tofilter.push(category.value);
              });
              const _filter_c = new Carto.filter.Category(filter.column_name, {
                in: col_vals_tofilter,
              });
              _filters.push(_filter_c);
              _columns.push(filter.column_name);
              break;
            default:
              break;
          }
        });

        //add filters to the source, if any
        if (_filters.length > 0) {
          _source.addFilter(new Carto.filter.AND(_filters));
        }

        //create the carto layer and add feature clicks
        const _layer = new Carto.layer.Layer(_source, _style, {
          featureClickColumns: _columns,
        });

        //setup feature clicks on relevant layers
        if (_columns.length > 0) {
          _layer.on("featureClicked", (featureEvent) => {
            console.log("clicked a feature", featureEvent);
            setPopup(featureEvent);
            setPopover(null);
            console.log("popup", popup);
          });
        }
        console.log("cycle");
        //set default visibility as set in map state
        if (layer.visible) {
          _layer.show();
        } else {
          _layer.hide();
        }

        //add the layer to carto client
        cartoClient.addLayer(_layer);
        setlayerID(index);

        // change legend when data classification method changes
        var executed = false;

        _layer.on("metadataChanged", function (event) {
          if (!executed) {
            executed = true;
            console.log(event);
            var obj = {};
            // get buckets
            if (event.styles[0]._buckets === undefined) {
              obj["variable"] = layer.name;
              obj["legend"] = event.styles[0]._categories;
              for (var i in obj.legend) {
                if (obj.legend[i].name === 1) {
                  obj.legend[i].name = "Rural remote";
                } else if (obj.legend[i].name === 2) {
                  obj.legend[i].name = "Rural on-road";
                } else {
                  obj.legend[i].name = "Rural mixed";
                }
              }
              buckets_list.push(obj);
            } else {
              obj["variable"] = layer.name;
              obj["legend"] = event.styles[0]._buckets;
              buckets_list.push(obj);
            }
            setBuckets((st) => [...st, obj]);
          }
        });

        //add the carto layer to global state
        dispatch({
          type: "layer.addCartoLayer",
          mapID: _mapID,
          layerID: index,
          cartoLayer: _layer,
        });
      });
    }
  }, [currentMapState, cartoClient, dispatch]);

  useEffect(() => {
    console.log("updated popup", popup);
    // setMultiPopup([...multiPopup, popup])
    // console.log("updated popupmulti", multiPopup);
    if (popup) {
      var dat = [];
      currentMapState.layers[layerID].filters.forEach(function (element) {
        dat.push([element.column_name, element.name, element.subcategory]);
      });
      dat.sort();
      var dat_loc = [];
      Object.entries(popup.data)
        .slice(1)
        .map((keyName) => {
          return dat_loc.push([keyName[0], keyName[1]]);
        });
      dat_loc.sort();

      for (let i = 0; i < dat.length; i++) {
        for (let j = 0; j < dat_loc.length; j++) {
          if (dat[i][0] === dat_loc[j][0]) {
            dat_popup.push([dat[i][1], dat_loc[j][1], dat[i][2]]);
          }
        }
      }
      dat_popup = transformArray(dat_popup);
      var obj = {};
      obj["data"] = dat_popup;
      obj["position"] = popup.position;
      setPopupData(obj);
      console.log("updated dat_popup", dat_popup);
      console.log("updated popupData", popupData);
    }
  }, [popup]);

  useEffect(() => {
    if (maps[mapID]) {
      let visibleLayer_list = [];
      maps[mapID].layers.forEach((layer, index) => {
        if (layer.visible) {
          visibleLayer_list.push(layer.name);
        }
      });
      setVisibleLayers(visibleLayer_list);
    }
  }, [maps, mapID]);

  // useEffect(()=>{
  //   if (buckets_list>0 && visibleLayer_list>0) {
  //     visibleLayer_list.map((vis) => {
  //       return (
  //         buckets_list.map((bucket,i) => {
  //           if (vis === bucket[i].variable) {
  //             return (
  //               setLegend(bucket[i])
  //             )
  //           }
  //         })
  //       )
  //     })
  //   }
  // },[])

  return (
    <div
      style={{ height: "100%", position: "relative" }}
      className={classes.content}
    >
      <div id="map" style={{ height: "100%" }}></div>
      {buckets && visibleLayers && (
        <Paper
          key={"legendContainer"}
          style={{
            padding: theme.spacing(1),
            position: "absolute",
            bottom: "10px",
            right: "10px",
            top: "unset",
            left: "unset",
            height: "auto",
            width: "auto",
            zIndex: "1000",
            backgroundColor: "#fff",
          }}
        >
          {/* {JSON.stringify(visibleLayers)} */}

          {visibleLayers.map((vis) => {
            return (
              <Fragment key={"legendContent" + vis}>
                {buckets.map((bucket, i) => {
                  if (vis === bucket.variable) {
                    return (
                      // <Grid container className={classes.root} spacing={2}><Grid item xs={12}><Grid container justify='center' spacing={0}>
                      //   <Grid item><Paper className={classes.grid} style={{backgroundColor: obj.value}} elevation={0}></Paper></Grid>
                      // <Grid container justify='center' spacing={0}>
                      //   <Grid item><Paper className={classes.gridlabel} elevation={0}>{obj.min}</Paper></Grid>
                      //   <Grid item><Paper className={classes.gridlabel} elevation={0}>{obj.max}</Paper></Grid>
                      // </Grid></Grid></Grid></Grid>
                      <Fragment key={"legendContent" + bucket.variable}>
                        <Typography key={"legendTitle" + bucket.variable}>
                          <strong>{vis}</strong>
                        </Typography>

                        {bucket.legend.map((legend, j) => {
                          return (
                            <Grid
                              container
                              direction="row"
                              alignItems="center"
                              className={classes.element}
                              key={"bucket" + j}
                            >
                              <div
                                className={classes.dot}
                                style={{
                                  backgroundColor: legend.value,
                                }}
                                key={legend.value.toString()}
                              ></div>
                              {legend.name === undefined
                                ? legend.min.toFixed(0).toString() +
                                  " - " +
                                  legend.max.toFixed(0).toString()
                                : legend.name}
                            </Grid>
                          );
                        })}
                      </Fragment>
                    );
                  } else {
                    return null;
                  }
                })}
              </Fragment>
            );
          })}
        </Paper>
      )}
      {popupData && (
        <Popper
          ref={clickRef}
          id={idPopper}
          key={idPopper}
          open={openPopper}
          disablePortal={true}
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "scrollParent",
            },
            arrow: {
              enabled: true,
              // element: arrowRef,
            },
          }}
          style={{
            position: "absolute",
            left: popupData.position.x,
            top: popupData.position.y,
            zIndex: "1300",
            backgroundColor: "#fff",
            width: "200px",
          }}
          elevation={3}
        >
          <div className={classes.paper}>
            {popupData.data.length === 1 && (
              <Box fontSize="fontSize">
                <strong>{popupData.data[0].Name}:</strong>{" "}
                {popupData.data[0].Value.toFixed(1)}
              </Box>
            )}
            {popupData.data.length > 1 && (
              <>
                <Box fontSize="fontSize">
                  <strong>Population Estimate:</strong>{" "}
                  {popupData.data[7].Value}
                  <br></br>
                  <strong>Community Classification:</strong> Rural Remote
                </Box>
                <Link
                  key={"seeMore"}
                  component="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPopover(e.currentTarget);
                    // setPopup(null);
                  }}
                >
                  SEE MORE
                </Link>
                <Popover
                  id={idPopover}
                  key={idPopover}
                  open={openPopover}
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: 400, left: 800 }}
                  style={{ zIndex: "2000" }}
                  onClose={() => {
                    setPopover(null);
                  }}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                  }}
                >
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
                        // e.preventDefault();
                        setPopover(null);
                        // openPopper(null)
                      }}
                    />
                  </Grid>
                  {cat.map((category, i) => {
                    return (
                      <Table
                        className={classes.popover}
                        key={"popoverTable" + i}
                      >
                        <Box fontWeight="fontWeightBold" pt={1}>
                          {category.toUpperCase()}
                        </Box>

                        <TableBody>
                          {popupData.data.map((anObjectMapped, j) => {
                            if (anObjectMapped.Category === category) {
                              return (
                                <TableRow key={"popoverTableRow" + j}>
                                  <TableCell style={{ width: "70%" }}>
                                    {anObjectMapped.Name}
                                  </TableCell>
                                  <TableCell
                                    style={{ width: "30%" }}
                                    align="center"
                                  >
                                    {anObjectMapped.Value}
                                  </TableCell>
                                </TableRow>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </TableBody>
                      </Table>
                    );
                  })}
                  <Divider />
                  <Grid container justify="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.button}
                      startIcon={<SaveIcon />}
                    >
                      DOWNLOAD TABLE
                    </Button>
                  </Grid>
                </Popover>
              </>
            )}
          </div>
        </Popper>
        // ))}
      )}
    </div>
  );
};
