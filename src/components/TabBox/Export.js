import React, { useMemo } from "react";
import { MapContext } from "../../state/MapState";
import { useState, useContext, useEffect } from "react";
import { Box, Divider } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
import { Loader_2, Loader2_2 } from "../subcomponents/Loader_2";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
// const useStyles = makeStyles((theme) => ({
//   button: {
//     margin: theme.spacing(1),
//   },
//   loader: {
//     width: "100%",
//     height: "100%",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     zIndex: "2",
//   },
// }));

export const Export = () => {
  const [
    {
      maps,
      currentMapID,
      currentLayerID,
      showSettlements,
      currentCountry,
      selectedDistName,
      userData,
    },
  ] = useContext(MapContext);
  const [download, setDownload] = useState(null);
  const [queryDesc, setQueryDesc] = useState(null);
  const [downloadSettlements, setDownloadSettlements] = useState(null);
  const [downloadUpload, setDownloadUpload] = useState(null);
  const [mapID, setMapID] = useState(currentMapID);
  const [loader, showLoader, hideLoader] = Loader_2();
  const [loader2, showLoader2, hideLoader2] = Loader2_2();
  const columnNames = [];
  const layerQuery = currentCountry[currentLayerID].query;

  useMemo(() => {
    currentCountry[currentLayerID].filters.map((filter) => {
      columnNames.push(filter.column_name);
      return columnNames;
    });
  }, [currentLayerID]);

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
    } else if (layerQuery && mapID && columnNames) {
      // let query = layerQuery.substring(8);
      // let queryURL = query.replace(/\s/g, " ");
      let queryURL = layerQuery.replace(/\s/g, " ");
      var conditions = [];
      if (selectedDistName.length > 0) {
        conditions.push(`[within ${selectedDistName}]`);
      }
      currentCountry[currentLayerID].filters.forEach((filter) => {
        if (filter.type === "range") {
          if (
            filter.min !== filter.value[0] ||
            filter.max !== filter.value[1]
          ) {
            conditions.push(
              ` [${filter.name} greater than or equal to ${filter.value[0]} and less than or equal to ${filter.value[1]}]`
            );
          }
        } else if (filter.type === "range_non_linear") {
          if (
            filter.scaledMin !== filter.scaledValue[0] ||
            filter.scaledMax !== filter.scaledValue[1]
          ) {
            conditions.push(
              ` [${filter.name} greater than or equal to ${filter.scaledValue[0]} and less than or equal to ${filter.scaledValue[1]}]`
            );
          }
        } else if (filter.type === "categorical") {
          if (
            filter.value[0].checked === false ||
            filter.value[1].checked === false ||
            filter.value[2].checked === false ||
            filter.value[3].checked === false
          ) {
            conditions.push(
              ` [${filter.name} includes ${
                filter.value[0].checked === true
                  ? filter.value[0].name + ","
                  : ""
              } ${
                filter.value[1].checked === true
                  ? filter.value[1].name + ","
                  : ""
              } ${
                filter.value[2].checked === true
                  ? filter.value[2].name + ","
                  : ""
              } ${
                filter.value[3].checked === true ? filter.value[3].name : ""
              }]`
            );
          }
        }
      });
      setQueryDesc([
        {
          Description: `This data export was created via the SanPlan tool (www.sanplan.app). This data is pulled from ${maps[mapID].name} with the following ${maps[mapID].layers[currentLayerID].name} filter constraints: ${conditions}`,
        },
        {
          Description: `The column "the_geom" column contains ${maps[mapID].layers[currentLayerID].name} geometry in well-known binary (WKB) format.`,
        },
      ]);
      return fetch(
        // `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ST_AsText(the_geom) as geometry, ${columnNames}${queryURL}`
        `https://zebra.geodb.host/user/admin/api/v2/sql?q=${queryURL}`
      )
        .then((resp) => resp.json())
        .then((response) => {
          for (var i = 0; i < response.rows.length; i++) {
            if (response.rows[i].classes !== undefined) {
              if (response.rows[i].classes === 1) {
                response.rows[i].classes = "Rural Remote";
              } else if (response.rows[i].classes === 2) {
                response.rows[i].classes = "Rural On-road";
              } else if (response.rows[i].classes === 3) {
                response.rows[i].classes = "Rural Mixed";
              } else if (response.rows[i].classes === 4) {
                response.rows[i].classes = "Urban";
              }
            }
            // eslint-disable-next-line no-loop-func
            Object.keys(response.rows[i]).forEach((k) => {
              response.rows[i][k] = "" + response.rows[i][k];
            });
          }

          setDownload(response.rows);
          hideLoader();
        });
    } else if (mapID && columnNames) {
      //   let queryURL = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
      setQueryDesc([
        {
          Description: `This data export was created via the SanPlan tool (www.sanplan.app). This data is pulled from ${maps[mapID].name} with no ${maps[mapID].layers[currentLayerID].name} filter constraints.`,
        },
        {
          Description: `The column "the_geom" column contains ${maps[mapID].layers[currentLayerID].name} geometry in well-known binary (WKB) format.`,
        },
      ]);
      return fetch(
        `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`
      )
        .then((resp) => resp.json())
        .then((response) => {
          for (var i = 0; i < response.rows.length; i++) {
            if (response.rows[i].classes !== undefined) {
              if (response.rows[i].classes === 1) {
                response.rows[i].classes = "Rural Remote";
              } else if (response.rows[i].classes === 2) {
                response.rows[i].classes = "Rural On-road";
              } else if (response.rows[i].classes === 3) {
                response.rows[i].classes = "Rural Mixed";
              } else if (response.rows[i].classes === 4) {
                response.rows[i].classes = "Urban";
              }
            }
            // eslint-disable-next-line no-loop-func
            Object.keys(response.rows[i]).forEach((k) => {
              response.rows[i][k] = "" + response.rows[i][k];
            });
          }
          setDownload(response.rows);
          hideLoader();
        });
    }
  }, [mapID, layerQuery]);

  useEffect(() => {
    if (showSettlements === true) {
      showLoader2();
      if (layerQuery && mapID) {
        let queryURL = layerQuery.replace(/\s/g, " ");
        return fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS foo, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(foo.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
        )
          .then((resp) => resp.json())
          .then((response) => {
            for (var i = 0; i < response.rows.length; i++) {
              if (response.rows[i].classes !== undefined) {
                if (response.rows[i].classes === 1) {
                  response.rows[i].classes = "Rural Remote";
                } else if (response.rows[i].classes === 2) {
                  response.rows[i].classes = "Rural On-road";
                } else if (response.rows[i].classes === 3) {
                  response.rows[i].classes = "Rural Mixed";
                } else if (response.rows[i].classes === 4) {
                  response.rows[i].classes = "Urban";
                }
              }
              // eslint-disable-next-line no-loop-func
              Object.keys(response.rows[i]).forEach((k) => {
                response.rows[i][k] = "" + response.rows[i][k];
              });
            }
            setDownloadSettlements(response.rows);
            hideLoader2();
          });
      } else if (mapID && columnNames) {
        return fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers["4"].carto_tableName}`
        )
          .then((resp) => resp.json())
          .then((response) => {
            for (var i = 0; i < response.rows.length; i++) {
              if (response.rows[i].classes !== undefined) {
                if (response.rows[i].classes === 1) {
                  response.rows[i].classes = "Rural Remote";
                } else if (response.rows[i].classes === 2) {
                  response.rows[i].classes = "Rural On-road";
                } else if (response.rows[i].classes === 3) {
                  response.rows[i].classes = "Rural Mixed";
                } else if (response.rows[i].classes === 4) {
                  response.rows[i].classes = "Urban";
                }
              }
              // eslint-disable-next-line no-loop-func
              Object.keys(response.rows[i]).forEach((k) => {
                response.rows[i][k] = "" + response.rows[i][k];
              });
            }
            setDownloadSettlements(response.rows);
            hideLoader2();
          });
      }
    }
  }, [layerQuery, showSettlements]);

  useEffect(() => {
    if (userData && mapID && columnNames) {
      showLoader2();
      var uploadArray = [];
      for (var i = 0; i < userData.length; i++) {
        fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName} WHERE ST_Intersects(ST_SetSRID(ST_Point(${userData[i].Longitude}, ${userData[i].Latitude}), 4326), ${maps[mapID].layers[currentLayerID].carto_tableName}.the_geom)`
        )
          .then((resp) => resp.json())
          .then((response) => {
            // for (var i = 0; i < response.rows.length; i++) {
            if (response.rows[0].classes !== undefined) {
              if (response.rows[0].classes === 1) {
                response.rows[0].classes = "Rural Remote";
              } else if (response.rows[0].classes === 2) {
                response.rows[0].classes = "Rural On-road";
              } else if (response.rows[0].classes === 3) {
                response.rows[0].classes = "Rural Mixed";
              } else if (response.rows[0].classes === 4) {
                response.rows[0].classes = "Urban";
              }
              // }
              // eslint-disable-next-line no-loop-func
              Object.keys(response.rows[0]).forEach((k) => {
                response.rows[0][k] = "" + response.rows[0][k];
              });
            }
            uploadArray.push(response.rows[0]);
            // setDownloadUpload((oldArray) => [...oldArray, response.rows]);
            setDownloadUpload(uploadArray);
            hideLoader2();
          });
      }
      // setDownloadUpload(uploadArray);
    }
  }, []);

  const label = (code) => {
    var lab = null;
    currentCountry[currentLayerID].filters.map((filter) => {
      if (filter.column_name === code) {
        lab = filter.name;
      }
      return lab;
    });
    return lab;
  };

  return (
    <React.Fragment>
      {downloadSettlements ? (
        <div align="center">{loader2}</div>
      ) : (
        <div align="center">{loader}</div>
      )}
      <React.Fragment>
        {currentLayerID === "1" ? (
          <React.Fragment>
            Data downloads are not available for this layer, please select a
            larger resolution from "Map Resolutions".{" "}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {download && downloadSettlements && downloadUpload === null ? (
              <React.Fragment>
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
                  filtering. Use the "Map Resolutions" tab to select the
                  resolution of the regions to download. Large datasets may take
                  longer to download.
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
                    {maps[currentMapID].layers[
                      currentLayerID
                    ].name.toLowerCase() + "s"}
                  </Box>{" "}
                  and{" "}
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
                <ExcelFile element={<button autoFocus>Download Data</button>}>
                  <ExcelSheet data={queryDesc} name="Notes">
                    <ExcelColumn
                      label="Data Export Notes"
                      value="Description"
                    />
                  </ExcelSheet>
                  <ExcelSheet data={download} name="Boundary Query Data">
                    {Object.keys(download[0]).map((col) => {
                      return (
                        <ExcelColumn
                          label={label(col) !== null ? label(col) : col}
                          value={col}
                          key={col}
                        />
                      );
                    })}
                  </ExcelSheet>
                  <ExcelSheet
                    data={downloadSettlements}
                    name="Settlement Query Data"
                  >
                    {Object.keys(downloadSettlements[0]).map((col) => {
                      return (
                        <ExcelColumn
                          label={label(col) !== null ? label(col) : col}
                          value={col}
                          key={col}
                        />
                      );
                    })}
                  </ExcelSheet>
                </ExcelFile>
              </React.Fragment>
            ) : download && downloadSettlements === null ? (
              <React.Fragment>
                <Box
                  p={1}
                  fontStyle="italic"
                  fontWeight="fontWeightBold"
                  fontSize={13.5}
                  variant="subtitle2"
                  style={{ color: "black" }}
                  key="rightBoxSubtitle2"
                >
                  Export a CSV file of mapped data.
                </Box>
                <Box style={{ fontSize: 12 }} pl={1} pb={1}>
                  The downloaded file will represent the regions remaining after
                  filtering. Use the "Map Resolutions" tab to select the
                  resolution of the regions to download. Large datasets may take
                  longer to download.
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
                    {maps[currentMapID].layers[
                      currentLayerID
                    ].name.toLowerCase() + "s"}
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
                <ExcelFile element={<button autoFocus>Download Data</button>}>
                  <ExcelSheet data={queryDesc} name="Notes">
                    <ExcelColumn
                      label="Data Export Notes"
                      value="Description"
                    />
                  </ExcelSheet>
                  <ExcelSheet data={download} name="Boundary Query Data">
                    {Object.keys(download[0]).map((col) => {
                      return (
                        <ExcelColumn
                          label={label(col) !== null ? label(col) : col}
                          value={col}
                          key={col}
                        />
                      );
                    })}
                  </ExcelSheet>
                </ExcelFile>
              </React.Fragment>
            ) : null}
            {downloadUpload !== null && (
              <React.Fragment>
                <Divider />
                <Box
                  p={1}
                  fontStyle="italic"
                  fontWeight="fontWeightBold"
                  fontSize={13.5}
                  variant="subtitle2"
                  style={{ color: "black" }}
                  key="rightBoxSubtitle3"
                >
                  Export a CSV file of data for your uploaded locations.
                </Box>
                <Box style={{ fontSize: 12 }} pl={1} pb={1}>
                  Download data for{" "}
                  <Box
                    component="span"
                    fontWeight="fontWeightMedium"
                    fontSize={16}
                    color="#BA0C2F"
                  >
                    {/* {downloadUpload.length} uploaded locations */}
                    all uploaded locations
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
                <ExcelFile element={<button>Download Data</button>}>
                  <ExcelSheet
                    data={downloadUpload}
                    name="Data at Uploaded Points"
                  >
                    {Object.keys(downloadUpload[0]).map((col) => {
                      return (
                        <ExcelColumn
                          label={label(col) !== null ? label(col) : col}
                          value={col}
                          key={col}
                        />
                      );
                    })}
                  </ExcelSheet>
                  {/* <ExcelSheet data={queryDesc} name="Notes">
                    <ExcelColumn
                      label="Data Export Notes"
                      value="Description"
                    />
                  </ExcelSheet> */}
                </ExcelFile>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    </React.Fragment>
  );
};
