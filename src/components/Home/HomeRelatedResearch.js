import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Container, Link, Typography } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.primary.light,
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
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(0, 2),
    fontFamily: "Source Sans Pro",
  },
  title: {
    marginBottom: theme.spacing(5),
    fontFamily: "Source Sans Pro",
  },
  number: {
    fontSize: 24,
    fontFamily: "Source Sans Pro",
    color: "#FFFFFF",
    fontWeight: theme.typography.fontWeightMedium,
  },
  image: {
    height: 55,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180,
    opacity: 0.7,
  },
});

function ProductHowItWorks(props) {
  const { classes } = props;
  const preventDefault = (event) => event.preventDefault();

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Typography
          variant="h3"
          marked="center"
          className={classes.title}
          fontWeight="fontWeightBold"
          component="h2"
        >
          <strong>RELATED RESEARCH</strong>
        </Typography>
        <Typography variant="body1" marked="center" className={classes.title}>
          This tool was built as a follow-on to USAID's Water, Sanitation and
          Hygiene Partnerships and Learning for Sustainability (WASHPaLS)
          Performance Envelope research, which sought to examine how local
          context and program implementation strategies affect CLTS outcomes
          across multiple countries. The aim of this research is to provide
          governments, donors, and implementing organizations with insights to
          i) target rural sanitation activities to areas with the highest
          likelihood of success, and ii) adapt implementation strategies to
          maximize the chances for their success and sustainability.
        </Typography>
        <React.Fragment>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number} align="center">
                  <strong>WHERE DOES CLTS WORK BEST?</strong>
                </div>
                <Link
                  href="https://pubs.acs.org/doi/full/10.1021/acs.est.0c05733"
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Publication
                </Link>
                <Link
                  href="https://www.globalwaters.org/resources/assets/washpals/targeting-community-led-total-sanitation-clts-favorable-contexts-factors-0"
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Cambodia Research Brief
                </Link>
                <Link
                  href="https://www.globalwaters.org/resources/assets/washpals/targeting-community-led-total-sanitation-clts-favorable-contexts-factors"
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Ghana Research Brief
                </Link>
                <Link
                  href="https://www.globalwaters.org/resources/assets/washpals/targeting-community-led-total-sanitation-clts-favorable-contexts-factors-2"
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Liberia Research Brief
                </Link>
                <Link
                  href="https://www.globalwaters.org/resources/assets/washpals/targeting-community-led-total-sanitation-clts-favorable-contexts-factors-1"
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Zambia Research Brief
                </Link>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number} align="center">
                  <strong>
                    HOW DO COMMUNITIES SUSTAIN LATRINE COVERAGE AND USE?
                  </strong>
                </div>
                <Link
                  href="https://www.mdpi.com/2071-1050/13/10/5440/htm"
                  onClick={preventDefault}
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Publication
                </Link>
                <Link
                  href="https://www.globalwaters.org/resources/assets/washpals/sustaining-latrine-coverage-and-use-study-cambodia-rural-sanitation-and-hygiene"
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Cambodia Research Brief
                </Link>
                <Link
                  href="https://www.globalwaters.org/resources/assets/washpals/sustaining-latrine-coverage-and-use-study-community-led-total-sanitation-programs"
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Ghana Research Brief
                </Link>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>
                  <strong>COMBINED TAKEAWAYS</strong>
                </div>
                <Link
                  href="#"
                  onClick={preventDefault}
                  variant="h6"
                  align="center"
                  color="inherit"
                  className={classes.root}
                >
                  Combined Quantitative / Qualitative Final Report
                </Link>
              </div>
            </Grid>
          </Grid>
        </React.Fragment>
      </Container>
    </section>
  );
}

ProductHowItWorks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHowItWorks);
