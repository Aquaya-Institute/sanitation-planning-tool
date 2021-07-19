import * as React from "react";
import { MapContext } from "../../state/MapState";
import {
  Box,
  Typography,
  Button,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import WashIcon from "../../images/wash.png";
import SocioIcon from "../../images/socioecon.png";
import HealthIcon from "../../images/health.png";
import AccessIcon from "../../images/access.png";
import resolutionIcon from "../../images/resolution.png";
import boundaryIcon from "../../images/boundaryselect.png";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FilterMenu from "./FilterMenu";
import Tour from "../subcomponents/Tour";
import theme from "../../theme/theme";
import Badge from "@material-ui/core/Badge";
import { MapResolutions } from "./MapResolutions";
import { DropdownMenu } from "./DropdownMenu";
// import TrapFocus from "@material-ui/unstyled/Unstable_TrapFocus";

/* Toggle button overrides */
const useStyles = makeStyles((theme) => ({
  root: {
    "&$selected": {
      backgroundColor: "white",
      // "&:hover": {
      //   backgroundColor: "yellow",
      // },
    },
  },
  selected: {},
  nested: {
    paddingLeft: theme.spacing(4),
  },
  drawerPaper: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: theme.palette.background.default,
  },
  drawerContainer: {
    overflow: "auto",
    align: "center",
  },
  item: {
    // fontSize: "13",
    // padding: 0,
    // textAlign: "left",
    "& span, & svg": {
      fontSize: 12.5,
      padding: 0,
      textAlign: "left",
    },
    minWidth: "35px",
  },
  reset: {
    "& span, & svg": {
      fontSize: 12.5,
      padding: 0,
      textAlign: "center",
    },
    minWidth: "35px",
  },
}));
const drawerWidth = 175;

export const MapMenu = () => {
  //pick specific states (and dispatcher) we need from mapstate
  const [{ maps, currentMapID, currentLayerID, currentCountry }, dispatch] =
    useContext(MapContext);
  const [mapID, setMapID] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  // const [scaleValue, setScaleValue] = useState("2");

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

  const resetFilter = () => {
    dispatch({
      type: "reset.filters",
      mapID: mapID,
    });
  };

  return (
    <React.Fragment key="drawerDiv">
      <Drawer
        key="drawer"
        // className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        // style={{ borderRight: "1px solid #CFCDC9" }}
      >
        <Toolbar key="toolbar" />
        <div
          className={classes.drawerContainer}
          key="drawerContainer"
          // style={{ borderRight: "1px solid #CFCDC9" }}
        >
          <Box m={1} align="center" id="publicData" fontSize={20}>
            {currentMapID && (
              <Typography variant="h5" color="primary" component="h1">
                {maps[currentMapID].name.toUpperCase()}
              </Typography>
            )}
          </Box>
          <Divider />
          <Box
            mt={1.5}
            align="center"
            fontWeight="fontWeightBold"
            key="scalesTitle"
            style={{ borderRight: "1px solid #CFCDC9" }}
          >
            <Typography key="scalesTitleLabel" color="secondary" component="h2">
              MAP SCALES
            </Typography>
          </Box>
          <Box
            key="scalesSubtitle"
            p={1}
            pb={0}
            variant="subtitle2"
            fontStyle="italic"
            fontSize={13.5}
            fontWeight="fontWeightBold"
            style={{ borderRight: "1px solid #CFCDC9" }}
          >
            Change resolution and focus of map:
          </Box>
          <List>
            <ListItem
              // disableEnforceFocus
              // tabIndex="1"
              className="tour-scale"
              button={true}
              key={"resButton"}
              autoFocus={true}
              selected={selectedMenu === 4}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFilterMenuOpen(true);
                setAnchorEl(e.currentTarget);
                setActive(e, 4);
              }}
              style={{
                width: drawerWidth - 1,
                borderBottom: selectedMenu === 4 ? "1px solid #CFCDC9" : null,
                borderTop: selectedMenu === 4 ? "1px solid #CFCDC9" : null,
                borderRight: selectedMenu !== 4 ? "1px solid #CFCDC9" : null,
                // backgroundColor:
                //   selectedMenu === 4
                //     ? theme.palette.background.selected
                //     : theme.palette.background.default,
              }}
              classes={{ root: classes.root, selected: classes.selected }}
            >
              {/* <Box
              key="resButtonContent"
              mx="auto"
              my="auto"
              style={{
                minHeight: "5vh",
                // justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            > */}
              <ListItemIcon className={classes.item}>
                <img
                  src={resolutionIcon}
                  alt="square with outward facing arrows icon"
                  height="25px"
                />
              </ListItemIcon>
              <ListItemText primary="SET RESOLUTION" className={classes.item} />
              {/* <Button
                justify="center"
                startIcon={
                  <img
                    src={resolutionIcon}
                    alt="square with outward facing arrows icon"
                    height="25px"
                  />
                }
                style={{ fontSize: 13, padding: 0, textAlign: "left" }}
              >
                SET RESOLUTION
              </Button>
            </Box> */}
              {selectedMenu === 4 && (
                // <div tabindex="1">
                <MapResolutions
                  anchorEl={anchorEl}
                  filterMenuOpen={filterMenuOpen}
                  setFilterMenuOpen={setFilterMenuOpen}
                  cat={"drop"}
                  setSelectedMenu={setSelectedMenu}
                  // tabIndex={1}
                />
                // </div>
              )}
            </ListItem>
            {mapID && (
              <ListItem
                // tabIndex={2}
                className="tour-dropdown"
                button
                key={"dropButton"}
                selected={selectedMenu === 5}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFilterMenuOpen(true);
                  // document
                  //   .getElementById("select-areas-mutiple-checkbox")
                  //   .focus();
                  // document.getElementById("popperDrop").focus();
                  setAnchorEl(e.currentTarget);
                  setActive(e, 5);
                }}
                style={{
                  width: drawerWidth - 1,
                  borderBottom: selectedMenu === 5 ? "1px solid #CFCDC9" : null,
                  borderTop: selectedMenu === 5 ? "1px solid #CFCDC9" : null,
                  borderRight: selectedMenu !== 5 ? "1px solid #CFCDC9" : null,
                }}
                classes={{ root: classes.root, selected: classes.selected }}
              >
                <ListItemIcon className={classes.item}>
                  <img
                    src={boundaryIcon}
                    alt="map with dropped pin icon"
                    height="25px"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    "SELECT " +
                    maps[mapID].layers["3"].name.toUpperCase() +
                    "(S)"
                  }
                  className={classes.item}
                />
                {/* <Box
              key="dropButtonContent"
              mx="auto"
              my="auto"
              style={{
                minHeight: "5vh",
                // justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            > */}
                {/* {mapID && (
                <Button
                  startIcon={
                    <img
                      src={boundaryIcon}
                      alt="map with dropped pin icon"
                      height="25px"
                    />
                  }
                  style={{
                    fontSize: 13,
                    padding: 0,
                    textAlign: "left",
                  }}
                >
                  SELECT {maps[mapID].layers["3"].name}(S)
                </Button>
              )}
            </Box> */}
                {selectedMenu === 5 && (
                  <DropdownMenu
                    anchorEl={anchorEl}
                    filterMenuOpen={filterMenuOpen}
                    setFilterMenuOpen={setFilterMenuOpen}
                    cat={"drop"}
                    setSelectedMenu={setSelectedMenu}
                    // tabIndex={2}
                  />
                )}
              </ListItem>
            )}
          </List>
          <Divider />
          <Box
            mt={1.5}
            align="center"
            fontWeight="fontWeightBold"
            key="themesTitle"
            style={{ borderRight: "1px solid #CFCDC9" }}
          >
            <Typography key="themesTitleLabel" color="secondary" component="h2">
              INDICATOR THEMES
            </Typography>
          </Box>
          <Box
            key="themesSubtitle"
            p={1}
            pb={0}
            variant="subtitle2"
            fontStyle="italic"
            fontSize={13.5}
            fontWeight="fontWeightBold"
            style={{ borderRight: "1px solid #CFCDC9" }}
          >
            Select a theme to view filters:
          </Box>
          {mapID && (
            <List
              className="tour-themes"
              key="themeList"
              // style={{ borderRight: "1px solid #CFCDC9" }}
            >
              <Badge
                key="accessBadge"
                badgeContent={currentCountry[currentLayerID].accessCounter.size}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                showZero={false}
                color="secondary"
                overlap="circular"
              >
                <ListItem
                  // tabIndex="3"
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
                    width: drawerWidth - 1,
                    borderBottom:
                      selectedMenu === 0 ? "1px solid #CFCDC9" : null,
                    borderTop: selectedMenu === 0 ? "1px solid #CFCDC9" : null,
                    borderRight:
                      selectedMenu !== 0 ? "1px solid #CFCDC9" : null,
                    // backgroundColor:
                    //   selectedMenu === 0
                    //     ? theme.palette.background.selected
                    //     : theme.palette.background.default,
                  }}
                  classes={{ root: classes.root, selected: classes.selected }}
                >
                  <ListItemIcon className={classes.item}>
                    <img src={AccessIcon} alt="Road icon" height="20px" />
                  </ListItemIcon>
                  <ListItemText
                    primary="ACCESSIBILITY"
                    className={classes.item}
                  />
                  {/* <Box
                    key="accessButtonContent"
                    style={{
                      minHeight: "5vh",
                      // justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Button
                      startIcon={
                        <img src={AccessIcon} alt="Road icon" height="20px" />
                      }
                      // onClick={startTour}
                      style={{ fontSize: 13, padding: 0, textAlign: "left" }}
                    >
                      ACCESSIBILITY
                    </Button>
                  </Box> */}
                  {selectedMenu === 0 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"accessibility"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={currentLayerID}
                      // tabIndex={"3"}
                    />
                  )}
                </ListItem>
              </Badge>
              <Badge
                key="washBadge"
                badgeContent={currentCountry[currentLayerID].washCounter.size}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                showZero={false}
                color="secondary"
                overlap="circular"
              >
                <ListItem
                  button
                  // tabIndex="4"
                  key="washButton"
                  selected={selectedMenu === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFilterMenuOpen(true);
                    setAnchorEl(e.currentTarget);
                    setActive(e, 1);
                  }}
                  style={{
                    width: drawerWidth - 1,
                    borderBottom:
                      selectedMenu === 1 ? "1px solid #CFCDC9" : null,
                    borderTop: selectedMenu === 1 ? "1px solid #CFCDC9" : null,
                    borderRight:
                      selectedMenu !== 1 ? "1px solid #CFCDC9" : null,
                    // backgroundColor:
                    //   selectedMenu === 1
                    //     ? theme.palette.background.selected
                    //     : theme.palette.background.default,
                  }}
                  classes={{ root: classes.root, selected: classes.selected }}
                >
                  <ListItemIcon className={classes.item}>
                    <img
                      src={WashIcon}
                      alt="Hand catching a water droplet icon"
                      height="27px"
                    />{" "}
                  </ListItemIcon>
                  <ListItemText
                    primary="WATER & SANITATION"
                    className={classes.item}
                  />
                  {/* <Box
                    key="washButtonContent"
                    style={{
                      minHeight: "5vh",
                      justifyContent: "left",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Button
                      justify="center"
                      startIcon={
                        <img
                          src={WashIcon}
                          alt="Hand catching a water droplet icon"
                          height="27px"
                        />
                      }
                      style={{ fontSize: 13, padding: 0, textAlign: "left" }}
                    >
                      WATER & SANITATION
                    </Button>
                  </Box> */}
                  {selectedMenu === 1 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"wash"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={currentLayerID}
                      // tabIndex={"4"}
                    />
                  )}
                </ListItem>
              </Badge>
              <Badge
                key="socioBadge"
                badgeContent={currentCountry[currentLayerID].socioCounter.size}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                showZero={false}
                color="secondary"
                overlap="circular"
              >
                <ListItem
                  button
                  // tabIndex="5"
                  key="socioButton"
                  selected={selectedMenu === 2}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFilterMenuOpen(true);
                    setAnchorEl(e.currentTarget);
                    setActive(e, 2);
                  }}
                  style={{
                    width: drawerWidth - 1,
                    borderBottom:
                      selectedMenu === 2 ? "1px solid #CFCDC9" : null,
                    borderTop: selectedMenu === 2 ? "1px solid #CFCDC9" : null,
                    borderRight:
                      selectedMenu !== 2 ? "1px solid #CFCDC9" : null,
                    // backgroundColor:
                    //   selectedMenu === 2
                    //     ? theme.palette.background.selected
                    //     : theme.palette.background.default,
                  }}
                  classes={{ root: classes.root, selected: classes.selected }}
                >
                  <ListItemIcon className={classes.item}>
                    <img
                      src={SocioIcon}
                      alt="Bag of money with a bowl and wheat icon"
                      height="35px"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="SOCIOECONOMIC"
                    className={classes.item}
                  />
                  {/* <Box
                    // mx="auto"
                    my="auto"
                    key="socioButtonContent"
                    style={{
                      minHeight: "5vh",
                      // justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Button
                      justify="center"
                      startIcon={
                        <img
                          src={SocioIcon}
                          alt="Bag of money with a bowl and wheat icon"
                          height="35px"
                        />
                      }
                      style={{ fontSize: 13, padding: 0, textAlign: "left" }}
                    >
                      SOCIOECONOMIC
                    </Button>
                  </Box> */}
                  {selectedMenu === 2 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"socioeconomic"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={currentLayerID}
                      // tabIndex={"5"}
                    />
                  )}
                </ListItem>
              </Badge>
              <Badge
                key="healthBadge"
                badgeContent={currentCountry[currentLayerID].healthCounter.size}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                showZero={false}
                color="secondary"
                overlap="circular"
              >
                <ListItem
                  button
                  // tabIndex={"6"}
                  key="healthButton"
                  selected={selectedMenu === 3}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFilterMenuOpen(true);
                    setAnchorEl(e.currentTarget);
                    setActive(e, 3);
                  }}
                  style={{
                    width: drawerWidth - 1,
                    borderBottom:
                      selectedMenu === 3 ? "1px solid #CFCDC9" : null,
                    borderTop: selectedMenu === 3 ? "1px solid #CFCDC9" : null,
                    borderRight:
                      selectedMenu !== 3 ? "1px solid #CFCDC9" : null,
                    // backgroundColor:
                    //   selectedMenu === 3
                    //     ? theme.palette.background.selected
                    //     : theme.palette.background.default,
                  }}
                  classes={{ root: classes.root, selected: classes.selected }}
                >
                  <ListItemIcon className={classes.item}>
                    <img
                      src={HealthIcon}
                      alt="Heart with a plus icon"
                      height="27px"
                    />
                  </ListItemIcon>
                  <ListItemText primary="HEALTH" className={classes.item} />
                  {/* <Box
                    key="healthButtonContent"
                    style={{
                      minHeight: "5vh",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Button
                      justify="left"
                      startIcon={
                        <img
                          src={HealthIcon}
                          alt="Heart with a plus icon"
                          height="27px"
                        />
                      }
                      // onClick={startTour}
                      style={{ fontSize: 13, padding: 0, textAlign: "left" }}
                    >
                      HEALTH
                    </Button>
                  </Box> */}
                  {selectedMenu === 3 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"health"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={currentLayerID}
                      // tabIndex={"6"}
                    />
                  )}
                </ListItem>
              </Badge>
            </List>
          )}
          <Divider />
          <List key="bottomList">
            <ListItem
              button
              // tabIndex={"7"}
              key="reset"
              style={{
                width: drawerWidth - 1,
                minHeight: "3vh",
                justifyContent: "center",
                alignItems: "center",
                borderRight: "1px solid #CFCDC9",
              }}
              onClick={(e, newval) => {
                resetFilter();
              }}
              className="tour-reset"
            >
              <ListItemText primary="RESET FILTERS" className={classes.reset} />
              {/* <Typography
                variant="button"
                align="center"
                key="resetLabel"
                style={{ fontSize: 13 }}
              >
                Reset Filters
              </Typography> */}
            </ListItem>
            <ListItem
              // tabIndex={"8"}
              key="tourButton"
              style={{
                width: drawerWidth - 1,
                borderRight: "1px solid #CFCDC9",
              }}
            >
              <Tour key="tour" style={{ justifyContent: "center" }} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </React.Fragment>
  );
};
