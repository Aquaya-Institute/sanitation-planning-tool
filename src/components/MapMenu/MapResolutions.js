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
  const [{ maps, currentMapID, currentLayerID }, dispatch] =
    useContext(MapContext);
  const [mapID, setMapID] = useState(currentMapID);
  const classes = useStyles();
  const [setMenuTileColor] = useState(false);
  const clickRefMenu = useRef(null);
  const [setPopoverOpen] = useState(false);
  const clickRef = useRef(null);

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
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

  const toggleLayerVisibility = (currentLayerID) => {
    console.log("radio");
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      newLayerID: currentLayerID,
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
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="1x1km areas (Rural Typology layer only)"
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="1x1km-layer-radio"
                    inputprops={{ "aria-label": "1x1km-layer-radio" }}
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="5x5km areas"
                    classes={{
                      label: classes.checkboxLabel,
                    }}
                    key="5x5km-layer-radio"
                    inputprops={{ "aria-label": "5x5km-layer-radio" }}
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
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
