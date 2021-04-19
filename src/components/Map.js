import {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
  Fragment,
} from "react";
import { MapContext } from "../state/MapState";
import Carto, { isNull } from "@carto/carto.js";
import L, { map } from "leaflet";
import mapboxgl from "mapbox-gl";
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
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { CSVLink } from "react-csv";
import Tour from "./subcomponents/Tour";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

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
    // width: 400,
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 2, 1),
    backgroundColor: theme.palette.background.paper,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  download: {
    textDecoration: "none",
    color: "white",
  },
  checkboxLabel: {
    fontSize: 13,
  },
  popper: {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${theme.palette.common.white} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 1em 1em 0",
        borderColor: `transparent ${theme.palette.common.white} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 0 1em 1em",
        borderColor: `transparent transparent transparent ${theme.palette.common.white}`,
      },
    },
  },
  arrow: {
    position: "absolute",
    fontSize: 5,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid",
    },
  },
}));

function transformArray(array) {
  var obj, i, layer, variable, value, cat, unit;
  var returnedTarget = [];
  for (i = 0; i < array.length; i++) {
    obj = {};
    layer = array[i][0];
    variable = array[i][1];
    value = array[i][2];
    cat = array[i][3];
    unit = array[i][4];
    obj["layer"] = layer;
    obj["name"] = variable;
    obj["value"] = value;
    obj["category"] = cat;
    obj["unit"] = unit;
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
  const [popupData, setPopupData] = useState();
  const [buckets, setBuckets] = useState([]);
  const openPopper = Boolean(popup);
  const idPopper = openPopper ? "transitions-popper" : undefined;
  const [popoverOpen, setPopoverOpen] = useState(false);
  const idPopover = popoverOpen ? "simple-popover" : undefined;
  const [popoverColumns, setPopoverColumns] = useState([]);
  const anchorRef = useRef(null);
  const [arrowRef, setArrowRef] = useState(null);
  const [arrow, setArrow] = useState(true);
  const classes = useStyles();
  const clickRef = useRef(null);
  const [commCalcSource, setCommCalcSource] = useState(null);
  const [districtsSource, setDistrictsSource] = useState(null);
  const [districtsStyle, setDistrictsStyle] = useState(null);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [widgetLoad, setWidgetLoad] = useState();
  const [allDistricts, setAllDistricts] = useState([]);

  const cat = ["accessibility", "wash", "health", "socioeconomic"];
  var dat_popup = [];

  const [distIndex, setDistIndex] = useState();
  const [regionIndex, setRegionIndex] = useState();
  const [classIndex, setClassIndex] = useState();
  const [popIndex, setPopIndex] = useState();
  const [nativeMap, setNativeMap] = useState();
  const [scaleValue, setScaleValue] = useState("1");

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
    if (mapID) {
      const map = L.map("map").setView(maps[mapID].view, maps[mapID].zoom);

      L.tileLayer(
        "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1Ijoia2FyYXN0dWFydCIsImEiOiJja2N6aGYyZWwwMTV4MnJwMGFoM3lmN2lzIn0.xr5B6ZPw0FV0iPBqokdTFQ",
        // "https://api.mapbox.com/styles/v1/karastuart/ckk5tl36t02e017npyq4xsp0s.html?fresh=true&title=copy&access_token=pk.eyJ1Ijoia2FyYXN0dWFydCIsImEiOiJja2N6aGYyZWwwMTV4MnJwMGFoM3lmN2lzIn0.xr5B6ZPw0FV0iPBqokdTFQ",
        {
          // maxZoom: 22,
          // minZoom: 7,
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
      setNativeMap(map);
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
      var buckets_list = [];
      var objlist = [];
      currentMapState.layers.forEach((layer, index) => {
        const _source = new Carto.source.SQL(
          `SELECT * FROM ${layer.carto_tableName}`
        );

        const _style = new Carto.style.CartoCSS(layer.carto_style);
        const _filters = [];
        const _columns = [];
        if (
          layer.name === "Settlement Areas and Estimated Population (pop.)" ||
          layer.name === "Communities"
        ) {
          setCommCalcSource(_source);
        }
        if (layer.name === "Districts") {
          setDistrictsSource(_source);
          setDistrictsStyle(_style);
        }
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
              const _filter = new Carto.filter.Range(filter.column_name, {
                gte: filter.value[0],
                lte: filter.value[1],
              });
              _filters.push(_filter);
              _columns.push(filter.column_name);
              break;
            case "range_non_linear":
              const _filter_non = new Carto.filter.Range(filter.column_name, {
                gte: filter.scaledValue[0],
                lte: filter.scaledValue[1],
              });
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
              const _filter_c = new Carto.filter.Category(filter.column_name, {
                in: col_vals_tofilter,
              });
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

        //setup feature clicks on relevant layers
        if (_columns.length > 0) {
          _layer.on("featureClicked", (featureEvent) => {
            console.log("clicked a feature", featureEvent);
            setPopup([layer.name, featureEvent]);
            setPopoverOpen(false);
            console.log("popup", popup);
            // const onButtonClick = () => {
            // `current` points to the mounted text input element
            anchorRef.current.focus();
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
            if (event.styles.length === 0) {
              obj["variable"] = layer.name;
              if (layer.name === "Districts") {
                obj["legend"] = [
                  {
                    name: "District boundaries",
                    value: "transparent",
                    border: "2px solid #000",
                  },
                ];
              } else {
                obj["legend"] = [
                  {
                    name: "User Uploaded Points",
                    value: "#a54acc",
                    border: "2px solid #7a228c",
                  },
                ];
              }
            } else if (event.styles[0]._buckets === undefined) {
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
      setPopoverColumns(objlist);
      console.log(popoverColumns);
    }
  }, [currentMapState, cartoClient, dispatch]);

  useEffect(() => {
    console.log("updated popup", popup);
    if (popup) {
      var dat = [];
      currentMapState.layers[layerID].filters.forEach(function (element) {
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
        }
      }
      Object.entries(popup[1].data)
        .slice(1)
        .map((keyName) => {
          return dat_loc.push([popup[0], keyName[0], keyName[1]]);
        });
      dat_loc.sort();

      for (let j = 0; j < dat_loc.length; j++) {
        for (let i = 0; i < popoverColumns.length; i++) {
          if (
            popoverColumns[i][2] === dat_loc[j][1] &&
            popoverColumns[i][0] === dat_loc[j][0]
          ) {
            dat_popup.push([
              popoverColumns[i][0],
              popoverColumns[i][1],
              dat_loc[j][2],
              popoverColumns[i][3],
              popoverColumns[i][4],
            ]);
            if (dat_loc[j][1] === "district") {
              setDistIndex(j);
            } else if (dat_loc[j][1] === "region") {
              setRegionIndex(j);
            } else if (dat_loc[j][1] === "classes") {
              setClassIndex(j);
            } else if (dat_loc[j][1] === "pop") {
              setPopIndex(j);
            }
            break;
          }
        }
      }
      dat_popup = transformArray(dat_popup);
      var obj = {};
      obj["data"] = dat_popup;
      obj["latLng"] = popup[1].latLng;
      obj["position"] = popup[1].position;
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
  // Community counter
  // useEffect(() => {
  //   if (cartoClient && commCalcSource && nativeMap) {
  //     if(mapID==="GhanaUU"){
  //       const commCalculator = new Carto.dataview.Formula(
  //         commCalcSource,
  //         "community",
  //         {
  //           operation: Carto.operation.COUNT,
  //         }
  //       );
  //       const bboxFilter = new Carto.filter.BoundingBoxLeaflet(nativeMap);
  //       cartoClient.addDataview(commCalculator);
  //       commCalculator.addFilter(bboxFilter);

  //       commCalculator.on("dataChanged", (data) => {
  //         refreshCommCalculator(data.result);
  //       });
  //     }else {
  //       const commCalculator = new Carto.dataview.Formula(
  //         commCalcSource,
  //         "community",
  //         {
  //           operation: Carto.operation.COUNT,
  //         }
  //       );
  //       const bboxFilter = new Carto.filter.BoundingBoxLeaflet(nativeMap);
  //       cartoClient.addDataview(commCalculator);
  //       commCalculator.addFilter(bboxFilter);

  //       commCalculator.on("dataChanged", (data) => {
  //         refreshCommCalculator(data.result);
  //       });
  //     }

  //   }
  // }, [cartoClient, commCalcSource, nativeMap]);

  // function refreshCommCalculator(avgPopulation) {
  //   const widgetDom = document.querySelector("#avgPopulationWidget");
  //   const commCalculatorDom = widgetDom.querySelector(".AveragePopulation");
  //   commCalculatorDom.innerText = Math.floor(avgPopulation);
  // }
  // District dropdown
  // useEffect(() => {
  //   if (cartoClient && districtsSource) {
  //     const countriesDataview = new Carto.dataview.Category(
  //       districtsSource,
  //       "district",
  //       {
  //         limit: 216,
  //       }
  //     );
  //     cartoClient.addDataview(countriesDataview);

  //     countriesDataview.on("dataChanged", (data) => {
  //       console.log("dataChanged");
  //       const countryNames = data.categories
  //         .map((category) => category.name)
  //         .sort();
  //       refreshCountriesWidget(countryNames);
  //       setAllDistricts(countryNames);
  //     });
  //   }
  // }, [cartoClient, districtsSource]);

  // // useLayoutEffect(()=> {
  // //   if(widgetLoad===true) {
  // //     refreshCountriesWidget(allDistricts);
  // //   }
  // // }, [widgetLoad])

  // function refreshCountriesWidget(districtNames) {
  //   const widgetDom = document.querySelector("#countriesWidget");
  //   // if (widgetDom != null) {
  //   const countriesDom = widgetDom.querySelector(".js-countries");

  //   countriesDom.onchange = (event) => {
  //     // setSelectedDistricts((st) => [...st, event.target.value]);
  //     setSelectedDistricts(event.target.value);
  //   };

  //   // Fill in the list of countries
  //   districtNames.forEach((district) => {
  //     const option = document.createElement("option");
  //     option.innerHTML = district;
  //     option.value = district;
  //     countriesDom.appendChild(option);
  //   });
  //   // }
  // }
  // useEffect(() => {
  //   if (selectedDistricts.length > 0) {
  //     highlightCountry(selectedDistricts);
  //     // filterPopulatedPlacesByCountry(selectedDistricts);
  //     // document.getElementById('js-countries').addEventListener("change", function () {
  //     // let input = selectedDistricts;
  //     return fetch(
  //       `https://karastuart.carto.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM gha_multivariable_dist where district Ilike '${selectedDistricts}'`
  //     )
  //       .then((resp) => resp.json())
  //       .then((response) => {
  //         let geojsonLayer = L.geoJSON(response);
  //         nativeMap.fitBounds(geojsonLayer.getBounds());
  //       });
  //     // });
  //   } else if (selectedDistricts === "") {
  //     highlightCountry(selectedDistricts);
  //     // filterPopulatedPlacesByCountry(selectedDistricts);
  //     nativeMap.setView(maps[mapID].view, maps[mapID].zoom);
  //   }
  // }, [selectedDistricts]);

  // function highlightCountry(district) {
  //   // district.forEach((district) => {
  //   let cartoCSS = `
  //     #layer {
  //       polygon-fill: 'transparent';
  //       polygon-opacity: 1;
  //       ::outline {
  //         line-width: 1;
  //         line-color: #000000;
  //         line-opacity: 0.5;
  //       }
  //     } `;
  //   if (district) {
  //     // cartoCSS = `
  //     //   ${cartoCSS}
  //     //   #layer[!district.includes('${district}')] {
  //     //     polygon-fill: #808080;
  //     //     polygon-opacity: .75;
  //     //   }
  //     // `;
  //     cartoCSS = `
  //         ${cartoCSS}
  //         #layer[district!='${district}'] {
  //           polygon-fill: #808080;
  //           polygon-opacity: .75;
  //         }
  //       `;
  //   }
  //   districtsStyle.setContent(cartoCSS);
  //   // });
  // }

  // function filterPopulatedPlacesByCountry(district) {
  //   // district.forEach((district) => {
  //     let query = `
  //     SELECT *
  //       FROM gh_gccomms
  //       WHERE district IN (SELECT district FROM gha_multivariable_dist)
  //     `;
  //     if (district) {
  //     query = `
  //       SELECT *
  //         FROM gh_gccomms
  //         WHERE district='${district}'
  //     `;
  //   // let query = `
  //   //     SELECT *
  //   //       FROM gha_comms_points
  //   //       WHERE district IN (SELECT district FROM gha_multivariable_dist)
  //   //   `;
  //   // if (district) {
  //   //   query = `
  //   //       SELECT *
  //   //         FROM gha_comms_points
  //   //         WHERE district='${district}'
  //   //     `;
  //   }
  //   commCalcSource.setQuery(query);
  //   // });
  // }
  const toggleLayerVisibility = (layerID) => {
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      layerID: layerID,
    });
  };
  return (
    <div
      style={{ height: "100%", position: "relative" }}
      className={classes.content}
    >
      <div id="map" style={{ height: "100%" }} className="tour-map"></div>
      {/* Legend */}
      {buckets && visibleLayers && (
        <Paper
          square
          key={"legendContainer"}
          style={{
            padding: theme.spacing(1),
            position: "absolute",
            bottom: "16px",
            right: "0px",
            top: "unset",
            left: "unset",
            height: "auto",
            width: "200px",
            zIndex: "1000",
            backgroundColor: "#fff",
          }}
        >
          {visibleLayers.map((vis) => {
            return (
              <Fragment key={"legendContent" + vis}>
                {buckets.map((bucket, i) => {
                  if (vis === bucket.variable) {
                    return (
                      <Fragment key={"legendContent" + bucket.variable}>
                        <Box
                          fontSize="fontSize"
                          key={"legendTitle" + bucket.variable}
                        >
                          <strong>{vis}</strong>
                        </Box>

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
                                  border: legend.border,
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
      {/* Popup */}
      {popupData && (
        <Popper
          anchorEl={anchorRef.current}
          ref={clickRef}
          id={idPopper}
          key={idPopper}
          open={openPopper}
          className={classes.popper}
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
              element: arrowRef,
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
          // elevation={3}
        >
          {/* {arrow ? <span className={classes.arrow} ref={setArrowRef} /> : null} */}
          <div className={classes.paper}>
            <Grid container justify="flex-end" pt={2} key={"popperHeader"}>
              <CloseIcon
                key={"popperClose"}
                fontSize="small"
                color="disabled"
                onClick={(e) => {
                  setPopup(null);
                }}
              />
            </Grid>
            {popupData.data.length === 1 && (
              <Box fontSize="fontSize">
                {popupData.data[0].layer === "Community Classification" ? (
                  <Box>
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[0].name}:{" "}
                    </Box>
                    {popupData.data[0].value}
                  </Box>
                ) : (
                  <Box>
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[0].name}:{" "}
                    </Box>
                    {popupData.data[0].value.toFixed(1)}
                  </Box>
                )}
              </Box>
            )}
            {popupData.data.length > 1 && (
              <Fragment key={"popper" + popupData.data[0].layer}>
                {popupData.data[0].layer ===
                "Settlement Areas and Estimated Population (pop.)" ? (
                  <Box>
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[popIndex].name}:{" "}
                    </Box>
                    {popupData.data[popIndex].value.toFixed(1)}
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[classIndex].name}:{" "}
                    </Box>
                    {popupData.data[classIndex].value}
                  </Box>
                ) : popupData.data[0].layer === "Districts" ? (
                  <Box>
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[regionIndex].name}:{" "}
                    </Box>
                    {popupData.data[regionIndex].value}
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[distIndex].name}:{" "}
                    </Box>
                    {popupData.data[distIndex].value}
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[classIndex].name}:{" "}
                    </Box>
                    {popupData.data[classIndex].value}
                  </Box>
                ) : (
                  <Box>
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[0].name}:{" "}
                    </Box>
                    {popupData.data[0].value}
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[3].name}:{" "}
                    </Box>
                    {popupData.data[3].value}
                    <Box fontWeight="fontWeightBold">
                      {popupData.data[4].name}:{" "}
                    </Box>
                    {popupData.data[4].value}
                  </Box>
                )}
                <Link
                  key={"seeMore"}
                  component="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPopoverOpen(true);
                    // setPopup(null);
                  }}
                >
                  SEE MORE
                </Link>
                {/* Popover */}
                <Modal
                  id={idPopover}
                  ref={clickRef}
                  key={idPopover}
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
                      </Grid>

                      <Table
                        className={classes.popover}
                        key={"popoverTable"}
                        elevation={0}
                      >
                        {popupData.data[0].layer ===
                          "Settlement Areas and Estimated Population (pop.)" ||
                        popupData.data[0].layer === "Communities" ? (
                          <TableHead>
                            <TableRow>
                              <TableCell colSpan={2} align="center">
                                <Box fontWeight="fontWeightBold">
                                  SETTLEMENT AREA/COMMUNITY DETAILS
                                </Box>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                colSpan={2}
                                align="center"
                                fontStyle="italic"
                              >
                                <Box fontStyle="italic">
                                  Location: {popupData.latLng.lat.toFixed(5)},{" "}
                                  {popupData.latLng.lng.toFixed(5)}
                                </Box>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                        ) : (
                          <TableHead>
                            <TableRow>
                              <TableCell colSpan={2} align="center">
                                <Box fontWeight="fontWeightBold">
                                  DISTRICT DETAILS
                                </Box>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                colSpan={2}
                                align="center"
                                fontStyle="italic"
                              >
                                <Box fontStyle="italic">
                                  REGION: {popupData.data[regionIndex].value},
                                  DISTRICT: {popupData.data[distIndex].value}
                                </Box>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                        )}
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
                                {popupData.data.map((anObjectMapped, j) => {
                                  if (anObjectMapped.category === category) {
                                    return (
                                      <TableRow key={"popoverTableRow" + j}>
                                        <TableCell style={{ width: "75%" }}>
                                          {anObjectMapped.name}
                                        </TableCell>
                                        <TableCell
                                          style={{ width: "25%" }}
                                          align="right"
                                        >
                                          {anObjectMapped.value}{" "}
                                          {anObjectMapped.unit}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  } else {
                                    return null;
                                  }
                                })}
                              </TableBody>
                            </Fragment>
                          );
                        })}
                      </Table>
                      <Divider />
                      <Grid container justify="center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          startIcon={<SaveIcon />}
                        >
                          {popupData.data[0].layer ===
                            "Settlement Areas and Estimated Population (pop.)" ||
                          popupData.data[0].layer === "Communities" ? (
                            <CSVLink
                              className={classes.download}
                              data={popupData.data}
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
                          ) : (
                            <CSVLink
                              className={classes.download}
                              data={popupData.data}
                              filename={
                                "SPT_" +
                                popupData.data[distIndex].value +
                                ".csv"
                              }
                            >
                              DOWNLOAD TABLE
                            </CSVLink>
                          )}
                        </Button>
                      </Grid>
                    </div>
                  </Fade>
                </Modal>
              </Fragment>
            )}
          </div>
        </Popper>
      )}
    </div>
  );
};

// export const newContext = createContext({ selectedDistricts});
