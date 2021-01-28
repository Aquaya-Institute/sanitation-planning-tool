import {
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Container,
  Button,
  Box,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { MapContext } from "../state/MapState";

const useCardStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 275,
    backgroundColor: "#ffffff",
  },
  media: {
    height: 180,
  },
  content: {
    height: 50,
  },
});

function MapCard({ name, url }) {
  const classes = useCardStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={url}>
        <CardMedia
          className={classes.media}
          /* Show a static tile generated from map */
          image={`/${name}_thumb.png`}
          title={`Map of ${name}`}
        />
        <CardContent className={classes.content}>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button component={Link} to={url} size="small" color="primary">
          Explore the Map
        </Button>
        {/* <Button size="small" color="primary">
          Learn More
        </Button> */}
      </CardActions>
    </Card>
  );
}

function Home() {
  const [{ maps }] = React.useContext(MapContext);

  return (
    <Container>
      <Paper elevation={0}>
        <Box p={2}>
          <Typography variant="h4" color="secondary" align="center">
            <strong>Welcome to the Sanitation Planning Tool</strong>
          </Typography>
        </Box>
        <Box p={2}>
          <Typography variant="h5" color="secondary" gutterBottom>
            <strong>What</strong> is the SanPlan tool?
          </Typography>
          {/* <br></br> */}
          SanPlan helps sanitation practitioners design and execute sanitation
          programs by allowing them to explore highly-localized, contextual,
          spatial data. It harmonizes data from multiple sources so that users
          can visualize geographic patterns and conduct their own analyses.
        </Box>
        <Box p={2}>
          <Typography variant="h5" color="secondary" p={2} gutterBottom>
            <strong>Who</strong> should use this tool?
          </Typography>
          {/* <br></br> */}
          SanPlan is intended for use for sanitation projects at national,
          regional or local scales. Users in the planning or budgeting phases
          can use the spatial information to select and target interventions
          based on the characteristics of a particular geographic area.
          Similarly, someone in the monitoring & reporting phase could use the
          tool to compare the local context of their program area to the rest of
          the country. Program implementers, funders, and government
          institutions, and researchers are all intended users.
        </Box>
        <Box p={2}>
          <Typography variant="h5" color="secondary" gutterBottom>
            <strong>How</strong> does the tool work?
          </Typography>
          {/* <br></br> */}
          SanPlan integrates data on contextual factors that are thought to
          influence sanitation program success, allowing users to identify areas
          where particular interventions are more likely to succeed, or to
          determine what interventions best suit a particular geographic area of
          interest.
        </Box>
      </Paper>
      <Grid container item spacing={2} lg={12}>
        {Object.keys(maps).map((map) => (
          <Grid key={maps[map].mapID} item xs={12} md={4} lg={3}>
            <MapCard name={maps[map].name} url={`/maps/${maps[map].mapID}`} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
