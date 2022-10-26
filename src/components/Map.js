import { useState, useMemo, useEffect, useContext, useRef } from "react";
import { MapContext } from "../state/MapState";
import Carto from "@carto/carto.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { makeStyles } from "@material-ui/core/styles";
import "../App.css";
import { legendStyles } from "./subcomponents/LegendStyles";
import { MapPopper } from "./subcomponents/MapPopper";
import { Legend } from "./subcomponents/Legend";
import NoDataAlert from "./subcomponents/NoDataAlert";

const useStyles = makeStyles((theme) => ({
  element: {
    textTransform: "none",
    color: theme.palette.text.secondary,
  },
  dot: {
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
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
      // queryDist,
      showSettlements,
      settlementBoundary,
      currentCountry,
      allowSettlements,
    },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState();
  const [currentMapState, setCurrentMapState] = useState();
  const [leaflet, setLeaflet] = useState();
  const [cartoClient, setCartoClient] = useState();
  const [popup, setPopup] = useState();
  const [popupData, setPopupData] = useState();
  const [downloadData, setDownloadData] = useState();
  const [buckets, setBuckets] = useState();
  const openPopper = Boolean(popup);
  const [popoverOpen, setPopoverOpen] = useState(false);
  // const [popoverColumns, setPopoverColumns] = useState([]);
  const settlementclickRef = useRef(null);
  const classes = useStyles();
  const clickRef = useRef(null);
  const clickRefPop = useRef(null);
  const mapRef = useRef(null);
  const initialLoad = useRef(false);
  const [hideLayer, setHideLayer] = useState(false);

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
  var dat_popup = {};
  const highlightLayer = useRef();
  const settlementHighlight = useRef();
  const legendStylesObj = legendStyles;
  const currentLayer = currentCountry[currentLayerID].layer;
  // const layerQuery = currentCountry[currentLayerID].query;

  //click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickRef.current && !clickRef.current.contains(event.target)) {
        if (clickRef.current && !clickRef.current.contains(event.target)) {
          if (
            clickRefPop.current &&
            !clickRefPop.current.contains(event.target)
          ) {
            setPopoverOpen(null);
            event.stopPropagation();
          } else if (
            clickRefPop.current &&
            clickRefPop.current.contains(event.target)
          ) {
          } else {
            setPopup(null);
            event.stopPropagation();
            settlementclickRef.current = false;
            if (highlightLayer.current && cartoClient) {
              mapRef.current.removeLayer(highlightLayer.current);
              highlightLayer.current = undefined;
            }
            if (settlementHighlight.current && cartoClient) {
              mapRef.current.removeLayer(settlementHighlight.current);
              settlementHighlight.current = undefined;
            }
          }
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
    if (currentMapID !== mapID) {
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

  //clean up
  useMemo(() => {
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
    if (leaflet !== undefined) {
      leaflet.remove();
    }

    if (maps && mapID) {
      const client = new Carto.Client({
        apiKey: process.env.REACT_APP_CARTO_DEV_API_KEY,
        username: process.env.REACT_APP_CARTO_USERNAME,
        serverUrl: process.env.REACT_APP_CARTO_SERVERURL,
      });
      mapRef.current = L.map("map", { minZoom: 5.75, maxZoom: 18 }).setView(
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
    if (cartoClient && mapID && initialLoad.current === false) {
      const _mapID = mapID;

      // var objlist = [];
      maps[mapID].layers.forEach((layer, index) => {
        // var _source = null;
        // if (queryDist && index > 1) {
        //   let queryedit =
        //     `SELECT * FROM ${layer.carto_tableName} WHERE` + queryDist;
        //   _source = new Carto.source.SQL(queryedit);
        // } else {
        //   _source = new Carto.source.SQL(
        //     `SELECT * FROM ${layer.carto_tableName}`
        //   );
        // }
        const _source = new Carto.source.SQL(
          `SELECT * FROM ${layer.carto_tableName}`
        );

        _source.on("queryChanged", function (e) {
          dispatch({
            type: "layer.query",
            query: e,
            layerID: index,
          });
        });
        const _style = new Carto.style.CartoCSS(layer.carto_style);
        const _filters = [];
        const _columns = [];
        // var obj1 = [];

        layer.filters.forEach((filter, filter_c) => {
          // obj1 = [
          //   layer.name,
          //   filter.name,
          //   filter.column_name,
          //   filter.subcategory,
          //   filter.unit,
          // ];
          // objlist.push(obj1);
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
        var _layer = null;
        if (index === "1") {
          _layer = new Carto.layer.Layer(_source, _style);
        } else {
          //create the carto layer and add feature clicks
          _layer = new Carto.layer.Layer(_source, _style, {
            featureClickColumns: _columns,
          });
        }

        dispatch({
          type: "layer.addCartoLayer",
          mapID: _mapID,
          layerID: index,
          cartoLayer: _layer,
          cartoSource: _source,
          cartoStyle: _style,
          cartoFilters: _filters,
        });
        initialLoad.current = true;
      });
      // setPopoverColumns(objlist);
    }
  }, [mapID, cartoClient]);

  //Set buckets
  useEffect(() => {
    if (initialLoad.current === true && currentLayer !== null) {
      const layer = maps[mapID].layers[currentLayerID];
      currentLayer.on("metadataChanged", function (event) {
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
            obj["legend"] = event.styles[0]._buckets;
          }
          setBuckets(obj);
          if (currentLayerID === "2") {
            buckets_2.current = obj;
          } else if (currentLayerID === "3") {
            buckets_3.current = obj;
          }
        }
      });
      if (currentLayerID === "1") {
        setBuckets(buckets_1.current);
      } else if (currentLayerID === "2") {
        setBuckets(buckets_2.current);
      } else if (currentLayerID === "3") {
        setBuckets(buckets_3.current);
      }
    }
  }, [currentLayer, currentLayerID, activeLegend]);

  //Register feature clicks
  useEffect(() => {
    if (
      initialLoad.current === true &&
      currentLayer !== null &&
      currentLayerID !== "1"
    ) {
      currentLayer.on("featureClicked", (featureEvent) => {
        if (
          settlementclickRef.current === false ||
          settlementclickRef.current === null
        ) {
          var result = null;
          var input = featureEvent.data.cartodb_id;
          fetch(
            `https://zebra.geodb.host/cached/user/admin/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM ${maps[mapID].layers[currentLayerID].carto_tableName} where cartodb_id = ${input}`
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
                settlementHighlight.current === null ||
                settlementHighlight.current === undefined
              ) {
                dispatch({
                  type: "boundary.highlight",
                  highlightBoundary: result,
                });
              }
            });
          setPopup([maps[mapID].layers[currentLayerID].name, featureEvent]);
          setPopoverOpen(false);
        }
      });
    }
  }, [currentLayer, currentLayerID, mapID]);

  // settlements layer
  useEffect(() => {
    if (allowSettlements === true && mapID) {
      if (showSettlements === true) {
        if (maps[mapID].layers["4"] && cartoClient) {
          currentCountry["4"].layer.on("featureClicked", (featureEvent) => {
            settlementclickRef.current = true;
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
                dispatch({
                  type: "boundary.highlight",
                  highlightBoundary: result,
                });
              });
            setPopup([maps[mapID].layers["4"].carto_tableName, featureEvent]);
            setPopoverOpen(false);
          });
          // cartoClient.addLayer(settlementBoundaryset);
          currentLayer.show();
          // dispatch({
          //   type: "settlement.boundary",
          //   settlementBoundary: settlementBoundaryset,
          // });
        }
      }
    }
  }, [
    allowSettlements,
    showSettlements,
    // currentLayerID,
  ]);

  // popup data
  useMemo(() => {
    if (popup) {
      var dat = [];
      var layerID = null;
      if (popup[0].includes("comms")) {
        layerID = "4";
      } else {
        layerID = currentLayerID;
      }
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
  const [myWeight] = useState(2);

  useEffect(() => {
    if (mapRef.current) {
      if (layerRef.current) {
        mapRef.current.removeLayer(layerRef.current);
      }
      layerRef.current = L.layerGroup().addTo(mapRef.current);
      mapRef.current.on("zoomend", function () {
        var currentZoom = mapRef.current.getZoom();
        if (currentZoom > 6) {
          setMyRadius(2);
        }
        setMyRadius(currentZoom * (1 / 2.5));
      });
    }
  }, [userData]);

  // update markers
  useEffect(() => {
    if (userData) {
      var markerOptions = {
        radius: myRadius,
        fillColor: "#ffffff",
        color: "#ffffff",
        weight: myWeight,
        opacity: 1,
        fillOpacity: 0.3,
      };
      userData.forEach((marker, key) => {
        if (marker.Latitude === null || marker.Longitude === null) {
          return null;
        } else {
          var popupContent = "";
          for (key in marker) {
            popupContent = popupContent + key + ":  " + marker[key] + "</br>";
          }
          L.circleMarker([marker.Latitude, marker.Longitude], markerOptions)
            .addTo(layerRef.current)
            .bindPopup(popupContent);
        }
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

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {mapID === "niger" || mapID === "mali" || mapID === "sudan" ? (
        <NoDataAlert />
      ) : null}
      <div
        id="map"
        style={{ height: "100%" }}
        className="tour-map"
        alt={"map of " + mapID + " which can be manipulated by the site user"}
      ></div>
      {/* Popup */}
      {popupData && (
        <MapPopper
          popupData={popupData}
          clickRef={clickRef}
          openPopper={openPopper}
          settlementclickRef={settlementclickRef.current}
          setPopup={setPopup}
          mapID={mapID}
          setPopoverOpen={setPopoverOpen}
          popoverOpen={popoverOpen}
          clickRefPop={clickRefPop}
          downloadData={downloadData}
          mapRef={mapRef}
        />
      )}

      {/* Legend */}
      {mapID && currentLayerID && (
        <Legend
          mapID={mapID}
          buckets={buckets}
          classes={classes}
          handleChange={handleChange}
          hideLayer={hideLayer}
          setHideLayer={setHideLayer}
        ></Legend>
      )}
    </div>
  );
};
