import {
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import { Box, Popper } from "@material-ui/core";
import { MapContext } from "../../state/MapState";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import L from "leaflet";
import clsx from "clsx";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

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
    // zIndex: "1500",
  },
}));

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  //   disablePortal: true,
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

export const DropdownMenu = ({
  anchorEl,
  filterMenuOpen,
  setFilterMenuOpen,
  cat,
  setSelectedMenu,
}) => {
  const [
    {
      maps,
      currentMapID,
      currentLayerID,
      carto_client,
      leafletMap,
      activeLegend,
      selectedDistName,
      highlightLayer,
      currentCountry,
    },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState(currentMapID);
  // const [currentLayerID, setcurrentLayerID] = useState("2");
  const [distName, setDistName] = useState(selectedDistName);
  const [allDistricts, setAllDistricts] = useState([]);
  const [column, setColumn] = useState("");
  const classes = useStyles();
  const highlightDist = useRef();
  const [setMenuTileColor] = useState(false);
  const clickRefMenu = useRef(null);

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

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
            const result = extractValue(response.rows, column_name);
            setAllDistricts(result);
          });
      }
    }
  }, [carto_client, mapID, maps]);

  function filterPopulatedPlacesByCountry(distName) {
    let query = null;
    if (distName.length > 0) {
      query = `SELECT * FROM ${
        maps[mapID].layers[currentLayerID].carto_tableName
      } WHERE ${column} IN (${distName.map((x) => "'" + x + "'").toString()})`;
    } else {
      query = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
    }
    // const source = new Carto.source.SQL(
    //   `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`
    // );
    // source.setQuery(query);
    if (
      maps[mapID].layers[currentLayerID].carto_source &&
      currentLayerID !== "1"
    ) {
      currentCountry.current_source.setQuery(query);
      dispatch({
        type: "layer.queryDist",
        queryDist: query,
      });
    }
  }

  useEffect(() => {
    if (highlightLayer) {
      leafletMap.removeLayer(highlightLayer);
    }

    if (leafletMap && mapID) {
      if (distName.length > 0) {
        return fetch(
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
            // highlightDist.current = geojsonLayer;
            leafletMap.fitBounds(geojsonLayer.getBounds());
            filterPopulatedPlacesByCountry(distName);
            geojsonLayer.addTo(leafletMap);
            dispatch({
              type: "dropdown.highlight",
              highlightLayer: geojsonLayer,
            });
          });
      }
    }
  }, [distName]);

  useLayoutEffect(() => {
    if (distName.length > 0 && mapID) {
      filterPopulatedPlacesByCountry(distName);
    }
  }, [activeLegend]);

  const handleChange = (event) => {
    setDistName(event.target.value);
    dispatch({
      type: "dropdown.selection",
      distName: event.target.value,
    });
  };

  return (
    <Popper
      // id={cat + "filterMenu"}
      ref={clickRefMenu}
      key={cat + "filterMenu"}
      anchorEl={anchorEl}
      placement={"left-start"}
      style={{
        height: "auto",
        maxHeight: "500px",
        width: "285px",
        zIndex: "1300",
        backgroundColor: "#fff",
        overflow: "auto",
      }}
      open={filterMenuOpen}
      onClose={(e) => {
        setFilterMenuOpen(false);
        setMenuTileColor(false);
      }}
    >
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={(e) => {
          console.log("click away");
          setFilterMenuOpen(false);
          setSelectedMenu(null);
        }}
      >
        {mapID && (
          <Box p={2}>
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
              <Box pl={1}>
                <InputLabel pl={1} id="demo-mutiple-checkbox-label">
                  Select {maps[mapID].layers["3"].name}(s)
                </InputLabel>

                <Select
                  //   native={true}
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
                    dispatch({
                      type: "dropdown.selection",
                      distName: [],
                    });
                    filterPopulatedPlacesByCountry([]);
                    leafletMap.setView(
                      [maps[mapID].lat, maps[mapID].long],
                      maps[mapID].zoom
                    );
                    if (highlightLayer) {
                      leafletMap.removeLayer(highlightLayer);
                    }
                  }}
                >
                  Clear
                </button>
              </Box>
            </FormControl>
          </Box>
        )}
      </ClickAwayListener>
    </Popper>
  );
};
