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
import "react-app-protect/dist/index.css";
import ReactGA from "react-ga4";
import RouteChangeTracker from "./components/subcomponents/RouteChangeTracker";

ReactGA.initialize("G-4M9J6LZRDQ");
ReactGA.send("pageview");

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MapContextProvider>
        <Router>
          <RouteChangeTracker />
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
