import * as React from "react";
// import { Redirect } from "react-router-dom";
import { MapContext } from "../state/MapState";
import Select from "@material-ui/core/Select";
import { useHistory } from "react-router-dom";

export const MapSelector = () => {
  //pick specific states (and dispatcher) we need from mapstate
  const [{ maps, currentMapID }, dispatch] = React.useContext(MapContext);
  const [mapID, setMapID] = React.useState(undefined);
  const history = useHistory();

  React.useLayoutEffect(() => {
    if (currentMapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    } else {
      setMapID("Select country");
    }
  }, [currentMapID]);

  const onSelectChange = (event) => {
    // <Redirect to={event.target.value} />;
    if (event.target.value === "Select country") {
      setMapID(event.target.value);
    } else if (event.target.value !== undefined) {
      history.push(`/maps/${event.target.value.toLowerCase()}`);
      dispatch({
        type: "layer.removeCartoLayers",
      });
      dispatch({
        type: "map.select",
        mapID: event.target.value,
      });
    }
  };

  return (
    <div>
      <Select
        native
        inputProps={{
          name: "country",
          id: "country-maps-dropdown",
        }}
        label="Filled"
        onChange={onSelectChange}
        style={{
          textTransform: "capitalize",
          backgroundColor: "#FFFFFF",
          opacity: "0.5",
        }}
        value={mapID}
      >
        <option aria-label="Default menu option" value="Select country">
          Select country
        </option>
        {Object.entries(maps).map((map, index) => (
          <option
            aria-label={"Menu option: " + map[0]}
            key={index}
            value={map[0]}
          >
            {map[1].name}
          </option>
        ))}
      </Select>
    </div>
  );
};
