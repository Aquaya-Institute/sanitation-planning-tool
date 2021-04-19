import * as React from "react";
import { MapContext } from "../state/MapState";
import { MapLayers } from "../components/MapLayers";
import { Map } from "../components/Map";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";

function MapDetail() {
  const [{}, dispatch] = React.useContext(MapContext);
  let { id } = useParams();

  React.useEffect(() => {
    dispatch({
      type: "map.select",
      mapID: id,
    });
  }, [dispatch, id]);

  return (
    <Grid container style={{height:"100%"}}>
      {/* <Grid item  style={{boxShadow:"0px 0px 10px black", zIndex: 1100}}> */}
      <Grid item>
        <MapLayers />
      </Grid>
      <Grid item xs={true} md={true} lg={true}>
        <Map />
      </Grid>
    </Grid>
  );
}

export default MapDetail;
