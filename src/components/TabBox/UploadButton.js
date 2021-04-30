import React, { useState, useContext } from "react";
import Papa from "papaparse";
import { Box, Typography } from "@material-ui/core";
import { MapContext } from "../../state/MapState";

// import theme from "../../theme/theme";

export const UploadButton = () => {
  const [{}, dispatch] = useContext(MapContext);

  const [state, setState] = useState({
    csvfile: null,
  });

  function handleChange(event) {
    setState({
      csvfile: event.target.files[0],
    });
  }

  function importCSV(e) {
    e.preventDefault();
    const { csvfile } = state;

    csvfile &&
      Papa.parse(csvfile, {
        header: true,
        dynamicTyping: true,
        complete: updateData,
      });
  }

  function updateData(result) {
    setState({
      csvfile: null,
    });
    var data = result.data;
    console.log(data);
    dispatch({
      type: "user.upload",
      userData: data,
    });
  }

  return (
    <div>
      <Box
        p={1}
        fontStyle="italic"
        fontWeight="fontWeightBold"
        fontSize={13.5}
        variant="subtitle2"
        style={{ color: "black" }}
        key="rightBoxSubtitle"
      >
        Upload a CSV file of GPS coordinates to display them on the map:
      </Box>
      <Box style={{ fontSize: 12 }} pl={1} pb={1}>
        To plot communitiy locations, create a CSV file with 3 specific columns,
        1) latitiude, 2) longitude, and 3) community name or identifier.
      </Box>
      <input
        className="upload-input"
        type="file"
        name="file"
        placeholder={null}
        onChange={handleChange}
      />
      <button onClick={importCSV}>Upload</button>
    </div>
  );
};
