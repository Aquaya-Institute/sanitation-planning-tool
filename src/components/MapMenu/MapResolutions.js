import { useState, useEffect, useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Box, Popper } from "@material-ui/core";
import { MapContext } from "../../state/MapState";

const useStyles = makeStyles((theme) => ({
  checkboxLabel: {
    fontSize: 13,
  },
}));

export const MapResolutions = ({
  anchorEl,
  filterMenuOpen,
  setFilterMenuOpen,
  cat,
  setSelectedMenu,
  tabIndex,
}) => {
  const [{ maps, currentMapID, currentLayerID }, dispatch] =
    useContext(MapContext);
  const [mapID, setMapID] = useState(currentMapID);
  const classes = useStyles();
  const [setMenuTileColor] = useState(false);
  const clickRefMenu = useRef(null);
  // const [setPopoverOpen] = useState(false);
  const clickRef = useRef(null);
  const radioRef = useRef();

  useEffect(() => {
    if (currentMapID !== mapID) {
      setMapID(currentMapID);
      // setDistName([]);
      // setcurrentLayerID(maps[currentMapID].currentLayer);
    }
  }, [currentMapID, mapID]);

  //click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clickRefMenu.current &&
        !clickRefMenu.current.contains(event.target)
      ) {
        if (clickRef.current && !clickRef.current.contains(event.target)) {
          // setPopoverOpen(null);
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

  const toggleLayerVisibility = (currentLayerID) => {
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      newLayerID: currentLayerID,
    });
  };

  useEffect(() => {
    if (radioRef.current) {
      radioRef.current.focus();
    }
  }, []);

  return (
    <Popper
      // id={cat + "filterMenu"}
      autoFocus={true}
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
        <Box p={2} autoFocus={true}>
          <FormControl component="fieldset" key="fieldset" autoFocus={true}>
            <FormLabel component="legend" key="legend" autoFocus={true}>
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
              <Box pl={1} autoFocus={true}>
                <RadioGroup
                  // tabIndex={1}
                  // p={1}
                  aria-label="Map resolution options"
                  name="resolutionSelector"
                  value={currentLayerID}
                  onChange={(e) => {
                    // setDistName([]);
                    toggleLayerVisibility(e.target.value);
                    // if (
                    //   (e.target.value === "4" || e.target.value === "5") &&
                    //   showSettlementsLayer === false
                    // ) {
                    //   setPopoverOpen(true);
                    // } else {
                    //   toggleLayerVisibility(e.target.value);
                    // }
                  }}
                  className="tour-scale"
                  key="radioLabel"
                  // autoFocus
                >
                  <FormControlLabel
                    value="1"
                    inputRef={radioRef}
                    control={
                      <Radio

                      // tabIndex={tabIndex}
                      />
                    }
                    label="1x1km areas (Rural Typology layer only)"
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="1x1km-layer-radio"
                    inputprops={{ "aria-label": "1x1km-layer-radio" }}
                  />
                  <FormControlLabel
                    value="2"
                    control={
                      <Radio

                      // tabIndex={tabIndex}
                      />
                    }
                    label="5x5km areas"
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="5x5km-layer-radio"
                    inputprops={{ "aria-label": "5x5km-layer-radio" }}
                  />
                  <FormControlLabel
                    value="3"
                    control={
                      <Radio
                      // tabIndex={tabIndex}
                      />
                    }
                    label={
                      maps[mapID].layers["3"].name === "County"
                        ? "Counties"
                        : maps[mapID].layers["3"].name === "Locality"
                        ? "Localities"
                        : maps[mapID].layers["3"].name + "s"
                    }
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="area-layer-radio"
                    inputprops={{ "aria-label": "area-layer-radio" }}
                  />
                </RadioGroup>
              </Box>
            )}
          </FormControl>
        </Box>
      )}
    </Popper>
  );
};
