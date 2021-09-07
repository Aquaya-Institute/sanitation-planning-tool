import React, { useMemo } from "react";
import { MapContext } from "../../state/MapState";
import { useState, useContext, useEffect } from "react";
import { Box, Divider, CircularProgress } from "@material-ui/core";
import { Loader_2, Loader2_2 } from "../subcomponents/Loader_2";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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
  const [downloadUpload5k, setDownloadUpload5k] = useState(null);
  const [downloadUploadAdmin, setDownloadUploadAdmin] = useState(null);
  const [mapID, setMapID] = useState(currentMapID);
  // const [loader, showLoader, hideLoader] = Loader_2();
  // const [loader2, showLoader2, hideLoader2] = Loader2_2();
  const [loading, setLoading] = useState(false);
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
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

  useEffect(() => {
    // showLoader();
    setLoading(true);
    if (currentLayerID === "1") {
      setDownload(null);
      // hideLoader();
      setLoading(false);
    } else if (layerQuery && mapID && columnNames) {
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
          // hideLoader();
          setLoading(false);
        });
    } else if (mapID && columnNames) {
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
          // hideLoader();
          setLoading(false);
        });
    }
  }, [mapID, layerQuery]);

  useEffect(() => {
    if (showSettlements === true) {
      // showLoader2();
      setLoading(true);
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
            // hideLoader2();
            setLoading(false);
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
            // hideLoader2();
            setLoading(false);
          });
      }
    }
  }, [layerQuery, showSettlements]);

  useEffect(() => {
    if (userData && mapID && columnNames) {
      // showLoader2();
      setLoading(true);
      var uploadArray = [];
      var uploadAdminArray = [];
      var upload5kArray = [];
      for (var i = 0; i < userData.length - 1; i++) {
        let userData_temp = userData[i];
        fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers["1"].carto_tableName} WHERE ST_Intersects(ST_SetSRID(ST_Point(${userData[i].Longitude}, ${userData[i].Latitude}), 4326), ${maps[mapID].layers["1"].carto_tableName}.the_geom)`
        )
          .then((resp) => resp.json())
          .then((response) => {
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
              Object.keys(response.rows[0]).forEach((k) => {
                response.rows[0][k] = "" + response.rows[0][k];
              });
            }
            let temp = { ...userData_temp, ...response.rows[0] };
            delete temp["the_geom"];
            delete temp["the_geom_webmercator"];
            delete temp["cartodb_id"];
            uploadArray.push(temp);
            setDownloadUpload(uploadArray);
            // hideLoader2();

            setLoading(false);
          });
        fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers["2"].carto_tableName} WHERE ST_Intersects(ST_SetSRID(ST_Point(${userData[i].Longitude}, ${userData[i].Latitude}), 4326), ${maps[mapID].layers["2"].carto_tableName}.the_geom)`
        )
          .then((resp) => resp.json())
          .then((response) => {
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
              Object.keys(response.rows[0]).forEach((k) => {
                response.rows[0][k] = "" + response.rows[0][k];
              });
            }
            let temp = { ...userData_temp, ...response.rows[0] };
            delete temp["the_geom"];
            delete temp["the_geom_webmercator"];
            delete temp["cartodb_id"];
            delete temp["name_1"];
            delete temp["name_2"];
            upload5kArray.push(temp);
            setDownloadUpload5k(upload5kArray);
            setLoading(false);
          });
        fetch(
          `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers["3"].carto_tableName} WHERE ST_Intersects(ST_SetSRID(ST_Point(${userData[i].Longitude}, ${userData[i].Latitude}), 4326), ${maps[mapID].layers["3"].carto_tableName}.the_geom)`
        )
          .then((resp) => resp.json())
          .then((response) => {
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
              Object.keys(response.rows[0]).forEach((k) => {
                response.rows[0][k] = "" + response.rows[0][k];
              });
            }
            let temp = { ...userData_temp, ...response.rows[0] };
            delete temp["the_geom"];
            delete temp["the_geom_webmercator"];
            delete temp["cartodb_id"];
            uploadAdminArray.push(temp);
            setDownloadUploadAdmin(uploadAdminArray);
            setLoading(false);
          });
      }
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
      {loading === true && (
        <div align="center">
          <CircularProgress />
        </div>
      )}
      <React.Fragment>
        {currentLayerID === "1" && downloadUpload === null ? (
          <React.Fragment>
            Data downloads are not available for this layer, please select a
            larger resolution from "Map Resolutions".{" "}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {download && downloadSettlements && downloadUpload === null ? (
              <React.Fragment>
                {download.length === 0 || downloadSettlements.length === 0 ? (
                  <Box
                    p={1}
                    fontStyle="italic"
                    fontWeight="fontWeightBold"
                    fontSize={13.5}
                    variant="subtitle2"
                    style={{ color: "black" }}
                    key="rightBoxSubtitle"
                  >
                    There is no data mapped to download, adjust the map filters
                    until map populates with data.
                  </Box>
                ) : (
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
                      The downloaded file will represent the regions remaining
                      after filtering. Use the "Map Resolutions" tab to select
                      the resolution of the regions to download. Large datasets
                      may take longer to download.
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
                    <ExcelFile
                      element={<button autoFocus>Download Data</button>}
                    >
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
                )}
              </React.Fragment>
            ) : download && downloadSettlements === null ? (
              <React.Fragment>
                {download.length === 0 ? (
                  <Box
                    p={1}
                    fontStyle="italic"
                    fontWeight="fontWeightBold"
                    fontSize={13.5}
                    variant="subtitle2"
                    style={{ color: "black" }}
                    key="rightBoxSubtitle"
                  >
                    There is no data mapped to download, adjust the map filters
                    until map populates with data.
                  </Box>
                ) : (
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
                      The downloaded file will represent the regions remaining
                      after filtering. Use the "Map Resolutions" tab to select
                      the resolution of the regions to download. Large datasets
                      may take longer to download.
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
                    <ExcelFile
                      element={<button autoFocus>Download Data</button>}
                    >
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
                )}
              </React.Fragment>
            ) : null}
            {downloadUpload !== null &&
              downloadUpload5k !== null &&
              downloadUploadAdmin !== null && (
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
                    <ExcelSheet data={downloadUpload} name="1km data at Points">
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
                    <ExcelSheet
                      data={downloadUpload5k}
                      name="5km Data at Points"
                    >
                      {Object.keys(downloadUpload5k[0]).map((col) => {
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
                      data={downloadUploadAdmin}
                      name="Admin Boundary Data at Points"
                    >
                      {Object.keys(downloadUploadAdmin[0]).map((col) => {
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
              )}
          </React.Fragment>
        )}
      </React.Fragment>
    </React.Fragment>
  );
};
