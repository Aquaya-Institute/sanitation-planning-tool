import { useState, useEffect, useContext, useRef } from "react";
import { MapContext } from "../state/MapState";
import Carto from "@carto/carto.js";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Box,
  Typography,
  Link,
  Grid,
  Divider,
  Button,
} from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import Popper from "@material-ui/core/Popper";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import $ from "jquery";
import "../App.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { positions } from "@material-ui/system";
import theme from "../theme/theme";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
// import { AggregationTypes } from '@carto/react/widgets';
// import { FormulaWidget } from '@carto/react/widgets';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    ...theme.typography.overline,
    textTransform: "none",
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.25, 0),
  },
  dot: {
    flex: "0 0 auto",
    width: 8,
    height: 8,
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
  const [currentMapState, setCurrentMapState] = useState();
  const [leaflet, setLeaflet] = useState();
  const [cartoClient, setCartoClient] = useState();
  const [popup, setPopup] = useState();
  const [popupData, setPopupData] = useState([]);
  const [popover, setPopover] = useState(null);
  const [buckets, setBuckets] = useState(null);
  const openPopper = Boolean(popup);
  const openPopover = Boolean(popover);
  const idPopper = openPopper ? "transitions-popper" : undefined;
  const idPopover = openPopover ? "simple-popover" : undefined;
  const arrowRef = useRef();
  const classes = useStyles();
  const clickRef = useRef(null);
  const legend = $("#legend-content");
  const legend_title = $("#legend-title");
  const mapRef = useRef();
  const [latLng, setLatLng] = useState([31, 55]);
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
              // const _filter_c = new Carto.filter.Category(filter_c.column_name, {
              //   in: filter_c.column_values
              // });
              // _filters.push(_filter_c);
              // _columns.push(filter_c.column_name);
              break;
            default:
              break;
          }
        });

        //add filters to the source, if any
        if (_filters.length > 0) {
          _source.addFilter(new Carto.filter.AND(_filters));
        }

        //show hide layers based on initial state in config
        const _layer = new Carto.layer.Layer(_source, _style, {
          featureClickColumns: _columns,
        });

        //setup feature clicks on relevant layers
        if (_columns.length > 0) {
          _layer.on("featureClicked", (featureEvent) => {
            console.log("clicked a feature", featureEvent);
            setPopup(featureEvent);
            console.log("popup", popup);
          });
        }

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
        if (layer.visible) {
          _layer.on("metadataChanged", function (event) {
            legend.empty();
            legend_title.empty();
            console.log(event);

            // get buckets
            var buckets_list = [];
            buckets_list.push(event.styles[0]._buckets);
            setBuckets(buckets_list);
            console.log("buckets", buckets);
          });
        }

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
    if (popup) {
      var dat = [];
      currentMapState.layers[layerID].filters.forEach(function (element) {
        dat.push([element.column_name, element.name, element.subcategory]);
      });
      dat.sort();
      var dat_loc = [];
      Object.entries(popup.data)
        .slice(1)
        .map((keyName, i) => {
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
      setPopupData(dat_popup);
      console.log("updated dat_popup", dat_popup);
      console.log("updated popupData", popupData);
    }
  }, [popup]);

  return (
    <div>
      <div id="map" style={{ height: "91vh" }} className={classes.content}>
        {buckets && (
          <Paper
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
            <Typography>
              <strong>{currentMapState.layers[layerID].name}</strong>
            </Typography>
            {buckets.map((obj, i) => {
              return (
                // <Grid container className={classes.root} spacing={2}><Grid item xs={12}><Grid container justify='center' spacing={0}>
                //   <Grid item><Paper className={classes.grid} style={{backgroundColor: obj[i].value}} elevation={0}></Paper></Grid>
                // <Grid container justify='center' spacing={0}>
                //   <Grid item><Paper className={classes.gridlabel} elevation={0}>{obj[i].min}</Paper></Grid>
                //   <Grid item><Paper className={classes.gridlabel} elevation={0}>{obj[i].max}</Paper></Grid>
                // </Grid></Grid></Grid></Grid>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  className={classes.element}
                  key={i}
                >
                  <div
                    className={classes.dot}
                    style={{ backgroundColor: obj[i].value }}
                  ></div>
                  {obj[i].min}-{obj[i].max}
                </Grid>
              );
            })}
          </Paper>
        )}
        {popup &&
          popup.data &&
          (currentMapState.layers[layerID].name === "Communities" ? (
            <Popper
              ref={clickRef}
              id={idPopper}
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
                left: popup.position.x,
                top: popup.position.y,
                zIndex: "1300",
                backgroundColor: "#fff",
                width: "200px",
              }}
              elevation={3}
            >
              <div className={classes.paper} elevation={3}>
                <span>
                  <strong>Population Estimate:</strong> {popup.data.pop_est}
                </span>
                <br></br>
                <span>
                  <strong>Community Classification:</strong> Rural Remote
                </span>
                <br></br>
                <Link
                  component="button"
                  onClick={(e) => {
                    // e.preventDefault();
                    setPopover(e.currentTarget);
                    // setPopper(null);
                  }}
                >
                  SEE MORE
                </Link>
              </div>

              <Popover
                ref={clickRef}
                id={idPopover}
                open={openPopover}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 400, left: 800 }}
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
                <Grid container justify="flex-end" pt={2}>
                  <CloseIcon
                    fontSize="small"
                    color="disabled"
                    onClick={(e) => {
                      // e.preventDefault();
                      setPopover(null);
                      // openPopper(null)
                    }}
                  />
                </Grid>
                {cat.map((category) => {
                  return (
                    <Table className={classes.popover}>
                      <TableHead>
                        <br></br>
                        <strong>{category.toUpperCase()}</strong>
                      </TableHead>
                      <TableBody>
                        {popupData.map((anObjectMapped) => {
                          if (anObjectMapped.Category === category) {
                            return (
                              <TableRow>
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
            </Popper>
          ) : (
            <Popper
              ref={clickRef}
              id={idPopper}
              open={openPopper}
              // placement="left-end"
              disablePortal={true}
              // anchorEl={popup}
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
                left: popup.position.x,
                top: popup.position.y,
                zIndex: "1300",
                backgroundColor: "#fff",
                width: "200px",
              }}
            >
              <div className={classes.paper}>
                <span>
                  <strong>{currentMapState.layers[layerID].name}:</strong>{" "}
                  {popup.data.val}
                </span>
                <br></br>
              </div>
            </Popper>
          ))}
        )}
      </div>
    </div>
  );
};
