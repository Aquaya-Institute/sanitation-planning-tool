import * as React from "react";
import { MapContext } from "../state/MapState";
import { Box, Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import WashIcon from "../images/wash.png";
import SocioIcon from "../images/socioecon.png";
import HealthIcon from "../images/health.png";
import AccessIcon from "../images/access.png";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FilterMenu from "./subcomponents/FilterMenu";
import Tour from "./subcomponents/Tour";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Paper from "@material-ui/core/Paper";
import theme from "../theme/theme";
import Badge from "@material-ui/core/Badge";

/* Toggle button overrides */
const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
    align: "center",
  },
  checkboxLabel: {
    fontSize: 13,
  },
}));
const drawerWidth = 116;

export const MapLayers = () => {
  //pick specific states (and dispatcher) we need from mapstate
  const [
    {
      maps,
      currentMapID,
      // accessCounter,
      // washCounter,
      // socioCounter,
      // healthCounter,
    },
    dispatch,
  ] = useContext(MapContext);
  const [mapID, setMapID] = useState("ghana");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  const [scaleValue, setScaleValue] = useState("2");

  const setActive = (event, text) => {
    setSelectedMenu(text);
  };

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

  // // District dropdown
  // useEffect(() => {
  //   if (cartoClient && districtsSource) {
  //     const legendDropdown = new Carto.dataview.Category(
  //       districtsSource,
  //       "district",
  //       {
  //         limit: 216,
  //       }
  //     );
  //     cartoClient.addDataview(legendDropdown);

  //     legendDropdown.on("dataChanged", (data) => {
  //       console.log("dataChanged");
  //       const countryNames = data.categories
  //         .map((category) => category.name)
  //         .sort();
  //       setAllDistricts(countryNames);
  //     });
  //   }
  // }, [cartoClient, districtsSource]);

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <Box mt={1.5} align="center" fontWeight="fontWeightBold">
            <Typography color="secondary">INDICATOR THEMES</Typography>
          </Box>
          <Box
            p={1}
            variant="subtitle2"
            fontStyle="italic"
            fontSize={13.5}
            fontWeight="fontWeightBold"
          >
            Select to view filters:
          </Box>
          {/* {accessCounter && ( */}
          <List>
            <Badge
              badgeContent={maps[mapID].layers[scaleValue].accessCounter}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              showZero={false}
              color="secondary"
              overlap="circle"
            >
              <ListItem
                button
                key={"accessButton"}
                selected={selectedMenu === 0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFilterMenuOpen(true);
                  setAnchorEl(e.currentTarget);
                  setActive(e, 0);
                }}
                style={{
                  backgroundColor: selectedMenu === 0 ? "#FFFFFF" : "#f2f2f2",
                }}
              >
                <div
                  key={"accessButtonContent"}
                  style={{
                    minHeight: "10vh",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" align="center">
                    <img src={AccessIcon} alt="Road" />
                    <br />
                    ACCESS-IBILITY
                  </Typography>
                </div>
                {selectedMenu === 0 && (
                  <FilterMenu
                    anchorEl={anchorEl}
                    filterMenuOpen={filterMenuOpen}
                    setFilterMenuOpen={setFilterMenuOpen}
                    cat={"accessibility"}
                    setSelectedMenu={setSelectedMenu}
                    layerID={scaleValue}
                  />
                )}
              </ListItem>
            </Badge>
            <Badge
              badgeContent={maps[mapID].layers[scaleValue].washCounter}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              showZero={false}
              color="secondary"
              overlap="circle"
            >
              <ListItem
                button
                key={"washButton"}
                selected={selectedMenu === 1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFilterMenuOpen(true);
                  setAnchorEl(e.currentTarget);
                  setActive(e, 1);
                }}
                style={{
                  backgroundColor: selectedMenu === 1 ? "#FFFFFF" : "#f2f2f2",
                }}
              >
                <div
                  key={"washButtonContent"}
                  style={{
                    minHeight: "10vh",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" align="center">
                    <img src={WashIcon} alt="Road" />
                    <br />
                    WATER & SANITATION
                  </Typography>
                </div>
                {selectedMenu === 1 && (
                  <FilterMenu
                    anchorEl={anchorEl}
                    filterMenuOpen={filterMenuOpen}
                    setFilterMenuOpen={setFilterMenuOpen}
                    cat={"wash"}
                    setSelectedMenu={setSelectedMenu}
                    layerID={scaleValue}
                  />
                )}
              </ListItem>
            </Badge>
            <Badge
              badgeContent={maps[mapID].layers[scaleValue].socioCounter}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              showZero={false}
              color="secondary"
              overlap="circle"
            >
              <ListItem
                button
                // id={text}
                key={"socioButton"}
                selected={selectedMenu === 2}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFilterMenuOpen(true);
                  setAnchorEl(e.currentTarget);
                  setActive(e, 2);
                }}
                style={{
                  backgroundColor: selectedMenu === 2 ? "#FFFFFF" : "#f2f2f2",
                }}
              >
                <div
                  key={"socioButtonContent"}
                  style={{
                    minHeight: "10vh",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" align="center">
                    <img src={SocioIcon} alt="Road" />
                    <br />
                    SOCIO-ECOMONIC
                  </Typography>
                </div>
                {selectedMenu === 2 && (
                  <FilterMenu
                    anchorEl={anchorEl}
                    filterMenuOpen={filterMenuOpen}
                    setFilterMenuOpen={setFilterMenuOpen}
                    cat={"socioeconomic"}
                    setSelectedMenu={setSelectedMenu}
                    layerID={scaleValue}
                  />
                )}
              </ListItem>
            </Badge>
            <Badge
              badgeContent={maps[mapID].layers[scaleValue].healthCounter}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              showZero={false}
              color="secondary"
              overlap="circle"
            >
              <ListItem
                button
                // id={text}
                key={"healthButton"}
                selected={selectedMenu === 3}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFilterMenuOpen(true);
                  setAnchorEl(e.currentTarget);
                  setActive(e, 3);
                }}
                style={{
                  backgroundColor: selectedMenu === 3 ? "#FFFFFF" : "#f2f2f2",
                }}
              >
                <div
                  key={"healthButtonContent"}
                  style={{
                    minHeight: "10vh",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" align="center">
                    <img src={HealthIcon} alt="Road" />
                    <br />
                    DISEASE BURDEN
                  </Typography>
                </div>
                {selectedMenu === 3 && (
                  <FilterMenu
                    anchorEl={anchorEl}
                    filterMenuOpen={filterMenuOpen}
                    setFilterMenuOpen={setFilterMenuOpen}
                    cat={"health"}
                    setSelectedMenu={setSelectedMenu}
                    layerID={scaleValue}
                  />
                )}
              </ListItem>
            </Badge>
          </List>
          {/* )} */}
          <Divider />
          <List>
            <ListItem
              button
              key="reset"
              style={{
                minHeight: "5vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" align="center">
                Reset Filters
              </Typography>
            </ListItem>
            <ListItem>
              <Tour style={{ justifyContent: "center" }} />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <Paper
        key={"commCalculator"}
        style={{
          padding: theme.spacing(1),
          position: "absolute",
          bottom: "unset",
          right: "0px",
          top: "0px",
          left: "unset",
          height: "auto",
          width: "240px",
          zIndex: "1000",
          backgroundColor: "#fff", //theme.palette.background.paper,
          margin: "auto",
        }}
        elevation={2}
        square
        // variant="outlined"
      >
        <Toolbar />

        <FormControl component="fieldset">
          <FormLabel component="legend">
            <Box mt={1} align="center" fontWeight="fontWeightBold">
              <Typography color="secondary">MAP RESOLUTIONS</Typography>
            </Box>
            <Box
              p={1}
              fontStyle="italic"
              fontWeight="fontWeightBold"
              fontSize={13.5}
              variant="subtitle2"
              style={{ color: "black" }}
            >
              {/* <Typography variant="subtitle2" color="black"> */}
              Select the resolution at which to explore the map:
              {/* </Typography> */}
            </Box>
          </FormLabel>
          <RadioGroup
            p={1}
            aria-label="scale"
            name="scaleSelector"
            value={scaleValue}
            onChange={(e) => {
              setScaleValue(e.target.value);
              toggleLayerVisibility(e.target.value);
            }}
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="1x1km area (Classification layer only)"
              classes={{
                label: classes.checkboxLabel,
              }}
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="5x5km area"
              classes={{
                label: classes.checkboxLabel,
              }}
            />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="District area"
              classes={{
                label: classes.checkboxLabel,
              }}
            />
          </RadioGroup>
        </FormControl>
        {/* <div
          id="avgPopulationWidget"
          class="widget widget-formula"
          className="tour-community-calc"
        > */}
        {/* <Box fontSize="h7.fontSize" align="center">
            Total Mapped Settlement Areas in Current View
          </Box> */}
        {/* <Box class="js-average-population result" align="center" color="secondary">[calculating]</Box> */}
        {/* <Typography
            variant="h5"
            color="secondary"
            align="center"
            fontWeight="fontWeightBold"
            fontSize="h6.fontSize"
          >
            <div class="AveragePopulation">[calculating]</div>
          </Typography> */}
        {/* </div> */}
      </Paper>
    </>
    // <div>
    //   <Paper
    //     style={{ maxHeight: "91vh", overflow: "auto" }}
    //     elevation={0}
    //     key={"drawerPaper"}
    //   >
    //     <Box mt={1.5} p={2}>
    //       {mapID && (
    //         <Typography variant="h5" color="secondary">
    //           <strong>{maps[mapID].name}</strong>
    //         </Typography>
    //       )}
    //     </Box>
    //     <Divider />
    //     <Box mt={2} ml={2}>
    //       <Typography variant="button" color="inherit">
    //         <strong>Explore Maps of Key Contextual Factors</strong>
    //       </Typography>
    //     </Box>
    //     {maps[mapID].layers.map((layer, layerIndex) => (
    //       <List key={"collapseHeader" + layerIndex} disablePadding>
    //         {layer.name ===
    //           "5x5km area" ||
    //         layer.name === "Districts"||
    //         layer.name === "Communities" ? (
    //           <div></div>
    //         ) : (
    //           <div>
    //             <MapLayerContent layer={layer} layerIndex={layerIndex} />
    //           </div>
    //         )}
    //       </List>
    //     ))}
    //     <Box mt={2} ml={2} mr={2}>
    //       <Typography variant="button" color="inherit">
    //         <strong>
    //           Locate Settlements & Districts by Contextual Factor(s)
    //         </strong>
    //       </Typography>
    //     </Box>
    //     {maps[mapID].layers.map((layer, layerIndex) => (
    //       <List key={"collapseHeader" + layerIndex} disablePadding>
    //         {layer.name ===
    //         "5x5km area"||layer.name === "Communities" ? (
    //           <div className="tour-comm">
    //             <MapLayerContent
    //               layer={layer}
    //               layerIndex={layerIndex}
    //               id="countriesWidget"
    //             />
    //             {/* <Box mt={2} ml={3.5} mb={2} key={"countriesDataview"}>
    //               <div id="countriesWidget" class="widget">
    //                 <Typography variant="subtitle2">
    //                   Select District from Dropdown
    //                 </Typography> */}
    //                 {/* <p>{JSON.stringify(selectedDistricts)}</p> */}
    //                 {/* <Select
    //                   labelId="demo-simple-select-disabled-label"
    //                   id="demo-simple-select-disabled"
    //                   value={age}
    //                   onChange={handleChange}
    //                   class="js-countries"
    //                 >
    //                   <MenuItem value="">
    //                     <em>All Districts</em>
    //                   </MenuItem>
    //                   {/* {selectedDistricts.map((name) => (
    //                     <MenuItem key={name} value={name}>
    //                       {name}
    //                     </MenuItem>
    //                   ))} */}
    //                 {/* </Select> */}
    //                 {/* <select class="js-countries">
    //                   <option value="">All Districts</option>
    //                 </select>
    //               </div>
    //             </Box> */}
    //           </div>
    //         ) : layer.name === "Districts" ? (
    //           <div className="tour-dist">
    //             <MapLayerContent layer={layer} layerIndex={layerIndex} />
    //           </div>
    //         ) : (
    //           <div></div>
    //         )}
    //       </List>
    //     ))}
    //   </Paper>
    // </div>
    // </div>
  );
};
