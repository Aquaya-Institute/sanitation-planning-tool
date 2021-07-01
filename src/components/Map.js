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
import { Grid, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "../App.css";
import Paper from "@material-ui/core/Paper";
import theme from "../theme/theme";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormHelperText from "@material-ui/core/FormHelperText";
import { legendStyles } from "./subcomponents/LegendStyles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import TabsWrappedLabel from "../components/TabBox/TabBox";
import { MapPopper } from "./subcomponents/MapPopper";
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
  checkboxLabel: {
    fontSize: 13,
  },
}));

export const Map = () => {
  const [
    {
      currentMapID,
      maps,
      currentLayerID,
      activeLegend,
      userData,
      queryDist,
      queries,
      showSettlements,
      settlementBoundary,
      currentCountry,
      allowSettlements,
    },
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
  const [buckets, setBuckets] = useState();
  const openPopper = Boolean(popup);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverColumns, setPopoverColumns] = useState([]);
  const classes = useStyles();
  const clickRef = useRef(null);
  const clickRefPop = useRef(null);
  const mapRef = useRef(null);
  const initialLoad = useRef(false);
  // const buckets = useRef({
  //   legend: [
  //     { name: "Rural Remote", value: "#3d4bc7" },
  //     { name: "Rural On-road", value: "#4f9130" },
  //     { name: "Rural Mixed", value: "#bf4343" },
  //     { name: "Urban", value: "#c49755" },
  //   ],
  // });
  const buckets_1 = useRef({
    legend: [
      { name: "Rural Remote", value: "#3d4bc7" },
      { name: "Rural On-road", value: "#4f9130" },
      { name: "Rural Mixed", value: "#bf4343" },
      { name: "Urban", value: "#c49755" },
    ],
  });
  const buckets_2 = useRef({
    legend: [
      { name: "Rural Remote", value: "#3d4bc7" },
      { name: "Rural On-road", value: "#4f9130" },
      { name: "Rural Mixed", value: "#bf4343" },
      { name: "Urban", value: "#c49755" },
    ],
  });
  const buckets_3 = useRef({
    legend: [
      { name: "Rural Remote", value: "#3d4bc7" },
      { name: "Rural On-road", value: "#4f9130" },
      { name: "Rural Mixed", value: "#bf4343" },
      { name: "Urban", value: "#c49755" },
    ],
  });
  // const [value, setValue] = useState(100);
  // const [commCalcSource, setCommCalcSource] = useState(null);
  // const [widgetLoad, setWidgetLoad] = useState();

  var dat_popup = {};
  const highlightLayer = useRef();
  const settlementHighlight = useRef();
  // const [highlightLayer, setHighlightLayer] = useState();
  const legendStylesObj = legendStyles;
  // const [legendIndex, setLegendIndex] = useState(0);

  //click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log("1");
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
            if (highlightLayer.current && cartoClient) {
              mapRef.current.removeLayer(highlightLayer.current);
              // highlightLayer.current.clearLayers();
            }
            if (settlementHighlight.current && cartoClient) {
              mapRef.current.removeLayer(settlementHighlight.current);
              // settlementHighlight.current.clearLayers();
              settlementHighlight.current = undefined;
            }
            // settlementPopup=null
          }
        }
        console.log("clicked outside");
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
    console.log("2");
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

    if (cartoClient && mapID && initialLoad.current === false) {
      // dispatch({
      //   type: "layer.removeCartoLayers",
      // });
      console.log("Creating Carto Layers");
      const _mapID = mapID;

      var objlist = [];
      maps[mapID].layers.forEach((layer, index) => {
        var _source = null;
        let queryURL = null;
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
          // visible:
          //   (showSettlements && index > 3) === true ? true : layer.visible,
        });

        dispatch({
          type: "layer.addCartoLayer",
          mapID: _mapID,
          layerID: index,
          cartoLayer: _layer,
          cartoSource: _source,
          cartoStyle: _style,
          cartoFilters: _filters,
        });

        // setup feature clicks on relevant layers
        // if (_columns.length > 1) {
        //   _layer.on("featureClicked", (featureEvent) => {
        //     console.log("clicked a feature", featureEvent);
        //     var result = null;
        //     var input = featureEvent.data.cartodb_id;
        //     fetch(
        //       `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM ${layer.carto_tableName} where cartodb_id = ${input}`
        //     )
        //       .then((resp) => resp.json())
        //       .then((response) => {
        //         var myStyle = {
        //           color: "#FFFFFF",
        //           fillColor: "#FFFFFF",
        //           fillOpacity: 0.3,
        //           weight: 1,
        //         };
        //         result = L.geoJson(
        //           JSON.parse(response.rows[0].the_geom),
        //           myStyle
        //         );
        //         highlightLayer.current = result;
        //         if (
        //           settlementHighlight.current &&
        //           popup !== undefined &&
        //           popup !== null
        //         ) {
        //           mapRef.current.removeLayer(settlementHighlight.current);
        //           // settlementHighlight.current.clearLayers();
        //           result.addTo(mapRef.current);
        //         } else if (
        //           // settlementHighlight.current === null ||
        //           settlementHighlight.current === undefined
        //         ) {
        //           result.addTo(mapRef.current);
        //         }
        //       });
        //     setPopup([layer.name, featureEvent]);
        //     setPopoverOpen(false);
        //     console.log("popup", popup);
        //   });
        // }
        console.log("cycle");

        //add the layer to carto client
        // cartoClient.addLayer(_layer);
        // _layer.bringToBack();
        // setlayerID(index);

        // _layer.on("metadataChanged", function (event) {
        //   console.log(event);
        //   if (
        //     layer.name === maps[mapID].layers[currentLayerID].name &&
        //     (layer.carto_style === legendStylesObj[activeLegend].style_pixel ||
        //       layer.carto_style === legendStylesObj[activeLegend].style_bounds)
        //   ) {
        //     var obj = {};
        //     // get buckets
        //     if (event.styles[0]._buckets === undefined) {
        //       obj["variable"] = layer.name;
        //       obj["legend"] = event.styles[0]._categories;
        //       for (var i in obj.legend) {
        //         if (obj.legend[i].name === 1) {
        //           obj.legend[i].name = "Rural Remote";
        //         } else if (obj.legend[i].name === 2) {
        //           obj.legend[i].name = "Rural On-road";
        //         } else if (obj.legend[i].name === 3) {
        //           obj.legend[i].name = "Rural Mixed";
        //         } else if (obj.legend[i].name === 4) {
        //           obj.legend[i].name = "Urban";
        //         }
        //       }
        //     } else {
        //       obj["variable"] = layer.name;
        //       obj["legend"] = event.styles[0]._buckets;
        //     }
        //     setBuckets(obj);
        //     // setBuckets((st) => [...st, obj]);
        //   }
        //   // }
        // });

        //add the carto layer to global state

        initialLoad.current = true;
        // }
      });
      setPopoverColumns(objlist);
      console.log(popoverColumns);
    }
  }, [mapID, cartoClient]);

  // useEffect(() => {
  //   if (initialLoad.current === true) {
  //     console.log("currentlayer");

  //     dispatch({
  //       type: "current.layer",
  //       // currentLayer: maps[mapID].layers[currentLayerID].carto_layer,
  //       // currentSource: maps[mapID].layers[currentLayerID].carto_source,
  //       // currentStyle: maps[mapID].layers[currentLayerID].carto_style,
  //       // currentFilters: maps[mapID].layers[currentLayerID].filters,
  //     });
  //   }
  // }, [currentLayerID, dispatch, mapID, maps]);

  useEffect(() => {
    if (
      initialLoad.current === true &&
      currentCountry[currentLayerID].layer !== null
    ) {
      const layer = maps[mapID].layers[currentLayerID];
      currentCountry[currentLayerID].layer.on(
        "metadataChanged",
        function (event) {
          console.log(event);
          if (
            layer.name === maps[mapID].layers[currentLayerID].name &&
            (currentCountry[currentLayerID].style ===
              legendStylesObj[activeLegend].style_pixel ||
              currentCountry[currentLayerID].style ===
                legendStylesObj[activeLegend].style_bounds)
          ) {
            var obj = {};
            // get buckets
            if (event.styles[0]._buckets === undefined) {
              // obj["variable"] = layer.name;
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
              // obj["variable"] = layer.name;
              obj["legend"] = event.styles[0]._buckets;
            }
            setBuckets(obj);
            // if (buckets_1.current === undefined) {
            //   buckets_1.current = obj;
            //   buckets_2.current = obj;
            //   buckets_3.current = obj;
            // }
            if (currentLayerID === "2") {
              buckets_2.current = obj;
              // buckets.current = obj;
            } else if (currentLayerID === "3") {
              buckets_3.current = obj;
              // buckets.current = obj;
            }
            // setBuckets((st) => [...st, obj]);
            // }
          }
        }
      );
      if (currentLayerID === "1") {
        setBuckets(buckets_1.current);
      } else if (currentLayerID === "2") {
        setBuckets(buckets_2.current);
      } else if (currentLayerID === "3") {
        setBuckets(buckets_3.current);
      }
    }
  }, [currentCountry[currentLayerID].layer, currentLayerID, activeLegend]);

  useEffect(() => {
    if (
      initialLoad.current === true &&
      currentCountry[currentLayerID].layer !== null
    ) {
      currentCountry[currentLayerID].layer.on(
        "featureClicked",
        (featureEvent) => {
          console.log("clicked a feature", featureEvent);
          if (highlightLayer.current) {
            mapRef.current.removeLayer(highlightLayer.current);
          }
          var result = null;
          var input = featureEvent.data.cartodb_id;
          fetch(
            `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM ${maps[mapID].layers[currentLayerID].carto_tableName} where cartodb_id = ${input}`
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
              if (
                settlementHighlight.current &&
                popup !== undefined &&
                popup !== null
              ) {
                mapRef.current.removeLayer(settlementHighlight.current);
                // settlementHighlight.current.clearLayers();
                result.addTo(mapRef.current);
              } else if (
                // settlementHighlight.current === null ||
                settlementHighlight.current === undefined
              ) {
                result.addTo(mapRef.current);
              }
            });
          setPopup([maps[mapID].layers[currentLayerID].name, featureEvent]);
          setPopoverOpen(false);
          console.log("popup", popup);
        }
      );
    }
  }, [currentCountry[currentLayerID].layer, currentLayerID, mapID, maps]);

  useEffect(() => {
    if (allowSettlements === true && mapID) {
      if (showSettlements === true) {
        if (maps[mapID].layers["4"] && cartoClient) {
          console.log("3");
          if (currentCountry[currentLayerID].query) {
            if (settlementBoundary) {
              cartoClient.removeLayer(settlementBoundary);
            }
            // var clause = query.substr(query.indexOf(" WHERE"), query.length);
            // queryURL =
            //   `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}` +
            //   clause;
            let queryURL = currentCountry[currentLayerID].query.replace(
              /\s/g,
              " "
            );
            var settlement_style = null;
            var settlement_source = null;
            var settlementBoundaryset = null;
            settlement_source = new Carto.source.SQL(
              `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS foo, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(foo.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom)`
            );
            settlement_style = new Carto.style.CartoCSS(
              `#layer {polygon-fill: #826dba; polygon-opacity: 0;} #layer::outline {line-width: 1; line-color: #000000; line-opacity: 1;}`
            );

            // let queryURL2 = `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom)`;
            // maps[mapID].layers["5"].carto_source.setQuery(queryURL2);
            // query.replace(/\s/g, " ");
            // queryURL2 = encodeURIComponent(queryURL2);

            // queryURL = `SELECT the_geom FROM ${queryURL2}`;
          } else {
            // queryURL = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
            // maps[mapID].layers["4"].carto_source.setQuery(
            //   `SELECT * FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom)`
            // );
            // _source = new Carto.source.SQL(
            //   `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
            // );
            settlement_source = new Carto.source.SQL(
              `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM ${maps[mapID].layers[currentLayerID].carto_tableName}, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(${maps[mapID].layers[currentLayerID].carto_tableName}.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom)`
            );
            settlement_style = new Carto.style.CartoCSS(
              `#layer {polygon-fill: #826dba; polygon-opacity: 0;} #layer::outline {line-width: 1; line-color: #000000; line-opacity: 1;}`
            );
          }
          if (settlement_source) {
            settlementBoundaryset = new Carto.layer.Layer(
              settlement_source,
              settlement_style,
              {
                visible: showSettlements === true ? true : false,
                featureClickColumns: [
                  "classes",
                  "dt",
                  "dr",
                  "timecities",
                  "pop",
                  "rr",
                  "rrd",
                  "rm",
                  "u",
                  "name_1",
                  "name_2",
                ],
              }
            );
            settlementBoundaryset.on("featureClicked", (featureEvent) => {
              console.log("clicked a feature", featureEvent);
              var result = null;
              var input = featureEvent.data.cartodb_id;
              fetch(
                `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM ${maps[mapID].layers["4"].carto_tableName} where cartodb_id = ${input}`
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
                  settlementHighlight.current = result;
                  if (highlightLayer.current) {
                    mapRef.current.removeLayer(highlightLayer.current);
                    // highlightLayer.current.clearLayers();
                  }
                  result.addTo(mapRef.current);
                });
              setPopup([maps[mapID].layers["4"].carto_tableName, featureEvent]);
              setPopoverOpen(false);
              console.log("popup", popup);
              // dispatch({
              //   type: "settlement.popup",
              //   settlementPopup: [
              //     maps[mapID].layers["4"].carto_tableName,
              //     featureEvent,
              //   ],
              //   settlementHighlight: selectedSettlement.current,
              // });
            });
            cartoClient.addLayer(settlementBoundaryset);
            currentCountry[currentLayerID].layer.show();
            dispatch({
              type: "settlement.boundary",
              settlementBoundary: settlementBoundaryset,
            });
          }
        }
      }
    }
  }, [
    currentCountry[currentLayerID].query,
    allowSettlements,
    showSettlements,
    currentLayerID,
  ]);

  // popup data
  useMemo(() => {
    console.log("updated popup", popup);
    if (popup) {
      var dat = [];
      currentMapState.layers[currentLayerID].filters.forEach(function (
        element
      ) {
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
      console.log("4");
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
    console.log("5");
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
      maps[mapID].layers[currentLayerID].name === "5x5km area" ||
      maps[mapID].layers[currentLayerID].name === "1x1km area"
    ) {
      styleNew = legendStyles[event.target.value].style_pixel;
    } else {
      styleNew = legendStyles[event.target.value].style_bounds;
    }

    dispatch({
      type: "legend.select",
      mapID: mapID,
      layerID: currentLayerID,
      legendIndex: event.target.value,
      styleNew: styleNew,
    });
  };
  // const handleOpacityChange = (e, newval) => {
  //   setValue(newval);
  //   let styleNew = null;
  //   if (
  //     maps[mapID].layers[currentLayerID].name === "5x5km area" ||
  //     maps[mapID].layers[currentLayerID].name === "1x1km area"
  //   ) {
  //     styleNew = legendStyles[activeLegend].style_pixel.concat(
  //       ` #layer {polygon-opacity: ${newval / 100};}`
  //     );
  //   } else {
  //     styleNew = legendStyles[activeLegend].style_bounds.concat(
  //       ` #layer {polygon-opacity: ${newval / 100};}`
  //     );
  //   }
  //   // let styleNew2 = maps[mapID].layers[currentLayerID].carto_style.concat(
  //   //   `#layer {polygon-opacity: ${newval / 100};}`
  //   // );

  //   // let styleNew = new Carto.layer.Layer(
  //   //   maps[mapID].layers[currentLayerID].carto_source,
  //   //   styleNew2
  //   // );
  //   // cartoClient.addLayer(styleNew);

  //   dispatch({
  //     type: "layer.opacity",
  //     styleNew: styleNew,
  //     mapID: mapID,
  //     layerID: currentLayerID,
  //   });
  // };

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
      {mapID && currentLayerID && (
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
            style={{ height: "5px", backgroundColor: "transparent" }}
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
                      currentCountry[currentLayerID].layer.hide();
                    } else {
                      currentCountry[currentLayerID].layer.show();
                    }
                  }}
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  color="primary"
                  inputProps={{ "aria-label": "show/hide-main-layer" }}
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
            style={{ height: "5px", backgroundColor: "transparent" }}
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
            <Fragment key={"legendContent" + currentLayerID}>
              <Box variant="subtitle2" fontSize={12} fontWeight="light">
                Selected resolution:{" "}
                {maps[mapID].layers[currentLayerID].name + "s"}
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
                    name: "active-legend",
                    id: "select-active-legend",
                    "aria-label": "select-active-legend",
                  }}
                  className="tour-legendselect"
                  style={{ backgroundColor: theme.palette.background.selected }}
                >
                  {maps[mapID].layers[currentLayerID].filters.map(
                    (filter, i) => {
                      if (filter.type !== "none") {
                        return (
                          <option key={"filter" + i} value={i}>
                            {filter.name}
                          </option>
                        );
                      } else {
                        return null;
                      }
                    }
                  )}
                </NativeSelect>
                <FormHelperText> </FormHelperText>
              </FormControl>
              {/* {maps[mapID].layers[currentLayerID].name === buckets.variable && ( */}
              {buckets && (
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
                            maps[mapID].layers[currentLayerID].filters[
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
        <MapPopper
          popupData={popupData}
          clickRef={clickRef}
          openPopper={openPopper}
          setPopup={setPopup}
          highlightLayer={
            popupData.data.cholera
              ? highlightLayer.current
              : settlementHighlight.current
          }
          mapID={mapID}
          setPopoverOpen={setPopoverOpen}
          popoverOpen={popoverOpen}
          clickRefPop={clickRefPop}
          downloadData={downloadData}
        />
      )}
    </div>
  );
};
