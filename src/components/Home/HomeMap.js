import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { MapContext } from "../../state/MapState";
import { useContext, useMemo } from "react";
// import { BrowserRouter as Router, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const markers = [];
const countries = [];
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = () => {
  const [{ maps }] = useContext(MapContext);

  useMemo(() => {
    var obj;
    for (const [key, value] of Object.entries(maps)) {
      obj = {};
      obj["markerOffset"] = -28;
      obj["name"] = `${value.name}`;
      obj["coordinates"] = [`${value.long}`, `${value.lat}`];
      obj["key"] = `${key}`;
      markers.push(obj);
      countries.push(value.name);
    }
  }, [maps]);

  const history = useHistory();

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        rotate: [-55, 0, 0],
        scale: 300,
      }}
      width={900}
      height={300}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const cur = countries.find((s) => s === geo.properties.NAME);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={cur ? "#651D32" : "#EAEAEC"}
                stroke="#D6D6DA"
                onClick={() => {
                  if (cur) {
                    var mapID;
                    for (let i = 0; i < countries.length; i++) {
                      if (markers[i].name === cur) {
                        mapID = markers[i].key;
                        break;
                      }
                    }
                    history.push(`/maps/${mapID.toLowerCase()}`);
                  }
                }}
                style={{
                  hover: {
                    fill: cur ? "#BA0C2F" : "#EAEAEC",
                    outline: "none",
                  },
                  pressed: {
                    fill: cur ? "#E42" : "#EAEAEC",
                    outline: "none",
                  },
                }}
              />
            );
          })
        }
      </Geographies>
      {markers.map(({ name, coordinates, markerOffset }, i) => (
        <Marker key={name + "marker" + i} coordinates={coordinates}>
          <g
            fill="none"
            stroke="#f28399"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(-12, -28)"
          >
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
          </g>
          <text
            textAnchor="middle"
            y={markerOffset}
            style={{ fontFamily: "Source Sans Pro", fill: "#5D5A6D" }}
          >
            {name}
          </text>
        </Marker>
      ))}
    </ComposableMap>
  );
};

export default MapChart;
