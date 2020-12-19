import * as React from "react";
import { Redirect } from "react-router-dom";
import { MapContext } from "../state/MapState";

export const MapSelector = () => {
  //pick specific states (and dispatcher) we need from mapstate
  const [{ maps }, dispatch] = React.useContext(MapContext);

  const onSelectChange = (event) => {
    <Redirect to={event.target.value} />
    // dispatch({
    //   type: "layer.removeCartoLayers",
    // });
    // dispatch({
    //   type: "map.select",
    //   mapID: event.target.value,
    // });
  };

  return (
    <div>
      <span>Show Map Of </span>
      <select onChange={onSelectChange} style={{textTransform:"capitalize"}}>
        {Object.keys(maps).map((map, index) => (
          <option key={index} value={map}>
            {map}
          </option>
        ))}
      </select>
    </div>
  );
};
