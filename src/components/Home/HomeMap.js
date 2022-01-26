import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { MapContext } from "../../state/MapState";
import { useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";

const markers = [];
const countries = [];
const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = ({ setTooltipContent }) => {
  const [{ maps }] = useContext(MapContext);

  useMemo(() => {
    var obj;
    for (const [key, value] of Object.entries(maps)) {
      obj = {};
      // obj["markerOffset"] = -28;
      obj["name"] = `${value.name}`;
      // obj["coordinates"] = [`${value.long}`, `${value.lat}`];
      obj["key"] = `${key}`;
      markers.push(obj);
      countries.push(value.name);
    }
  }, [maps]);

  const history = useHistory();

  return (
    <ComposableMap
      data-tip=""
      projection="geoMercator"
      projectionConfig={{
        rotate: [-55, -5, 0],
        scale: 270,
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
                onMouseEnter={() =>{
                  if (cur) {
                  // const {NAME} = cur;
                  setTooltipContent(`${cur}`);
                  }
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
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
    </ComposableMap>
  );
};

export default memo(MapChart);
