import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import { CssBaseline, Container, Box, Menu, MenuItem } from "@material-ui/core";
import { MapSelector } from "../components/MapSelector";
import MoreIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import { MapContext } from "../state/MapState";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: "left",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    margin: 0,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function DefaultLayout(props) {
  const classes = useStyles();
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const mobileMenuId = "primary-search-account-menu-mobile";
  const [{}, dispatch] = React.useContext(MapContext);

  // const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  //   handleMobileMenuClose();
  // };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        component={RouterLink}
        color="inherit"
        to="/"
        onClick={() => {
          dispatch({
            type: "map.select",
            mapID: null,
          });
        }}
      >
        Home
      </MenuItem>
      <MenuItem
        component={RouterLink}
        color="inherit"
        to="/datasets"
        onClick={() => {
          dispatch({
            type: "map.select",
            mapID: null,
          });
        }}
      >
        Datasets Overview
      </MenuItem>
      <MenuItem
        component={RouterLink}
        color="inherit"
        to="/about"
        onClick={() => {
          dispatch({
            type: "map.select",
            mapID: null,
          });
        }}
      >
        About
      </MenuItem>
      <MenuItem
        component={RouterLink}
        color="inherit"
        to="/faq"
        onClick={() => {
          dispatch({
            type: "map.select",
            mapID: null,
          });
        }}
      >
        FAQ
      </MenuItem>
    </Menu>
  );

  return (
    <div
      className={classes.root}
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <CssBaseline />
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <Link component={RouterLink} color="inherit" to="/">
            <Typography variant="h6" className={classes.title}>
              SanPlan
            </Typography>
          </Link>
          <div className={classes.grow} />
          <Box>
            <span>Change map to:</span>
          </Box>
          <Box ml={3}>
            <MapSelector
              // selectMapID="country-drop-id-nav"
              // selectMapAria="country-drop-id-nav"
              // selectMapName="country-drop-name-nav"
              inputProps={{
                name: "country-drop-name-nav",
                id: "country-drop-id-nav",
                "aria-label": "country-drop-id-nav",
              }}
            />
          </Box>

          <div className={classes.sectionDesktop}>
            <Box ml={3}>
              <Button
                component={RouterLink}
                color="inherit"
                to="/"
                onClick={() => {
                  dispatch({
                    type: "map.select",
                    mapID: null,
                  });
                }}
              >
                Home
              </Button>
            </Box>
            <Box ml={3}>
              <Button
                component={RouterLink}
                color="inherit"
                to="/datasets"
                onClick={() => {
                  dispatch({
                    type: "map.select",
                    mapID: null,
                  });
                }}
              >
                Datasets Overview
              </Button>
            </Box>
            <Box ml={3}>
              <Button
                component={RouterLink}
                color="inherit"
                to="/about"
                onClick={() => {
                  dispatch({
                    type: "map.select",
                    mapID: null,
                  });
                }}
              >
                About
              </Button>
            </Box>
            <Box ml={3}>
              <Button
                component={RouterLink}
                color="inherit"
                to="/faq"
                onClick={() => {
                  dispatch({
                    type: "map.select",
                    mapID: null,
                  });
                }}
              >
                FAQ
              </Button>
            </Box>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <main style={{ flex: 1, display: "flex" }}>
        <Container maxWidth={false} disableGutters={true}>
          {props.children}
        </Container>
      </main>
      {renderMobileMenu}
    </div>
  );
}
