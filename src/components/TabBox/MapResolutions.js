import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Box } from "@material-ui/core";
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

export const MapResolutions = () => {
  const [
    { maps, currentMapID, activeLayer, carto_client, leafletMap },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState(currentMapID);
  // const [activeLayer, setActiveLayer] = useState("2");
  const [distName, setDistName] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [column, setColumn] = useState("");
  const classes = useStyles();
  const highlightDist = useRef();

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
      setDistName([]);
      // setActiveLayer(maps[currentMapID].currentLayer);
    }
  }, [currentMapID, mapID]);

  const toggleLayerVisibility = (activeLayer) => {
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      layerID: activeLayer,
    });
  };

  useMemo(() => {
    if (carto_client && mapID) {
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
        });
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
    // function highlightCountry(district) {
    //   // district.forEach((district) => {
    //   let cartoCSS = `
    //     #layer {
    //       polygon-fill: 'transparent';
    //       polygon-opacity: 1;
    //       ::outline {
    //         line-width: 1;
    //         line-color: #000000;
    //         line-opacity: 0.5;
    //       }
    //     } `;
    //   if (district) {
    //     // cartoCSS = `
    //     //   ${cartoCSS}
    //     //   #layer[!district.includes('${district}')] {
    //     //     polygon-fill: #808080;
    //     //     polygon-opacity: .75;
    //     //   }
    //     // `;
    //     cartoCSS = `
    //         ${cartoCSS}
    //         #layer[district!='${district}'] {
    //           polygon-fill: #808080;
    //           polygon-opacity: .75;
    //         }
    //       `;
    //   }
    //   const districtsStyle = new Carto.style.CartoCSS(
    //     maps[mapID].layers["3"].carto_style
    //   );
    //   districtsStyle.setContent(cartoCSS);
    // }
    // if (maps[mapID].layers["3"].carto_source) {

    // }

    if (highlightDist.current) {
      carto_client.removeLayer(highlightDist.current);
    }

    if (leafletMap && mapID) {
      // const _source = new Carto.source.SQL(
      //   `SELECT * FROM ${maps[mapID].layers["3"].carto_tableName}`
      // );
      // const countriesDataview = new Carto.dataview.Category(_source, "name_2", {
      //   limit: 216,
      // });
      // carto_client.addDataview(countriesDataview);
      if (distName.length > 0) {
        var source = new Carto.source.SQL(
          `SELECT * FROM ${
            maps[mapID].layers["3"].carto_tableName
          } where ${column} IN (${distName
            .map((x) => "'" + x + "'")
            .toString()})`
        );
        let style = new Carto.style.CartoCSS(
          `#layer::outline {
            line-width: 2;
            line-color: #FFFFFF;
            line-opacity: 1;
          }`
        );
        var highlight_dist = new Carto.layer.Layer(source, style);
        highlightDist.current = highlight_dist;
        carto_client.addLayer(highlight_dist);
        return fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?format=GeoJSON&q=SELECT * FROM ${
            maps[mapID].layers["3"].carto_tableName
          } where ${column} IN (${distName
            .map((x) => "'" + x + "'")
            .toString()})`
        )
          .then((resp) => resp.json())
          .then((response) => {
            let geojsonLayer = L.geoJSON(response);
            leafletMap.fitBounds(geojsonLayer.getBounds());
            filterPopulatedPlacesByCountry(distName);
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

  const handleChange = (event) => {
    setDistName(event.target.value);
  };

  return (
    <div style={{ height: "200px", overflow: "auto" }}>
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
              aria-label="scale"
              name="scaleSelector"
              value={activeLayer}
              onChange={(e) => {
                setDistName([]);
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
                label={maps[mapID].layers["3"].name}
                classes={{
                  label: classes.checkboxLabel,
                }}
                key="radio3"
              />
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
        Optionally, select specific region(s) to explore:
      </Box>
      <FormControl className={classes.formControl} pl={1}>
        {mapID && (
          <Box pl={1}>
            <InputLabel pl={1} id="demo-mutiple-checkbox-label">
              Select {maps[mapID].layers["3"].name}
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
          </Box>
        )}
      </FormControl>
    </div>
  );
};
