import React, { useReducer, useEffect } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import Button from "@material-ui/core/Button";
import MapIcon from "@material-ui/icons/Map";

const TOUR_STEPS = [
  {
    target: "body",
    content: "Tour the features of the SanPlan map!",
    placement: "center",
  },
  {
    target: ".tour-scale",
    content:
      "Select the resolution at which you would like to explore and filter the map. If you select the 5km or larger resolution, you are able to explore 13 contextual indicators across the country. Only the Rural Typology data is available is availble at the 1km resolution. You are free to move back and forth between resolutions.",
    disableBeacon: true, // This makes the tour to start automatically without clicking
  },
  {
    target: ".tour-comms",
    content:
      "We have included a layer of pre-defined settlement areas to help estimate the number and location of communities, based on satellite imagery. These areas may not represent administratively recognized communities.",
  },
  {
    target: ".tour-dropdown",
    content:
      "To explore one or more boundary areas by name, you can select them from this dropdown before beginning.",
  },
  {
    target: ".tour-themes",
    content:
      "Click on a theme to open a menu of filters for contextual indicators associated with that theme. Manipulate the filters to locate areas of interest on the map. You can use multiple filters at once, and combine filters from multiple themes. Your selections will be saved as you move between resolutions.",
  },
  {
    target: ".tour-reset",
    content:
      "Click this button to clear all filter selections for the currently selected resolution.",
  },
  {
    target: ".tour-legendselect",
    content:
      "Select the indicator from this dropdown that you would like to see represented in the legend. Each indicator will display a unique color scale. Your selection will be saved between resolutions.",
  },
  {
    target: ".tour-upload",
    content:
      "Within this menu you can upload your own community locations and view them on the map.",
  },
  {
    target: ".tour-export",
    content:
      "After identifying areas of interest, you can download the associated data for those remaining areas, here.",
  },
  {
    target: ".tour-map",
    content:
      "Click directly on a grid square or administrative boundary to access data for all avalable indicators at the selected location, and the ability to download data tables.",
  },
];

const INITIAL_STATE = {
  key: new Date(), // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: TOUR_STEPS,
};

// Reducer will manage updating the local state
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "START":
      return { ...state, run: true };
    case "RESET":
      return { ...state, stepIndex: 0 };
    case "STOP":
      return { ...state, run: false };
    case "NEXT_OR_PREV":
      return { ...state, ...action.payload };
    case "RESTART":
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      };
    default:
      return state;
  }
};

// Tour component
const Tour = () => {
  // Tour state is the state which control the JoyRide component
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    // Auto start the tour if the tour is not viewed before
    if (!localStorage.getItem("tour")) {
      dispatch({ type: "START" });
    }
  }, []);

  // Set once tour is viewed, skipped or closed
  const setTourViewed = () => {
    localStorage.setItem("tour", "1");
  };
  const callback = (data) => {
    const { action, index, type, status } = data;
    if (
      // If close button clicked, then close the tour
      action === ACTIONS.CLOSE ||
      // If skipped or end tour, then close the tour
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      setTourViewed();
      dispatch({ type: "STOP" });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Check whether next or back button click and update the step.
      dispatch({
        type: "NEXT_OR_PREV",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
      });
    }
  };

  const startTour = () => {
    // Start the tour manually
    dispatch({ type: "RESTART" });
  };

  return (
    <React.Fragment>
      <Button
        // justifyContent="center"
        startIcon={<MapIcon />}
        onClick={startTour}
        style={{ fontSize: 13, padding: 0 }}
      >
        Restart Tour
      </Button>
      <JoyRide
        {...tourState}
        callback={callback}
        showSkipButton={true}
        styles={{
          tooltipContainer: {
            textAlign: "left",
          },

          buttonBack: {
            marginRight: 10,
          },
          options: {
            zIndex: 10000,
            primaryColor: "#002F6C",
            width: "300px",
          },
        }}
        locale={{
          last: "End tour",
        }}
      />
    </React.Fragment>
  );
};

export default Tour;
