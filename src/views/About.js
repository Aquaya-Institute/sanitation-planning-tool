import {
  Grid,
  Container,
  Typography,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

function About() {
  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography variant="h4" color="secondary">
          About
        </Typography>
      </Box>
      <Grid container item spacing={2} lg={12}></Grid>
    </Container>
  );
}

export default About;
