// import React from "react";
import { useContext } from "react";
import { MapContext } from "../../state/MapState";
import Carto from "@carto/carto.js";

export const CalculatorWidget = () => {
  const [{ currentLayerID, currentCountry, carto_client }] =
    useContext(MapContext);

  const averagePopulation = new Carto.dataview.Formula(
    currentCountry[currentLayerID].source,
    "pop",
    {
      operation: Carto.operation.SUM,
    }
  );

  averagePopulation.on("dataChanged", (data) => {
    refreshAveragePopulationWidget(data.result);
  });

  function refreshAveragePopulationWidget(avgPopulation) {
    const widgetDom = document.querySelector("#avgPopulationWidget");
    const averagePopulationDom = widgetDom.querySelector(
      ".js-average-population"
    );
    averagePopulationDom.innerText = Math.floor(avgPopulation);
  }
  carto_client.addDataview(averagePopulation);
};
