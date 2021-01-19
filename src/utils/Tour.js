import React, { useReducer, useEffect } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import Button from "@material-ui/core/Button";
// import theme from "./theme/theme";

const TOUR_STEPS = [
  {
    target: "body",
    content: "Tour the features of the SanPlan map!",
    placement: "center",
  },
  {
    target: ".tour-visibility",
    content:
      "Turn layers on/off by clicking on the eye symbol next to the layer you want to visualize.",
    disableBeacon: true, // This makes the tour to start automatically without clicking
  },
  {
    target: ".tour-expand",
    content: "Click the arrow buttons to expand filter options for each layer.",
  },
  {
    target: ".tour-community-calc",
    content:
      "The number of communities will change as you zoom in the map view or filter on variables of interest within the 'Estimated Settlements and Communities' layer.",
  },
  {
    target: ".tour-comm-dist",
    content: "View data according to district or community.",
  },
  {
    target: ".tour-map",
    content: "Click on a district or community for more information.",
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
    // localStorage.setItem("tour", "1");
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
    <>
      {/* <li className="items-center tour-link" onClick={startTour}>
        <button className="text-gray-800 hover:text-gray-600 text-xs uppercase py-3 font-bold block">
          <i className="fas fa-fingerprint text-gray-500 mr-2 text-sm"></i>{" "}
          Restart tour
        </button>
      </li> */}
      <Button onClick={startTour}>Resart Tour</Button>
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
    </>
  );
};

export default Tour;
