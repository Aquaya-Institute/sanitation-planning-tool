/* accessibility: mui components done*/
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import HomeLayout from "./HomeLayout";
import backgroundImage from "../../images/latrinebanner.jpg";
import usaidLogo from "../../images/USAID_funded.png";

const styles = (theme) => ({
  root: {
    fontFamily: "Source Sans Pro",
    fontWeight: "bold",
  },
  title: {
    fontFamily: "Kefa",
  },
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: "#7fc7d9",
    backgroundPosition: "center",
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(4),
    },
    fontFamily: "Source Sans Pro",
  },
  more: {
    marginTop: theme.spacing(2),
    fontFamily: "Source Sans Pro",
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <HomeLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: "none" }}
        src={backgroundImage}
        alt="Two complete and one partial mud and clay latrine superstructures with thatch roofs in Ghana"
      />

      <Typography
        color="inherit"
        align="left"
        variant="h2"
        className={classes.root}
        component="h1"
      >
        SanPlan: The Sanitation Planning Tool
      </Typography>

      <Typography
        color="inherit"
        variant="h6"
        className={classes.h5}
        component="h3"
      >
        Use SanPlan to design sanitation programs by exploring highly-localized,
        contextual, spatial data. SanPlan harmonizes data from multiple sources
        so that you can visualize geographic patterns and local contexts from
        anywhere.
      </Typography>

      <Typography
        color="inherit"
        variant="h6"
        className={classes.h5}
        component="h3"
      >
        Explore the map tool below.
      </Typography>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <a href="https://www.usaid.gov/">
          <img
            align="left"
            style={{ height: "85px", width: "215px" }}
            src={usaidLogo}
            alt="USAID rectangular logo"
          />
        </a>
      </div>
    </HomeLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
