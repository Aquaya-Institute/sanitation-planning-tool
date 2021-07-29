import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { MapContextProvider } from "./state/MapState";
import theme from "./theme/theme";
import DefaultLayout from "./layouts/default";
import Home from "./views/Home";
import MapDetail from "./views/MapDetail";
import About from "./views/About";
import FAQ from "./views/FAQ";
import Datasets from "./views/Datasets";
import Privacy from "./views/Privacy";
import "./App.css";

// const express = require("express");
// const helmet = require("helmet");

// const app = express();

// app.use(helmet());

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MapContextProvider>
        <Router>
          <DefaultLayout>
            <Switch>
              <Route path="/maps/:id" component={MapDetail} />
              <Route path="/maps" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/datasets" component={Datasets} />
              <Route path="/faq" component={FAQ} />
              <Route exact path="/" component={Home} />
              <Route exact path="/privacy" component={Privacy} />
            </Switch>
          </DefaultLayout>
        </Router>
      </MapContextProvider>
    </ThemeProvider>
  );
}

export default App;
