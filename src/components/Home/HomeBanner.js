import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import HomeLayout from "./HomeLayout";
import backgroundImage from "../../images/latrinebanner.jpg";

const styles = (theme) => ({
  root: {
    fontFamily: "Source Sans Pro",
  },
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: "#7fc7d9", // Average color of the background image.
    backgroundPosition: "center",
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(10),
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
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        The Sanitation Planning Tool <br />
        (SanPlan)
      </Typography>
      <Typography color="inherit" variant="h6" className={classes.h5}>
        Design and execute sanitation programs by exploring highly-localized,
        contextual, spatial data. SanPlan harmonizes data from multiple sources
        so that you can visualize geographic patterns and local contexts from
        anywhere.
      </Typography>

      <Typography variant="body2" color="inherit" className={classes.more}>
        <strong>Explore the map tool below.</strong>
      </Typography>
    </HomeLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
