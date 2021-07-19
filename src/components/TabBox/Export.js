import React, { useMemo } from "react";
import { MapContext } from "../../state/MapState";
import { useState, useContext, useEffect } from "react";
import { Box, Divider } from "@material-ui/core";
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

  useMemo(() => {
    currentCountry[currentLayerID].filters.map((filter) => {
      columnNames.push(filter.column_name);
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
    } else if (currentCountry[currentLayerID].query && mapID && columnNames) {
      // let query = currentCountry[currentLayerID].query.substring(8);
      // let queryURL = query.replace(/\s/g, " ");
      let queryURL = currentCountry[currentLayerID].query.replace(/\s/g, " ");
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
  }, [mapID, currentCountry[currentLayerID].query]);

  useEffect(() => {
    if (showSettlements === true) {
      showLoader2();
      if (currentCountry[currentLayerID].query && mapID) {
        let queryURL = currentCountry[currentLayerID].query.replace(/\s/g, " ");
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
  }, [currentCountry[currentLayerID].query, showSettlements]);

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
        // break;
      }
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
                <ExcelFile element={<button>Download Data</button>}>
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
                <ExcelFile element={<button>Download Data</button>}>
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

// import { MapContext } from "../../state/MapState";
// import { useState, useContext, useEffect } from "react";
// import { Box } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import { Loader_2, Loader2_2 } from "../subcomponents/Loader_2";
// import ReactExport from "react-export-excel";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
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

// export const Export = () => {
//   const [
//     {
//       maps,
//       currentMapID,
//       currentLayerID,
//       showSettlements,
//       currentCountry,
//       selectedDistName,
//     },
//   ] = useContext(MapContext);
//   const [download, setDownload] = useState(null);
//   const [queryDesc, setQueryDesc] = useState(null);
//   const [downloadSettlements, setDownloadSettlements] = useState(null);
//   const [mapID, setMapID] = useState(currentMapID);
//   const [loader, showLoader, hideLoader] = Loader_2();
//   const [loader2, showLoader2, hideLoader2] = Loader2_2();

//   useEffect(() => {
//     if (currentMapID !== mapID) {
//       console.log(currentMapID);
//       setMapID(currentMapID);
//     }
//   }, [currentMapID, mapID]);

//   useEffect(() => {
//     showLoader();
//     if (currentLayerID === "1") {
//       setDownload(null);
//       hideLoader();
//     } else if (currentCountry[currentLayerID].query && mapID) {
//       let queryURL = currentCountry[currentLayerID].query.replace(/\s/g, " ");
//       var conditions = [];
//       if (selectedDistName.length > 0) {
//         conditions.push(`[within ${selectedDistName}]`);
//       }
//       currentCountry[currentLayerID].filters.forEach((filter) => {
//         if (filter.type === "range") {
//           if (
//             filter.min !== filter.value[0] ||
//             filter.max !== filter.value[1]
//           ) {
//             conditions.push(
//               ` [${filter.name} greater than or equal to ${filter.value[0]} and less than or equal to ${filter.value[1]}]`
//             );
//           }
//         } else if (filter.type === "range_non_linear") {
//           if (
//             filter.scaledMin !== filter.scaledValue[0] ||
//             filter.scaledMax !== filter.scaledValue[1]
//           ) {
//             conditions.push(
//               ` [${filter.name} greater than or equal to ${filter.scaledValue[0]} and less than or equal to ${filter.scaledValue[1]}]`
//             );
//           }
//         } else if (filter.type === "categorical") {
//           if (
//             filter.value[0].checked === false ||
//             filter.value[1].checked === false ||
//             filter.value[2].checked === false ||
//             filter.value[3].checked === false
//           ) {
//             conditions.push(
//               ` [${filter.name} includes ${
//                 filter.value[0].checked === true
//                   ? filter.value[0].name + ","
//                   : ""
//               } ${
//                 filter.value[1].checked === true
//                   ? filter.value[1].name + ","
//                   : ""
//               } ${
//                 filter.value[2].checked === true
//                   ? filter.value[2].name + ","
//                   : ""
//               } ${
//                 filter.value[3].checked === true ? filter.value[3].name : ""
//               }]`
//             );
//           }
//         }
//       });
//       setQueryDesc([
//         {
//           Description: `This data export was created via the SanPlan tool (www.sanplan.app). This data is pulled from ${maps[mapID].name} with the following ${maps[mapID].layers[currentLayerID].name} filter constraints: ${conditions}`,
//         },
//         {
//           Description: `The column "the_geom" column contains ${maps[mapID].layers[currentLayerID].name} geometry in well-known binary (WKB) format.`,
//         },
//       ]);
//       return fetch(
//         `https://zebra.geodb.host/user/admin/api/v2/sql?q=${queryURL}`
//       )
//         .then((resp) => resp.json())
//         .then((response) => {
//           for (var i = 0; i < response.rows.length; i++) {
//             if (response.rows[i].classes !== undefined) {
//               if (response.rows[i].classes === 1) {
//                 response.rows[i].classes = "Rural Remote";
//               } else if (response.rows[i].classes === 2) {
//                 response.rows[i].classes = "Rural On-road";
//               } else if (response.rows[i].classes === 3) {
//                 response.rows[i].classes = "Rural Mixed";
//               } else if (response.rows[i].classes === 4) {
//                 response.rows[i].classes = "Urban";
//               }
//             }
//             // eslint-disable-next-line no-loop-func
//             Object.keys(response.rows[i]).forEach((k) => {
//               response.rows[i][k] = "" + response.rows[i][k];
//             });
//           }

//           setDownload(response.rows);
//           hideLoader();
//         });
//     } else if (mapID) {
//       //   let queryURL = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
//       setQueryDesc([
//         {
//           Description: `This data export was created via the SanPlan tool (www.sanplan.app). This data is pulled from ${maps[mapID].name} with no ${maps[mapID].layers[currentLayerID].name} filter constraints.`,
//         },
//         {
//           Description: `The column "the_geom" column contains ${maps[mapID].layers[currentLayerID].name} geometry in well-known binary (WKB) format.`,
//         },
//       ]);
//       return fetch(
//         `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`
//       )
//         .then((resp) => resp.json())
//         .then((response) => {
//           for (var i = 0; i < response.rows.length; i++) {
//             if (response.rows[i].classes !== undefined) {
//               if (response.rows[i].classes === 1) {
//                 response.rows[i].classes = "Rural Remote";
//               } else if (response.rows[i].classes === 2) {
//                 response.rows[i].classes = "Rural On-road";
//               } else if (response.rows[i].classes === 3) {
//                 response.rows[i].classes = "Rural Mixed";
//               } else if (response.rows[i].classes === 4) {
//                 response.rows[i].classes = "Urban";
//               }
//             }
//             // eslint-disable-next-line no-loop-func
//             Object.keys(response.rows[i]).forEach((k) => {
//               response.rows[i][k] = "" + response.rows[i][k];
//             });
//           }
//           setDownload(response.rows);
//           hideLoader();
//         });
//     }
//   }, [mapID, currentCountry[currentLayerID].query]);

//   useEffect(() => {
//     if (showSettlements === true) {
//       showLoader2();
//       if (currentCountry[currentLayerID].query && mapID) {
//         let queryURL = currentCountry[currentLayerID].query.replace(/\s/g, " ");
//         return fetch(
//           `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS foo, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(foo.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
//         )
//           .then((resp) => resp.json())
//           .then((response) => {
//             for (var i = 0; i < response.rows.length; i++) {
//               if (response.rows[i].classes !== undefined) {
//                 if (response.rows[i].classes === 1) {
//                   response.rows[i].classes = "Rural Remote";
//                 } else if (response.rows[i].classes === 2) {
//                   response.rows[i].classes = "Rural On-road";
//                 } else if (response.rows[i].classes === 3) {
//                   response.rows[i].classes = "Rural Mixed";
//                 } else if (response.rows[i].classes === 4) {
//                   response.rows[i].classes = "Urban";
//                 }
//               }
//               // eslint-disable-next-line no-loop-func
//               Object.keys(response.rows[i]).forEach((k) => {
//                 response.rows[i][k] = "" + response.rows[i][k];
//               });
//             }
//             setDownloadSettlements(response.rows);
//             hideLoader2();
//           });
//       } else if (mapID) {
//         return fetch(
//           `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers["4"].carto_tableName}`
//         )
//           .then((resp) => resp.json())
//           .then((response) => {
//             for (var i = 0; i < response.rows.length; i++) {
//               if (response.rows[i].classes !== undefined) {
//                 if (response.rows[i].classes === 1) {
//                   response.rows[i].classes = "Rural Remote";
//                 } else if (response.rows[i].classes === 2) {
//                   response.rows[i].classes = "Rural On-road";
//                 } else if (response.rows[i].classes === 3) {
//                   response.rows[i].classes = "Rural Mixed";
//                 } else if (response.rows[i].classes === 4) {
//                   response.rows[i].classes = "Urban";
//                 }
//               }
//               // eslint-disable-next-line no-loop-func
//               Object.keys(response.rows[i]).forEach((k) => {
//                 response.rows[i][k] = "" + response.rows[i][k];
//               });
//             }
//             setDownloadSettlements(response.rows);
//             hideLoader2();
//           });
//       }
//     }
//   }, [currentCountry[currentLayerID].query, showSettlements]);

//   return (
//     <div>
//       {downloadSettlements ? (
//         <div align="center">{loader2}</div>
//       ) : (
//         <div align="center">{loader}</div>
//       )}
//       <div>
//         {currentLayerID === "1" ? (
//           <div>
//             Data downloads are not available for this layer, please select a
//             larger resolution from "Map Resolutions".{" "}
//           </div>
//         ) : (
//           <div>
//             {download && downloadSettlements ? (
//               <>
//                 <Box
//                   p={1}
//                   fontStyle="italic"
//                   fontWeight="fontWeightBold"
//                   fontSize={13.5}
//                   variant="subtitle2"
//                   style={{ color: "black" }}
//                   key="rightBoxSubtitle"
//                 >
//                   Export a CSV file of mapped data.
//                 </Box>
//                 <Box style={{ fontSize: 12 }} pl={1} pb={1}>
//                   The downloaded file will represent the regions remaining after
//                   filtering. Use the "Map Resolutions" tab to select the
//                   resolution of the regions to download.
//                 </Box>
//                 <Box style={{ fontSize: 12 }} pl={1} pb={1}>
//                   Download data for{" "}
//                   <Box
//                     component="span"
//                     fontWeight="fontWeightMedium"
//                     fontSize={16}
//                     color="#BA0C2F"
//                   >
//                     {download.length}{" "}
//                     {maps[currentMapID].layers[
//                       currentLayerID
//                     ].name.toLowerCase() + "s"}
//                   </Box>{" "}
//                   and{" "}
//                   <Box
//                     component="span"
//                     fontWeight="fontWeightMedium"
//                     fontSize={16}
//                     color="#BA0C2F"
//                   >
//                     {downloadSettlements.length} estimated settlement areas
//                   </Box>{" "}
//                   in{" "}
//                   <Box
//                     component="span"
//                     fontWeight="fontWeightMedium"
//                     fontSize={16}
//                     color="#BA0C2F"
//                   >
//                     {maps[currentMapID].name}
//                   </Box>
//                   .
//                 </Box>
//                 <ExcelFile element={<button>Download Data</button>}>
//                   <ExcelSheet data={queryDesc} name="Notes">
//                     <ExcelColumn
//                       label="Data Export Notes"
//                       value="Description"
//                     />
//                   </ExcelSheet>
//                   <ExcelSheet data={download} name="Boundary Query Data">
//                     <ExcelColumn label="Geometry" value="the_geom" />
//                     {download[0]["name_1"] && (
//                       <ExcelColumn label="Region" value="name_1" />
//                     )}
//                     {download[0]["name_2"] && (
//                       <ExcelColumn label="District" value="name_2" />
//                     )}
//                     {download[0]["cholera"] && (
//                       <ExcelColumn
//                         label="Predicted Annual Cholera Incidence (cases/100,000pp)"
//                         value="cholera"
//                       />
//                     )}
//                     {download[0]["dia"] && (
//                       <ExcelColumn
//                         label="Diahrrea Prevalence in Children <5 Years (%)"
//                         value="dia"
//                       />
//                     )}
//                     {download[0]["dr"] && (
//                       <ExcelColumn label="Distance to Roads (km.)" value="dr" />
//                     )}
//                     {download[0]["dt"] && (
//                       <ExcelColumn label="Distance to Towns (km.)" value="dt" />
//                     )}
//                     {download[0]["edu_m"] && (
//                       <ExcelColumn
//                         label="Men's Educational Attainment (yrs.)"
//                         value="edu_m"
//                       />
//                     )}
//                     {download[0]["edu_w"] && (
//                       <ExcelColumn
//                         label="Women's Educational Attainment (yrs.)"
//                         value="edu_w"
//                       />
//                     )}
//                     {download[0]["od"] && (
//                       <ExcelColumn
//                         label="Population Practicing Open Defecation (yrs.)"
//                         value="od"
//                       />
//                     )}
//                     {download[0]["pop"] && (
//                       <ExcelColumn
//                         label="Population Estimate (people)"
//                         value="pop"
//                       />
//                     )}
//                     {download[0]["classes"] && (
//                       <ExcelColumn label="Rural Typology" value="classes" />
//                     )}
//                     {download[0]["rm"] && (
//                       <ExcelColumn label="Rural Mixed (%)" value="rm" />
//                     )}
//                     {download[0]["rrd"] && (
//                       <ExcelColumn label="Rural On-road (%)" value="rrd" />
//                     )}
//                     {download[0]["rr"] && (
//                       <ExcelColumn label="Rural Remote (%)" value="rr" />
//                     )}
//                     {download[0]["u"] && (
//                       <ExcelColumn label="Urban (%)" value="u" />
//                     )}
//                     {download[0]["s_unimp"] && (
//                       <ExcelColumn
//                         label="Reliance on Unimproved Sanitation (%)"
//                         value="s_unimp"
//                       />
//                     )}
//                     {download[0]["w_unimp"] && (
//                       <ExcelColumn
//                         label="Reliance on Unimproved Drinking Water (%)"
//                         value="w_unimp"
//                       />
//                     )}
//                     {download[0]["timecities"] && (
//                       <ExcelColumn
//                         label="Travel Time to Cities (hr.)"
//                         value="timecities"
//                       />
//                     )}
//                     {download[0]["u5m"] && (
//                       <ExcelColumn
//                         label="Mortality in Children <5 Years (%)"
//                         value="u5m"
//                       />
//                     )}
//                   </ExcelSheet>
//                   <ExcelSheet
//                     data={downloadSettlements}
//                     name="Settlement Query Data"
//                   >
//                     <ExcelColumn label="geometry" value="the_geom" />
//                     {downloadSettlements[0]["name_1"] && (
//                       <ExcelColumn label="Region" value="name_1" />
//                     )}
//                     {downloadSettlements[0]["name_2"] && (
//                       <ExcelColumn label="District" value="name_2" />
//                     )}
//                     {downloadSettlements[0]["dr"] && (
//                       <ExcelColumn label="Distance to Roads (km.)" value="dr" />
//                     )}
//                     {downloadSettlements[0]["dt"] && (
//                       <ExcelColumn label="Distance to Towns (km.)" value="dt" />
//                     )}
//                     {downloadSettlements[0]["pop"] && (
//                       <ExcelColumn
//                         label="Population Estimate (people)"
//                         value="pop"
//                       />
//                     )}
//                     {downloadSettlements[0]["classes"] && (
//                       <ExcelColumn label="Rural Typology" value="classes" />
//                     )}
//                     {downloadSettlements[0]["rm"] && (
//                       <ExcelColumn label="Rural Mixed (%)" value="rm" />
//                     )}
//                     {downloadSettlements[0]["rrd"] && (
//                       <ExcelColumn label="Rural On-road (%)" value="rrd" />
//                     )}
//                     {downloadSettlements[0]["rr"] && (
//                       <ExcelColumn label="Rural Remote (%)" value="rr" />
//                     )}
//                     {downloadSettlements[0]["u"] && (
//                       <ExcelColumn label="Urban (%)" value="u" />
//                     )}
//                     {downloadSettlements[0]["timecities"] && (
//                       <ExcelColumn
//                         label="Travel Time to Cities (hr.)"
//                         value="timecities"
//                       />
//                     )}
//                   </ExcelSheet>
//                 </ExcelFile>
//               </>
//             ) : (
//               download &&
//               downloadSettlements === null && (
//                 <>
//                   <Box
//                     p={1}
//                     fontStyle="italic"
//                     fontWeight="fontWeightBold"
//                     fontSize={13.5}
//                     variant="subtitle2"
//                     style={{ color: "black" }}
//                     key="rightBoxSubtitle"
//                   >
//                     Export a CSV file of mapped data.
//                   </Box>
//                   <Box style={{ fontSize: 12 }} pl={1} pb={1}>
//                     The downloaded file will represent the regions remaining
//                     after filtering. Use the "Map Resolutions" tab to select the
//                     resolution of the regions to download.
//                   </Box>
//                   <Box style={{ fontSize: 12 }} pl={1} pb={1}>
//                     Download data for{" "}
//                     <Box
//                       component="span"
//                       fontWeight="fontWeightMedium"
//                       fontSize={16}
//                       color="#BA0C2F"
//                     >
//                       {download.length}{" "}
//                       {maps[currentMapID].layers[
//                         currentLayerID
//                       ].name.toLowerCase() + "s"}
//                     </Box>{" "}
//                     in{" "}
//                     <Box
//                       component="span"
//                       fontWeight="fontWeightMedium"
//                       fontSize={16}
//                       color="#BA0C2F"
//                     >
//                       {maps[currentMapID].name}
//                     </Box>
//                     .
//                   </Box>
//                   <ExcelFile element={<button>Download Data</button>}>
//                     <ExcelSheet data={queryDesc} name="Notes">
//                       <ExcelColumn
//                         label="Data Export Notes"
//                         value="Description"
//                       />
//                     </ExcelSheet>
//                     <ExcelSheet data={download} name="Boundary Query Data">
//                       <ExcelColumn label="Geometry" value="the_geom" />
//                       {download[0]["name_1"] && (
//                         <ExcelColumn label="Region" value="name_1" />
//                       )}
//                       {download[0]["name_2"] && (
//                         <ExcelColumn label="District" value="name_2" />
//                       )}
//                       {download[0]["cholera"] && (
//                         <ExcelColumn
//                           label="Predicted Annual Cholera Incidence (cases/100,000pp)"
//                           value="cholera"
//                         />
//                       )}
//                       {download[0]["dia"] && (
//                         <ExcelColumn
//                           label="Diahrrea Prevalence in Children <5 Years (%)"
//                           value="dia"
//                         />
//                       )}
//                       {download[0]["dr"] && (
//                         <ExcelColumn
//                           label="Distance to Roads (km.)"
//                           value="dr"
//                         />
//                       )}
//                       {download[0]["dt"] && (
//                         <ExcelColumn
//                           label="Distance to Towns (km.)"
//                           value="dt"
//                         />
//                       )}
//                       {download[0]["edu_m"] && (
//                         <ExcelColumn
//                           label="Men's Educational Attainment (yrs.)"
//                           value="edu_m"
//                         />
//                       )}
//                       {download[0]["edu_w"] && (
//                         <ExcelColumn
//                           label="Women's Educational Attainment (yrs.)"
//                           value="edu_w"
//                         />
//                       )}
//                       {download[0]["od"] && (
//                         <ExcelColumn
//                           label="Population Practicing Open Defecation (yrs.)"
//                           value="od"
//                         />
//                       )}
//                       {download[0]["pop"] && (
//                         <ExcelColumn
//                           label="Population Estimate (people)"
//                           value="pop"
//                         />
//                       )}
//                       {download[0]["classes"] && (
//                         <ExcelColumn label="Rural Typology" value="classes" />
//                       )}
//                       {download[0]["rm"] && (
//                         <ExcelColumn label="Rural Mixed (%)" value="rm" />
//                       )}
//                       {download[0]["rrd"] && (
//                         <ExcelColumn label="Rural On-road (%)" value="rrd" />
//                       )}
//                       {download[0]["rr"] && (
//                         <ExcelColumn label="Rural Remote (%)" value="rr" />
//                       )}
//                       {download[0]["u"] && (
//                         <ExcelColumn label="Urban (%)" value="u" />
//                       )}
//                       {download[0]["s_unimp"] && (
//                         <ExcelColumn
//                           label="Reliance on Unimproved Sanitation (%)"
//                           value="s_unimp"
//                         />
//                       )}
//                       {download[0]["w_unimp"] && (
//                         <ExcelColumn
//                           label="Reliance on Unimproved Drinking Water (%)"
//                           value="w_unimp"
//                         />
//                       )}
//                       {download[0]["timecities"] && (
//                         <ExcelColumn
//                           label="Travel Time to Cities (hr.)"
//                           value="timecities"
//                         />
//                       )}
//                       {download[0]["u5m"] && (
//                         <ExcelColumn
//                           label="Mortality in Children <5 Years (%)"
//                           value="u5m"
//                         />
//                       )}
//                     </ExcelSheet>
//                   </ExcelFile>
//                 </>
//               )
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
