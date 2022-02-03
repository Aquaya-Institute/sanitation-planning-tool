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
import Protect from "react-app-protect";
import "react-app-protect/dist/index.css";

function App() {
  return (
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
  );
}

export default App;
