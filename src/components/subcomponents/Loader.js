import React from "react";
import Spinner from "../../images/spinner.gif";

export const Loader = () => {
  return (
    <div className="fp-container" align-items="center">
      <img
        src={Spinner}
        className="fp-loader"
        alt="loading"
        height="25px"
        width="25px"
      />
    </div>
  );
};

export const Loader2 = () => {
  return (
    <div className="fp-container" align-items="center">
      <img
        src={Spinner}
        className="fp-loader"
        alt="loading"
        height="25px"
        width="25px"
      />
    </div>
  );
};
