import { MapContext } from "../../state/MapState";
import { useState, useContext, useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import { CSVLink } from "react-csv";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import Loader_2 from "../subcomponents/Loader_2";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  loader: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: "2",
  },
}));

export const Export = () => {
  const [{ maps, currentMapID, activeLayer, query }, dispatch] =
    useContext(MapContext);
  const classes = useStyles();
  const [download, setDownload] = useState(null);
  const [mapID, setMapID] = useState(currentMapID);
  const [loader, showLoader, hideLoader] = Loader_2();

  useEffect(() => {
    if (currentMapID !== mapID) {
      console.log(currentMapID);
      setMapID(currentMapID);
    }
  }, [currentMapID, mapID]);

  useEffect(() => {
    showLoader();
    if (activeLayer === "1") {
      setDownload(null);
      hideLoader();
    } else if (query && mapID) {
      let queryURL = query.replace(/\s/g, " ");
      return fetch(
        `https://zebra.geodb.host/user/admin/api/v2/sql?q=${queryURL}`
      )
        .then((resp) => resp.json())
        .then((response) => {
          setDownload(response.rows);
          hideLoader();
        });
    } else if (mapID) {
      //   let queryURL = `SELECT * FROM ${maps[mapID].layers[activeLayer].carto_tableName}`;
      return fetch(
        `https://zebra.geodb.host/user/admin/api/v2/sql?q=SELECT * FROM ${maps[mapID].layers[activeLayer].carto_tableName}`
      )
        .then((resp) => resp.json())
        .then((response) => {
          setDownload(response.rows);
          hideLoader();
        });
    }
  }, [mapID, query]);

  return (
    <div>
      <div align="center">{loader}</div>
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
                {download.length}{" "}
                {maps[currentMapID].layers[activeLayer].name.toLowerCase() +
                  "s"}
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
              filtering. Use the "Map Resolutions" tab to select the resolution
              of the regions to download.
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
    </div>
  );
};
