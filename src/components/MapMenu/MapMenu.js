import * as React from "react";
import { MapContext } from "../../state/MapState";
import { Box, Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import WashIcon from "../../images/wash.png";
import SocioIcon from "../../images/socioecon.png";
import HealthIcon from "../../images/health.png";
import AccessIcon from "../../images/access.png";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FilterMenu from "./FilterMenu";
import Tour from "../subcomponents/Tour";
import theme from "../../theme/theme";
import Badge from "@material-ui/core/Badge";
import TabsWrappedLabel from "../TabBox/TabBox";
// import ReactFileReader from "react-file-reader";

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
const drawerWidth = 135;

export const MapMenu = () => {
  //pick specific states (and dispatcher) we need from mapstate
  const [{ maps, currentMapID, activeLayer }, dispatch] = useContext(
    MapContext
  );
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
                badgeContent={
                  maps[mapID].layers[activeLayer].accessCounter.size
                }
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
                  <div
                    key="accessButtonContent"
                    style={{
                      minHeight: "10vh",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      align="center"
                      key="accessLabel"
                    >
                      <img src={AccessIcon} alt="Road icon" />
                      <br />
                      ACCESS-IBILITY
                    </Typography>
                  </div>
                  {selectedMenu === 0 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"accessibility"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={activeLayer}
                    />
                  )}
                </ListItem>
              </Badge>
              <Badge
                key="washBadge"
                badgeContent={maps[mapID].layers[activeLayer].washCounter.size}
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
                  <div
                    key="washButtonContent"
                    style={{
                      minHeight: "10vh",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      align="center"
                      key="washLabel"
                    >
                      <img
                        src={WashIcon}
                        alt="Hand catching a water droplet icon"
                      />
                      <br />
                      WATER & SANITATION
                    </Typography>
                  </div>
                  {selectedMenu === 1 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"wash"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={activeLayer}
                    />
                  )}
                </ListItem>
              </Badge>
              <Badge
                key="socioBadge"
                badgeContent={maps[mapID].layers[activeLayer].socioCounter.size}
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
                  <div
                    key="socioButtonContent"
                    style={{
                      minHeight: "10vh",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      align="center"
                      key="socioLabel"
                    >
                      <img
                        src={SocioIcon}
                        alt="Bag of money with a bowl and wheat icon"
                      />
                      <br />
                      SOCIO-ECOMONIC
                    </Typography>
                  </div>
                  {selectedMenu === 2 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"socioeconomic"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={activeLayer}
                    />
                  )}
                </ListItem>
              </Badge>
              <Badge
                key="healthBadge"
                badgeContent={
                  maps[mapID].layers[activeLayer].healthCounter.size
                }
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
                  <div
                    key="healthButtonContent"
                    style={{
                      minHeight: "10vh",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      align="center"
                      key="healthLabel"
                    >
                      <img src={HealthIcon} alt="Heart with a plus icon" />
                      <br />
                      DISEASE BURDEN
                    </Typography>
                  </div>
                  {selectedMenu === 3 && (
                    <FilterMenu
                      key="filterMenus"
                      anchorEl={anchorEl}
                      filterMenuOpen={filterMenuOpen}
                      setFilterMenuOpen={setFilterMenuOpen}
                      cat={"health"}
                      setSelectedMenu={setSelectedMenu}
                      layerID={activeLayer}
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
              style={{ borderRight: "1px solid #CFCDC9" }}
            >
              <Tour key="tour" style={{ justifyContent: "center" }} />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <TabsWrappedLabel />
    </React.Fragment>
  );
};
