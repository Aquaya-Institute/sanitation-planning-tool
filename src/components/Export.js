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
