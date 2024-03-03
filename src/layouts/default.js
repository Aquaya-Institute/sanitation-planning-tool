import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  // Typography,
  Button,
  Link,
  CssBaseline,
  Container,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { MapSelector } from "../components/subcomponents/MapSelector";
import MoreIcon from "@material-ui/icons/MoreVert";
import { MapContext } from "../state/MapState";
// import { Survey } from "../components/subcomponents/Survey";

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
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const mobileMenuId = "primary-search-account-menu-mobile";
  const [dispatch] = React.useContext(MapContext);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [url, setUrl] = useState("");
  // const [surveyOpen, setSurveyOpen] = useState(false);
  const clickRefPop = useRef(null);
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const renderMobileMenu = (
    <>
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
          onClick={(event) => {
            if (
              (window.location.pathname !== "") &
              (window.location.pathname !== "/") &
              (window.location.pathname !== "/datasets") &
              (window.location.pathname !== "/faq") &
              (window.location.pathname !== "/about")
            ) {
              // setSurveyOpen(true);
              setUrl(event.target.value);
            }
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
    </>
  );

  return (
    <div
      className={classes.root}
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <CssBaseline />
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <Link
            component={RouterLink}
            color="inherit"
            to="/"
            onClick={(event) => {
              if (
                (window.location.pathname !== "") &
                (window.location.pathname !== "/") &
                (window.location.pathname !== "/datasets") &
                (window.location.pathname !== "/faq") &
                (window.location.pathname !== "/about")
              ) {
                // setSurveyOpen(true);
                setUrl(event.target.value);
              }
            }}
          >
            <img
              src="/SanPlanLogo_twotone.png"
              alt="SanPlan Tool logo"
              style={{ width: "110px", height: "55px" }}
            ></img>
            {/* <Typography variant="h6" className={classes.title}>
              SanPlan
            </Typography> */}
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
                onClick={(event) => {
                  if (
                    (window.location.pathname !== "") &
                    (window.location.pathname !== "/") &
                    (window.location.pathname !== "/datasets") &
                    (window.location.pathname !== "/faq") &
                    (window.location.pathname !== "/about")
                  ) {
                    // setSurveyOpen(true);
                    setUrl(event.target.value);
                  }
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
      {/* {surveyOpen === true && surveyPrompt === false ? (
        <Survey
          setSurveyOpen={setSurveyOpen}
          surveyOpen={surveyOpen}
          clickRefPop={clickRefPop}
          url={url}
        />
      ) : null} */}
      <main style={{ flex: 1, display: "flex" }}>
        <Container maxWidth={false} disableGutters={true}>
          {props.children}
        </Container>
      </main>
      {renderMobileMenu}
    </div>
  );
}
