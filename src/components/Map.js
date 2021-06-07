import {
  useState,
  useMemo,
  useEffect,
  useContext,
  useRef,
  Fragment,
} from "react";
import { MapContext } from "../state/MapState";
import Carto from "@carto/carto.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link, Grid, Button, Box, Typography } from "@material-ui/core";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import "../App.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import theme from "../theme/theme";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import { CSVLink } from "react-csv";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormHelperText from "@material-ui/core/FormHelperText";
import { legendStyles } from "./subcomponents/LegendStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import TabsWrappedLabel from "../components/TabBox/TabBox";

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: theme.palette.background.default,
  },
  table: {
    width: "20px",
    height: "20px",
    opacity: 1,
    position: "absolute",
    bottom: "12px",
    left: "50px",
  },
  button: {
    margin: theme.spacing(1),
  },
  element: {
    textTransform: "none",
    color: theme.palette.text.secondary,
  },
  dot: {
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  download: {
    textDecoration: "none",
    color: "#ffffff",
  },
  checkboxLabel: {
    fontSize: 13,
  },
}));

export const Map = () => {
  const [
    { currentMapID, maps, activeLayer, activeLegend, userData, queryDist },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState();
  // const [layerID, setlayerID] = useState();
  const [currentMapState, setCurrentMapState] = useState();
  const [leaflet, setLeaflet] = useState();
  const [cartoClient, setCartoClient] = useState();
  const [popup, setPopup] = useState();
  const [popupData, setPopupData] = useState();
  const [downloadData, setDownloadData] = useState();
  const [buckets, setBuckets] = useState([]);
  const openPopper = Boolean(popup);
  const idPopper = openPopper ? "transitions-popper" : undefined;
  const [popoverOpen, setPopoverOpen] = useState(false);
  const idPopover = popoverOpen ? "simple-popover" : undefined;
  const [popoverColumns, setPopoverColumns] = useState([]);
  const anchorRef = useRef(null);
  const classes = useStyles();
  const clickRef = useRef(null);
  const clickRefPop = useRef(null);
  const mapRef = useRef(null);
  // const [value, setValue] = useState(100);
  // const [commCalcSource, setCommCalcSource] = useState(null);
  // const [widgetLoad, setWidgetLoad] = useState();

  const cat = ["accessibility", "wash", "health", "socioeconomic"];
  var dat_popup = {};
  const highlightLayer = useRef();
  // const [highlightLayer, setHighlightLayer] = useState();
  const legendStylesObj = legendStyles;
  // const [legendIndex, setLegendIndex] = useState(0);

  //click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickRef.current && !clickRef.current.contains(event.target)) {
        if (clickRef.current && !clickRef.current.contains(event.target)) {
          console.log("clicked outside");
          if (
            clickRefPop.current &&
            !clickRefPop.current.contains(event.target)
          ) {
            setPopoverOpen(null);
            console.log("clicked outside");
          } else if (
            clickRefPop.current &&
            clickRefPop.current.contains(event.target)
          ) {
          } else {
            setPopup(null);
          }
        }
        console.log("clicked outside");
        if (highlightLayer.current && cartoClient) {
          mapRef.current.removeLayer(highlightLayer.current);
        }
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [cartoClient]);

  //set mapID
  useMemo(() => {
    console.log("currentMapID", currentMapID);
    if (currentMapID !== mapID) {
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

  //clean up
  useMemo(() => {
    console.log("mapClean");
    if (mapID && dispatch) {
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
  }, [dispatch, mapID]);

  // load leaflet
  useEffect(() => {
    console.log("load");

    if (leaflet !== undefined) {
      console.log("remove map renderer");
      leaflet.remove();
    }

    if (maps && mapID) {
      const client = new Carto.Client({
        apiKey: process.env.REACT_APP_CARTO_DEV_API_KEY,
        username: process.env.REACT_APP_CARTO_USERNAME,
        serverUrl: process.env.REACT_APP_CARTO_SERVERURL,
      });
      mapRef.current = L.map("map", { minZoom: 6, maxZoom: 18 }).setView(
        [maps[mapID].lat, maps[mapID].long],
        maps[mapID].zoom
      );
      mapRef.current.createPane("labels");
      mapRef.current.getPane("labels").style.zIndex = 650;
      mapRef.current.getPane("labels").style.pointerEvents = "none";

      L.tileLayer(
        "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1Ijoia2FyYXN0dWFydCIsImEiOiJja2N6aGYyZWwwMTV4MnJwMGFoM3lmN2lzIn0.xr5B6ZPw0FV0iPBqokdTFQ"
      ).addTo(mapRef.current);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
        {
          attribution: "©OpenStreetMap, ©CartoDB",
          pane: "labels",
        }
      ).addTo(mapRef.current);

      setLeaflet(mapRef.current);
      setCartoClient(client);
      client.getLeafletLayer().addTo(mapRef.current);
      dispatch({
        type: "map.addCartoClient",
        carto_client: client,
      });
      dispatch({
        type: "map.saveMap",
        leafletMap: mapRef.current,
      });
    }
  }, [mapID]);

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
  }, [maps, mapID]);

  /* 
  When map state is updated run this effect.
  Instantiate carto layers using map state and store 
  the carto layer objects in global state (mapstate.js) so that we 
  can later run operations on the layers - such as 
  filtering, toggling visibility 
  */
  useEffect(() => {
    console.log("Selected Map Changed", currentMapState);

    if (cartoClient && mapID) {
      // maps[mapID].layers.forEach((layer, i) => {
      //   if (layer.carto_layer && i > 1 && activeLayer) {
      //     var _source = new Carto.source.SQL(
      //       `SELECT * FROM ${layer.carto_tableName}`
      //     );
      //     const _style = new Carto.style.CartoCSS(layer.carto_style);
      //     const _layer = new Carto.layer.Layer(_source, _style, {});
      //     dispatch({
      //       type: "layer.addCartoLayer",
      //       mapID: mapID,
      //       layerID: i,
      //       cartoLayer: _layer,
      //       cartoSource: _source,
      //     });
      //     // layerstoremove.push(layer.carto_layer);
      //   }
      // });
      dispatch({
        type: "layer.removeCartoLayers",
      });
      console.log("Creating Carto Layers");
      const _mapID = mapID;

      var objlist = [];
      maps[mapID].layers.forEach((layer, index) => {
        // var _source = new Carto.source.SQL(
        //   `SELECT * FROM ${layer.carto_tableName}`
        // );
        var _source = null;
        if (queryDist && index > 1) {
          let queryedit =
            `SELECT * FROM ${layer.carto_tableName} WHERE` + queryDist;
          // let queryedit2 = queryedit.replace(/\s/g, " ");
          _source = new Carto.source.SQL(queryedit);
          // _source = maps[mapID].layers[layer].carto_source;
        } else {
          _source = new Carto.source.SQL(
            `SELECT * FROM ${layer.carto_tableName}`
          );
        }

        _source.on("queryChanged", function (e) {
          dispatch({
            type: "layer.query",
            query: e,
          });
        });
        const _style = new Carto.style.CartoCSS(layer.carto_style);
        const _filters = [];
        const _columns = [];
        var obj1 = [];

        layer.filters.forEach((filter, filter_c) => {
          obj1 = [
            layer.name,
            filter.name,
            filter.column_name,
            filter.subcategory,
            filter.unit,
          ];
          objlist.push(obj1);
          switch (filter.type) {
            case "range":
              const _filter = new Carto.filter.Range(
                filter.column_name,
                {
                  gte: filter.value[0],
                  lte: filter.value[1],
                },
                { includeNull: true }
              );
              _filters.push(_filter);
              _columns.push(filter.column_name);
              break;
            case "range_non_linear":
              const _filter_non = new Carto.filter.Range(
                filter.column_name,
                {
                  gte: filter.scaledValue[0],
                  lte: filter.scaledValue[1],
                },
                { includeNull: true }
              );
              _filters.push(_filter_non);
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
              const _filter_c = new Carto.filter.Category(
                filter.column_name,
                {
                  in: col_vals_tofilter,
                },
                { includeNull: true }
              );
              _filters.push(_filter_c);
              _columns.push(filter.column_name);
              break;
            case "none":
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

        // setup feature clicks on relevant layers
        if (_columns.length > 1) {
          _layer.on("featureClicked", (featureEvent) => {
            console.log("clicked a feature", featureEvent);
            var result = null;
            var input = featureEvent.data.cartodb_id;
            fetch(
              `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM ${layer.carto_tableName} where cartodb_id = ${input}`
            )
              .then((resp) => resp.json())
              .then((response) => {
                var myStyle = {
                  color: "#FFFFFF",
                  fillColor: "#FFFFFF",
                  fillOpacity: 0.3,
                  weight: 1,
                };
                result = L.geoJson(
                  JSON.parse(response.rows[0].the_geom),
                  myStyle
                );
                highlightLayer.current = result;
                result.addTo(mapRef.current);
              });
            setPopup([layer.name, featureEvent]);
            setPopoverOpen(false);
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
        // setlayerID(index);

        _layer.on("metadataChanged", function (event) {
          console.log(event);
          if (
            layer.name === maps[mapID].layers[activeLayer].name &&
            (layer.carto_style === legendStylesObj[activeLegend].style_pixel ||
              layer.carto_style === legendStylesObj[activeLegend].style_bounds)
          ) {
            var obj = {};
            // get buckets
            if (event.styles[0]._buckets === undefined) {
              obj["variable"] = layer.name;
              obj["legend"] = event.styles[0]._categories;
              for (var i in obj.legend) {
                if (obj.legend[i].name === 1) {
                  obj.legend[i].name = "Rural Remote";
                } else if (obj.legend[i].name === 2) {
                  obj.legend[i].name = "Rural On-road";
                } else if (obj.legend[i].name === 3) {
                  obj.legend[i].name = "Rural Mixed";
                } else if (obj.legend[i].name === 4) {
                  obj.legend[i].name = "Urban";
                }
              }
            } else {
              obj["variable"] = layer.name;
              obj["legend"] = event.styles[0]._buckets;
            }
            setBuckets(obj);
            // setBuckets((st) => [...st, obj]);
          }
          // }
        });

        //add the carto layer to global state
        dispatch({
          type: "layer.addCartoLayer",
          mapID: _mapID,
          layerID: index,
          cartoLayer: _layer,
          cartoSource: _source,
        });
      });
      setPopoverColumns(objlist);
      console.log(popoverColumns);
    }
  }, [mapID, activeLegend, activeLayer, cartoClient]);

  // popup data
  useMemo(() => {
    console.log("updated popup", popup);
    if (popup) {
      var dat = [];
      currentMapState.layers[activeLayer].filters.forEach(function (element) {
        dat.push([
          element.column_name,
          element.name,
          element.subcategory,
          element.unit,
        ]);
      });
      dat.sort();
      var dat_loc = [];
      if (popup[1].data.classes !== undefined) {
        if (popup[1].data.classes === 1) {
          popup[1].data.classes = "Rural Remote";
        } else if (popup[1].data.classes === 2) {
          popup[1].data.classes = "Rural On-road";
        } else if (popup[1].data.classes === 3) {
          popup[1].data.classes = "Rural Mixed";
        } else if (popup[1].data.classes === 4) {
          popup[1].data.classes = "Urban";
        }
      }
      Object.entries(popup[1].data)
        .slice(1)
        .map((keyName) => {
          return dat_loc.push([keyName[0], keyName[1]]);
        });
      dat_loc.sort();

      for (let j = 0; j < dat.length; j++) {
        for (let i = 0; i < dat_loc.length; i++) {
          if (dat[j][0] === dat_loc[i][0]) {
            dat_popup[dat[j][0]] = {
              Name: dat[j][1],
              Category: dat[j][2],
              Unit: dat[j][3],
              Value: dat_loc[i][1],
            };
          }
        }
      }
      var obj = {};
      obj["data"] = dat_popup;
      obj["latLng"] = popup[1].latLng;
      obj["position"] = popup[1].position;
      setPopupData(obj);
      var myData = Object.keys(dat_popup).map((key) => {
        return dat_popup[key];
      });
      setDownloadData(myData);
    }
  }, [popup]);

  // add layer
  const layerRef = useRef(null);
  const [myRadius, setMyRadius] = useState(5);
  const [myWeight, setMyWeight] = useState(2);
  useEffect(() => {
    if (mapRef.current) {
      if (layerRef.current) {
        mapRef.current.removeLayer(layerRef.current);
      }
      layerRef.current = L.layerGroup().addTo(mapRef.current);
      mapRef.current.on("zoomend", function () {
        var currentZoom = mapRef.current.getZoom();
        if (currentZoom > 6) {
          setMyRadius(2); //or whatever ratio you prefer
        }
        setMyRadius(currentZoom * (1 / 2.5)); //or whatever ratio you prefer
        // setMyWeight(currentZoom * (1 / 4)); //or whatever ratio you prefer
        // layerRef.current.setStyle({ radius: myRadius, weight: myWeight });
      });
    }
  }, [userData]);

  // update markers

  useEffect(() => {
    if (userData) {
      // var myRadius = 5;
      // var myWeight = 2;

      var markerOptions = {
        radius: myRadius,
        fillColor: "#ffffff",
        color: "#ffffff",
        weight: myWeight,
        opacity: 1,
        fillOpacity: 0.3,
      };
      // if (layerRef.current) {
      //   layerRef.current.clearLayers();
      // }
      userData.forEach((marker, key) => {
        var popupContent = "";
        for (var key in marker) {
          popupContent = popupContent + key + ":  " + marker[key] + "</br>";
        }
        L.circleMarker([marker.Latitude, marker.Longitude], markerOptions)
          .addTo(layerRef.current)
          .bindPopup(popupContent);
      });
    }
  }, [myRadius, myWeight, userData]);

  const handleChange = (event) => {
    let styleNew = null;
    if (
      maps[mapID].layers[activeLayer].name === "5x5km area" ||
      maps[mapID].layers[activeLayer].name === "1x1km area"
    ) {
      styleNew = legendStyles[event.target.value].style_pixel;
    } else {
      styleNew = legendStyles[event.target.value].style_bounds;
    }

    dispatch({
      type: "legend.select",
      mapID: mapID,
      layerID: activeLayer,
      legendIndex: event.target.value,
      styleNew: styleNew,
    });
  };
  // const handleOpacityChange = (e, newval) => {
  //   setValue(newval);
  //   let styleNew = null;
  //   if (
  //     maps[mapID].layers[activeLayer].name === "5x5km area" ||
  //     maps[mapID].layers[activeLayer].name === "1x1km area"
  //   ) {
  //     styleNew = legendStyles[activeLegend].style_pixel.concat(
  //       ` #layer {polygon-opacity: ${newval / 100};}`
  //     );
  //   } else {
  //     styleNew = legendStyles[activeLegend].style_bounds.concat(
  //       ` #layer {polygon-opacity: ${newval / 100};}`
  //     );
  //   }
  //   // let styleNew2 = maps[mapID].layers[activeLayer].carto_style.concat(
  //   //   `#layer {polygon-opacity: ${newval / 100};}`
  //   // );

  //   // let styleNew = new Carto.layer.Layer(
  //   //   maps[mapID].layers[activeLayer].carto_source,
  //   //   styleNew2
  //   // );
  //   // cartoClient.addLayer(styleNew);

  //   dispatch({
  //     type: "layer.opacity",
  //     styleNew: styleNew,
  //     mapID: mapID,
  //     layerID: activeLayer,
  //   });
  // };

  const [scroll] = useState("paper");
  const [hideLayer, setHideLayer] = useState(false);

  return (
    <div
      style={{ height: "100%", position: "relative" }}
      className={classes.content}
    >
      <div
        id="map"
        style={{ height: "100%" }}
        className="tour-map"
        alt={"map of " + mapID + " which can be manipulated by the site user"}
      ></div>

      {/* Legend */}
      {mapID && activeLayer && (
        <div
          style={{
            padding: theme.spacing(1),
            position: "absolute",
            bottom: "10px",
            right: "0px",
            top: "unset",
            left: "unset",
            height: "auto",
            width: "280px",
            zIndex: "1000",
            backgroundColor: "transparent",
          }}
        >
          <TabsWrappedLabel />
          <Paper
            style={{ height: "10px", backgroundColor: "transparent" }}
          ></Paper>
          <Paper
            square
            pb={2}
            style={{
              padding: theme.spacing(0.5),
              backgroundColor: theme.palette.background.default,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={hideLayer}
                  onChange={() => {
                    setHideLayer(!hideLayer);
                    if (!hideLayer === true) {
                      maps[mapID].layers[activeLayer].carto_layer.hide();
                    } else {
                      maps[mapID].layers[activeLayer].carto_layer.show();
                    }
                  }}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  color="primary"
                />
              }
              label={
                <Typography key="filterListItemLabel" variant="body2">
                  Remove layer to view underlying satellite imagery
                </Typography>
              }
              size="small"
            />
          </Paper>
          {/* <Paper
            square
            pb={2}
            style={{
              padding: theme.spacing(0.5),
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Grid container spacing={0}>
              <Box>
                <Typography variant="subtitle2">Change opacity</Typography>
              </Box>
              <Box mx="auto" width="210px" height="45px">
                <Slider
                  value={value}
                  aria-labelledby={"Opacity range slider"}
                  marks={[
                    { value: 0, label: "0%" },
                    { value: 100, label: "100%" },
                  ]}
                  onChange={handleOpacityChange}
                />
              </Box>
            </Grid>
          </Paper> */}
          <Paper
            style={{ height: "10px", backgroundColor: "transparent" }}
          ></Paper>
          <Paper
            square
            key={"legendContainer"}
            style={{
              padding: theme.spacing(1),
              // position: "absolute",
              // bottom: "16px",
              // right: "0px",
              // top: "unset",
              // left: "unset",
              // height: "auto",
              // width: "280px",
              // zIndex: "1000",
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Fragment key={"legendContent" + activeLayer}>
              <Box variant="subtitle2" fontSize={12} fontWeight="light">
                Selected resolution:{" "}
                {maps[mapID].layers[activeLayer].name + "s"}
              </Box>
              <FormControl className={classes.formControl}>
                <Box
                  variant="subtitle2"
                  fontStyle="italic"
                  fontWeight="fontWeightBold"
                >
                  Select the indicator to visualize:
                </Box>
                <NativeSelect
                  value={activeLegend}
                  onChange={handleChange}
                  inputProps={{
                    name: "age",
                    id: "age-native-label-placeholder",
                  }}
                  className="tour-legendselect"
                  style={{ backgroundColor: theme.palette.background.selected }}
                >
                  {maps[mapID].layers[activeLayer].filters.map((filter, i) => {
                    if (filter.type !== "none") {
                      return (
                        <option key={"filter" + i} value={i}>
                          {filter.name}
                        </option>
                      );
                    } else {
                      return null;
                    }
                  })}
                </NativeSelect>
                <FormHelperText> </FormHelperText>
              </FormControl>
              {maps[mapID].layers[activeLayer].name === buckets.variable && (
                <Fragment key={"legendContent" + buckets.variable}>
                  {buckets.legend.map((legend, j) => {
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
                            border: legend.border,
                          }}
                          key={legend.value.toString()}
                        ></div>
                        {legend.min === null
                          ? "No data remaining"
                          : legend.name === undefined
                          ? legend.min.toString() +
                            " - " +
                            legend.max.toString() +
                            " " +
                            maps[mapID].layers[activeLayer].filters[
                              activeLegend
                            ].unit
                          : legend.name}
                      </Grid>
                    );
                  })}
                </Fragment>
              )}
            </Fragment>
          </Paper>
        </div>
      )}
      {/* Popup */}
      {popupData && (
        <Popper
          aria-labelledby="Small popup on data at the clicked location"
          aria-describedby="Content of the popup changes depending on the variable selected in the legend, and also contians a link to a larger dialog box of all data a the clicked location."
          anchorEl={anchorRef.current}
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
          }}
          style={{
            position: "absolute",
            left: popupData.position.x,
            top: popupData.position.y,
            zIndex: "1300",
            // backgroundColor: "#fff",
            width: "200px",
          }}
        >
          <div className={classes.paper}>
            <Grid container justify="flex-end" pt={2} key={"popperHeader"}>
              <CloseIcon
                key={"popperClose"}
                fontSize="small"
                color="disabled"
                onClick={(e) => {
                  setPopup(null);
                  mapRef.current.removeLayer(highlightLayer.current);
                }}
              />
            </Grid>

            {/* <Fragment key={"popper"}> */}
            {activeLegend !== "0" ? (
              <Box>
                <Box fontWeight="fontWeightBold">
                  {
                    popupData.data[
                      maps[mapID].layers[activeLayer].filters[activeLegend]
                        .column_name
                    ].Name
                  }
                  :{" "}
                </Box>
                <Box>
                  {
                    popupData.data[
                      maps[mapID].layers[activeLayer].filters[activeLegend]
                        .column_name
                    ].Value
                  }
                  {
                    popupData.data[
                      maps[mapID].layers[activeLayer].filters[activeLegend]
                        .column_name
                    ].Unit
                  }
                </Box>
              </Box>
            ) : (
              <Box>
                <Box fontWeight="fontWeightBold">
                  {popupData.data.classes.Name}:{" "}
                </Box>
                {popupData.data.classes.Value}
                <Box fontWeight="fontWeightLight" fontSize={11}>
                  {popupData.data.rr.Name}: {popupData.data.rr.Value}
                  {popupData.data.rr.Unit}
                </Box>
                <Box fontWeight="fontWeightLight" fontSize={11}>
                  {popupData.data["rrd"].Name}: {popupData.data.rrd.Value}
                  {popupData.data.rrd.Unit}
                </Box>
                <Box fontWeight="fontWeightLight" fontSize={11}>
                  {popupData.data["rm"].Name}: {popupData.data.rm.Value}
                  {popupData.data.rm.Unit}
                </Box>
                <Box fontWeight="fontWeightLight" fontSize={11}>
                  {popupData.data.u.Name}: {popupData.data.u.Value}
                  {popupData.data.u.Unit}
                </Box>
              </Box>
            )}
            <Link
              key={"seeMore"}
              component="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPopoverOpen(true);
              }}
            >
              SEE MORE
            </Link>
            {/* Popover */}
            <Dialog
              id={idPopover}
              ref={clickRefPop}
              key={idPopover}
              aria-labelledby="Popup diaglog box containing data at clicked location"
              aria-describedby="Popup diaglog box containing data values for all variables the at clicked location, aggregated at the level of resolution of the clicked layer."
              className={classes.modal}
              open={popoverOpen}
              onClose={(e) => {
                setPopoverOpen(false);
              }}
              scroll={"paper"}
            >
              {/* <Fade in={popoverOpen}>
                  <div className={classes.popover}> */}
              <Grid container justify="flex-end" key={"popoverHeader"}>
                <CloseIcon
                  key={"popoverClose"}
                  fontSize="small"
                  color="disabled"
                  onClick={(e) => {
                    setPopoverOpen(false);
                  }}
                />
              </Grid>
              <DialogTitle>
                {maps[mapID].layers[activeLayer].name}
                <Box fontStyle="italic" fontSize={13}>
                  Location: {popupData.latLng.lat.toFixed(5).toString()},{" "}
                  {popupData.latLng.lng.toFixed(5).toString()}
                  <br />
                  {popupData.data.name_1.Name}: {popupData.data.name_1.Value}{" "}
                  <br />
                  {popupData.data.name_2.Name}: {popupData.data.name_2.Value}
                  {popupData.data.name_3 !== undefined && (
                    <span>
                      <br />
                      {popupData.data.name_3.Name}:{" "}
                      {popupData.data.name_3.Value}
                    </span>
                  )}
                </Box>
              </DialogTitle>
              <DialogContent dividers={scroll === "paper"}>
                <Table
                  key={"popoverTable"}
                  aria-label="Data table of values from each variable at the clicked location."
                >
                  {cat.map((category, i) => {
                    return (
                      <Fragment key={"popoverTableRow" + category}>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: "70%" }}>
                              <Box fontWeight="fontWeightBold" pt={1}>
                                {category.toUpperCase()}
                              </Box>
                            </TableCell>
                            <TableCell
                              style={{ width: "30%" }}
                              align="right"
                            ></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(popupData.data).map(
                            (anObjectMapped, j) => {
                              if (anObjectMapped[1].Category === category) {
                                return (
                                  <TableRow key={"popoverTableRow" + j}>
                                    <TableCell style={{ width: "75%" }}>
                                      {anObjectMapped[1].Name}
                                    </TableCell>
                                    <TableCell
                                      style={{ width: "25%" }}
                                      align="right"
                                    >
                                      {anObjectMapped[1].Value}{" "}
                                      {anObjectMapped[1].Unit}
                                    </TableCell>
                                  </TableRow>
                                );
                              } else {
                                return null;
                              }
                            }
                          )}
                        </TableBody>
                      </Fragment>
                    );
                  })}
                </Table>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                >
                  {maps[mapID].layers[activeLayer].name === "5x5km area" ? (
                    <CSVLink
                      className={classes.download}
                      data={downloadData}
                      filename={
                        "SPT_" +
                        popupData.latLng.lat.toFixed(5).toString() +
                        "_" +
                        popupData.latLng.lng.toFixed(5).toString() +
                        ".csv"
                      }
                    >
                      DOWNLOAD TABLE
                    </CSVLink>
                  ) : popupData.data.name_3 !== undefined ? (
                    <CSVLink
                      className={classes.download}
                      data={downloadData}
                      filename={"SPT_" + popupData.data.name_3.Value + ".csv"}
                    >
                      DOWNLOAD TABLE
                    </CSVLink>
                  ) : (
                    <CSVLink
                      className={classes.download}
                      data={downloadData}
                      filename={"SPT_" + popupData.data.name_2.Value + ".csv"}
                    >
                      DOWNLOAD TABLE
                    </CSVLink>
                  )}
                </Button>
              </DialogActions>
              {/* </div>
                </Fade> */}
            </Dialog>
            {/* </Fragment> */}
          </div>
        </Popper>
      )}
    </div>
  );
};
