import {
  Paper,
  // Grid,
  // Card,
  // CardContent,
  // CardActionArea,
  // CardMedia,
  // CardActions,
  Container,
  Box,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link } from "react-router-dom";
import { MapContext } from "../state/MapState";
import HomeBanner from "../components/Home/HomeBanner";
import HomeMap from "../components/Home/HomeMap";
import HomeRelatedResearch from "../components/Home/HomeRelatedResearch";
import { MapSelector } from "../components/MapSelector";
import HomeHowItWorks from "../components/Home/HomeHowItWorks";

const useCardStyles = makeStyles({
  root: {
    minWidth: 275,
    minHeight: 275,
    backgroundColor: "#ffffff",
    fontFamily: "Source Sans Pro",
  },
  font: {
    fontFamily: "Source Sans Pro",
  },
  media: {
    height: 180,
  },
  content: {
    height: 50,
  },
});

// function MapCard({ name, url }) {
//   const classes = useCardStyles();
//   return (
//     <Card className={classes.root}>
//       <CardActionArea component={Link} to={url}>
//         <CardMedia
//           className={classes.media}
//           /* Show a static tile generated from map */
//           image={`/${name}_thumb.png`}
//           title={`Map of ${name}`}
//         />
//         <CardContent className={classes.content}>
//           <Typography variant="h5" component="h2">
//             {name}
//           </Typography>
//         </CardContent>
//       </CardActionArea>
//       <CardActions>
//         <Button component={Link} to={url} size="small" color="primary">
//           Explore the Map
//         </Button>
//       </CardActions>
//     </Card>
//   );
// }

function Home() {
  const [{ maps }] = React.useContext(MapContext);
  const classes = useCardStyles();
  return (
    <>
      <HomeBanner />
      {/* <br /> */}
      {/* <Typography variant="h5" color="secondary" align="center">
        Click a country to enter the map tool
      </Typography> */}
      <HomeMap />
      <Container>
        <Paper elevation={0}>
          <Box p={2}>
            <Typography variant="h6" color="secondary" className={classes.font}>
              Enter the map tool by selecting a country above or selecting from
              the dropdown:
            </Typography>
            <MapSelector />
          </Box>
        </Paper>
        {/* <Grid container item spacing={2} lg={12}>
          {Object.keys(maps).map((map) => (
            <Grid key={maps[map].mapID} item xs={12} md={4} lg={3}>
              <MapCard name={maps[map].name} url={`/maps/${maps[map].mapID}`} />
            </Grid>
          ))}
        </Grid> */}
      </Container>
      <br />
      <HomeHowItWorks />
      <br />
      <HomeRelatedResearch />
    </>
  );
}

export default Home;
