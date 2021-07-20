/* accessibility: mui components done*/
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import theme from "../../theme/theme";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: 0,
    display: "flex",
    fontFamily: "Source Sans Pro",
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    display: "flex",
    justifycontent: "center",
    backgroundColor: "#000000",
    padding: theme.spacing(8, 3),
    color: "#FFFFFF",
  },
  cardContent: {
    maxWidth: 400,
  },
  textField: {
    width: "100%",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  button: {
    width: "100%",
  },
  imagesWrapper: {
    position: "relative",
  },
  imageDots: {
    position: "absolute",
    top: -67,
    left: -67,
    right: 0,
    bottom: -67,
    width: "100%",
    background: "url(/static/onepirate/productCTAImageDots.png)",
  },
  image: {
    position: "absolute",
    top: -35,
    left: -30,
    right: 0,
    // bottom: 80,
    width: "100%",
    maxWidth: 600,
  },
  font: {
    fontFamily: "Source Sans Pro",
  },
});

function ProductCTA(props) {
  const { classes } = props;

  return (
    <Container className={classes.root} component="section">
      <Grid container>
        <Grid item xs={12} md={12} className={classes.cardWrapper}>
          <Typography
            variant="h3"
            marked="center"
            className={classes.root}
            fontWeight="fontWeightBold"
            component="h2"
          >
            <strong>HOW IT WORKS</strong>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} className={classes.cardWrapper}>
          <div className={classes.card}>
            <Typography variant="h2" component="h3" gutterBottom>
              Video Tutorial Placeholder
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={6} className={classes.imagesWrapper}>
          <Hidden smDown>
            <div className={classes.imageDots} />
            <Box
              p={5}
              className={classes.image}
              border={2}
              borderColor={theme.palette.secondary.main}
            >
              <Typography
                variant="h5"
                p={2}
                gutterBottom
                className={classes.font}
                component="h3"
              >
                <strong>Who should use this tool?</strong>
              </Typography>
              SanPlan is intended for use for sanitation projects at national,
              regional or local scales. Users in the planning or budgeting
              phases can use the spatial information to select and target
              interventions based on the characteristics of a particular
              geographic area. Similarly, someone in the monitoring & reporting
              phase could use the tool to compare the local context of their
              program area to the rest of the country. Program implementers,
              funders, and government institutions, and researchers are all
              intended users.
            </Box>
          </Hidden>
        </Grid>
      </Grid>
    </Container>
  );
}

ProductCTA.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCTA);
