import { Helmet } from "react-helmet";
import { Paper, Container, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Link } from "react-router-dom";
import HomeBanner from "../components/Home/HomeBanner";
import HomeMap from "../components/Home/HomeMap";
import HomeRelatedResearch from "../components/Home/HomeRelatedResearch";
import { MapSelector } from "../components/subcomponents/MapSelector";
// import HomeHowItWorks from "../components/Home/HomeHowItWorks";
import HomeFooter from "../components/Home/HomeFooter";
import ReactTooltip from "react-tooltip";

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
  content: {
    height: 50,
  },
});

function Home() {
  const classes = useCardStyles();
  const [content, setContent] = useState("");

  return (
    <React.Fragment>
      <Helmet>
        <html lang="en" />
        <title>Home Page</title>
        <meta
          name="Home"
          content="Application description, navigator and related research."
        />
      </Helmet>
      <HomeBanner />
      <HomeMap setTooltipContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
      <Container>
        <Paper elevation={0}>
          <Box p={2}>
            <Typography
              variant="h6"
              color="secondary"
              className={classes.font}
              component="h5"
            >
              Enter the map tool by selecting a country above or selecting from
              the dropdown:
            </Typography>
            <MapSelector
              inputProps={{
                name: "country-drop-name-home",
                id: "country-drop-id-home",
                "aria-label": "country-drop-id-home",
              }}
            />
          </Box>
        </Paper>
      </Container>
      <br />
      {/* <HomeHowItWorks />
      <br /> */}
      <HomeRelatedResearch />
      <HomeFooter />
    </React.Fragment>
  );
}

export default Home;
