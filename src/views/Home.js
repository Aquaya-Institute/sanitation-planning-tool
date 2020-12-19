import { Grid, Card, CardContent, CardActionArea, CardMedia,CardActions, Container, Button,Box, Typography } from "@material-ui/core";
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
          <Typography variant="body2" color="textSecondary" component="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            convallis diam at vestibulum rutrum. Proin facilisis ornare neque,
            eget sodales nisl posuere id.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button component={Link} to={url} size="small" color="primary">
          Open
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
      <Box mt={4} mb={4}>
        <Typography variant="h4" color="secondary">
          Sanitation Planning Maps
        </Typography>
      </Box>
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
