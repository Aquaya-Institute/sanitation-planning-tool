import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { MapContextProvider } from "./state/MapState";

import theme from "./theme/theme";
import DefaultLayout from "./layouts/default"
import Home from "./views/Home";
import MapDetail from "./views/MapDetail";
import About from "./views/About";
import Datasets from "./views/Datasets";
import "./App.css";

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
              <Route exact path="/" component={Home} />
            </Switch>
          </DefaultLayout>
        </Router>
      </MapContextProvider>
    </ThemeProvider>
  );
}

export default App;
