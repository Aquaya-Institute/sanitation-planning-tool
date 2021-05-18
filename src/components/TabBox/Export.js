import Carto from "@carto/carto.js";
import { MapContext } from "../../state/MapState";
import { useState, useEffect, useContext } from "react";

export const Export = () => {
  const [{ currentMapID, activeLayer, download }, dispatch] = useContext(
    MapContext
  );

  useEffect(() => {
    if (download) {
      const categoryDataview = new Carto.dataview.Category(download, "name_3", {
        operation: Carto.operation.COUNT,
      });
      console.log(categoryDataview);
    }
  }, [download]);

  return <div>Coming Soon!</div>;
};

// Community counter
// useEffect(() => {
//   if (cartoClient && commCalcSource && nativeMap) {
//     if(mapID==="GhanaUU"){
//       const commCalculator = new Carto.dataview.Formula(
//         commCalcSource,
//         "community",
//         {
//           operation: Carto.operation.COUNT,
//         }
//       );
//       const bboxFilter = new Carto.filter.BoundingBoxLeaflet(nativeMap);
//       cartoClient.addDataview(commCalculator);
//       commCalculator.addFilter(bboxFilter);

//       commCalculator.on("dataChanged", (data) => {
//         refreshCommCalculator(data.result);
//       });
//     }else {
//       const commCalculator = new Carto.dataview.Formula(
//         commCalcSource,
//         "community",
//         {
//           operation: Carto.operation.COUNT,
//         }
//       );
//       const bboxFilter = new Carto.filter.BoundingBoxLeaflet(nativeMap);
//       cartoClient.addDataview(commCalculator);
//       commCalculator.addFilter(bboxFilter);

//       commCalculator.on("dataChanged", (data) => {
//         refreshCommCalculator(data.result);
//       });
//     }

//   }
// }, [cartoClient, commCalcSource, nativeMap]);
