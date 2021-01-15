import {
  Grid,
  Container,
  Typography,
  Box,
  Card, CardContent, Divider,Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  box: {
    backgroundImage: `url(/banner.png)`,
    // backgroundPosition: 'center', 
    // // backgroundSize: 'cover', 
    // backgroundRepeat: 'no-repeat',
    height:'25vh',
    width: '100vw',
    // display: 'flex',
  }
}));
function About() {
  const classes = useStyles();
  return (
    <>
      <Box >
        <img src="/banner.png"
          alt=""
          style={{width:"99vw"}}
        >
          
        </img>
      </Box>
      <Container>
        <Card>
          <CardContent>
            <Typography variant="h4" color="secondary">
              About WASHPaLS
            </Typography>
            <br></br>
            The Water, Sanitation, and Hygiene Partnerships and Learning for Sustainability (WASHPaLS) 
            project is a five-year (2016–2021) USAID Task Order working to improve water supply, sanitation 
            and hygiene (WASH) programming by identifying, researching and sharing best practices for 
            the delivery of WASH services and sustained behavior change.
          </CardContent>
        </Card>
        <Divider /><br></br>
        <Card>
          <CardContent>
            <Typography variant="h6" color="secondary">
              Project Contractors
            </Typography><br></br>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <img src="/aquaya.png"
                  alt=""
                  style={{width:"110px", height:"60px"}}>
                </img>
              </Grid>
              <Grid item xs={9} className={classes.paper}>
              AQUAYA INSTITUTE offers experienced scientists and field-based WASH researchers who bring 
              an objective, nimble, and rigorous approach to implementation research. The Aquaya 
              Institute provides technical assistance in the areas of CLTS, water quality, market-based 
              approaches, research design, data collection, and program evaluation.
              </Grid>
            </Grid><br></br>
            
            <Divider />
            <br></br>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <img src="/tetratech.png"
                  alt=""
                  style={{width:"200px", height:"60px"}}>
                </img>
              </Grid>
              <Grid item xs={9}>
              TETRA TECH has over 30 years of successful WASH sector programming and thought leadership. 
              Tetra Tech provides technical assistance in the areas of rural water supply, sustainability 
              assessments, the sanitation value chain including fecal sludge management, and environmental 
              compliance.<br></br>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Divider /><br></br>
      </Container>
    </>
  );
}

export default About;
