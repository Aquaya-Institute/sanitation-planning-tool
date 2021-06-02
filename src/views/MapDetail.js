import * as React from "react";
import { MapContext } from "../state/MapState";
import { MapMenu } from "../components/MapMenu/MapMenu";
import { Map } from "../components/Map";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";

var link = document.createElement("meta");
link.setAttribute("name", "map page description");
link.content = "The map page consists of the interactive map tool.";
document.getElementsByTagName("head")[0].appendChild(link);

function MapDetail() {
  // eslint-disable-next-line no-empty-pattern
  const [{}, dispatch] = React.useContext(MapContext);
  let { id } = useParams();

  React.useEffect(() => {
    dispatch({
      type: "map.select",
      mapID: id,
    });
  }, [dispatch, id]);

  return (
    <Grid container style={{ height: "100%" }}>
      {/* <Grid item  style={{boxShadow:"0px 0px 10px black", zIndex: 1100}}> */}
      <Grid item>
        <MapMenu />
      </Grid>
      <Grid item xs={true} md={true} lg={true}>
        <Map />
      </Grid>
    </Grid>
  );
}

export default MapDetail;
