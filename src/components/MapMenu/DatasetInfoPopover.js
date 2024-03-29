import React from "react";
import InfoOutlinedIcon from "@material-ui/icons/Info";
import { Modal, Backdrop, Fade } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "2000",
  },
  popover: {
    width: 550,
    padding: theme.spacing(1, 1, 1, 1),
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    color: "#a8a8a8",
    "&:focus": {
      color: theme.palette.secondary.main,
    },
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
}));

const datasetsInfo = [
  {
    name: "Predicted Annual Cholera Incidence",
    description:
      "The mean annual cholera incidence rate (cases per 100,000 people) in the immediate geographic area between 2010 and 2016.",
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
      "The straight-line distance from the selected location to the nearest city of 50,000 people or larger.",
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
    name: "Population Estimate",
    description: "The estimated population in the location.",
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
      "The average years of education for women ages 15-49 in the selected location.",
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
      "The average years of education for men ages 15-49 in the selected location.",
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
      "The number of diarrhea cases in children under 5 years in the immediate geographic area.",
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
      "The percent of the population utilizing an unimproved sanitation source in the immediate geographic area.",
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
    name: "Reliance on Unimproved Drinking Water",
    ihme: "IHME estimations were created with various data sources including the Demographic and Health Survey (DHS) and UNICEF Multiple Indicator Cluster Survey (MICS) series, and other country‐specific surveys.",
    description:
      "The percent of the population utilizing an unimproved drinking water source in the immediate geographic area.",
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
      "The percent of the population estimated to practice open defecation in the immediate geographic area.",
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
      "The probability of death before reaching age 5 in the immediate geographic area.",
    year: 2017,
    resolution: "5km",
    source: "Institute for Health Metrics and Evaluation",
    subcategory: "health",
    link: "http://www.healthdata.org/research-article/mapping-under-5-and-neonatal-mortality-africa-2000%E2%80%9315-baseline-analysis-sustainable",
    citation:
      "Golding, N., et al. Mapping under-5 and neonatal mortality in Africa, 2000–15: a baseline analysis for the Sustainable Development Goals. The Lancet.",
  },
  {
    name: "Distance to Roads",
    description:
      "The straight-line distance to the nearest trunk, primary, secondary or tertiary roadway. These constitute roadways that link sizable towns together.",
    note: "This dataset was created with the 'Roadways' dataset from Open Street Maps.",
    year: 2020,
    resolution: "200m",
    source: "SanPlan",
    subcategory: "accessibility",
  },
  {
    name: "Distance to Towns",
    description:
      "The straight-line distance to the nearest ‘town’. SanPlan considers a ‘town’ to be a settlement area with a population of 5,000 or more.",
    note: "This dataset was created with the 'Population' dataset from WorldPop.",
    year: 2020,
    resolution: "200m",
    source: "SanPlan",
    subcategory: "accessibility",
  },
  {
    name: "Rural Typology",
    description:
      "This layer assigns all geographic areas of the country into one of three typologies to give an indication of accessibility and remoteness: rural mixed, rural on-road, and rural remote.",
    remote:
      "Rural communities far from urban areas or far from main roads. SanPlan considered an area to be ‘rural remote’ if they were further than 25 minutes travel time to a city, further than 800 meters from a small town/city, and more than 1.5 kilometers from a major roadway.",
    road: "Rural communities that are on or close to main road. SanPlan considered an area to be ‘rural on-road’ if it is further than 25 minutes travel time to a city, further than 800 meters from a small town/city, and within 1.5 kilometers from a major roadway.",
    mixed:
      "Communities with mixed rural and urban characteristics such as peri-urban areas or small towns. SanPlan considered an area to be ‘rural mixed’ if it is within 25 minutes travel time to a city or within 800 meters to a small town/city.",
    urban:
      "Cities estimated to have 50,000 people or larger or areas which are within 10 minutes travel time to the city.",
    note: "This dataset was created with the 'Distance to Roads', 'Distance to Towns', and 'Time to Cities' datasets.",
    year: 2020,
    resolution: "1km",
    source: "SanPlan",
    subcategory: "accessibility",
    link: "/Datasets/#class",
  },
  {
    name: "Estimated Settlement",
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

const DatasetInfoPopover = ({ filter, filterIndex, clickRefData }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const classes = useStyles();
  const [datasetName, setDatasetName] = useState();
  const [selectedDataset, setSelectedDataset] = useState();

  useEffect(() => {
    if (datasetName) {
      if (datasetName) {
        datasetsInfo.forEach((data, i) => {
          if (datasetName.includes(data.name)) {
            setSelectedDataset(data);
          }
        });
      }
    }
  }, [datasetName]);

  return (
    <React.Fragment>
      <IconButton
        autoFocus={
          filterIndex === 0
            ? true
            : filterIndex === 1
            ? true
            : filterIndex === 3
            ? true
            : filterIndex === 7
            ? true
            : false
        }
        className={classes.icon}
        p={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPopoverOpen(true);
          setDatasetName(filter.name);
        }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>

      <Modal
        ref={clickRefData}
        aria-labelledby="Popup containing details of the selected dataset"
        aria-describedby="Popup lists the title, source, resolution, year, associated puplication, and link to the data source."
        className={classes.modal}
        open={popoverOpen}
        onClose={(e) => {
          setPopoverOpen(false);
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        elevation={3}
      >
        <Fade in={popoverOpen}>
          <div className={classes.popover}>
            <Grid
              container
              justifyContent="flex-end"
              pt={2}
              key={"popoverHeader"}
            >
              <IconButton
                key={"popoverClose"}
                p={0}
                fontSize="small"
                color="default"
                onClick={(e) => {
                  setPopoverOpen(false);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              {selectedDataset && (
                <Card className={classes.root} elevation={0}>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {selectedDataset.name}
                    </Typography>
                    {selectedDataset.description}
                    <br></br>
                    {selectedDataset.remote && (
                      <React.Fragment>
                        <ul>
                          <li>
                            <strong>Urban:</strong> {selectedDataset.urban}
                          </li>
                          <li>
                            <strong>Rural Mixed:</strong>{" "}
                            {selectedDataset.mixed}
                          </li>
                          <li>
                            <strong>Rural On-road:</strong>{" "}
                            {selectedDataset.road}
                          </li>
                          <li>
                            <strong>Rural Remote:</strong>{" "}
                            {selectedDataset.remote}
                          </li>
                        </ul>
                      </React.Fragment>
                    )}
                    <Typography color="textSecondary">
                      {selectedDataset.note}
                    </Typography>
                    <Typography variant="body1">
                      Year: {selectedDataset.year}
                    </Typography>
                    <Typography variant="body1" component="h5">
                      Dataset resolution: {selectedDataset.resolution}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      <strong>{selectedDataset.source}</strong>
                    </Typography>
                    {selectedDataset.ihme && (
                      <React.Fragment>
                        <Typography variant="body2" gutterBottom>
                          {selectedDataset.ihme}
                        </Typography>
                      </React.Fragment>
                    )}
                    {selectedDataset.citation && (
                      <Typography variant="body2" color="textSecondary">
                        Corresponding publication: {selectedDataset.citation}
                      </Typography>
                    )}
                    {selectedDataset.source === "SanPlan" ? (
                      <Button
                        href={selectedDataset.link}
                        size="small"
                        variant="outlined"
                        color="primary"
                      >
                        More Info on This Layer
                      </Button>
                    ) : (
                      <Button
                        href={selectedDataset.link}
                        size="small"
                        variant="outlined"
                        color="primary"
                      >
                        Link to data source
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </Grid>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};
export default DatasetInfoPopover;
