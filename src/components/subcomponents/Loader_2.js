import React, { useState } from "react";
import { Loader, Loader2 } from "./Loader";

export const Loader_2 = () => {
  const [loading, setLoading] = useState(false);

  return [
    loading ? <Loader /> : null,
    () => setLoading(true), //Show loader
    () => setLoading(false), //Hide Loader
  ];
};

export const Loader2_2 = () => {
  const [loading2, setLoading2] = useState(false);

  return [
    loading2 ? <Loader2 /> : null,
    () => setLoading2(true), //Show loader
    () => setLoading2(false), //Hide Loader
  ];
};
