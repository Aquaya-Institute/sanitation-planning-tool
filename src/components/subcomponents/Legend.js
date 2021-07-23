import { useContext, Fragment } from "react";
import { MapContext } from "../../state/MapState";
import "leaflet/dist/leaflet.css";
import { Grid, Box, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import theme from "../../theme/theme";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import TabsWrappedLabel from "../TabBox/TabBox";
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
      <Paper
        square
        pb={2}
        style={{
          padding: theme.spacing(0.5),
          backgroundColor: theme.palette.background.default,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={hideLayer}
              onChange={() => {
                setHideLayer(!hideLayer);

                if (!hideLayer === true) {
                  currentCountry[currentLayerID].layer.hide();
                } else {
                  currentCountry[currentLayerID].layer.show();
                }
              }}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              color="primary"
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
      </Paper>
      {/* <Paper
        square
        pb={2}
        style={{
        padding: theme.spacing(0.5),
        backgroundColor: theme.palette.background.default,
        }}
        >
        <Grid container spacing={0}>
        <Box>
            <Typography variant="subtitle2">Change opacity</Typography>
        </Box>
        <Box mx="auto" width="210px" height="45px">
            <Slider
            value={value}
            aria-labelledby={"Opacity range slider"}
            marks={[
                { value: 0, label: "0%" },
                { value: 100, label: "100%" },
            ]}
            onChange={handleOpacityChange}
            />
        </Box>
        </Grid>
        </Paper> */}
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
          {/* {maps[mapID].layers[currentLayerID].name === buckets.variable && ( */}
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
