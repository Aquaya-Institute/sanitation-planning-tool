import { Paper, Container, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link } from "react-router-dom";
import HomeBanner from "../components/Home/HomeBanner";
import HomeMap from "../components/Home/HomeMap";
import HomeRelatedResearch from "../components/Home/HomeRelatedResearch";
import { MapSelector } from "../components/MapSelector";
import HomeHowItWorks from "../components/Home/HomeHowItWorks";
import HomeFooter from "../components/Home/HomeFooter";

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

function Home() {
  // const [{ maps }] = React.useContext(MapContext);
  const classes = useCardStyles();
  return (
    <>
      <HomeBanner />
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
      </Container>
      <br />
      <HomeHowItWorks />
      <br />
      <HomeRelatedResearch />
      <HomeFooter />
    </>
  );
}

export default Home;
