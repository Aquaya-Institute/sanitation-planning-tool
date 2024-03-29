import { Helmet } from "react-helmet";
import {
  Grid,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import HomeFooter from "../components/Home/HomeFooter";

var link = document.createElement("meta");
link.setAttribute("name", "about page description");
link.content =
  "The about page gives a short description of the tool and its intended use, and the organizations involved in the creation of the tool.";
document.getElementsByTagName("head")[0].appendChild(link);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
  },
}));
function About() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Helmet>
        <html lang="en" />
        <title>About Page</title>
        <meta
          name="About"
          content="Additional details about the SanPlan tool and it's authors."
        />
      </Helmet>

      <Container m={2}>
        <Box mt={3} mb={2} id="publicData">
          <Typography variant="h5" color="primary" component="h1">
            ABOUT SANPLAN
          </Typography>
        </Box>
        <Paper elevation={0}>
          <Box p={2}>
            <Typography variant="h5" color="secondary" component="h2">
              <strong>What</strong> is the SanPlan tool?
            </Typography>
            <br />
            SanPlan saves sanitation practitioners the time and challenges of
            collecting, analyzing, and mapping data to inform their program
            design by giving them access to key contextual data required for
            planning sanitation programs all in one place. SanPlan brings
            together data on settlement-level accessibility, environmental,
            demographic, socioeconomic, and WASH factors and displays the
            information spatially within a map. Users can explore trends and
            patterns within a geographic area, or use the built in filters and
            sliders to customize their analysis and download detailed, granular
            data on their area of interest.
          </Box>
          <Box p={2}>
            <Typography variant="h5" color="secondary" p={2} component="h2">
              <strong>Who</strong> should use this tool?
            </Typography>
            <br />
            The tool is designed for anyone in the planning or budgeting phase
            of a sanitation project at the national, regional or local scale.
            Typical users might include government agencies, program funders,
            and implementing partners who are looking to understand more
            existing context where they are planning to work. Users might use
            SanPlan to identify where communities with high open defecation
            rates and low access to sanitation are in a specific region, or they
            may be interested to know how many settlement areas/communities in
            their region are on a major roadway.
          </Box>
          <Box p={2}>
            <Typography variant="h5" color="secondary" component="h2">
              <strong>How</strong> does the tool work?
            </Typography>
            <br />
            SanPlan uses existing publicly available data and links it to a
            specific location on the map. This allows users to click anywhere on
            the map and access information on key contextual factors. Because
            GPS locations for communities are often unknown or difficult to
            obtain, SanPlan has developed its own method for identifying
            communities and settlements of all sizes on the map. (You can learn
            more about this below). In the future, users will be able to upload
            their own community locations and data and have them visualized in
            the map.
          </Box>
        </Paper>

        <Card elevation={0}>
          <CardContent>
            <Typography variant="h5" color="secondary" component="h2">
              About WASHPaLS
            </Typography>
            <br></br>
            The Water, Sanitation, and Hygiene Partnerships and Learning for
            Sustainability (WASHPaLS) project is a five-year (2016–2021) USAID
            Task Order working to improve water supply, sanitation and hygiene
            (WASH) programming by identifying, researching and sharing best
            practices for the delivery of WASH services and sustained behavior
            change.
          </CardContent>
        </Card>
        <Divider />
        <br></br>
        <Card elevation={0}>
          <CardContent>
            <Typography variant="h6" color="secondary" component="h3">
              Project Contractors
            </Typography>
            <br></br>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <img
                  src="/aquaya.png"
                  alt="The Aquaya Institute logo"
                  style={{ width: "110px", height: "60px" }}
                ></img>
              </Grid>
              <Grid item xs={9} className={classes.paper}>
                AQUAYA INSTITUTE offers experienced scientists and field-based
                WASH researchers who bring an objective, nimble, and rigorous
                approach to implementation research. The Aquaya Institute
                provides technical assistance in the areas of CLTS, water
                quality, market-based approaches, research design, data
                collection, and program evaluation.
              </Grid>
            </Grid>
            <br></br>
            <Divider />
            <br></br>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <img
                  src="/tetratech.png"
                  alt="TetraTech company logo"
                  style={{ width: "200px", height: "60px" }}
                ></img>
              </Grid>
              <Grid item xs={9} className={classes.paper}>
                TETRA TECH has over 30 years of successful WASH sector
                programming and thought leadership. Tetra Tech provides
                technical assistance in the areas of rural water supply,
                sustainability assessments, the sanitation value chain including
                fecal sludge management, and environmental compliance.<br></br>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Divider />
      </Container>
      <HomeFooter />
    </React.Fragment>
  );
}
export default About;
