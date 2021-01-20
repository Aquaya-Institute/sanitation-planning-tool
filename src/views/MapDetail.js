import * as React from "react";
import { MapContext } from "../state/MapState";
import { MapLayers } from "../components/MapLayers";
import { Map } from "../components/Map";
import { Grid, Box } from "@material-ui/core";
import { useParams } from "react-router-dom";

function MapDetail() {
  const [{}, dispatch] = React.useContext(MapContext);
  let { id } = useParams();

  React.useEffect(() => {
    dispatch({
      type: "map.select",
      mapID: id,
    });
  }, []);

  return (
    <Grid container style={{height:"100%"}}>
      <Grid item xs={4} md={4} lg={3} style={{boxShadow:"0px 0px 10px black", zIndex: 1100}}>
      <Box
        p={2}>
        <MapLayers />
      </Box>
      </Grid>
      <Grid item xs={8} md={8} lg={9}>
        <Map />
      </Grid>
    </Grid>
  );
}

export default MapDetail;
