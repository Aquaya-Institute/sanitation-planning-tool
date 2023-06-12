import { Helmet } from "react-helmet";
import {
  Grid,
  Card,
  CardContent,
  Divider,
  Link,
  Container,
  Button,
  Box,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import "../theme/index.css";
import HomeFooter from "../components/Home/HomeFooter";

var link = document.createElement("meta");
link.setAttribute("name", "datasets page description");
link.content =
  "The datasets overview page lists the name, year, raw resolution, a short description, source organization, associated publication, and link the source for each dataset used within the map tool.";
document.getElementsByTagName("head")[0].appendChild(link);

const useCardStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  image: {
    height: "100%",
    width: "100%",
  },
}));

function Datasets() {
  const classes = useCardStyles();
  const datasetsInfo = [
    {
      name: "Predicted Annual Cholera Incidence",
      description:
        "Each mapped pixel represents the mean annual cholera incidence rate (cases per 100,000 people) in that geographic area between 2010 and 2016.",
      year: "2010-2016",
      resolution: "20km",
      source: "Infectious Disease Dynamics",
      subcategory: "health",
      link: "http://www.iddynamics.jhsph.edu/projects/cholera-dynamics",
      citation:
        "Lessler, J., et al. Mapping the burden of cholera in sub-Saharan Africa and implications for control: an analysis of data across geographical scales. Lancet, 2018: 391(10133): 1908-1915, 10.1016/S0140-6736(17)33050-7",
    },
    {
      name: "Travel Time to Cities",
      description:
        "Each mapped pixel represents the straight-line distance from that location to the nearest city of 50,000 people or larger.",
      year: 2015,
      resolution: "1km",
      source: "Malaria Atlas Project",
      subcategory: "accessibility",
      link: "https://malariaatlas.org/research-project/accessibility-to-cities/",
      citation:
        "Weiss, D.J., et al. A global map of travel time to cities to assess inequalities in accessibility in 2015. (2018). Nature. doi:10.1038/nature25181.",
    },
    {
      name: "Roadways",
      description:
        "'Main' roadways include 'trunk', 'primary', 'secondary' or 'tertiary' roadway. These constitute roadways that link sizable towns together.",
      year: 2020,
      resolution: "vector",
      source: "Open Street Maps",
      subcategory: "socioeconomic",
      note: "This dataset was used to calculate the 'Distance to Roads' dataset.",
      link: "https://www.openstreetmap.org/",
    },
    {
      name: "Population",
      description:
        "Each mapped pixel represents the estimated population in that location.",
      year: 2020,
      resolution: "1km",
      source: "WorldPop",
      subcategory: "socioeconomic",
      note: "This dataset was used to calculate the 'Distance to Towns' dataset.",
      link: "https://www.worldpop.org/",
    },
    {
      name: "Women's Educational Attainment",
      description:
        "Each mapped pixel displays the average years of education for women ages 15-49 in that location.",
      ihme: "IHME estimations were created with various data sources including the Demographic and Health Survey (DHS) and UNICEF Multiple Indicator Cluster Survey (MICS) series, and other country‐specific surveys.",
      year: 2017,
      resolution: "5km",
      source: "Institute for Health Metrics and Evaluation",
      subcategory: "socioeconomic",
      link: "http://www.healthdata.org/research-article/mapping-disparities-education-across-low-and-middle-income-countries",
      citation:
        "Local Burden of Disease Educational Attainment Collaborators. Mapping disparities in education across low- and middle-income countries. Nature. 25 December 2019. doi:10.1038/s41586-019-1872-1.",
    },
    {
      name: "Men's Educational Attainment",
      description:
        "Each mapped pixel displays the average years of education for men ages 15-49 in that location.",
      ihme: "IHME estimations were created with various data sources including the Demographic and Health Survey (DHS) and UNICEF Multiple Indicator Cluster Survey (MICS) series, and other country‐specific surveys.",
      year: 2017,
      resolution: "5km",
      source: "Institute for Health Metrics and Evaluation",
      subcategory: "socioeconomic",
      link: "http://www.healthdata.org/research-article/mapping-disparities-education-across-low-and-middle-income-countries",
      citation:
        "Local Burden of Disease Educational Attainment Collaborators. Mapping disparities in education across low- and middle-income countries. Nature. 25 December 2019. doi:10.1038/s41586-019-1872-1.",
    },
    {
      name: "Diahrrea Prevalence in Children <5 Years",
      description:
        "Each mapped pixel displays the number of diarrhea cases in children under 5 years in that geographic area.",
      ihme: "IHME estimations were created with various data sources including the Demographic and Health Survey (DHS) and UNICEF Multiple Indicator Cluster Survey (MICS) series, and other country‐specific surveys.",
      year: 2017,
      resolution: "5km",
      source: "Institute for Health Metrics and Evaluation",
      subcategory: "health",
      link: "http://www.healthdata.org/research-article/mapping-geographical-inequalities-childhood-diarrhoeal-morbidity-and-mortality-low",
      citation:
        "Local Burden of Disease Diarrhoea Collaborators. Mapping geographical inequalities in childhood diarrhoeal morbidity and mortality in low-income and middle-income countries, 2000–17: analysis for the Global Burden of Disease Study 2017. The Lancet. 6 May 2020. doi:10.1016/S0140-6736(20)30114-8.",
    },
    {
      name: "Reliance on Unimproved Sanitation",
      description:
        "Each mapped pixel displays the percent of the population utilizing an unimproved sanitation source in that geographic area.",
      ihme: "IHME estimations were created with various data sources including the Demographic and Health Survey (DHS) and UNICEF Multiple Indicator Cluster Survey (MICS) series, and other country‐specific surveys.",
      year: 2017,
      resolution: "5km",
      source: "Institute for Health Metrics and Evaluation",
      subcategory: "wash",
      link: "http://www.healthdata.org/research-article/mapping-geographic-inequalities-access-drinking-water-and-sanitation-facilities-low",
      citation:
        "Local Burden of Disease WaSH Collaborators. Mapping geographical inequalities in access to drinking water and sanitation facilities in low-income and middle-income countries, 2000–17. The Lancet Global Health. August 2020. doi:10.1016/S2214-109X(20)30278-3.",
    },
    {
      name: "Reliance on Unimproved Water",
      ihme: "IHME estimations were created with various data sources including the Demographic and Health Survey (DHS) and UNICEF Multiple Indicator Cluster Survey (MICS) series, and other country‐specific surveys.",
      description:
        "Each mapped pixel displays the percent of the population utilizing an unimproved drinking water source in that geographic area.",
      year: 2017,
      resolution: "5km",
      source: "Institute for Health Metrics and Evaluation",
      subcategory: "wash",
      link: "http://www.healthdata.org/research-article/mapping-geographic-inequalities-access-drinking-water-and-sanitation-facilities-low",
      citation:
        "Local Burden of Disease WaSH Collaborators. Mapping geographical inequalities in access to drinking water and sanitation facilities in low-income and middle-income countries, 2000–17. The Lancet Global Health. August 2020. doi:10.1016/S2214-109X(20)30278-3.",
    },
    {
      name: "Population Practicing Open Defecation",
      ihme: "IHME estimations were created with various data sources including the Demographic and Health Survey (DHS) and UNICEF Multiple Indicator Cluster Survey (MICS) series, and other country‐specific surveys.",
      description:
        "Each mapped pixel displays the percent of the population estimated to practice open defecation in that geographic area.",
      year: 2017,
      resolution: "5km",
      source: "Institute for Health Metrics and Evaluation",
      subcategory: "wash",
      link: "http://www.healthdata.org/research-article/mapping-geographic-inequalities-access-drinking-water-and-sanitation-facilities-low",
      citation:
        "Local Burden of Disease WaSH Collaborators. Mapping geographical inequalities in access to drinking water and sanitation facilities in low-income and middle-income countries, 2000–17. The Lancet Global Health. August 2020. doi:10.1016/S2214-109X(20)30278-3.",
    },
    {
      name: "Mortality in Children <5 Years",
      ihme: "IHME estimations were created with various data sources including the Demographic and Health Survey (DHS) and UNICEF Multiple Indicator Cluster Survey (MICS) series, and other country‐specific surveys.",
      description:
        "Each mapped pixel displays the probability of death before reaching age 5 in that geographic area.",
      year: 2017,
      resolution: "5km",
      source: "Institute for Health Metrics and Evaluation",
      subcategory: "health",
      link: "http://www.healthdata.org/research-article/mapping-under-5-and-neonatal-mortality-africa-2000%E2%80%9315-baseline-analysis-sustainable",
      citation:
        "Golding, N., et al. Mapping under-5 and neonatal mortality in Africa, 2000–15: a baseline analysis for the Sustainable Development Goals. The Lancet.",
    },
    {
      name: "Estimated Settlements",
      description:
        "The location and geographic extents of settlement areas estimated from satellite imagery.",
      year: 2020,
      resolution: "vector",
      source: "GRID3",
      subcategory: "layer",
      note: "The raw dataset only includes the settlement area polygons. We manipulated the dataset to aggregated indicator values and administrative boundary names to each settlement area. The dataset divides settlement areas into three categories (ordered from large to small): built up areas, small settlement areas, and hamlets. We removed the smallest hamlets from the dataset prior to loading to the tool.",
      link: "https://grid3.org/",
      citation:
        "Jochem WC, Leasure DR, Pannell O, Chamberlain HR, Jones P, Tatem AJ. Classifying settlement types from multi-scale spatial patterns of building footprints. Environment and Planning B: Urban Analytics and City Science. 2020:1–19.",
    },
  ];
  const datasetsInfoCustom = [
    {
      name: "Distance to Roads",
      description:
        "Each pixel represents the straight-line distance to the nearest trunk, primary, secondary or tertiary roadway. These constitute roadways that link sizable towns together.",
      note: "This dataset was created with the 'Roadways' dataset from Open Street Maps.",
      year: 2020,
      resolution: "200m",
      source: "SanPlan",
      subcategory: "accessibility",
    },
    {
      name: "Distance to Towns",
      description:
        "Each pixel represents the straight-line distance to the nearest ‘town’. SanPlan considers a ‘town’ to be a settlement area with a population of 5,000 or more.",
      note: "This dataset was created with the 'Population' dataset from WorldPop.",
      year: 2020,
      resolution: "200m",
      source: "SanPlan",
      subcategory: "accessibility",
    },
    {
      name: "Rural Typology",
      description:
        "This layer assigns all geographic areas of the country into one of three typologies to give an indication of accessibility and remoteness: rural mixed, rural on-road, and rural remote. These typologies were inspired by the Rethinking Rural Sanitation Guidance. Implementers enacting this guidance will be able to utilize the SanPlan classification layer to determine rural typologys at once, without field visits or key informant interviews.",
      remote:
        "Rural communities far from urban areas or far from main roads. SanPlan considered an area to be ‘rural remote’ if they were further than 25 minutes travel time to a city, further than 800 meters from a small town/city, and more than 1.5 kilometers from a major roadway.",
      road: "Rural communities that are on or close to main road. SanPlan considered an area to be ‘rural on-road’ if it is further than 25 minutes travel time to a city, further than 800 meters from a small town/city, and within 1.5 kilometers from a major roadway.",
      mixed:
        "Communities with mixed rural and urban characteristics such as peri-urban areas or small towns. SanPlan considered an area to be ‘rural mixed’ if it is within 25 minutes travel time to a city or within 800 meters to a small town/city.",
      urban:
        "Cities estimated to have 50,000 people or larger or areas which are within 10 minutes travel time to the city.",
      note: "This dataset was created with the 'Distance to Roads', 'Distance to Towns', and 'Time to Cities' datasets.",
      year: 2020,
      resolution: "200m",
      source: "SanPlan",
      subcategory: "accessibility",
      link: "https://washmatters.wateraid.org/publications/rethinking-rural-sanitation",
    },
  ];
  return (
    <Container>
      <Helmet>
        <html lang="en" />
        <title>Datasets Overview</title>
        <meta
          name="Datasets Overview"
          content="Names, sources, citations and metadata for datasets utilized in the interactive maps."
        />
      </Helmet>
      <Box mt={3} mb={2} id="publicData">
        <Typography variant="h5" color="primary" component="h1">
          OVERVIEW OF DATASETS UTILIZED
        </Typography>
      </Box>
      <Box mb={1} id="publicData">
        <Typography variant="h6" color="secondary" component="h2">
          PUBLIC DATASETS
        </Typography>
      </Box>
      <Grid container item spacing={2} lg={12}>
        {Object.entries(datasetsInfo).map((data, i) => (
          <Grid key={"dataCard" + i} item xs={12} md={12} lg={12}>
            <Card className={classes.root} elevation={0}>
              <CardContent>
                <Typography variant="h6" component="h3">
                  {data[1].name}
                </Typography>
                {data[1].description}
                <br></br>
                <Typography color="textSecondary" component="h4">
                  {data[1].note}
                </Typography>
                <Typography variant="body1" component="h4">
                  Year: {data[1].year}
                </Typography>
                <Typography variant="body1" component="h4">
                  Dataset resolution: {data[1].resolution}
                </Typography>
                <Typography variant="body1" color="primary" component="h4">
                  <strong>{data[1].source}</strong>
                </Typography>
                {data[1].ihme && (
                  <React.Fragment>
                    <Typography variant="body2" gutterBottom>
                      {data[1].ihme}
                    </Typography>
                  </React.Fragment>
                )}
                {data[1].citation && (
                  <Typography variant="body2" color="textSecondary">
                    Corresponding publication: {data[1].citation}
                  </Typography>
                )}
                <Button
                  href={data[1].link}
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  Link to data source
                </Button>
              </CardContent>
            </Card>
            <Divider />
          </Grid>
        ))}
      </Grid>
      <Box mt={3} mb={1} id="customData">
        <Typography variant="h6" color="secondary" component="h2">
          CUSTOM-BUILT DATASETS
        </Typography>
      </Box>
      <Grid container item spacing={2} lg={12}>
        {Object.entries(datasetsInfoCustom).map((data, i) => (
          <Grid
            key={"dataCard" + i}
            item
            xs={12}
            md={12}
            lg={12}
            // id={() => {
            //   if (data[1].name.includes("Classification")) {
            //     return "class";
            //   } else if (data[1].name.includes("Settlement")) {
            //     return "settle";
            //   } else {
            //     return "";
            //   }
            // }}
          >
            <Card className={classes.root} elevation={0}>
              <CardContent>
                <Typography variant="h6" component="h3">
                  {data[1].name}
                </Typography>
                {data[1].description}
                {data[1].remote && (
                  <React.Fragment>
                    <ul>
                      <li>
                        <strong>Urban:</strong> {data[1].urban}
                      </li>
                      <li>
                        <strong>Rural Mixed:</strong> {data[1].mixed}
                      </li>
                      <li>
                        <strong>Rural On-road:</strong> {data[1].road}
                      </li>
                      <li>
                        <strong>Rural Remote:</strong> {data[1].remote}
                      </li>
                    </ul>
                    <center>
                      <img
                        src="/class-rules.png"
                        alt="Chart of the decision tree used to delinate areas between the various classifications, modeled after the definitions of the typologies."
                        style={{ height: "230px", width: "auto" }}
                        // class="center"
                      ></img>
                    </center>
                    <Link href="https://washmatters.wateraid.org/publications/rethinking-rural-sanitation">
                      Check out the Rethinking Rural Sanitation Guidance
                    </Link>
                  </React.Fragment>
                )}
                {data[1].wsf && (
                  <React.Fragment>
                    <ul>
                      <li>
                        <strong>World Settlement Footprint (2015):</strong>{" "}
                        {data[1].wsf}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="h4"
                        >
                          Corresponding publication: {data[1].wsf_citation}
                        </Typography>
                        <Button
                          href={data[1].wsf_link}
                          size="small"
                          variant="outlined"
                          color="primary"
                        >
                          Link to data source
                        </Button>
                      </li>
                      <li>
                        <strong>Data for Good (2016):</strong> {data[1].fb}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="h4"
                        >
                          Corresponding publication: {data[1].fb_citation}
                        </Typography>
                        <Button
                          href={data[1].fb_link}
                          size="small"
                          variant="outlined"
                          color="primary"
                        >
                          Link to data source
                        </Button>
                      </li>
                    </ul>
                  </React.Fragment>
                )}
                <Typography color="textSecondary" component="h4">
                  {data[1].note}
                </Typography>
                <Typography variant="body1" component="h4">
                  Year: {data[1].year}
                </Typography>
                <Typography variant="body1" component="h4">
                  Dataset resolution: {data[1].resolution}
                </Typography>
                <Typography variant="body1" color="primary" component="h4">
                  <strong>{data[1].source}</strong>
                </Typography>
              </CardContent>
            </Card>
            <Divider />
          </Grid>
        ))}
      </Grid>
      <HomeFooter />
    </Container>
  );
}
export default Datasets;
