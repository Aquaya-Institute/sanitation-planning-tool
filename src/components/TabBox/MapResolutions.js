import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Box } from "@material-ui/core";
import { MapContext } from "../../state/MapState";

const useStyles = makeStyles((theme) => ({
  checkboxLabel: {
    fontSize: 13,
  },
}));

export const MapResolutions = () => {
  const [{ maps, currentMapID }, dispatch] = useContext(MapContext);
  const [mapID, setMapID] = useState("ghana");
  const [scaleValue, setScaleValue] = useState("2");

  const classes = useStyles();

  useEffect(() => {
    if (currentMapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID]);

  const toggleLayerVisibility = (layerID) => {
    dispatch({
      type: "layer.toggle",
      mapID: mapID,
      layerID: layerID,
    });
  };

  return (
    <FormControl component="fieldset" key="fieldset">
      <FormLabel component="legend" key="legend">
        {/* <Box mt={1} align="center" fontWeight="fontWeightBold" key="rightBox">
          <Typography key="rightBoxLabel" color="secondary">
            MAP RESOLUTIONS
          </Typography>
        </Box> */}
        <Box
          p={1}
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
      <Box pl={1}>
        <RadioGroup
          // p={1}
          aria-label="scale"
          name="scaleSelector"
          value={scaleValue}
          onChange={(e) => {
            setScaleValue(e.target.value);
            toggleLayerVisibility(e.target.value);
          }}
          className="tour-scale"
          key="radioLabel"
        >
          <FormControlLabel
            value="1"
            control={<Radio />}
            label="1x1km area (Classification layer only)"
            classes={{
              label: classes.checkboxLabel,
            }}
            key="radio1"
          />
          <FormControlLabel
            value="2"
            control={<Radio />}
            label="5x5km area"
            classes={{
              label: classes.checkboxLabel,
            }}
            key="radio2"
          />
          <FormControlLabel
            value="3"
            control={<Radio />}
            label="District area"
            classes={{
              label: classes.checkboxLabel,
            }}
            key="radio3"
          />
        </RadioGroup>
      </Box>
    </FormControl>
    // </Paper>
  );
};
