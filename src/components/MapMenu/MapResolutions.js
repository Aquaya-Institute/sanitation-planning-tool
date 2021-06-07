import { useState, useEffect, useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Box, Typography, Popper, Dialog, Grid } from "@material-ui/core";
import { MapContext } from "../../state/MapState";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";

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
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
}));

export const MapResolutions = ({
  anchorEl,
  filterMenuOpen,
  setFilterMenuOpen,
  cat,
  setSelectedMenu,
}) => {
  const [{ maps, currentMapID, activeLayer }, dispatch] =
    useContext(MapContext);
  const [mapID, setMapID] = useState(currentMapID);
  // const [activeLayer, setActiveLayer] = useState("2");
  const [checked, setChecked] = useState(false);
  const classes = useStyles();
  const [setMenuTileColor] = useState(false);
  const clickRefMenu = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const idPopover = popoverOpen ? "simple-popover" : undefined;
  const clickRef = useRef(null);
  const [scroll] = useState("paper");

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
      // setDistName([]);
      // setActiveLayer(maps[currentMapID].currentLayer);
    }
  }, [currentMapID, mapID]);

  //click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clickRefMenu.current &&
        !clickRefMenu.current.contains(event.target)
      ) {
        console.log("clicked outside");
        if (clickRef.current && !clickRef.current.contains(event.target)) {
          setPopoverOpen(null);
          console.log("clicked outside");
        } else if (
          clickRef.current &&
          clickRef.current.contains(event.target)
        ) {
        } else {
          setFilterMenuOpen(false);
          setSelectedMenu(null);
        }
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setFilterMenuOpen, setSelectedMenu]);

  const toggleLayerVisibility = (activeLayer) => {
    console.log("radio");
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      layerID: activeLayer,
    });
  };

  return (
    <Popper
      // id={cat + "filterMenu"}
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
      open={filterMenuOpen}
      onClose={(e) => {
        setFilterMenuOpen(false);
        setMenuTileColor(false);
      }}
    >
      {mapID && (
        <Box p={2}>
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
                  aria-label="Map resolution options"
                  name="resolutionSelector"
                  value={activeLayer}
                  onChange={(e) => {
                    // setDistName([]);

                    if (e.target.value === "4" && checked === false) {
                      setPopoverOpen(true);
                    } else {
                      toggleLayerVisibility(e.target.value);
                    }
                  }}
                  className="tour-scale"
                  key="radioLabel"
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="1x1km areas (Rural Typology layer only)"
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
                    label={maps[mapID].layers["3"].name + "s"}
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="radio3"
                  />
                  {maps[mapID].layers["4"] && (
                    <div className="tour-comms">
                      <Divider />
                      <FormControlLabel
                        value="4"
                        // disabled={disabled}
                        control={<Radio />}
                        label="Estimated settlement areas (Beta)"
                        classes={{
                          label: classes.checkboxLabel,
                        }}
                        key="radio4"
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
                        <Grid
                          container
                          justify="flex-end"
                          key={"popoverHeader"}
                        >
                          <CloseIcon
                            key={"popoverClose"}
                            fontSize="small"
                            color="disabled"
                            onClick={(e) => {
                              setPopoverOpen(false);
                            }}
                          />
                        </Grid>
                        <DialogTitle>
                          Estimated Settlements Layer (Beta)
                        </DialogTitle>
                        <DialogContent dividers={scroll === "paper"}>
                          <Typography
                            key="filterListItemLabel"
                            variant="body2"
                            // style={{ fontSize: 11 }}
                            gutterBottom
                          >
                            The settlements layer is an estimation and still
                            under development. Some settlements may not be
                            captured and values are estimated from data of lower
                            resolution and therefore not precise.
                          </Typography>
                          <DialogActions>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  key="consent"
                                  checked={checked}
                                  name="consent"
                                  onChange={() => {
                                    setChecked(!checked);
                                    if (!checked === true) {
                                      toggleLayerVisibility("4");
                                    } else {
                                      toggleLayerVisibility("2");
                                    }
                                  }}
                                  icon={
                                    <CheckBoxOutlineBlankIcon fontSize="small" />
                                  }
                                  checkedIcon={
                                    <CheckBoxIcon fontSize="small" />
                                  }
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
                    </div>
                  )}
                </RadioGroup>
              </Box>
            )}
          </FormControl>
        </Box>
      )}
    </Popper>
  );
};
