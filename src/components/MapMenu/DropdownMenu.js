import React from "react";
import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Popper,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  ListItemText,
  Select,
  Checkbox,
  ClickAwayListener,
  TextField,
  Divider,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { MapContext } from "../../state/MapState";
import L from "leaflet";
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

// function extractValue(arr, prop) {
//   let extractedValue = arr.map((item) => item[prop]).sort();
//   return extractedValue;
// }

export const DropdownMenu = ({
  anchorEl,
  filterMenuOpen,
  setFilterMenuOpen,
  cat,
  setSelectedMenu,
  tabIndex,
  allDistricts,
  allAdm1Names,
  allAdm2aNames,
  column,
}) => {
  const [
    {
      maps,
      currentMapID,
      currentLayerID,
      // carto_client,
      leafletMap,
      activeLegend,
      selectedDistName,
      selectedAdm1Name,
      selectedAdm2aName,
      highlightLayer,
      currentCountry,
      // allDistricts,
      // column,
      adm1LayerId,
      adm2aLayerId,
    },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState(currentMapID);
  const [distName, setDistName] = useState(selectedDistName);
  const [newDistName, setNewDistName] = useState(false);
  const [adm1Name, setAdm1Name] = useState(selectedAdm1Name);
  const [newAdm1Name, setNewAdm1Name] = useState(false);
  const [adm2aName, setAdm2aName] = useState(selectedAdm2aName);
  const [newAdm2aName, setNewAdm2aName] = useState(false);
  // const [allDistricts, setAllDistricts] = useState([]);
  // const [column, setColumn] = useState("");
  // const column = useRef();
  // const allDistricts = useRef();
  const classes = useStyles();
  const [setMenuTileColor] = useState(false);
  const clickRefMenu = useRef(null);
  const initialSelect = useRef(false);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    if (currentMapID !== mapID) {
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

  // useEffect(() => {
  //   if (adm1Name.length > 0) {
  //     return fetch(
  //       `https://zebra.geodb.host/cached/user/admin/api/v2/sql?q=SELECT ${"name_2"} FROM ${
  //         maps[currentMapID].layers[adm2LayerId].carto_tableName
  //       } WHERE ${"name_1"} IN (${adm1Name
  //         .map((x) => "'" + x + "'")
  //         .toString()})`
  //     )
  //       .then((resp) => resp.json())
  //       .then((response) => {
  //         const result = extractValue(response.rows, "name_2");
  //         allDistricts.current = result;
  //       });
  //   }
  // }, [adm1Name]);

  function filterByAdm1(adm1Name) {
    let query = null;
    if (adm1Name.length > 0) {
      query = `SELECT * FROM ${
        maps[mapID].layers[currentLayerID].carto_tableName
      } WHERE ${"name_1"} IN (${adm1Name
        .map((x) => "'" + x + "'")
        .toString()})`;
    } else {
      query = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
    }
    if (currentCountry[currentLayerID].source && currentLayerID !== "1") {
      currentCountry[currentLayerID].source.setQuery(query);
      currentCountry[currentLayerID].layer.getSource().setQuery(query);
      dispatch({
        type: "layer.queryDist",
        queryDist: query,
      });
    }
  }
  function filterByAdm2(distName) {
    let query = null;
    if (distName.length > 0) {
      query = `SELECT * FROM ${
        maps[mapID].layers[currentLayerID].carto_tableName
      } WHERE ${column} IN (${distName.map((x) => "'" + x + "'").toString()})`;
    } else {
      query = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
    }
    if (currentCountry[currentLayerID].source && currentLayerID !== "1") {
      currentCountry[currentLayerID].source.setQuery(query);
      currentCountry[currentLayerID].layer.getSource().setQuery(query);
      dispatch({
        type: "layer.queryDist",
        queryDist: query,
      });
    }
  }
  function filterByAdm2a(adm2aName) {
    let query = null;
    if (adm2aName.length > 0) {
      var column_name = null;
      if (currentLayerID === "2") {
        column_name = "name_3a";
      } else {
        column_name = "name_3";
      }
      query = `SELECT * FROM ${
        maps[mapID].layers[currentLayerID].carto_tableName
      } WHERE ${column_name} IN (${adm2aName
        .map((x) => "'" + x + "'")
        .toString()})`;
    } else {
      query = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
    }
    if (currentCountry[currentLayerID].source && currentLayerID !== "1") {
      currentCountry[currentLayerID].source.setQuery(query);
      currentCountry[currentLayerID].layer.getSource().setQuery(query);
      dispatch({
        type: "layer.queryDist",
        queryDist: query,
      });
    }
  }

  useMemo(() => {
    if (newAdm1Name === true) {
      if (highlightLayer) {
        leafletMap.removeLayer(highlightLayer);
      }
      if (leafletMap && mapID) {
        if (adm1Name.length > 0) {
          return fetch(
            `https://zebra.geodb.host/cached/user/admin/api/v2/sql?format=GeoJSON&q=SELECT * FROM ${
              maps[mapID].layers["3"].carto_tableName
            } where ${"name_1"} IN (${adm1Name
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
              leafletMap.fitBounds(geojsonLayer.getBounds());
              filterByAdm1(adm1Name);
              geojsonLayer.addTo(leafletMap);
              dispatch({
                type: "dropdown.highlight",
                highlightLayer: geojsonLayer,
              });
              initialSelect.current = true;
            });
        } else if (initialSelect.current === true) {
          filterByAdm1(adm1Name);
          leafletMap.setView(
            [maps[mapID].lat, maps[mapID].long],
            maps[mapID].zoom
          );
        }
      }
    }
    if (newAdm2aName === true) {
      if (highlightLayer) {
        leafletMap.removeLayer(highlightLayer);
      }
      if (leafletMap && mapID) {
        if (adm2aName.length > 0) {
          return fetch(
            `https://zebra.geodb.host/cached/user/admin/api/v2/sql?format=GeoJSON&q=SELECT * FROM ${
              maps[mapID].layers["4"].carto_tableName
            } where ${"name_3"} IN (${adm2aName
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
              leafletMap.fitBounds(geojsonLayer.getBounds());
              filterByAdm2a(adm2aName);
              geojsonLayer.addTo(leafletMap);
              dispatch({
                type: "dropdown.highlight",
                highlightLayer: geojsonLayer,
              });
              initialSelect.current = true;
            });
        } else if (initialSelect.current === true) {
          filterByAdm2a(adm2aName);
          leafletMap.setView(
            [maps[mapID].lat, maps[mapID].long],
            maps[mapID].zoom
          );
        }
      }
    }
    if (newDistName === true) {
      if (highlightLayer) {
        leafletMap.removeLayer(highlightLayer);
      }
      if (leafletMap && mapID) {
        if (distName.length > 0) {
          return fetch(
            `https://zebra.geodb.host/cached/user/admin/api/v2/sql?format=GeoJSON&q=SELECT * FROM ${
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
              leafletMap.fitBounds(geojsonLayer.getBounds());
              filterByAdm2(distName);
              geojsonLayer.addTo(leafletMap);
              dispatch({
                type: "dropdown.highlight",
                highlightLayer: geojsonLayer,
              });
              initialSelect.current = true;
            });
        } else if (initialSelect.current === true) {
          filterByAdm2(distName);
          leafletMap.setView(
            [maps[mapID].lat, maps[mapID].long],
            maps[mapID].zoom
          );
        }
      }
    }
  }, [distName, currentLayerID, adm1Name, adm2aName]);

  useMemo(() => {
    if (distName.length > 0 && mapID) {
      filterByAdm2(distName);
    } else if (adm2aName.length > 0 && mapID) {
      filterByAdm2a(adm2aName);
    } else if (adm1Name.length > 0 && mapID) {
      filterByAdm1(adm1Name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLegend]);

  const handleChangeAdm1 = (event) => {
    // setDistName(event.target.value);
    setAdm1Name((prevAdm1) => {
      if (prevAdm1 && prevAdm1 === event.target.value) {
        setNewAdm1Name(false);
        return prevAdm1;
      } else {
        //user has selected different country
        setNewAdm1Name(true);
        return event.target.value;
      }
    });
    dispatch({
      type: "dropdown.selection.adm1",
      adm1Name: event.target.value,
    });
  };
  const handleChangeAdm2a = (event) => {
    // setDistName(event.target.value);
    setAdm2aName((prevAdm2a) => {
      if (prevAdm2a && prevAdm2a === event.target.value) {
        setNewAdm2aName(false);
        return prevAdm2a;
      } else {
        //user has selected different country
        setNewAdm2aName(true);
        setNewAdm1Name(false);
        return event.target.value;
      }
    });
    dispatch({
      type: "dropdown.selection.adm2a",
      adm2aName: event.target.value,
    });
  };
  const handleChange = (event) => {
    // setDistName(event.target.value);
    setDistName((prevDists) => {
      if (prevDists && prevDists === event.target.value) {
        setNewDistName(false);
        return prevDists;
      } else {
        //user has selected different country
        setNewDistName(true);
        setNewAdm1Name(false);
        return event.target.value;
      }
    });
    dispatch({
      type: "dropdown.selection",
      distName: event.target.value,
    });
  };

  return (
    <Popper
      id={"popperDrop"}
      // tabIndex={-1}
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
      open={true}
      onClose={(e) => {
        setFilterMenuOpen(false);
        // setIsMounted(false);
        setMenuTileColor(false);
      }}
      keepMounted={true}
    >
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={(e) => {
          setFilterMenuOpen(false);
          setSelectedMenu(null);
        }}
      >
        {mapID && (
          <Box p={1} pb={2}>
            {adm1LayerId && (
              <FormControl
                className={clsx(classes.formControl, "tour-dropdown")}
                pl={1}
              >
                <Box pl={1} pb={1}>
                  <InputLabel pl={1} id="select-areas-mutiple-checkbox-label">
                    Select {maps[mapID].layers[adm1LayerId].name}(s)
                  </InputLabel>

                  <Select
                    labelId="select-areas-mutiple-checkbox-label"
                    id="select-areas-mutiple-checkbox"
                    inputProps={{
                      "aria-label": "select-areas-mutiple-checkbox",
                    }}
                    multiple
                    value={adm1Name}
                    onChange={handleChangeAdm1}
                    input={<Input autoFocus tabIndex="-1" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    className={classes.formControl}
                    disabled={
                      distName.length > 0 ||
                      adm2aName.length > 0 ||
                      currentLayerID === "3" ||
                      currentLayerID === adm2aLayerId
                    }
                  >
                    {allAdm1Names.map((name, i) => (
                      <MenuItem key={i} value={name} className={classes.menu}>
                        <Checkbox
                          checked={adm1Name.indexOf(name) > -1}
                          inputProps={{ "aria-label": "area-name-checkbox" }}
                        />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                  <button
                    tabIndex="0"
                    onClick={() => {
                      setAdm1Name([]);
                      dispatch({
                        type: "dropdown.selection.adm1",
                        adm1Name: [],
                      });
                      filterByAdm1([]);
                      setDistName([]);
                      dispatch({
                        type: "dropdown.selection",
                        distName: [],
                      });
                      filterByAdm2([]);
                      setAdm2aName([]);
                      dispatch({
                        type: "dropdown.selection.adm2a",
                        adm2aName: [],
                      });
                      filterByAdm2a([]);
                      leafletMap.setView(
                        [maps[mapID].lat, maps[mapID].long],
                        maps[mapID].zoom
                      );
                      if (highlightLayer) {
                        leafletMap.removeLayer(highlightLayer);
                      }
                    }}
                  >
                    Clear {maps[mapID].layers[adm1LayerId].name}(s)
                  </button>
                </Box>
              </FormControl>
            )}
            {adm2aLayerId && (
              <>
                <Divider variant="middle" />
                <Box
                  pt={1}
                  fontStyle="italic"
                  fontWeight="fontWeightBold"
                  fontSize={13.5}
                  variant="subtitle2"
                  style={{ color: "black" }}
                  key="rightBoxSubtitle"
                >
                  Optionally, select only one of the following subareas:
                </Box>
                <FormControl
                  className={clsx(classes.formControl, "tour-dropdown")}
                  pl={1}
                >
                  <Box pl={1}>
                    <InputLabel pl={1} id="select-areas-mutiple-checkbox-label">
                      Select {maps[mapID].layers[adm2aLayerId].name}(s)
                    </InputLabel>

                    <Select
                      labelId="select-areas-mutiple-checkbox-label"
                      id="select-areas-mutiple-checkbox"
                      inputProps={{
                        "aria-label": "select-areas-mutiple-checkbox",
                      }}
                      multiple
                      value={adm2aName}
                      onChange={handleChangeAdm2a}
                      input={<Input autoFocus tabIndex="-1" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                      className={classes.formControl}
                      disabled={distName.length > 0 || currentLayerID === "3"}
                    >
                      {allAdm2aNames.map((name, i) => (
                        <MenuItem key={i} value={name} className={classes.menu}>
                          <Checkbox
                            checked={adm2aName.indexOf(name) > -1}
                            inputProps={{ "aria-label": "area-name-checkbox" }}
                          />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    <button
                      tabIndex="0"
                      onClick={() => {
                        setAdm2aName([]);
                        dispatch({
                          type: "dropdown.selection.adm2a",
                          adm2aName: [],
                        });
                        filterByAdm2a([]);
                        setDistName([]);
                        dispatch({
                          type: "dropdown.selection",
                          distName: [],
                        });
                        filterByAdm2([]);
                        leafletMap.setView(
                          [maps[mapID].lat, maps[mapID].long],
                          maps[mapID].zoom
                        );
                        if (highlightLayer) {
                          leafletMap.removeLayer(highlightLayer);
                        }
                        setNewAdm1Name(true);
                      }}
                    >
                      Clear {maps[mapID].layers[adm2aLayerId].name}(s)
                    </button>
                  </Box>
                </FormControl>
              </>
            )}
            <FormControl
              className={clsx(classes.formControl, "tour-dropdown")}
              pl={1}
            >
              <Box pl={1}>
                <InputLabel pl={1} id="select-areas-mutiple-checkbox-label">
                  Select {maps[mapID].layers["3"].name}(s)
                </InputLabel>

                <Select
                  labelId="select-areas-mutiple-checkbox-label"
                  id="select-areas-mutiple-checkbox"
                  inputProps={{ "aria-label": "select-areas-mutiple-checkbox" }}
                  multiple
                  value={distName}
                  onChange={handleChange}
                  input={<Input autoFocus tabIndex="-1" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                  className={classes.formControl}
                  disabled={
                    adm2aName.length > 0 ||
                    currentLayerID === adm2aLayerId.toString()
                  }
                >
                  {allDistricts.map((name, i) => (
                    <MenuItem key={i} value={name} className={classes.menu}>
                      <Checkbox
                        checked={distName.indexOf(name) > -1}
                        inputProps={{ "aria-label": "area-name-checkbox" }}
                      />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
                <button
                  tabIndex="0"
                  onClick={() => {
                    setDistName([]);
                    dispatch({
                      type: "dropdown.selection",
                      distName: [],
                    });
                    filterByAdm2([]);
                    leafletMap.setView(
                      [maps[mapID].lat, maps[mapID].long],
                      maps[mapID].zoom
                    );
                    if (highlightLayer) {
                      leafletMap.removeLayer(highlightLayer);
                    }
                    setNewAdm1Name(true);
                  }}
                >
                  Clear {maps[mapID].layers["3"].name}(s)
                </button>
              </Box>
            </FormControl>
          </Box>
        )}
      </ClickAwayListener>
    </Popper>
  );
};
