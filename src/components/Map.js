import { useState, useEffect, useContext } from "react";
import { MapContext } from "../state/MapState";
import Carto from "@carto/carto.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography, Link } from "@material-ui/core";

export const Map = () => {
  const [{ currentMapID, maps }, dispatch] = useContext(MapContext);
  const [mapID, setMapID] = useState();
  const [currentMapState, setCurrentMapState] = useState();
  const [leaflet, setLeaflet] = useState();
  const [cartoClient, setCartoClient] = useState();
  const [popup, setPopup] = useState();

  useEffect(() => {
    console.log("currentMapID", currentMapID);
    if (currentMapID) {
      setMapID(currentMapID);
    }
  }, [currentMapID]);

  useEffect(()=>{
    //clean up
    if(mapID) {
      return function cleanup() {
        dispatch({
          type: "map.select",
          mapID: null
        });
        dispatch({
          type: "layer.removeCartoLayers",
        });
      };
    }
  }, [mapID])

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

      currentMapState.layers.forEach((layer, index) => {
        const _source = new Carto.source.SQL(
          `SELECT * FROM ${layer.carto_tableName}`
        );
        const _style = new Carto.style.CartoCSS(layer.carto_style);
        const _filters = [];
        const _columns = [];
        layer.filters.forEach((filter) => {
          switch (filter.type) {
            case "range":
              const _filter = new Carto.filter.Range(filter.column_name, {
                gte: filter.value[0],
                lte: filter.value[1],
              });
              _filters.push(_filter);
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

        //show hide layers based on initial state in config
        const _layer = new Carto.layer.Layer(_source, _style, {
          featureClickColumns: _columns,
        });

        //setup feature clicks on relevant layers
        if (_columns.length > 0) {
          _layer.on("featureClicked", (featureEvent) => {
            console.log("clicked a feature", featureEvent);
            setPopup(featureEvent);
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

  return (
    <div>
      <div id="map" style={{ height: "90vh" }}>
        {popup && popup.data && (
          <Box
            style={{
              position: "absolute",
              left: popup.position.x,
              top: popup.position.y,
              zIndex: "2000",
              backgroundColor: "#fff",
              width: "200px",
            }}
          >
            <Link
              href=""
              onClick={(e) => {
                e.preventDefault();
                setPopup(null);
              }}
            >
              Close
            </Link>
            <Typography>{JSON.stringify(popup.data, null, 2)}</Typography>
          </Box>
        )}
      </div>
    </div>
  );
};
