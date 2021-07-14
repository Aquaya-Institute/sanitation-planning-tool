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
  // const [popup, setPopup] = useState();
  // const [popupData, setPopupData] = useState();
  // const [downloadData, setDownloadData] = useState();
  const [
    {
      maps,
      currentMapID,
      settlementBoundary,
      currentCountry,
      // carto_client,
      // queries,
      // currentLayerID,
      // showSettlements,
      allowSettlements,
      // leafletMap,
    },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const idPopover = popoverOpen ? "simple-popover" : undefined;
  const clickRef = useRef(null);
  const [scroll] = useState("paper");
  const classes = useStyles();
  // const selectedSettlement = useRef();
  // const clickRefPop = useRef(null);
  // const openPopper = Boolean(popup);
  // const dat_popup = [];

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

  return (
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
      {mapID && (
        <React.Fragment>
          {" "}
          {maps[mapID].layers["4"] && (
            <React.Fragment>
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
                          // currentCountry["4"].layer.show();
                          // currentCountry["4"].layer.bringToFront();
                        } else {
                          if (settlementBoundary) {
                            settlementBoundary.hide();
                          }
                          // currentCountry["4"].layer.hide();
                        }
                      }
                    }}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    color="primary"
                    inputProps={{
                      "aria-label": "sho/hide-settlements-layer-checkbox",
                    }}
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
                          key="allow-settlements-layer"
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
                              // currentCountry["4"].layer.show();
                              // currentCountry["4"].layer.bringToFront();
                              // carto_client.addLayer(settlementBoundary);
                              setChecked(true);
                              dispatch({
                                type: "allow.settlements",
                                allowSettlements: !checked,
                              });
                            } else {
                              // maps[mapID].layers["4"].carto_layer.hide();
                              settlementBoundary.hide();
                              // currentCountry["4"].layer.hide();
                              // carto_client.removeLayer(settlementBoundary);
                            }
                          }}
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                          color="primary"
                          inputProps={{
                            "aria-label": "allow-settlements-layer-checkbox",
                          }}
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
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
