import { Grid, Card, CardContent, CardActionArea, CardMedia,CardActions, Container, Button,Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { MapContext } from "../state/MapState";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';



const useCardStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    // minHeight: 260,
  },
  media: {
    height: 140,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const datasetsInfo = [
    {
        name: "Women's Educational Attainment",
        year: 2017,
        resolution: "5km",
        source: "Institute for Health Metrics and Evaluation",
        subcategory:"socioeconomic",
        link: "http://www.healthdata.org/research-article/mapping-disparities-education-across-low-and-middle-income-countries",
        citation: "Local Burden of Disease Educational Attainment Collaborators. Mapping disparities in education across low- and middle-income countries. Nature. 25 December 2019. doi:10.1038/s41586-019-1872-1."
    },
    {
        name: "Men's Educational Attainment",
        year: 2017,
        resolution: "5km",
        source: "Institute for Health Metrics and Evaluation",
        subcategory:"socioeconomic",
        link: "http://www.healthdata.org/research-article/mapping-disparities-education-across-low-and-middle-income-countries",
        citation: "Local Burden of Disease Educational Attainment Collaborators. Mapping disparities in education across low- and middle-income countries. Nature. 25 December 2019. doi:10.1038/s41586-019-1872-1."
    },
    {
        name: "Diahrrea Prevalence in Children <5 Years",
        year: 2017,
        resolution: "5km",
        source: "Institute for Health Metrics and Evaluation",
        subcategory:"health",
        link: "http://www.healthdata.org/research-article/mapping-geographical-inequalities-childhood-diarrhoeal-morbidity-and-mortality-low",
        citation: "Local Burden of Disease Diarrhoea Collaborators. Mapping geographical inequalities in childhood diarrhoeal morbidity and mortality in low-income and middle-income countries, 2000–17: analysis for the Global Burden of Disease Study 2017. The Lancet. 6 May 2020. doi:10.1016/S0140-6736(20)30114-8."
    },
    {
        name: "Reliance on Unimproved Sanitation",
        year: 2017,
        resolution: "5km",
        source: "Institute for Health Metrics and Evaluation",
        subcategory:"wash",
        link: "http://www.healthdata.org/research-article/mapping-geographic-inequalities-access-drinking-water-and-sanitation-facilities-low",
        citation: "Local Burden of Disease WaSH Collaborators. Mapping geographical inequalities in access to drinking water and sanitation facilities in low-income and middle-income countries, 2000–17. The Lancet Global Health. August 2020. doi:10.1016/S2214-109X(20)30278-3."
    },
    {
        name: "Reliance on Unimproved Water",
        year: 2017,
        resolution: "5km",
        source: "Institute for Health Metrics and Evaluation",
        subcategory:"wash",
        link: "http://www.healthdata.org/research-article/mapping-geographic-inequalities-access-drinking-water-and-sanitation-facilities-low",
        citation: "Local Burden of Disease WaSH Collaborators. Mapping geographical inequalities in access to drinking water and sanitation facilities in low-income and middle-income countries, 2000–17. The Lancet Global Health. August 2020. doi:10.1016/S2214-109X(20)30278-3."
    },
    {
        name: "Mortality in Children <5 Years",
        year: 2017,
        resolution: "5km",
        source: "Institute for Health Metrics and Evaluation",
        subcategory:"health",
        link: "http://www.healthdata.org/research-article/mapping-under-5-and-neonatal-mortality-africa-2000%E2%80%9315-baseline-analysis-sustainable",
        citation: "Golding, N., et al. Mapping under-5 and neonatal mortality in Africa, 2000–15: a baseline analysis for the Sustainable Development Goals. The Lancet."
    },
    {
        name: "Predicted Annual Cholera Incidence",
        year: 2016,
        resolution: "20km",
        source: "Infectious Disease Dynamics",
        subcategory:"health",
        link: "http://www.iddynamics.jhsph.edu/projects/cholera-dynamics",
        citation: "Lessler, J., et al. Mapping the burden of cholera in sub-Saharan Africa and implications for control: an analysis of data across geographical scales. Lancet, 2018: 391(10133): 1908-1915, 10.1016/S0140-6736(17)33050-7"
    },
    {
        name: "Travel Time to Cities",
        year: 2015,
        resolution: "1km",
        source: "Malaria Atlas Project",
        subcategory:"accessibility",
        link: "https://malariaatlas.org/research-project/accessibility-to-cities/",
        citation: "Weiss, D.J., et al. A global map of travel time to cities to assess inequalities in accessibility in 2015. (2018). Nature. doi:10.1038/nature25181."
    },
    {
        name: "Roadways",
        year: 2020,
        resolution: "vector",
        source: "Open Street Maps",
        subcategory:"socioeconomic",
        note: "This dataset was used to calculate the 'Distance to Roads' dataset.",
        link: "https://www.openstreetmap.org/"
    },
    {
        name: "Population",
        year: 2020,
        resolution: "1km",
        source: "WorldPop",
        subcategory:"socioeconomic",
        note: "This dataset was used to calculate the 'Distance to Towns' dataset.",
        link: "https://www.worldpop.org/"
    },
]


function Datasets() {
    const classes = useCardStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
    <Container>
        <Box mt={4} mb={4}>
          <Typography variant="h4" color="secondary">
            Overview of Datasets Utlilized
          </Typography>
        </Box>
        <Grid container item spacing={2} lg={12}>
            {Object.entries(datasetsInfo).map((data,i) => (
                <Grid key={"dataCard"+i} item xs={12} md={6} lg={6}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography  variant="h5" component="h2">
                            {data[1].name}
                            </Typography>
                            <Typography  variant="body2" color="textSecondary" >
                            {data[1].note}
                            </Typography>
                            <Typography variant="body1" color="secondary">
                                {data[1].year}
                            </Typography>
                            <Typography  variant="body1" component="h5">
                                Dataset resolution: {data[1].resolution}
                            </Typography>
                            <Typography  variant="h7" component="h3">
                                {data[1].source}
                                    <IconButton
                                        className={(classes.expand, {
                                            [classes.expandOpen]: expanded,
                                        })}
                                        onClick={handleExpandClick}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                        >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                    <Typography variant="body2" color="textSecondary" >{data[1].citation}</Typography>
                                    </CardContent>
                                </Collapse>
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                
                            </Typography>
                            <Button href={data[1].link} size="small" color="primary">
                                Link to Data Source
                            </Button>
                        </CardContent>
                    </Card> 
                </Grid>
            ))}
        </Grid>
    </Container>
    );
}
  
export default Datasets;
  