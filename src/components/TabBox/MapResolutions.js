import {
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Box, Typography } from "@material-ui/core";
import { MapContext } from "../../state/MapState";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import L from "leaflet";
import Carto from "@carto/carto.js";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  checkboxLabel: {
    fontSize: 13,
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 200,
    maxWidth: 275,
  },
  menu: {
    height: "25px",
  },
}));

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      padding: 0,
    },
  },
};
function extractValue(arr, prop) {
  let extractedValue = arr.map((item) => item[prop]).sort();
  return extractedValue;
}

export const MapResolutions = ({ value }) => {
  const [
    { maps, currentMapID, activeLayer, carto_client, leafletMap, activeLegend },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState(currentMapID);
  // const [activeLayer, setActiveLayer] = useState("2");
  const [distName, setDistName] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [column, setColumn] = useState("");
  const [disabled, setDisabled] = useState(true);
  const classes = useStyles();
  const highlightDist = useRef();
  var selectedDistList = [];

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
      // setDistName([]);
      // setActiveLayer(maps[currentMapID].currentLayer);
    }
  }, [currentMapID, mapID]);

  const toggleLayerVisibility = (activeLayer) => {
    console.log("radio");
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      layerID: activeLayer,
    });
  };
  //Set all districts
  useMemo(() => {
    if (carto_client && mapID) {
      if (allDistricts.length === 0) {
        var column_name = null;
        if (
          maps[mapID].layers["3"].filters.some(
            (el) => el.column_name === "name_3"
          )
        ) {
          column_name = "name_3";
        } else {
          column_name = "name_2";
        }
        setColumn(column_name);

        return fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ${column_name} FROM ${maps[mapID].layers["3"].carto_tableName}`
        )
          .then((resp) => resp.json())
          .then((response) => {
            // setAllDistricts(response.rows);
            const result = extractValue(response.rows, column_name);
            setAllDistricts(result);
            // dispatch({
            //   type: "dropdown.names",
            //   distNames: result,
            //   mapID: mapID,
            //   layerID: activeLayer,
            // });
          });
      }
    }
  }, [carto_client, mapID, maps]);

  function filterPopulatedPlacesByCountry(distName) {
    let query = `
        SELECT *
          FROM ${maps[mapID].layers[activeLayer].carto_tableName}
          WHERE ${column} IN (SELECT ${column} FROM ${maps[mapID].layers["3"].carto_tableName})
      `;
    if (distName.length > 0) {
      query = `
        SELECT *
          FROM ${maps[mapID].layers[activeLayer].carto_tableName}
          WHERE ${column} IN (${distName
        .map((x) => "'" + x + "'")
        .toString()})`;
    }
    // const source = new Carto.source.SQL(
    //   `SELECT * FROM ${maps[mapID].layers[activeLayer].carto_tableName}`
    // );
    // source.setQuery(query);
    if (maps[mapID].layers[activeLayer].carto_source && activeLayer !== "1") {
      maps[mapID].layers[activeLayer].carto_source.setQuery(query);
    }
  }

  useEffect(() => {
    if (highlightDist.current) {
      leafletMap.removeLayer(highlightDist.current);
    }

    if (leafletMap && mapID) {
      if (distName.length > 0) {
        fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?format=GeoJSON&q=SELECT * FROM ${
            maps[mapID].layers["3"].carto_tableName
          } where ${column} IN (${distName
            .map((x) => "'" + x + "'")
            .toString()})`
        )
          .then((resp) => resp.json())
          .then((response) => {
            var myStyle = {
              color: "#FFFFFF",
              fillColor: "#FFFFFF",
              fillOpacity: 0,
              weight: 2,
            };
            let geojsonLayer = L.geoJSON(response, myStyle);
            highlightDist.current = geojsonLayer;
            leafletMap.fitBounds(geojsonLayer.getBounds());
            filterPopulatedPlacesByCountry(distName);
            geojsonLayer.addTo(leafletMap);
          });
      } else if (distName.length === 0) {
        filterPopulatedPlacesByCountry(distName);
        leafletMap.setView(
          [maps[mapID].lat, maps[mapID].long],
          maps[mapID].zoom
        );
      }
    }
  }, [distName, activeLayer]);

  // useLayoutEffect(() => {
  //   if (distName && mapID) {
  //     filterPopulatedPlacesByCountry(distName);
  //   }
  // }, [activeLegend]);

  const updateFilter = ({
    layerIndex,
    filterIndex,
    newValue,
    scaledValue,
    filterStateObject,
    categoryFilterIndex,
  }) => {
    // if (
    //   filterStateObject.type === "categorical" &&
    //   categoryFilterIndex !== undefined
    // ) {
    //   let new_cat_obj = {
    //     ...filterStateObject.value[categoryFilterIndex],
    //     checked: newValue,
    //   };
    //   newValue = [...filterStateObject.value];
    //   newValue[categoryFilterIndex] = new_cat_obj;
    // }

    dispatch({
      type: "layer.filter",
      mapID: currentMapID,
      layerIndex: activeLayer,
      filterIndex: filterIndex,
      filter: {
        ...filterStateObject,
        // value: newValue,
        // scaledValue: scaledValue,
      },
      selectedDists: newValue,
    });
  };

  const handleChange = (event) => {
    setDistName(event.target.value);
    selectedDistList.push(event.target.value);
    // dispatch({
    //   type: "dropdown.selection",
    //   selectedDists: selectedDistList,
    // });
    // updateFilter({
    //   layerIndex: activeLayer,
    //   filterIndex: 19,
    //   filterStateObject: maps[currentMapID].layers[activeLayer].filters[19],
    //   newValue: selectedDistList,
    //   categoryFilterIndex: 2,
    // });
  };

  return (
    <div style={{ height: "200px", overflow: "auto" }}>
      {mapID && (
        <>
          <FormControl component="fieldset" key="fieldset">
            <FormLabel component="legend" key="legend">
              <Box
                pb={1}
                fontStyle="italic"
                fontWeight="fontWeightBold"
                fontSize={13.5}
                variant="subtitle2"
                style={{ color: "black" }}
                key="rightBoxSubtitle"
              >
                Select the resolution at which to explore the map:
              </Box>
            </FormLabel>
            {mapID && (
              <Box pl={1}>
                <RadioGroup
                  // p={1}
                  aria-label="Map resolution options"
                  name="resolutionSelector"
                  value={activeLayer}
                  onChange={(e) => {
                    // setDistName([]);
                    toggleLayerVisibility(e.target.value);
                  }}
                  className="tour-scale"
                  key="radioLabel"
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="1x1km areas (Classification layer only)"
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="radio1"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="5x5km areas"
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="radio2"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label={maps[mapID].layers["3"].name + "s"}
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="radio3"
                  />
                  {maps[mapID].layers["4"] && (
                    <div className="tour-comms">
                      <Divider />
                      <FormControlLabel
                        value="4"
                        disabled={disabled}
                        control={<Radio />}
                        label="Estimated settlement areas (Beta)"
                        classes={{
                          label: classes.checkboxLabel,
                        }}
                        key="radio4"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            key="consent"
                            checked={!disabled}
                            name="consent"
                            onChange={() => {
                              setDisabled(!disabled);
                            }}
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            color="primary"
                          />
                        }
                        label={
                          <Typography
                            key="filterListItemLabel"
                            variant="body2"
                            style={{ fontSize: 11 }}
                            gutterBottom
                          >
                            I understand the settlements layer is an estimation
                            and still under development. Some settlements may
                            not be captured and values are estimated from data
                            of lower resolution and therefore not precise.
                          </Typography>
                        }
                        size="small"
                      />
                    </div>
                  )}
                </RadioGroup>
              </Box>
            )}
          </FormControl>
          <Divider />
          <Box
            pt={1}
            fontStyle="italic"
            fontWeight="fontWeightBold"
            fontSize={13.5}
            variant="subtitle2"
            style={{ color: "black" }}
            key="rightBoxSubtitle"
          >
            Optionally, select specific{" "}
            {maps[mapID].layers["3"].name.toLowerCase()}(s) to explore:
          </Box>
          <FormControl
            className={clsx(classes.formControl, "tour-dropdown")}
            pl={1}
          >
            {mapID && (
              <Box pl={1}>
                <InputLabel pl={1} id="demo-mutiple-checkbox-label">
                  Select {maps[mapID].layers["3"].name}(s)
                </InputLabel>
                <Select
                  labelId="demo-mutiple-checkbox-label"
                  id="demo-mutiple-checkbox"
                  multiple
                  value={distName}
                  onChange={handleChange}
                  input={<Input />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                  className={classes.formControl}
                >
                  {allDistricts.map((name, i) => (
                    <MenuItem key={i} value={name} className={classes.menu}>
                      <Checkbox checked={distName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
                <button
                  onClick={() => {
                    setDistName([]);
                  }}
                >
                  Clear
                </button>
              </Box>
            )}
          </FormControl>
        </>
      )}
    </div>
  );
};
