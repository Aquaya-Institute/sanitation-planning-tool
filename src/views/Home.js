import { Paper, Grid, Card, CardContent, CardActionArea, CardMedia,CardActions, Container, Button,Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { MapContext } from "../state/MapState";


const useCardStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 275,
  },
  media: {
    height: 140,
  },
});

function MapCard({name, url}) {
  const classes = useCardStyles();
  return (
 
    <Card className={classes.root}>
      <CardActionArea component={Link} to={url}>
        <CardMedia
          className={classes.media}
          /* Show a static tile generated from map */
          image="/none"
          title={`Map of ${name}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
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
      <Paper elevation={0} >
        <Box p={2} >
        <Typography variant="h5" color="secondary">
        <strong>What</strong> is the SanPlan tool?
        </Typography>
          <br></br>
          SanPlan saves sanitation practitioners the time and challenges of collecting, analyzing, 
          and mapping data to inform their program design by giving them access to information on key 
          contextual factors, all in one place. Users can explore trends and patterns 
          within a geographic area, or use the built in filters and sliders to customize their analysis 
          and download detailed, granular data on their area of interest.
        </Box>
        <Box  p={2}>
        <Typography variant="h5" color="secondary" p={2}>
          <strong>Who</strong> should use this tool? 
        </Typography>
          <br></br>
          The tool is designed for anyone in the planning or budgeting phase of a sanitation project at the 
          national, regional or local scale. Typical users might include government agencies, program funders, 
          and implementing partners who are looking to better understand more existing context where they are 
          planning to work.
        </Box>
        <Box  p={2}>
        <Typography variant="h5" color="secondary">
        <strong>How</strong> does the tool work? 
        </Typography>
          <br></br>
          SanPlan uses existing publicly available data and links it to a specific location on the map. This 
          allows users to click anywhere on the map and access information on key contextual factors.  
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
