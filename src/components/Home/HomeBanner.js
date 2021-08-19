/* accessibility: mui components done*/
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";
import HomeLayout from "./HomeLayout";
import backgroundImage from "../../images/latrinebanner.jpg";
import usaidLogo from "../../images/usaid-rect.png";

const styles = (theme) => ({
  root: {
    fontFamily: "Source Sans Pro",
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
        align="center"
        variant="h2"
        marked="center"
        component="h1"
      >
        The Sanitation Planning Tool <br />
        (SanPlan)
      </Typography>
      <div display="flex">
        <Grid>
          <Typography
            color="inherit"
            align="center"
            variant="h6"
            marked="center"
            component="h2"
          >
            Funded By
          </Typography>
        </Grid>
        <Grid>
          <a href="https://www.usaid.gov/">
            <img
              align="left"
              style={{ height: "85px", width: "215px" }}
              src={usaidLogo}
              alt="USAID rectangular logo"
            />
          </a>
        </Grid>
      </div>
      <Typography
        color="inherit"
        variant="h6"
        className={classes.h5}
        component="h3"
      >
        Use SanPlan to design and execute sanitation programs by exploring
        highly-localized, contextual, spatial data. SanPlan harmonizes data from
        multiple sources so that you can visualize geographic patterns and local
        contexts from anywhere.
      </Typography>

      <Typography
        variant="body2"
        color="inherit"
        className={classes.more}
        component="h4"
      >
        <strong>Explore the map tool below.</strong>
      </Typography>
    </HomeLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
