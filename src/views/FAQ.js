import { Container, Typography, Box, Paper } from "@material-ui/core";
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
function FAQ() {
  const classes = useStyles();
  return (
    <>
      <Container m={2}>
        <br />
        <Paper elevation={0}>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              What do I do if I find a bug, or have a recommendation or comment
              about the tool?
            </Typography>
            <br />
            Please email any issues or comments to admin@URL.org
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary" p={2}>
              When will my country be available?
            </Typography>
            <br />
            Countries will likely not be added on a regular basis. If you have a
            request for a particular country please contact us and we will try
            to make it a priority as opportunities become available.
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              How can I add my program data to the tool?
            </Typography>
            <br />
            You are currently able to upload data associated with a latitude and
            longitude. Any additional information provided for a set of
            coordinates will be available to view in a popup when the location
            marker is clicked. At this time, you cannot do more than simply
            visualize the locations on the map and compare with underlying data
            layers. <br />
            Coordinates within the CSV file should be in WGS84 (ESPG:4326)
            coordinate reference system.
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              Why can I not see government data? Can I see if the community is
              ODF certified?
            </Typography>
            <br />
            At this time, we are unable to link to national or subnational
            databases and incorporate their data. Most governments do not supply
            community-level information publicly. <br />
            Practitioners are, however, able to upload their own ODF and other
            program data through the upload portal, and visualize them on the
            map.
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              Why do some grid cells appear to be missing?
            </Typography>
            <br />
            Missing grid cells represent areas with insufficient data.
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              Why do urban, rural mixed and rural on-road areas appear so much
              larger at 5km than they do at 1km?
            </Typography>
            <br />
            In the process of aggregating the rural typologies from the 1km
            resolution to 5km, we decided that the 5km grid cell should take on
            the typology of the most developed of the contained 1km cells. Thus,
            if a grid cell is mostly classified as rural on-road, but contains 1
            grid cell of rural mixed, then the 5km grid cell is classified as
            rural mixed. We do this to ensure that small towns and roads, which
            have large implications for supplies and accessibility, are not
            misinterpreted as strictly rural remote.
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              What is an estimated settlement area, and how does that relate to
              actual communities?
            </Typography>
            <br />A settlement area, or settlement “extent” is defined using
            machine learning of structural footprints. Therefore, the
            estimations of settled and non-settled areas are determined only by
            the presence and density of buildings, and not what is considered to
            be a community or village socially, politically, or administratively
            by the government. Therefore, communities that are outspread could
            be mistaken for multiple settlements, and communities within close
            proximity could be enveloped in one settlement.
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              Why are names not included on each settlement?
            </Typography>
            <br />
            Because the settlement areas are developed from secondary satellite
            data, they were not linked to any identifying information. After
            obtaining the datasets, we have linked the administrative boundary
            names to the settlement areas based on location.
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              Why do I need to opt in to the settlements layer?
            </Typography>
            <br />
            We want users to clearly understand the limitation and
            approximations inherent in the estimated settlements layer. The
            layer may be useful for estimating the locations, extent, and
            population of settled areas, but the statistics pulled from this
            layer cannot be confirmed as accurate. First, the number of
            settlements may be incorrect. There are settlement areas and
            scattered households not included in the dataset shown, and there
            can be discrepancies between the source data and currently displayed
            satellite imagery. <br />
            Additionally, many of the data sources for the indicators explored
            in the tool statistically approximated values at a resolution of
            5km. These aggregate values are attributed to a settlement area by
            location, but are not specific to the community or independently
            validated.
          </Box>
          <Box p={2}>
            <Typography variant="h6" color="secondary">
              How do I interpret the data presented in the partial grid cells?
            </Typography>
            <br />
            These partial grid cells, particularly observed along the country
            borders, are attributed indicator values in much the same way as
            full pixels, since all indicators are aggregated at the grid cell
            using the mean (with the exception of population, which is summed).
            It is possible, however, that an average value is over- or
            under-estimated based on activity outside of the country boundary.
            The population estimates are made at the 100m resolution, and thus,
            overstating the population is likely only to happen in the smallest
            of pixel fractions.
          </Box>
        </Paper>
      </Container>
      <HomeFooter />
    </>
  );
}
export default FAQ;
