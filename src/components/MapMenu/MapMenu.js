import * as React from "react";
import { MapContext } from "../../state/MapState";
import {
  Box,
  Typography,
  ListItemText,
  ListItemIcon,
  Drawer,
  Toolbar,
  Divider,
  List,
  ListItem,
} from "@material-ui/core";
import WashIcon from "../../images/wash.png";
import SocioIcon from "../../images/socioecon.png";
import HealthIcon from "../../images/health.png";
import AccessIcon from "../../images/access.png";
import resolutionIcon from "../../images/resolution.png";
import boundaryIcon from "../../images/boundaryselect.png";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FilterMenu from "./FilterMenu";
import Tour from "../subcomponents/Tour";
import Badge from "@material-ui/core/Badge";
import { MapResolutions } from "./MapResolutions";
import { DropdownMenu } from "./DropdownMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    "&$selected": {
      backgroundColor: "white",
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
  const [{ maps, currentMapID, currentLayerID, currentCountry }, dispatch] =
    useContext(MapContext);
  const [mapID, setMapID] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = React.useState(null);
  const setActive = (event, text) => {
    setSelectedMenu(text);
  };
  const classes = useStyles();

  useEffect(() => {
    if (currentMapID) {
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
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar key="toolbar" />
        <div className={classes.drawerContainer} key="drawerContainer">
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
              }}
              classes={{ root: classes.root, selected: classes.selected }}
            >
              <ListItemIcon className={classes.item}>
                <img
                  src={resolutionIcon}
                  alt="square with outward facing arrows icon"
                  height="25px"
                />
              </ListItemIcon>
              <ListItemText primary="SET RESOLUTION" className={classes.item} />
              {selectedMenu === 4 && (
                <MapResolutions
                  anchorEl={anchorEl}
                  filterMenuOpen={filterMenuOpen}
                  setFilterMenuOpen={setFilterMenuOpen}
                  cat={"drop"}
                  setSelectedMenu={setSelectedMenu}
                />
              )}
            </ListItem>
            {mapID && (
              <ListItem
                className="tour-dropdown"
                button
                key={"dropButton"}
                selected={selectedMenu === 5}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFilterMenuOpen(true);
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
                {selectedMenu === 5 && (
                  <DropdownMenu
                    anchorEl={anchorEl}
                    filterMenuOpen={filterMenuOpen}
                    setFilterMenuOpen={setFilterMenuOpen}
                    cat={"drop"}
                    setSelectedMenu={setSelectedMenu}
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
            <List className="tour-themes" key="themeList">
              <Badge
                key="accessBadge"
                badgeContent={currentCountry[currentLayerID].accessCounter.size}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                showZero={false}
                color="secondary"
                overlap="circular"
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
                    width: drawerWidth - 1,
                    borderBottom:
                      selectedMenu === 0 ? "1px solid #CFCDC9" : null,
                    borderTop: selectedMenu === 0 ? "1px solid #CFCDC9" : null,
                    borderRight:
                      selectedMenu !== 0 ? "1px solid #CFCDC9" : null,
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
                  {selectedMenu === 0 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"accessibility"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={currentLayerID}
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
                  {selectedMenu === 1 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"wash"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={currentLayerID}
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
                  {selectedMenu === 2 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"socioeconomic"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={currentLayerID}
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
                  {selectedMenu === 3 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"health"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={currentLayerID}
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
            </ListItem>
            <ListItem
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
