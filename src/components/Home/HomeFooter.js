import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
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
    // fontFamily: "Source Sans Pro",
    fontSize: 15,
  },
});

function ProductHowItWorks(props) {
  const { classes } = props;
  const preventDefault = (event) => event.preventDefault();

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Typography variant="body1" marked="center" className={classes.title}>
          The information provided on this Web site is not official U.S.
          Government information and does not represent the views or positions
          of the U.S. Agency for International Development or the U.S.
          Government.
        </Typography>
        <Link component={RouterLink} color="inherit" to="/privacy">
          <Typography align="left">PRIVACY</Typography>
        </Link>
      </Container>
    </section>
  );
}

ProductHowItWorks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHowItWorks);
