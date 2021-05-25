import React, { useState } from "react";
import Loader from "./Loader";

const Loader_2 = () => {
  const [loading, setLoading] = useState(false);

  return [
    loading ? <Loader /> : null,
    () => setLoading(true), //Show loader
    () => setLoading(false), //Hide Loader
  ];
};

export default Loader_2;
