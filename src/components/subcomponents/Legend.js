import { useContext, Fragment } from "react";
import { MapContext } from "../../state/MapState";
import "leaflet/dist/leaflet.css";
import {
  Grid,
  Box,
  Typography,
  Paper,
  FormControl,
  NativeSelect,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@material-ui/core";
import theme from "../../theme/theme";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import TabsWrappedLabel from "../TabBox/TabBox";
import { CalculatorWidget } from "./CalculatorWidget";
export const Legend = ({
  mapID,
  buckets,
  classes,
  handleChange,
  hideLayer,
  setHideLayer,
}) => {
  const [{ maps, currentLayerID, activeLegend, currentCountry }] =
    useContext(MapContext);
  return (
    <div
      style={{
        padding: theme.spacing(1),
        position: "absolute",
        bottom: "10px",
        right: "0px",
        top: "unset",
        left: "unset",
        height: "auto",
        width: "280px",
        zIndex: "1000",
        backgroundColor: "transparent",
      }}
    >
      <TabsWrappedLabel />
      <Paper
        style={{
          height: "5px",
          backgroundColor: "transparent",
        }}
      ></Paper>
      {/* {currentCountry[currentLayerID].source && (
        <Paper>
          <CalculatorWidget />
        </Paper>
      )} */}
      <Paper
        square
        pb={2}
        style={{
          padding: theme.spacing(0.5),
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box pl={1}>
          <FormControlLabel
            control={
              <Switch
                checked={hideLayer}
                onChange={() => {
                  setHideLayer(!hideLayer);
                  if (!hideLayer === true) {
                    currentCountry[currentLayerID].layer.hide();
                  } else {
                    currentCountry[currentLayerID].layer.show();
                  }
                }}
                // icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                // checkedIcon={<CheckBoxIcon fontSize="small" />}
                size="small"
                color="secondary"
                inputProps={{
                  "aria-label": "show/hide-main-layer",
                }}
              />
            }
            label={
              <Typography key="filterListItemLabel" variant="body2">
                Remove layer to view underlying satellite imagery
              </Typography>
            }
            size="small"
          />
        </Box>
      </Paper>
      <Paper
        style={{
          height: "5px",
          backgroundColor: "transparent",
        }}
      ></Paper>
      <Paper
        square
        key={"legendContainer"}
        style={{
          padding: theme.spacing(1),
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Fragment key={"legendContent" + currentLayerID}>
          <Box variant="subtitle2" fontSize={12} fontWeight="light">
            Selected resolution: {maps[mapID].layers[currentLayerID].name + "s"}
          </Box>
          <FormControl className={classes.formControl}>
            <Box
              variant="subtitle2"
              fontStyle="italic"
              fontWeight="fontWeightBold"
            >
              Select the indicator to visualize:
            </Box>
            <NativeSelect
              value={activeLegend}
              onChange={handleChange}
              inputProps={{
                name: "active-legend",
                id: "select-active-legend",
                "aria-label": "select-active-legend",
              }}
              className="tour-legendselect"
              style={{
                backgroundColor: theme.palette.background.selected,
              }}
            >
              {maps[mapID].layers[currentLayerID].filters.map((filter, i) => {
                if (filter.type !== "none") {
                  return (
                    <option key={"filter" + i} value={i}>
                      {filter.name}
                    </option>
                  );
                } else {
                  return null;
                }
              })}
            </NativeSelect>
            <FormHelperText> </FormHelperText>
          </FormControl>
          {buckets && (
            <Fragment key={"legendContent" + buckets.variable}>
              {buckets.legend.map((legend, j) => {
                return (
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    className={classes.element}
                    key={"bucket" + j}
                  >
                    <div
                      className={classes.dot}
                      style={{
                        backgroundColor: legend.value,
                        border: legend.border,
                      }}
                      key={legend.value.toString()}
                    ></div>
                    {legend.min === null
                      ? "No data remaining"
                      : legend.name === undefined
                      ? legend.min.toString() +
                        " - " +
                        legend.max.toString() +
                        " " +
                        maps[mapID].layers[currentLayerID].filters[activeLegend]
                          .unit
                      : legend.name}
                  </Grid>
                );
              })}
            </Fragment>
          )}
        </Fragment>
      </Paper>
    </div>
  );
};
