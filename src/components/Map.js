import { useState, useEffect, useContext, useRef, Fragment } from "react";
import { MapContext } from "../state/MapState";
import Carto from "@carto/carto.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link, Grid, Button, Box } from "@material-ui/core";
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
    { currentMapID, maps, activeLayer, activeLegend, userData },
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
  const mapRef = useRef(null);
  // const [commCalcSource, setCommCalcSource] = useState(null);
  // const [districtsSource, setDistrictsSource] = useState(null);
  // const [districtsStyle, setDistrictsStyle] = useState(null);
  // const [selectedDistricts, setSelectedDistricts] = useState([]);
  // const [widgetLoad, setWidgetLoad] = useState();
  // const [allDistricts, setAllDistricts] = useState([]);

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
        setPopup(null);
        console.log("clicked outside");
        if (highlightLayer.current && cartoClient) {
          cartoClient.removeLayer(highlightLayer.current);
        }
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [cartoClient]);

  //set mapID
  useEffect(() => {
    console.log("currentMapID", currentMapID);
    if (currentMapID) {
      setMapID(currentMapID);
    }
  }, [currentMapID]);

  //clean up
  useEffect(() => {
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

      L.tileLayer(
        "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1Ijoia2FyYXN0dWFydCIsImEiOiJja2N6aGYyZWwwMTV4MnJwMGFoM3lmN2lzIn0.xr5B6ZPw0FV0iPBqokdTFQ"
      ).addTo(mapRef.current);

      // setLeaflet((prevmap) => {
      //   if (!prevmap) {
      //     return mapRef.current;
      //   } else {
      //     return prevmap;
      //   }
      // });
      setLeaflet(mapRef.current);
      setCartoClient(client);
      client.getLeafletLayer().addTo(mapRef.current);
      dispatch({
        type: "map.addCartoClient",
        carto_client: client,
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

    if (cartoClient && mapID) {
      dispatch({
        type: "layer.removeCartoLayers",
      });
      console.log("Creating Carto Layers");
      const _mapID = mapID;

      var objlist = [];
      maps[mapID].layers.forEach((layer, index) => {
        const _source = new Carto.source.SQL(
          `SELECT * FROM ${layer.carto_tableName}`
        );
        // if (index === 3) {
        //   setDistrictsSource(_source);
        // }
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

        var highlight_layer = null;
        // setup feature clicks on relevant layers
        if (_columns.length > 1) {
          _layer.on("featureClicked", (featureEvent) => {
            console.log("clicked a feature", featureEvent);

            var input = featureEvent.data.cartodb_id;
            var source = new Carto.source.SQL(
              `SELECT * FROM ${layer.carto_tableName} where cartodb_id = ${input}`
            );
            let style = new Carto.style.CartoCSS(
              `#layer {
                polygon-fill: #FFFFFF;
                polygon-opacity: 0.3;
              }
              #layer::outline {
                line-width: 2;
                line-color: #FFFFFF;
                line-opacity: 1;
              }`
            );
            highlight_layer = new Carto.layer.Layer(source, style);
            cartoClient.addLayer(highlight_layer);
            highlightLayer.current = highlight_layer;
            // setHighlightLayer(highlight_layer);
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
            layer.carto_style === legendStylesObj[activeLegend].style
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
        });
      });
      setPopoverColumns(objlist);
      console.log(popoverColumns);
    }
  }, [currentMapState, activeLegend, activeLayer]);

  // popup data
  useEffect(() => {
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
        setMyRadius(currentZoom * (1 / 1)); //or whatever ratio you prefer
        setMyWeight(currentZoom * (1 / 3)); //or whatever ratio you prefer
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
        fillOpacity: 0.7,
      };
      // if (layerRef.current) {
      //   layerRef.current.clearLayers();
      // }
      userData.forEach((marker, key) => {
        let popupContent = document.createElement("UL");
        let popupContentList = document.createElement("LI");
        Object.entries(marker).map(
          (key) =>
            popupContentList.appendChild(
              document.createTextNode(key[0] + ": " + key[1])
            ),
          popupContent.appendChild(popupContentList)
        );
        L.circleMarker([marker.Latitude, marker.Longitude], markerOptions)
          .addTo(layerRef.current)
          .bindPopup(popupContent);
      });
    }
  }, [myRadius, myWeight, userData]);

  // Community counter
  // useEffect(() => {
  //   if (cartoClient && districtsSource && nativeMap) {
  //     const commCalculator = new Carto.dataview.FormulaData(
  //       districtsSource,
  //       "community",
  //       {
  //         operation: Carto.operation.COUNT,
  //       }
  //     );
  //     const bboxFilter = new Carto.filter.BoundingBoxLeaflet(nativeMap);
  //     cartoClient.addDataview(commCalculator);
  //     commCalculator.addFilter(bboxFilter);

  //     commCalculator.on("dataChanged", (data) => {
  //       refreshCommCalculator(data.result);
  //     });
  //   }
  // }, [cartoClient, commCalcSource, nativeMap]);

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
  const handleChange = (event) => {
    const styleNew = legendStyles[event.target.value].style;

    dispatch({
      type: "legend.select",
      mapID: mapID,
      layerID: activeLayer,
      legendIndex: event.target.value,
      styleNew: styleNew,
    });
  };
  // useEffect(() => {
  //   if (mapID && activeLegend && activeLayer) {
  //     const styleNew = legendStyles[activeLegend].style;

  //     dispatch({
  //       type: "legend.select",
  //       mapID: mapID,
  //       layerID: activeLayer,
  //       legendIndex: activeLegend,
  //       styleNew: styleNew,
  //     });
  //   }
  // }, [activeLegend]);
  const [scroll] = useState("paper");

  return (
    <div
      style={{ height: "100%", position: "relative" }}
      className={classes.content}
    >
      <div id="map" style={{ height: "100%" }} className="tour-map"></div>
      {/* Legend */}
      {mapID && activeLayer && (
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
            width: "250px",
            zIndex: "1000",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Fragment key={"legendContent" + activeLayer}>
            <Box variant="subtitle2" fontSize={12} fontWeight="light">
              Selected resolution: {maps[mapID].layers[activeLayer].name}
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
                  if (filter.subcategory !== "id") {
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

                      {legend.name === undefined
                        ? legend.min.toString() +
                          " - " +
                          legend.max.toString() +
                          " " +
                          maps[mapID].layers[activeLayer].filters[activeLegend]
                            .unit
                        : legend.name}
                    </Grid>
                  );
                })}
              </Fragment>
            )}
          </Fragment>
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
                  cartoClient.removeLayer(highlightLayer.current);
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
              ref={clickRef}
              key={idPopover}
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
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
                <Table key={"popoverTable"}>
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
                      filename={"SPT_" + popupData.data.name_3.Value + ".csv"}
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
