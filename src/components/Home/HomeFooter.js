/* accessibility: mui components done*/
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Container, Typography, Link, Grid } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const styles = (theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#000000",
    overflow: "hidden",
    color: "#FFFFFF",
    fontFamily: "Source Sans Pro",
  },
  container: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Source Sans Pro",
  },
  title: {
    marginBottom: theme.spacing(5),
    fontSize: 13,
  },
});

function ProductHowItWorks(props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Grid container>
          <Grid item xs={6}>
            <Typography align="left">CONTACT US</Typography>
            <Typography align="left" gutterBottom>
              Have feedback for us? Let us know at{" "}
              <a
                href="mailto:sanplan.app?subject=SanPlan%20App%3A"
                style={{ color: "white" }}
              >
                support@sanplan.app
              </a>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Link component={RouterLink} color="inherit" to="/privacy">
              <Typography align="left">PRIVACY POLICY</Typography>
            </Link>
          </Grid>
        </Grid>
        <Typography variant="body1" marked="center" className={classes.title}>
          <br></br>
          The information provided on this Web site is not official U.S.
          Government information and does not represent the views or positions
          of the U.S. Agency for International Development or the U.S.
          Government.
        </Typography>
      </Container>
    </section>
  );
}

ProductHowItWorks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHowItWorks);
