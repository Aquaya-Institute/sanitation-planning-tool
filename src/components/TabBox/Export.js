import { MapContext } from "../../state/MapState";
import { useState, useContext, useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import { CSVLink } from "react-csv";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import { Loader_2, Loader2_2 } from "../subcomponents/Loader_2";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  loader: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: "2",
  },
}));

export const Export = () => {
  const [
    { maps, currentMapID, currentLayerID, query, showSettlements },
    dispatch,
  ] = useContext(MapContext);
  const classes = useStyles();
  const [download, setDownload] = useState(null);
  const [downloadSettlements, setDownloadSettlements] = useState(null);
  const [mapID, setMapID] = useState(currentMapID);
  const [loader, showLoader, hideLoader] = Loader_2();
  const [loader2, showLoader2, hideLoader2] = Loader2_2();

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

  useEffect(() => {
    showLoader();
    if (currentLayerID === "1") {
      setDownload(null);
      hideLoader();
    } else if (query && mapID) {
      let queryURL = query.replace(/\s/g, " ");
      return fetch(
        `https://zebra.geodb.host/user/admin/api/v2/sql?q=${queryURL}`
      )
        .then((resp) => resp.json())
        .then((response) => {
          setDownload(response.rows);
          hideLoader();
        });
    } else if (mapID) {
      //   let queryURL = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
      return fetch(
        `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`
      )
        .then((resp) => resp.json())
        .then((response) => {
          setDownload(response.rows);
          hideLoader();
        });
    }
  }, [mapID, query]);

  useEffect(() => {
    if (showSettlements === true) {
      showLoader2();
      if (query && mapID) {
        let queryURL = query.replace(/\s/g, " ");
        return fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS foo, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(foo.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
        )
          .then((resp) => resp.json())
          .then((response) => {
            setDownloadSettlements(response.rows);
            hideLoader2();
          });
      } else if (mapID) {
        return fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers["4"].carto_tableName}`
        )
          .then((resp) => resp.json())
          .then((response) => {
            setDownloadSettlements(response.rows);
            hideLoader2();
          });
      }
    }
  }, [query, showSettlements]);

  // useEffect(() => {
  //   if (download) {
  //     var dat = [];
  //     maps[mapID].layers[currentLayerID].filters.forEach(function (element) {
  //       dat.push([
  //         element.column_name,
  //         element.name,
  //         element.subcategory,
  //         element.unit,
  //       ]);
  //     });
  //     dat.sort();
  //     // var dat_loc = [];
  //     // if (popup[1].data.classes !== undefined) {
  //     //   if (popup[1].data.classes === 1) {
  //     //     popup[1].data.classes = "Rural Remote";
  //     //   } else if (popup[1].data.classes === 2) {
  //     //     popup[1].data.classes = "Rural On-road";
  //     //   } else if (popup[1].data.classes === 3) {
  //     //     popup[1].data.classes = "Rural Mixed";
  //     //   } else if (popup[1].data.classes === 4) {
  //     //     popup[1].data.classes = "Urban";
  //     //   }
  //     // }
  //     // Object.entries(download[1].data)
  //     //   .slice(1)
  //     //   .map((keyName) => {
  //     //     return dat_loc.push([keyName[0], keyName[1]]);
  //     //   });
  //     // dat_loc.sort();

  //     for (let i = 0; i < download.length; i++) {
  //       Object.keys(download[i]).map((key) => {
  //         for (let j = 0; j < dat.length; j++) {
  //           if (key === dat[j][0]) {
  //             key = dat[j][1] + " (" + dat[j][3] + ")";
  //             // break
  //           }
  //         }
  //       });
  //     }
  //     console.log(download);

  //     // const download_rename = download.map(({
  //     //   cholera: Cholera,
  //     //   ...rest
  //     // }) => ({
  //     //   Cholera,
  //     //   ...rest
  //     // }));
  //   }
  // }, [download]);

  return (
    <div>
      <div align="center">{loader}</div>
      <div>
        {currentLayerID === "1" && (
          <div>
            Data downloads are not available for this layer, please select a
            larger resolution from "Map Resolutions".{" "}
          </div>
        )}
        {download && (
          <>
            <Box
              p={1}
              fontStyle="italic"
              fontWeight="fontWeightBold"
              fontSize={13.5}
              variant="subtitle2"
              style={{ color: "black" }}
              key="rightBoxSubtitle"
            >
              Export a CSV file of mapped data.
            </Box>
            <Box style={{ fontSize: 12 }} pl={1} pb={1}>
              The downloaded file will represent the regions remaining after
              filtering. Use the "Map Resolutions" tab to select the resolution
              of the regions to download.
            </Box>
            <Box style={{ fontSize: 12 }} pl={1} pb={1}>
              Download data for{" "}
              <Box
                component="span"
                fontWeight="fontWeightMedium"
                fontSize={16}
                color="#BA0C2F"
              >
                {download.length}{" "}
                {maps[currentMapID].layers[currentLayerID].name.toLowerCase() +
                  "s"}
              </Box>{" "}
              in{" "}
              <Box
                component="span"
                fontWeight="fontWeightMedium"
                fontSize={16}
                color="#BA0C2F"
              >
                {maps[currentMapID].name}
              </Box>
              .
            </Box>
            {/* <ExcelFile element={<button>Download Data</button>}>
              <ExcelSheet data={download} name="Employees">
                <ExcelColumn label="geometry" value="the_geom" />
                {download[0]["name_1"] && (
                  <ExcelColumn label="Region" value="name_1" />
                )}
                {download[0]["name_2"] && (
                  <ExcelColumn label="District" value="name_2" />
                )}
                {download[0]["cholera"] && (
                  <ExcelColumn
                    label="Predicted Annual Cholera Incidence (cases/100,000pp)"
                    value="cholera"
                  />
                )}
                {download[0]["dia"] && (
                  <ExcelColumn
                    label="Diahrrea Prevalence in Children <5 Years (%)"
                    value="dia"
                  />
                )}
                {download[0]["dr"] && (
                  <ExcelColumn label="Distance to Roads (km.)" value="dr" />
                )}
                {download[0]["dt"] && (
                  <ExcelColumn label="Distance to Towns (km.)" value="dt" />
                )}
                {download[0]["edu_m"] && (
                  <ExcelColumn
                    label="Men's Educational Attainment (yrs.)"
                    value="edu_m"
                  />
                )}
                {download[0]["edu_w"] && (
                  <ExcelColumn
                    label="Women's Educational Attainment (yrs.)"
                    value="edu_w"
                  />
                )}
                {download[0]["od"] && (
                  <ExcelColumn
                    label="Population Practicing Open Defecation (yrs.)"
                    value="od"
                  />
                )}
                {download[0]["pop"] && (
                  <ExcelColumn
                    label="Population Estimate (people)"
                    value="pop"
                  />
                )}
                {download[0]["classes"] && (
                  <ExcelColumn label="Rural Typology" value="classes" />
                )}
                {download[0]["rm"] && (
                  <ExcelColumn label="Rural Mixed (%)" value="rm" />
                )}
                {download[0]["rrd"] && (
                  <ExcelColumn label="Rural On-road (%)" value="rrd" />
                )}
                {download[0]["rr"] && (
                  <ExcelColumn label="Rural Remote (%)" value="rr" />
                )}
                {download[0]["u"] && (
                <ExcelColumn label="Urban (%)" value="u" />
                )}
                {download[0]["s_unimp"] && (
                  <ExcelColumn
                    label="Reliance on Unimproved Sanitation (%)"
                    value="s_unimp"
                  />
                )}
                {download[0]["w_unimp"] && (
                  <ExcelColumn
                    label="Reliance on Unimproved Drinking Water (%)"
                    value="w_unimp"
                  />
                )}
                {download[0]["timecities"] && (
                  <ExcelColumn
                    label="Travel Time to Cities (hr.)"
                    value="timecities"
                  />
                )}
                {download[0]["u5m"] && (
                  <ExcelColumn
                    label="Mortality in Children <5 Years (%)"
                    value="u5m"
                  />
                )}
              </ExcelSheet>
            </ExcelFile> */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<SaveIcon />}
            >
              <CSVLink
                data={download}
                filename={"SPT_Data_Download.csv"}
                style={{ fontSize: 11, color: "#FFFFFF" }}
              >
                DOWNLOAD DATA TABLE
              </CSVLink>
            </Button>
          </>
        )}
        {downloadSettlements && (
          <>
            <Box style={{ fontSize: 12 }} pl={1} pb={1}>
              Download data for{" "}
              <Box
                component="span"
                fontWeight="fontWeightMedium"
                fontSize={16}
                color="#BA0C2F"
              >
                {downloadSettlements.length} estimated settlement areas
              </Box>{" "}
              in{" "}
              <Box
                component="span"
                fontWeight="fontWeightMedium"
                fontSize={16}
                color="#BA0C2F"
              >
                {maps[currentMapID].name}
              </Box>
              .
            </Box>
            {/* <ExcelFile element={<button>Download Settlement Data</button>}>
              <ExcelSheet data={downloadSettlements} name="Employees">
                <ExcelColumn label="geometry" value="the_geom" />
                {downloadSettlements[0]["name_1"] && (
                  <ExcelColumn label="Region" value="name_1" />
                )}
                {downloadSettlements[0]["name_2"] && (
                  <ExcelColumn label="District" value="name_2" />
                )}
                {downloadSettlements[0]["dr"] && (
                  <ExcelColumn label="Distance to Roads (km.)" value="dr" />
                )}
                {downloadSettlements[0]["dt"] && (
                  <ExcelColumn label="Distance to Towns (km.)" value="dt" />
                )}
                {downloadSettlements[0]["pop"] && (
                  <ExcelColumn
                    label="Population Estimate (people)"
                    value="pop"
                  />
                )}
                {downloadSettlements[0]["classes"] && (
                  <ExcelColumn label="Rural Typology" value="classes" />
                )}
                {downloadSettlements[0]["rm"] && (
                  <ExcelColumn label="Rural Mixed (%)" value="rm" />
                )}
                {downloadSettlements[0]["rrd"] && (
                  <ExcelColumn label="Rural On-road (%)" value="rrd" />
                )}
                {downloadSettlements[0]["rr"] && (
                  <ExcelColumn label="Rural Remote (%)" value="rr" />
                )}
                {downloadSettlements[0]["u"] && (
                  <ExcelColumn label="Urban (%)" value="u" />
                )}
                {downloadSettlements[0]["timecities"] && (
                  <ExcelColumn
                    label="Travel Time to Cities (hr.)"
                    value="timecities"
                  />
                )}
              </ExcelSheet>
            </ExcelFile> */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<SaveIcon />}
            >
              <CSVLink
                data={downloadSettlements}
                filename={"SPT_Settlements_Data_Download.csv"}
                style={{ fontSize: 11, color: "#FFFFFF" }}
              >
                DOWNLOAD SETTLEMENTS DATA
              </CSVLink>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
