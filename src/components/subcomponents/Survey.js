// import RGF from "react-google-forms";
// import { makeStyles } from "@material-ui/core/styles";
import React from "react";
// import { useState } from "react";
import { useHistory } from "react-router-dom";
import { MapContext } from "../../state/MapState";
import "leaflet/dist/leaflet.css";
import { Dialog, IconButton, Grid } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

// const formConfig = {
//   formURL:
//     "https://docs.google.com/forms/d/e/1FAIpQLSfE2vv2KDHhndMdfSgPvewXYwnElBFFiPrTP-QAt1AgBhXtgg/viewform?embedded=true",
//   inputs: [
//     {
//       type: "radio",
//       options: [
//         { text: "Poor" },
//         { text: "Satisfactory" },
//         { text: "Good" },
//         { text: "Very Good" },
//         { text: "Awesome" },
//       ],
//     },
//     {
//       type: "radio",
//       options: [
//         { text: "Very Unlikely" },
//         { text: "Unlikely" },
//         { text: "Unsure" },
//         { text: "Likely" },
//         { text: "Very Likely" },
//       ],
//     },
//     {
//       type: "checkbox",
//       options: [
//         {
//           text: "Rural typology layer (the map which categorizes areas into rural remote, rural on-road, rural mixed, and urban)",
//         },
//         {
//           text: "Settlement boundary layer (the option which displays the black boundaries of built-up areas on top of the map)",
//         },
//         { text: "Within-district filtering" },
//         { text: "Data upload" },
//         { text: "Data export" },
//         { text: "Other" },
//       ],
//     },
//     {
//       type: "text",
//     },
//   ],
//   redirectURL: null,
// };

export const Survey = ({ setSurveyOpen, surveyOpen, clickRefPop, url }) => {
  const [{ maps, currentMapID }, dispatch] = React.useContext(MapContext);
  const idPopover = "simple-popover";
  // const anchorRef = useRef(null);
  const history = useHistory();

  return (
    <Dialog
      id={idPopover}
      ref={clickRefPop}
      key={idPopover}
      aria-labelledby="Popup diaglog box containing user feedback survey"
      aria-describedby="Popup diaglog box containing user feedback survey."
      // className={classes.modal}
      open={surveyOpen}
      onClose={(event) => {
        setSurveyOpen(false);
        dispatch({
          type: "survey.prompt",
          surveyPrompt: true,
        });
        // history.push(`/maps/${url.toLowerCase()}`);
        // window.location.reload();
        // dispatch({
        //   type: "layer.removeCartoLayers",
        // });
        // dispatch({
        //   type: "map.select",
        //   mapID: event.target.value,
        // });
      }}
      scroll={"paper"}
      fullWidth={true}
      maxWidth={"sm"}
      style={{ padding: "0px 0px 0px 0px", backgroundColor: "transparent" }}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Grid container justifyContent="flex-end" p={0}>
        <IconButton
          key={"popoverClose"}
          fontSize="small"
          color="secondary"
          onClick={(e) => {
            setSurveyOpen(false);
            dispatch({
              type: "survey.prompt",
              surveyPrompt: true,
            });
            history.push(`/maps/${url.toLowerCase()}`);
            window.location.reload();
            dispatch({
              type: "layer.removeCartoLayers",
            });
            dispatch({
              type: "map.select",
              mapID: e.target.value,
            });
          }}
        >
          <CloseIcon />
        </IconButton>
      </Grid>
      {/* <RGF config={formConfig} />; */}
      <iframe
        title="SiteSurvey"
        src="https://docs.google.com/forms/d/e/1FAIpQLSfE2vv2KDHhndMdfSgPvewXYwnElBFFiPrTP-QAt1AgBhXtgg/viewform?embedded=true"
        width="100%"
        height="1156"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
      >
        Loading…
      </iframe>
    </Dialog>
  );
};
