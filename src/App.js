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
<<<<<<< HEAD
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
=======
//     <Protect
//       sha512="40042129d59da9aeb1f847a98459e489c383ad1a09b868ce6052645fcd654647484fe1af323c74f7cd5d604b3f1b242618d911176a1635eb89aef9fc7e1076be"
//       blur={true}
//       boxTitle="The site will unlock once the webinar is over. Please check back soon!"
//     >
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
//     </Protect>
>>>>>>> b0f576cc8a4824110225c89f0d64ab2be20aeb0a
  );
}

export default App;
