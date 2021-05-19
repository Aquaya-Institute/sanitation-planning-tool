import { MapContext } from "../../state/MapState";
import { useState, useContext, useMemo, useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import { CSVLink } from "react-csv";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));
export const Export = () => {
  const [{ maps, currentMapID, activeLayer, query }, dispatch] = useContext(
    MapContext
  );
  const classes = useStyles();
  const [download, setDownload] = useState(null);
  const [mapID, setMapID] = useState(currentMapID);

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

  useEffect(() => {
    if (activeLayer === "1") {
      setDownload(null);
    } else if (query && mapID) {
      let queryURL = query.replace(/\s/g, " ");
      return fetch(
        `https://zebra.geodb.host/user/admin/api/v2/sql?q=${queryURL}`
      )
        .then((resp) => resp.json())
        .then((response) => {
          setDownload(response.rows);
        });
    } else if (mapID) {
      //   let queryURL = `SELECT * FROM ${maps[mapID].layers[activeLayer].carto_tableName}`;
      return fetch(
        `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers[activeLayer].carto_tableName}`
      )
        .then((resp) => resp.json())
        .then((response) => {
          setDownload(response.rows);
        });
    }
  }, [mapID, query]);

  return (
    <div>
      {activeLayer === "1" && (
        <div>
          Data downloads are not available for this layer, please select a
          larger resolution from "Map Resolutions".{" "}
        </div>
      )}
      {download && (
        <>
          <Box
            p={1}
            fontStyle="italic"
            fontWeight="fontWeightBold"
            fontSize={13.5}
            variant="subtitle2"
            style={{ color: "black" }}
            key="rightBoxSubtitle"
          >
            Export a CSV file of mapped data.
          </Box>
          <Box style={{ fontSize: 12 }} pl={1} pb={1}>
            Click the button below to download data for{" "}
            <Box
              component="span"
              fontWeight="fontWeightMedium"
              fontSize={16}
              color="#BA0C2F"
            >
              {download.length} {maps[currentMapID].layers[activeLayer].name}
            </Box>{" "}
            in{" "}
            <Box
              component="span"
              fontWeight="fontWeightMedium"
              fontSize={16}
              color="#BA0C2F"
            >
              {maps[currentMapID].name}
            </Box>
            . The downloaded file will represent the regions remaining after
            filtering. Use the "Map Resolutions" tab to select the resoltion of
            the regions to download.
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<SaveIcon />}
          >
            <CSVLink
              data={download}
              filename={"SPT_Upload_Template.csv"}
              style={{ fontSize: 13, color: "#FFFFFF" }}
            >
              DOWNLOAD DATA TABLE
            </CSVLink>
          </Button>
        </>
      )}
    </div>
  );
};
