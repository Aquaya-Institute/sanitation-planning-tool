import React from "react";
import { useState, useContext, Fragment } from "react";
import { MapContext } from "../../state/MapState";
import "leaflet/dist/leaflet.css";
import {
  Link,
  Grid,
  Button,
  Box,
  Popper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import { CSVLink } from "react-csv";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
  button: {
    margin: theme.spacing(1),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  download: {
    textDecoration: "none",
    color: "#ffffff",
  },
}));

export const MapPopper = ({
  popupData,
  clickRef,
  openPopper,
  setPopup,
  // highlightLayer,
  mapID,
  setPopoverOpen,
  popoverOpen,
  clickRefPop,
  anchorPopper,
  downloadData,
  mapRef,
  settlementclickRef,
}) => {
  const [{ maps, currentLayerID, activeLegend, highlightBoundary }] =
    useContext(MapContext);
  const classes = useStyles();
  const idPopper = "transitions-popper";
  const idPopover = "simple-popover";
  // const anchorRef = useRef(null);
  const [scroll] = useState("paper");
  const cat = ["accessibility", "wash", "health", "socioeconomic"];
  const cat_lim = ["accessibility", "socioeconomic"];
  // const [downloadData, setDownloadData] = useState();
  //   const [popupData, setPopupData] = useState();
  // var dat_popup = {};
  //   // popup data
  //   useMemo(() => {
  //     if (popup) {
  //       var dat = [];
  //       maps[mapID].layers[currentLayerID].filters.forEach(function (element) {
  //         dat.push([
  //           element.column_name,
  //           element.name,
  //           element.subcategory,
  //           element.unit,
  //         ]);
  //       });
  //       dat.sort();
  //       var dat_loc = [];
  //         if (popup[1].data.classes !== undefined) {
  //           if (popup[1].data.classes === 1) {
  //             popup[1].data.classes = "Rural Remote";
  //           } else if (popup[1].data.classes === 2) {
  //             popup[1].data.classes = "Rural On-road";
  //           } else if (popup[1].data.classes === 3) {
  //             popup[1].data.classes = "Rural Mixed";
  //           } else if (popup[1].data.classes === 4) {
  //             popup[1].data.classes = "Urban";
  //           }
  //         }
  //       Object.entries(popup[1].data)
  //         .slice(1)
  //         .map((keyName) => {
  //           return dat_loc.push([keyName[0], keyName[1]]);
  //         });
  //       dat_loc.sort();

  //       for (let j = 0; j < dat.length; j++) {
  //         for (let i = 0; i < dat_loc.length; i++) {
  //           if (dat[j][0] === dat_loc[i][0]) {
  //             dat_popup[dat[j][0]] = {
  //               Name: dat[j][1],
  //               Category: dat[j][2],
  //               Unit: dat[j][3],
  //               Value: dat_loc[i][1],
  //             };
  //           }
  //         }
  //       }
  //       var obj = {};
  //       obj["data"] = dat_popup;
  //       obj["latLng"] = popup[1].latLng;
  //       obj["position"] = popup[1].position;
  //       setPopupData(obj);
  //       var myData = Object.keys(dat_popup).map((key) => {
  //         return dat_popup[key];
  //       });
  //       setDownloadData(myData);
  //     }
  //   }, [popup]);

  return (
    <React.Fragment>
      {popupData && (
        <Popper
          aria-labelledby="Small popup on data at the clicked location"
          aria-describedby="Content of the popup changes depending on the variable selected in the legend, and also contians a link to a larger dialog box of all data a the clicked location."
          anchorEl={anchorPopper}
          ref={clickRef}
          id={idPopper}
          key={idPopper}
          open={openPopper}
          disablePortal={true}
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "scrollParent",
            },
          }}
          style={{
            position: "absolute",
            left: popupData.position.x,
            top: popupData.position.y,
            zIndex: "1300",
            // backgroundColor: "#fff",
            width: "175px",
          }}
        >
          <div className={classes.paper}>
            <Grid container justifyContent="flex-end" p={0}>
              <IconButton
                size="small"
                key={"popperClose"}
                p={0}
                color="default"
                onClick={(e) => {
                  setPopup(null);
                  settlementclickRef = false;
                  if (highlightBoundary) {
                    mapRef.current.removeLayer(highlightBoundary);
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Grid>
            {activeLegend !== "0" && popupData.data.od ? (
              <Box>
                <Box fontWeight="fontWeightBold">
                  {popupData.data.name_1.Name}:
                </Box>{" "}
                {popupData.data.name_1.Value}
                {popupData.data.name_2 !== undefined && (
                  <span>
                    <br />
                    <Box fontWeight="fontWeightBold">
                      {popupData.data.name_2.Name}:
                    </Box>{" "}
                    {popupData.data.name_2.Value}
                  </span>
                )}
                {popupData.data.name_3 !== undefined && (
                  <span>
                    <br />
                    <Box fontWeight="fontWeightBold">
                      {popupData.data.name_3.Name}:
                    </Box>{" "}
                    {popupData.data.name_3.Value}
                  </span>
                )}
                <Divider />
                <Box fontWeight="fontWeightBold">
                  {
                    popupData.data[
                      maps[mapID].layers[currentLayerID].filters[activeLegend]
                        .column_name
                    ].Name
                  }
                  :{" "}
                </Box>
                <Box>
                  {
                    popupData.data[
                      maps[mapID].layers[currentLayerID].filters[activeLegend]
                        .column_name
                    ].Value
                  }
                  {
                    popupData.data[
                      maps[mapID].layers[currentLayerID].filters[activeLegend]
                        .column_name
                    ].Unit
                  }
                </Box>
              </Box>
            ) : (
              <Box>
                <Box fontWeight="fontWeightBold">
                  {popupData.data.name_1.Name}:
                </Box>{" "}
                {popupData.data.name_1.Value}
                {popupData.data.name_2 !== undefined && (
                  <span>
                    <br />
                    <Box fontWeight="fontWeightBold">
                      {popupData.data.name_2.Name}:
                    </Box>{" "}
                    {popupData.data.name_2.Value}
                  </span>
                )}
                {popupData.data.name_3 !== undefined && (
                  <span>
                    <br />
                    <Box fontWeight="fontWeightBold">
                      {popupData.data.name_3.Name}:
                    </Box>{" "}
                    {popupData.data.name_3.Value}
                  </span>
                )}
                <Divider />
                <Box fontWeight="fontWeightBold">
                  {popupData.data.class.Name}:{" "}
                </Box>
                {popupData.data.class.Value}
                {/* {currentLayerID !== "1" && (
                  <> */}
                <Box fontWeight="fontWeightLight" fontSize={11}>
                  {popupData.data.rr.Name}: {popupData.data.rr.Value}
                  {popupData.data.rr.Unit}
                </Box>
                <Box fontWeight="fontWeightLight" fontSize={11}>
                  {popupData.data["rrd"].Name}: {popupData.data.rrd.Value}
                  {popupData.data.rrd.Unit}
                </Box>
                <Box fontWeight="fontWeightLight" fontSize={11}>
                  {popupData.data["rm"].Name}: {popupData.data.rm.Value}
                  {popupData.data.rm.Unit}
                </Box>
                <Box fontWeight="fontWeightLight" fontSize={11}>
                  {popupData.data.u.Name}: {popupData.data.u.Value}
                  {popupData.data.u.Unit}
                </Box>
                {/* </>
                )} */}
              </Box>
            )}
            <Divider />
            <Grid container justifyContent="flex-end">
              <Link
                key={"seeMore"}
                component="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPopoverOpen(true);
                }}
              >
                SEE MORE
              </Link>
            </Grid>
            {/* Popover */}
            <Dialog
              id={idPopover}
              ref={clickRefPop}
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
              {/* <Fade in={popoverOpen}>
                  <div className={classes.popover}> */}
              <Grid
                container
                pb={0}
                justifyContent="flex-end"
                key={"popoverHeader"}
              >
                <IconButton
                  key={"popoverClose"}
                  fontSize="small"
                  color="default"
                  onClick={(e) => {
                    setPopoverOpen(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
              <DialogTitle>
                {popupData.data.od ? (
                  <React.Fragment>
                    {maps[mapID].layers[currentLayerID].name}
                  </React.Fragment>
                ) : (
                  "Estimated Settlement Area"
                )}
                <Box fontStyle="italic" fontSize={13}>
                  Location: {popupData.latLng.lat.toFixed(5).toString()},{" "}
                  {popupData.latLng.lng.toFixed(5).toString()}
                  <br />
                  {popupData.data.name_1.Name}: {popupData.data.name_1.Value}{" "}
                  {popupData.data.name_2 !== undefined && (
                    <span>
                      <br />
                      {popupData.data.name_2.Name}:{" "}
                      {popupData.data.name_2.Value}
                    </span>
                  )}
                  {popupData.data.name_3 !== undefined && (
                    <span>
                      <br />
                      {popupData.data.name_3.Name}:{" "}
                      {popupData.data.name_3.Value}
                    </span>
                  )}
                </Box>
              </DialogTitle>
              <DialogContent dividers={scroll === "paper"}>
                <Table
                  key={"popoverTable"}
                  aria-label="Data table of values from each variable at the clicked location."
                >
                  {popupData.data.od ? (
                    <React.Fragment>
                      {cat.map((category, i) => {
                        return (
                          <Fragment key={"popoverTableRow" + category}>
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ width: "70%" }}>
                                  <Box fontWeight="fontWeightBold" pt={1}>
                                    {category.toUpperCase()}
                                  </Box>
                                </TableCell>
                                <TableCell
                                  style={{ width: "30%" }}
                                  align="right"
                                ></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(popupData.data).map(
                                (anObjectMapped, j) => {
                                  if (anObjectMapped[1].Category === category) {
                                    return (
                                      <TableRow key={"popoverTableRow" + j}>
                                        <TableCell style={{ width: "75%" }}>
                                          {anObjectMapped[1].Name}
                                        </TableCell>
                                        <TableCell
                                          style={{ width: "25%" }}
                                          align="right"
                                        >
                                          {anObjectMapped[1].Value}{" "}
                                          {anObjectMapped[1].Unit}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  } else {
                                    return null;
                                  }
                                }
                              )}
                            </TableBody>
                          </Fragment>
                        );
                      })}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {cat_lim.map((category, i) => {
                        return (
                          <Fragment key={"popoverTableRow" + category}>
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ width: "70%" }}>
                                  <Box fontWeight="fontWeightBold" pt={1}>
                                    {category.toUpperCase()}
                                  </Box>
                                </TableCell>
                                <TableCell
                                  style={{ width: "30%" }}
                                  align="right"
                                ></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(popupData.data).map(
                                (anObjectMapped, j) => {
                                  if (anObjectMapped[1].Category === category) {
                                    return (
                                      <TableRow key={"popoverTableRow" + j}>
                                        <TableCell style={{ width: "75%" }}>
                                          {anObjectMapped[1].Name}
                                        </TableCell>
                                        <TableCell
                                          style={{ width: "25%" }}
                                          align="right"
                                        >
                                          {anObjectMapped[1].Value}{" "}
                                          {anObjectMapped[1].Unit}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  } else {
                                    return null;
                                  }
                                }
                              )}
                            </TableBody>
                          </Fragment>
                        );
                      })}
                    </React.Fragment>
                  )}
                </Table>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                >
                  {maps[mapID].layers[currentLayerID].name === "5x5km area" ? (
                    <CSVLink
                      className={classes.download}
                      data={downloadData}
                      filename={
                        "SPT_" +
                        popupData.latLng.lat.toFixed(5).toString() +
                        "_" +
                        popupData.latLng.lng.toFixed(5).toString() +
                        ".csv"
                      }
                    >
                      DOWNLOAD TABLE
                    </CSVLink>
                  ) : popupData.data.name_3 !== undefined ? (
                    <CSVLink
                      className={classes.download}
                      data={downloadData}
                      filename={"SPT_" + popupData.data.name_3.Value + ".csv"}
                    >
                      DOWNLOAD TABLE
                    </CSVLink>
                  ) : popupData.data.name_3 !== undefined ? (
                    <CSVLink
                      className={classes.download}
                      data={downloadData}
                      filename={"SPT_" + popupData.data.name_2.Value + ".csv"}
                    >
                      DOWNLOAD TABLE
                    </CSVLink>
                  ) : (
                    <CSVLink
                      className={classes.download}
                      data={downloadData}
                      filename={"SPT_" + popupData.data.name_1.Value + ".csv"}
                    >
                      DOWNLOAD TABLE
                    </CSVLink>
                  )}
                </Button>
              </DialogActions>
              {/* </div>
                </Fade> */}
            </Dialog>
          </div>
        </Popper>
      )}
    </React.Fragment>
  );
};
