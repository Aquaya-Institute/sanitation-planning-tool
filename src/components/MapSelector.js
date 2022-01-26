import * as React from "react";
import { MapContext } from "../state/MapState";
import Select from "@material-ui/core/Select";
import { useHistory } from "react-router-dom";

export const MapSelector = ({ inputProps }) => {
  const [{ maps, currentMapID }, dispatch] = React.useContext(MapContext);
  const [mapID, setMapID] = React.useState(undefined);
  const history = useHistory();

  React.useLayoutEffect(() => {
    if (currentMapID) {
      setMapID(currentMapID);
    } else {
      setMapID("Select country");
    }
  }, [currentMapID]);

  const onSelectChange = (event) => {
    if (event.target.value === "Select country") {
      setMapID(event.target.value);
    } else if (event.target.value !== undefined) {
      history.push(`/maps/${event.target.value.toLowerCase()}`);
      window.location.reload();
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
    <React.Fragment>
      <Select
        native
        inputProps={inputProps}
        label="Filled"
        onChange={onSelectChange}
        style={{
          textTransform: "capitalize",
          backgroundColor: "#FFFFFF",
          opacity: "0.75",
        }}
        value={mapID}
      >
        <option aria-label="Default menu option" value="Select country">
          Select country
        </option>
        {Object.entries(maps)
          .sort()
          .map((map, index) => (
            <option
              aria-label={"Menu option: " + map[0]}
              key={index}
              value={map[0]}
            >
              {map[1].name}
            </option>
          ))}
      </Select>
    </React.Fragment>
  );
};
