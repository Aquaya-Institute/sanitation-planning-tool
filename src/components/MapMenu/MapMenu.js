import * as React from "react";
import { MapContext } from "../../state/MapState";
import { Box, Typography, Button } from "@material-ui/core";
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

/* Toggle button overrides */
const useStyles = makeStyles((theme) => ({
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
  checkboxLabel: {
    fontSize: 13,
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
          <Box
            mt={1.5}
            align="center"
            fontWeight="fontWeightBold"
            key="scalesTitle"
            style={{ borderRight: "1px solid #CFCDC9" }}
          >
            <Typography key="scalesTitleLabel" color="secondary">
              MAP SCALES
            </Typography>
          </Box>
          <Box
            key="scalesSubtitle"
            p={1}
            variant="subtitle2"
            fontStyle="italic"
            fontSize={13.5}
            fontWeight="fontWeightBold"
            style={{ borderRight: "1px solid #CFCDC9" }}
          >
            Change resolution and focus of map:
          </Box>
          <ListItem
            className="tour-scale"
            button
            key={"resButton"}
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
              backgroundColor:
                selectedMenu === 4
                  ? theme.palette.background.selected
                  : theme.palette.background.default,
            }}
          >
            <Box
              key="resButtonContent"
              mx="auto"
              my="auto"
              style={{
                minHeight: "5vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                justify="center"
                startIcon={
                  <img
                    src={resolutionIcon}
                    alt="square with outward facing arrows icon"
                    height="25px"
                  />
                }
                style={{ fontSize: 13, padding: 0 }}
              >
                SET RESOLUTION
              </Button>
            </Box>
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
              backgroundColor:
                selectedMenu === 5
                  ? theme.palette.background.selected
                  : theme.palette.background.default,
            }}
          >
            <Box
              key="dropButtonContent"
              mx="auto"
              my="auto"
              style={{
                minHeight: "5vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {mapID && (
                <Button
                  justify="center"
                  startIcon={
                    <img
                      src={boundaryIcon}
                      alt="map with dropped pin icon"
                      height="25px"
                    />
                  }
                  style={{ fontSize: 13, padding: 0 }}
                >
                  SELECT {maps[mapID].layers["3"].name}(S)
                </Button>
              )}
            </Box>
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
          <Divider />
          <Box
            mt={1.5}
            align="center"
            fontWeight="fontWeightBold"
            key="themesTitle"
            style={{ borderRight: "1px solid #CFCDC9" }}
          >
            <Typography key="themesTitleLabel" color="secondary">
              INDICATOR THEMES
            </Typography>
          </Box>
          <Box
            key="themesSubtitle"
            p={1}
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
                    width: drawerWidth - 1,
                    borderBottom:
                      selectedMenu === 0 ? "1px solid #CFCDC9" : null,
                    borderTop: selectedMenu === 0 ? "1px solid #CFCDC9" : null,
                    borderRight:
                      selectedMenu !== 0 ? "1px solid #CFCDC9" : null,
                    backgroundColor:
                      selectedMenu === 0
                        ? theme.palette.background.selected
                        : theme.palette.background.default,
                  }}
                >
                  <Box
                    key="accessButtonContent"
                    // mx="auto"
                    my="auto"
                    style={{
                      minHeight: "5vh",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      justify="center"
                      mx="auto"
                      startIcon={
                        <img src={AccessIcon} alt="Road icon" height="20px" />
                      }
                      // onClick={startTour}
                      style={{ fontSize: 13, padding: 0 }}
                    >
                      ACCESSIBILITY & REMOTENESS
                    </Button>
                  </Box>
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
                overlap="circle"
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
                    backgroundColor:
                      selectedMenu === 1
                        ? theme.palette.background.selected
                        : theme.palette.background.default,
                  }}
                >
                  <Box
                    key="washButtonContent"
                    // mx="auto"
                    my="auto"
                    style={{
                      minHeight: "5vh",
                      justifyContent: "center",
                      alignItems: "center",
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
                      // onClick={startTour}
                      style={{ fontSize: 13, padding: 0 }}
                    >
                      WATER & SANITATION
                    </Button>
                  </Box>
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
                overlap="circle"
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
                    backgroundColor:
                      selectedMenu === 2
                        ? theme.palette.background.selected
                        : theme.palette.background.default,
                  }}
                >
                  <Box
                    // mx="auto"
                    my="auto"
                    key="socioButtonContent"
                    style={{
                      minHeight: "5vh",
                      justifyContent: "center",
                      alignItems: "center",
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
                      // onClick={startTour}
                      style={{ fontSize: 13, padding: 0 }}
                    >
                      SOCIOECONOMIC
                    </Button>
                  </Box>
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
                overlap="circle"
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
                    backgroundColor:
                      selectedMenu === 3
                        ? theme.palette.background.selected
                        : theme.palette.background.default,
                  }}
                >
                  <Box
                    key="healthButtonContent"
                    // mx="auto"
                    my="auto"
                    style={{
                      minHeight: "5vh",
                      // justifyContent: "center",
                      // alignItems: "center",
                    }}
                  >
                    <Button
                      justify="center"
                      my="auto"
                      startIcon={
                        <img
                          src={HealthIcon}
                          alt="Heart with a plus icon"
                          height="27px"
                        />
                      }
                      // onClick={startTour}
                      style={{ fontSize: 13, padding: 0 }}
                    >
                      DISEASE BURDEN
                    </Button>
                  </Box>
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
              <Typography
                variant="button"
                align="center"
                key="resetLabel"
                style={{ fontSize: 13 }}
              >
                Reset Filters
              </Typography>
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
