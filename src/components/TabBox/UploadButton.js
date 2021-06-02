import React, { useState, useContext } from "react";
import Papa from "papaparse";
import { Box } from "@material-ui/core";
import { MapContext } from "../../state/MapState";
import { CSVLink } from "react-csv";
// import { Settlements } from "./Settlements";

// import theme from "../../theme/theme";
const template = [
  {
    Community: null,
    Latitude: null,
    Longitude: null,
  },
];

export const UploadButton = () => {
  const [{}, dispatch] = useContext(MapContext);

  const [state, setState] = useState(null);

  function handleChange(event) {
    setState({
      csvfile: event.target.files[0],
    });
  }
  function removeCSV() {
    dispatch({
      type: "user.upload",
      userData: null,
    });
    setState(null);
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
    // setState(null);
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
        To plot communitiy locations, create a CSV file with at minimum 2
        specific columns, 1) Latitiude, and 2) Longitude. Other columns
        including community name or identifiers may also be included.
      </Box>
      <CSVLink
        data={template}
        filename={"SPT_Upload_Template.csv"}
        style={{ fontSize: 13 }}
      >
        DOWNLOAD TEMPLATE UPLOAD FORM
      </CSVLink>
      <input
        className="upload-input"
        type="file"
        name="file"
        placeholder={state}
        onChange={handleChange}
      />
      <button onClick={importCSV}>Upload</button>
      <button onClick={removeCSV}>Remove</button>
      {/* <Divider />
      <Settlements /> */}
    </div>
  );
};
