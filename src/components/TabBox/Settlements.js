import { MapContext } from "../../state/MapState";
import { useState, useContext, useEffect } from "react";
import L from "leaflet";
import Carto from "@carto/carto.js";

// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
//   button: {
//     margin: theme.spacing(1),
//   },
// }));

export const Settlements = () => {
  const [{ maps, currentMapID, currentLayerID, query, leafletMap }, dispatch] =
    useContext(MapContext);
  // const classes = useStyles();
  const [geoms, setGeoms] = useState(null);
  const [mapID, setMapID] = useState(currentMapID);

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

  useEffect(() => {
    if (mapID) {
      let queryURL = null;
      if (query) {
        var clause = query.substr(query.indexOf("WHERE"), query.length);
        queryURL =
          `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}` +
          clause;
        // maps[mapID].layers["4"].carto_source.setQuery(
        //   `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
        // );
        // query.replace(/\s/g, " ");
        // queryURL2 = encodeURIComponent(queryURL2);

        // queryURL = `SELECT the_geom FROM ${queryURL2}`;
      } else {
        queryURL = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
        // maps[mapID].layers["4"].carto_source.setQuery(
        //   `SELECT * FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom)`
        // );
      }
      var _source = new Carto.source.SQL(
        `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
      );
      const _style = new Carto.style.CartoCSS(
        `#layer::outline {line-width: 1; line-color: #000000; line-opacity: 1;}`
      );
      const settlementBoundaryset = new Carto.layer.Layer(_source, _style, {});

      dispatch({
        type: "settlement.boundary",
        settlementBoundary: settlementBoundaryset,
      });

      // return fetch(
      //   // `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT the_geom FROM (SELECT * FROM gha_multivariable_pixel) as originalQuery WHERE (classes IN (2,3,4) AND (pop >= 0 AND pop <= 442720) AND (od >= 0 AND od <= 99) AND (s_unimp >= 0 AND s_unimp <= 90) AND (w_unimp >= 0 AND w_unimp <= 73) AND (timecities >= 0 AND timecities <= 592) AND (dr >= 0.1 AND dr <= 37.8) AND (dt >= 0 AND dt <= 76.2) AND (dia >= 2.4 AND dia <= 6.5) AND (cholera >= 0 AND cholera <= 6410.7) AND (u5m >= 4.4 AND u5m <= 13.3) AND (edu_w >= 2 AND edu_w <= 10) AND (edu_m >= 3 AND edu_m <= 11))`
      //   // `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT gha_multivariable_comms.*, geoms=(SELECT the_geom FROM (SELECT * FROM gha_multivariable_pixel) as originalQuery WHERE (classes IN (2,3,4) AND (pop >= 0 AND pop <= 442720) AND (od >= 0 AND od <= 99) AND (s_unimp >= 0 AND s_unimp <= 90) AND (w_unimp >= 0 AND w_unimp <= 73) AND (timecities >= 0 AND timecities <= 592) AND (dr >= 0.1 AND dr <= 37.8) AND (dt >= 0 AND dt <= 76.2) AND (dia >= 2.4 AND dia <= 6.5) AND (cholera >= 0 AND cholera <= 6410.7) AND (u5m >= 4.4 AND u5m <= 13.3) AND (edu_w >= 2 AND edu_w <= 10) AND (edu_m >= 3 AND edu_m <= 11))) FROM gha_multivariable_comms WHERE ST_Intersects(gha_multivariable_comms.the_geom, geoms)`//   gha_multivariable_pixel.the_geom, // WHERE ST_Intersects( // FROM gha_multivariable_pixel, gha_multivariable_comms // COUNT(gha_multivariable_comms.cartodb_id) //   gha_multivariable_pixel.cartodb_id, // `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT
      //   //   gha_multivariable_comms.the_geom)
      //   // GROUP BY gha_multivariable_pixel.cartodb_id`
      //   `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
      // )
      //   .then((resp) => resp.json())
      //   .then((response) => {
      //     var myStyle = {
      //       color: "#000000",
      //       fillColor: "#FFFFFF",
      //       fillOpacity: 0,
      //       weight: 1,
      //     };
      //     let result = L.geoJson(
      //       JSON.parse(response.rows[0].the_geom),
      //       myStyle
      //     );
      //     // highlightLayer.current = result;
      //     result.addTo(leafletMap.current);
      //   });
    }
  }, [query]);
  //   useEffect(() => {
  //     if (geoms) {
  //       let queryURL = null;
  //       if (query) {
  //         let queryURL2 = query.replace(/\s/g, " ");
  //         queryURL2 = encodeURIComponent(queryURL2);

  //         queryURL = `SELECT the_geom FROM ${queryURL2}`;
  //       } else {
  //         queryURL = `SELECT the_geom FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
  //       }
  //       return fetch(
  //         // `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT the_geom FROM (SELECT * FROM gha_multivariable_pixel) as originalQuery WHERE (classes IN (2,3,4) AND (pop >= 0 AND pop <= 442720) AND (od >= 0 AND od <= 99) AND (s_unimp >= 0 AND s_unimp <= 90) AND (w_unimp >= 0 AND w_unimp <= 73) AND (timecities >= 0 AND timecities <= 592) AND (dr >= 0.1 AND dr <= 37.8) AND (dt >= 0 AND dt <= 76.2) AND (dia >= 2.4 AND dia <= 6.5) AND (cholera >= 0 AND cholera <= 6410.7) AND (u5m >= 4.4 AND u5m <= 13.3) AND (edu_w >= 2 AND edu_w <= 10) AND (edu_m >= 3 AND edu_m <= 11))`
  //         `https://zebra.geodb.host/user/admin/api/v2/sql?q=
  //         SELECT gha_multivariable_comms.*
  //         FROM gha_multivariable_comms
  //         WHERE ST_Intersects(gha_multivariable_comms.the_geom, ${geoms})`
  //       )
  //         .then((resp) => resp.json())
  //         .then((response) => {
  //           console.log(response.rows);
  //         });
  //     }
  //   }, [geoms]);

  return "Hi";
};
