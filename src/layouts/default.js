import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";
import { CssBaseline, Container, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign:'center'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    // height: "55px",
    margin:0,
  },
}));

export default function DefaultLayout(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="sticky" className={classes.appBar} >
        <Toolbar>
        <Link component={RouterLink} color="inherit" to="/">
            <img src="/usaid-rect.png"
            alt=""
            style={{width:"135px", height:"50px"}}></img>
           </Link>
          <Typography variant="h6" className={classes.title}>
            {/* Place the logo here instead and link to home */}
            {/* <Link component={RouterLink} color="inherit" to="/" style={{textDecoration: 'none'}}> */}
              <strong>Sanitation Planning Tool</strong>
            {/* </Link> */}
          </Typography>
          <Box ml={3}>
            <Button component={RouterLink} color="inherit" to="/">
              Home
            </Button>
          </Box>

          <Box ml={3}>
            <Button component={RouterLink} color="inherit" to="/about">
              About
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth={false} disableGutters={true}>
          {props.children}
        </Container>
      </main>
    </div>
  );
}
