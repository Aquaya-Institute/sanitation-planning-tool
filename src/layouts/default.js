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
  },
}));

export default function DefaultLayout(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {/* Place the logo here instead and link to home */}
            <Link component={RouterLink} color="secondary" to="/">
              Aq
            </Link>
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
