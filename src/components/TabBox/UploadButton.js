import React, { useState, useContext, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Papa from "papaparse";
import { Box, Divider, Typography, Dialog, Grid } from "@material-ui/core";
import { MapContext } from "../../state/MapState";
import { CSVLink } from "react-csv";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
// import Carto from "@carto/carto.js";
// import L from "leaflet";
// import { Settlements } from "./Settlements";
// import { MapPopper } from "../subcomponents/MapPopper";

// import theme from "../../theme/theme";
const template = [
  {
    Community: null,
    Latitude: null,
    Longitude: null,
  },
];
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
}));

export const UploadButton = () => {
  const [state, setState] = useState(null);
  const [showLayer, setShowLayer] = useState(false);
  const [checked, setChecked] = useState(false);
  const [popup, setPopup] = useState();
  const [popupData, setPopupData] = useState();
  const [downloadData, setDownloadData] = useState();
  const [
    {
      maps,
      currentMapID,
      settlementBoundary,
      carto_client,
      queries,
      currentLayerID,
      showSettlements,
      allowSettlements,
      leafletMap,
    },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const idPopover = popoverOpen ? "simple-popover" : undefined;
  const clickRef = useRef(null);
  const [scroll] = useState("paper");
  const classes = useStyles();
  const selectedSettlement = useRef();
  const clickRefPop = useRef(null);
  const openPopper = Boolean(popup);
  const dat_popup = [];

  function handleChange(event) {
    setState({
      csvfile: event.target.files[0],
    });
  }
  function removeCSV() {
    dispatch({
      type: "user.upload",
      userData: null,
    });
    setState(null);
  }

  function importCSV(e) {
    e.preventDefault();
    const { csvfile } = state;

    csvfile &&
      Papa.parse(csvfile, {
        header: true,
        dynamicTyping: true,
        complete: updateData,
      });
  }

  function updateData(result) {
    // setState(null);
    var data = result.data;
    console.log(data);
    dispatch({
      type: "user.upload",
      userData: data,
    });
  }
  useEffect(() => {
    if (currentMapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID]);

  // //click outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (clickRef.current && !clickRef.current.contains(event.target)) {
  //       if (clickRef.current && !clickRef.current.contains(event.target)) {
  //         console.log("clicked outside");
  //         if (
  //           clickRefPop.current &&
  //           !clickRefPop.current.contains(event.target)
  //         ) {
  //           setPopoverOpen(null);
  //           console.log("clicked outside");
  //         } else if (
  //           clickRefPop.current &&
  //           clickRefPop.current.contains(event.target)
  //         ) {
  //         } else {
  //           setPopup(null);
  //         }
  //       }
  //       console.log("clicked outside");
  //       if (selectedSettlement.current) {
  //         leafletMap.removeLayer(selectedSettlement.current);
  //       }
  //     }
  //   };
  //   document.addEventListener("click", handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, true);
  //   };
  // }, [leafletMap]);

  // useEffect(() => {
  //   if (mapID) {
  //     var _source = new Carto.source.SQL(
  //       `SELECT * FROM ${maps[mapID].layers["4"].carto_tableName}`
  //     );
  //     const _style = new Carto.style.CartoCSS(
  //       `#layer::outline {line-width: 1; line-color: #000000; line-opacity: 1;}`
  //     );
  //     const settlementBoundaryset = new Carto.layer.Layer(_source, _style, {});

  //     dispatch({
  //       type: "settlement.boundary",
  //       settlementBoundary: settlementBoundaryset,
  //     });
  //   }
  // }, [mapID]);

  // useEffect(() => {
  //   if (mapID) {
  //     let queryURL = null;
  //     if (query) {
  //       if (settlementBoundary) {
  //         carto_client.removeLayer(settlementBoundary);
  //       }
  //       // var clause = query.substr(query.indexOf(" WHERE"), query.length);
  //       // queryURL =
  //       //   `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}` +
  //       //   clause;
  //       let queryURL = query.replace(/\s/g, " ");
  //       var _style = null;
  //       var _source = null;
  //       var settlementBoundaryset = null;
  //       _source = new Carto.source.SQL(
  //         `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS foo, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(foo.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
  //       );
  //       _style = new Carto.style.CartoCSS(
  //         `#layer {polygon-fill: #826dba; polygon-opacity: 0;} #layer::outline {line-width: 1; line-color: #000000; line-opacity: 1;}`
  //       );

  //       // let queryURL2 = `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom)`;
  //       // maps[mapID].layers["5"].carto_source.setQuery(queryURL2);
  //       // query.replace(/\s/g, " ");
  //       // queryURL2 = encodeURIComponent(queryURL2);

  //       // queryURL = `SELECT the_geom FROM ${queryURL2}`;
  //     } else {
  //       // queryURL = `SELECT * FROM ${maps[mapID].layers[currentLayerID].carto_tableName}`;
  //       // maps[mapID].layers["4"].carto_source.setQuery(
  //       //   `SELECT * FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom)`
  //       // );
  //       // _source = new Carto.source.SQL(
  //       //   `SELECT ${maps[mapID].layers["4"].carto_tableName}.* FROM (${queryURL}) AS originalQuery, ${maps[mapID].layers["4"].carto_tableName} WHERE ST_Intersects(originalQuery.the_geom, ${maps[mapID].layers["4"].carto_tableName}.the_geom) GROUP BY ${maps[mapID].layers["4"].carto_tableName}.cartodb_id`
  //       // );
  //       _source = new Carto.source.SQL(
  //         `SELECT * FROM ${maps[mapID].layers["4"].carto_tableName}`
  //       );
  //       _style = new Carto.style.CartoCSS(
  //         `#layer {polygon-fill: #826dba; polygon-opacity: 0;} #layer::outline {line-width: 1; line-color: #000000; line-opacity: 1;}`
  //       );
  //     }
  //     if (_source) {
  //       settlementBoundaryset = new Carto.layer.Layer(_source, _style, {
  //         visible: showLayer === true ? true : false,
  //         featureClickColumns: [
  //           "classes",
  //           "dt",
  //           "dr",
  //           "timecities",
  //           "pop",
  //           "rr",
  //           "rrd",
  //           "rm",
  //           "u",
  //           "name_1",
  //           "name_2",
  //         ],
  //       });
  //       settlementBoundaryset.on("featureClicked", (featureEvent) => {
  //         console.log("clicked a feature", featureEvent);
  //         var result = null;
  //         var input = featureEvent.data.cartodb_id;
  //         setAnchorPopper(featureEvent.currentTarget);
  //         fetch(
  //           `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT ST_AsGeoJSON(the_geom) as the_geom FROM ${maps[mapID].layers["4"].carto_tableName} where cartodb_id = ${input}`
  //         )
  //           .then((resp) => resp.json())
  //           .then((response) => {
  //             var myStyle = {
  //               color: "#FFFFFF",
  //               fillColor: "#FFFFFF",
  //               fillOpacity: 0.3,
  //               weight: 1,
  //             };
  //             result = L.geoJson(
  //               JSON.parse(response.rows[0].the_geom),
  //               myStyle
  //             );
  //             selectedSettlement.current = result;
  //             result.addTo(leafletMap);
  //           });
  //         setPopup([maps[mapID].layers["4"].carto_tableName, featureEvent]);
  //         setPopoverOpen(false);
  //         console.log("popup", popup);
  //         // dispatch({
  //         //   type: "settlement.popup",
  //         //   settlementPopup: [
  //         //     maps[mapID].layers["4"].carto_tableName,
  //         //     featureEvent,
  //         //   ],
  //         //   settlementHighlight: selectedSettlement.current,
  //         // });
  //       });
  //       carto_client.addLayer(settlementBoundaryset);
  //       dispatch({
  //         type: "settlement.boundary",
  //         settlementBoundary: settlementBoundaryset,
  //       });
  //     }
  //   }
  // }, [query, mapID]);

  // // popup data
  // useEffect(() => {
  //   console.log("updated popup", popup);
  //   if (popup) {
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
  //     var dat_loc = [];
  //     if (popup[1].data.classes !== undefined) {
  //       if (popup[1].data.classes === 1) {
  //         popup[1].data.classes = "Rural Remote";
  //       } else if (popup[1].data.classes === 2) {
  //         popup[1].data.classes = "Rural On-road";
  //       } else if (popup[1].data.classes === 3) {
  //         popup[1].data.classes = "Rural Mixed";
  //       } else if (popup[1].data.classes === 4) {
  //         popup[1].data.classes = "Urban";
  //       }
  //     }
  //     Object.entries(popup[1].data)
  //       .slice(1)
  //       .map((keyName) => {
  //         return dat_loc.push([keyName[0], keyName[1]]);
  //       });
  //     dat_loc.sort();

  //     for (let j = 0; j < dat.length; j++) {
  //       for (let i = 0; i < dat_loc.length; i++) {
  //         if (dat[j][0] === dat_loc[i][0]) {
  //           dat_popup[dat[j][0]] = {
  //             Name: dat[j][1],
  //             Category: dat[j][2],
  //             Unit: dat[j][3],
  //             Value: dat_loc[i][1],
  //           };
  //         }
  //       }
  //     }
  //     var obj = {};
  //     obj["data"] = dat_popup;
  //     obj["latLng"] = popup[1].latLng;
  //     obj["position"] = popup[1].position;
  //     setPopupData(obj);
  //     var myData = Object.keys(dat_popup).map((key) => {
  //       return dat_popup[key];
  //     });
  //     setDownloadData(myData);
  //     dispatch({
  //       type: "settlement.popup",
  //       settlementPopup: obj,
  //       settlementHighlight: selectedSettlement.current,
  //     });
  //   }
  // }, [popup]);

  return (
    <div>
      <Box
        p={1}
        fontStyle="italic"
        fontWeight="fontWeightBold"
        fontSize={13.5}
        variant="subtitle2"
        style={{ color: "black" }}
        key="rightBoxSubtitle"
      >
        Upload a CSV file of GPS coordinates to display them on the map:
      </Box>
      <Box style={{ fontSize: 12 }} pl={1} pb={1}>
        To plot communitiy locations, create a CSV file with at minimum 2
        specific columns, 1) Latitiude, and 2) Longitude. Other columns
        including community name or identifiers may also be included.
      </Box>
      <CSVLink
        data={template}
        filename={"SPT_Upload_Template.csv"}
        style={{ fontSize: 13 }}
      >
        DOWNLOAD TEMPLATE UPLOAD FORM
      </CSVLink>
      <input
        className="upload-input"
        type="file"
        name="file"
        placeholder={state}
        onChange={handleChange}
      />
      <button onClick={importCSV}>Upload</button>
      <button onClick={removeCSV}>Remove</button>
      <Divider />
      {/* <Settlements /> */}
      {mapID && (
        <>
          {" "}
          {maps[mapID].layers["4"] && (
            <>
              <Box
                p={1}
                fontStyle="italic"
                fontWeight="fontWeightBold"
                fontSize={13.5}
                variant="subtitle2"
                style={{ color: "black" }}
              >
                Display all estimated settlement boundary areas on the map:
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={showLayer}
                    onChange={() => {
                      if (showLayer === false && allowSettlements === false) {
                        setPopoverOpen(true);
                      } else {
                        setShowLayer(!showLayer);
                        dispatch({
                          type: "show.settlements",
                          showSettlements: !showLayer,
                        });
                        if (showLayer === false) {
                          if (settlementBoundary) {
                            settlementBoundary.show();
                          }
                          // maps[mapID].layers["4"].carto_layer.show();
                          // maps[mapID].layers["4"].carto_layer.bringToFront();
                          // carto_client.addLayer(settlementBoundary);
                          // maps[mapID].layers["4"].carto_layer.show();
                        } else {
                          // maps[mapID].layers["4"].carto_layer.hide();
                          if (settlementBoundary) {
                            settlementBoundary.hide();
                          }
                          // carto_client.removeLayer(settlementBoundary);
                        }
                      }
                    }}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    color="primary"
                  />
                }
                label={
                  <Typography key="filterListItemLabel" variant="body2">
                    Show estimated settlement boundaries
                  </Typography>
                }
                size="small"
              />
              <Dialog
                id={idPopover}
                ref={clickRef}
                key={idPopover}
                aria-labelledby="Popup diaglog box containing data at clicked location"
                aria-describedby="Popup diaglog box containing data values for all variables the at clicked location, aggregated at the level of resolution of the clicked layer."
                className={classes.modal}
                open={popoverOpen}
                onClose={(e) => {
                  setPopoverOpen(false);
                }}
                scroll={"paper"}
              >
                <Grid container justify="flex-end" key={"popoverHeader"}>
                  <CloseIcon
                    key={"popoverClose"}
                    fontSize="small"
                    color="disabled"
                    onClick={(e) => {
                      setPopoverOpen(false);
                    }}
                  />
                </Grid>
                <DialogTitle>Estimated Settlements Layer (Beta)</DialogTitle>
                <DialogContent dividers={scroll === "paper"}>
                  <Typography
                    key="filterListItemLabel"
                    variant="body2"
                    // style={{ fontSize: 11 }}
                    gutterBottom
                  >
                    The settlements layer is an estimation and still under
                    development. Some settlements may not be captured and values
                    are estimated from data of lower resolution and therefore
                    not precise.
                  </Typography>
                  <DialogActions>
                    <FormControlLabel
                      control={
                        <Checkbox
                          key="consent"
                          checked={showLayer}
                          name="consent"
                          onChange={() => {
                            setShowLayer(!showLayer);
                            dispatch({
                              type: "show.settlements",
                              showSettlements: !showLayer,
                            });
                            if (!showLayer === true) {
                              // maps[mapID].layers["4"].carto_layer.show();
                              if (settlementBoundary) {
                                settlementBoundary.show();
                              }
                              // carto_client.addLayer(settlementBoundary);
                              setChecked(true);
                              dispatch({
                                type: "allow.settlements",
                                allowSettlements: !checked,
                              });
                            } else {
                              // maps[mapID].layers["4"].carto_layer.hide();
                              settlementBoundary.hide();
                              // carto_client.removeLayer(settlementBoundary);
                            }
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
                          // style={{ fontSize: 11 }}
                          gutterBottom
                        >
                          I understand, turn on the layer.
                        </Typography>
                      }
                      size="small"
                    />
                  </DialogActions>
                </DialogContent>
              </Dialog>
            </>
          )}
        </>
      )}
      {/* <MapPopper
        popup={popup}
        clickRef={clickRef}
        openPopper={openPopper}
        setPopup={setPopup}
        highlightLayer={selectedSettlement}
        mapID={mapID}
        setPopoverOpen={setPopoverOpen}
        popoverOpen={popoverOpen}
        clickRefPop={clickRefPop}
        anchorPopper={anchorPopper}
      /> */}
    </div>
  );
};
