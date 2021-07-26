import * as React from "react";
import Carto from "@carto/carto.js";
import produce from "immer";
import { enableMapSet } from "immer";
import { legendStyles } from "../components/subcomponents/LegendStyles";
import { ghana } from "./countries/ghana";
import { liberia } from "./countries/liberia";
import { niger } from "./countries/niger";
import { rwanda } from "./countries/rwanda";
import { nigeria } from "./countries/nigeria";
import { cambodia } from "./countries/cambodia";
import { s_sudan } from "./countries/s_sudan";
import { ethiopia } from "./countries/ethiopia";
import { mozambique } from "./countries/mozambique";
// import { senegal } from "./countries/senegal";

enableMapSet();
const legendStylesObj = legendStyles;
//this is the "global map state". this is where state is maintained and updated
const initialState = {
  currentMapID: null /* current country map */,
  carto_client: null,
  leafletMap: null,
  /* all the maps in the tool organised by country */
  maps: {
    cambodia,
    ethiopia,
    ghana,
    liberia,
    mozambique,
    niger,
    rwanda,
    nigeria,
    s_sudan,
    // senegal,
  },
  currentLayerID: "2",
  activeLegend: "0",
  userData: null,
  // query: null,
  queryDist: null,
  skip: true,
  selectedDistName: [],
  highlightLayer: null,
  highlightBoundary: null,
  settlementBoundary: null,
  showSettlements: false,
  allowSettlements: false,
  settlementHighlight: null,
  settlementPopup: null,
  currentCountry: [
    {
      source: null,
      style: null,
      layer: null,
      filters: null,
      columns: null,
      query: null,
      legendID: "0",
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
    },
    {
      source: null,
      style: null,
      layer: null,
      filters: null,
      columns: null,
      query: null,
      legendID: "0",
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
    },
    {
      source: null,
      style: null,
      layer: null,
      filters: null,
      columns: null,
      query: null,
      legendID: "0",
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
    },
    {
      source: null,
      style: null,
      layer: null,
      filters: null,
      columns: null,
      query: null,
      legendID: "0",
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
    },
    {
      source: null,
      style: null,
      layer: null,
      filters: null,
      columns: null,
      query: null,
      legendID: "0",
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
    },
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    //when a different country is selected
    case "map.select":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        if (action.mapID !== null) {
          // var index = draft.maps[action.mapID].layers.length - 1;
          var index = 3;
          for (; index >= 0; index--) {
            if (draft.maps[action.mapID].layers[index].visible === true) {
              draft.currentLayerID = index.toString();
              // draft.currentCountry[index].query = null;
              // draft.filters[index].filter = null;
              break;
            }
          }
          var i;
          for (i = 0; i < legendStylesObj.length; i++) {
            if (
              legendStylesObj[i].style_pixel ===
                draft.currentCountry[draft.currentLayerID].style ||
              legendStylesObj[i].style_bounds ===
                draft.currentCountry[draft.currentLayerID].style
            ) {
              draft.activeLegend = i.toString();
              break;
            }
          }
        }
      });

    case "current.layer":
      return produce(state, (draft) => {
        // if (draft.currentCountry[draft.currentLayerID].layer) {
        //   draft.carto_client.removeLayer(
        //     draft.currentCountry[draft.currentLayerID].layer
        //   );
        // }
        // draft.currentCountry[draft.currentLayerID].layer = action.currentLayer;
        draft.currentCountry[draft.currentLayerID].source =
          action.currentSource;
        draft.currentCountry[draft.currentLayerID].style = action.currentStyle;
        draft.currentCountry[draft.currentLayerID].filters =
          action.currentFilters;
        const columns = [];
        action.currentFilters.forEach((filter) => {
          columns.push(filter.column_name);
        });
        draft.currentCountry[draft.currentLayerID].columns = columns;
        draft.currentCountry[draft.currentLayerID].layer =
          new Carto.layer.Layer(
            draft.currentCountry[draft.currentLayerID].source,
            new Carto.style.CartoCSS(
              draft.currentCountry[draft.currentLayerID].style
            ),
            { featureClickColumns: columns }
          );
        draft.carto_client.addLayer(
          draft.currentCountry[draft.currentLayerID].layer
        );
        draft.currentCountry[draft.currentLayerID].layer.show();
        if (draft.showSettlements === true) {
          draft.currentCountry[draft.currentLayerID].layer.bringToBack();
        }
      });

    case "map.addCartoClient":
      return produce(state, (draft) => {
        draft.carto_client = action.carto_client;
      });

    case "map.saveMap":
      return produce(state, (draft) => {
        draft.leafletMap = action.leafletMap;
      });

    //when layer is toggled
    case "layer.toggle":
      /* 
      produce(immer) lets us manipulate the state in a 
      immutable manner easily, see immer lib doc 
      */
      return produce(state, (draft) => {
        // draft.currentMapID = action.mapID;
        // const mid = action.mapID;
        // draft.currentCountry[draft.currentLayerID].filters =
        //   draft.currentCountry[draft.currentLayerID].source.getFilters();
        draft.currentCountry[draft.currentLayerID].layer.hide();
        draft.currentLayerID = action.newLayerID;
        draft.currentCountry[draft.currentLayerID].layer.show();
        // if (draft.settlementBoundary === true) {
        //   draft.draft.carto_client.removeLayer(draft.settlementBoundary);
        // }
        // draft.query[draft.currentLayerID] = null;
        // draft.currentCountry.carto_layer =
        //   draft.currentCountry[draft.currentLayerID].layer.setFilters(
        //     draft.currentCountry[draft.currentLayerID].filters
        //   );
        //update the state
        // for (var index in draft.maps[mid].layers) {
        //   if (index === action.layerID || index === "0") {
        //     draft.maps[mid].layers[action.layerID].visible = true;
        //     cartoLayer.show();
        //   } else {
        //     draft.maps[mid].layers[index].visible = false;
        //     draft.maps[mid].layers[index].carto_layer.hide();
        //   }
        // }
        var i;
        for (i = 0; i < legendStylesObj.length; i++) {
          if (
            legendStylesObj[i].style_pixel ===
              draft.currentCountry[draft.currentLayerID].style ||
            legendStylesObj[i].style_bounds ===
              draft.currentCountry[draft.currentLayerID].style
          ) {
            draft.activeLegend = i.toString();
            break;
          }
        }
        // if (draft.showSettlements === true) {
        //   draft.carto_client.removeLayer(draft.settlementBoundary);
        //   draft.carto_client.addLayer(draft.settlementBoundary);
        // }
      });

    // case "clear.filter":
    // cycle over initial filter states, see which filters are on, and reset the carto API

    case "legend.select":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        // if (draft.currentCountry[draft.currentLayerID].layer) {
        //   draft.carto_client.removeLayer(
        //     draft.currentCountry[draft.currentLayerID].layer
        //   );
        // }
        draft.currentCountry[draft.currentLayerID].style = action.styleNew;
        draft.currentCountry[draft.currentLayerID].layer
          .getStyle()
          .setContent(action.styleNew);
        draft.activeLegend = action.legendIndex;
        // draft.currentCountry[draft.currentLayerID].layer =
        //   new Carto.layer.Layer(
        //     draft.currentCountry[draft.currentLayerID].source,
        //     new Carto.style.CartoCSS(
        //       draft.currentCountry[draft.currentLayerID].style
        //     ),
        //     { featureClickColumns: draft.currentCountry.current_columns }
        //   );
        // draft.carto_client.addLayer(
        //   draft.currentCountry[draft.currentLayerID].layer
        // );
        draft.currentCountry[draft.currentLayerID].layer.show();
        if (draft.showSettlements === true) {
          draft.currentCountry[draft.currentLayerID].layer.bringToBack();
        }
      });

    case "layer.opacity":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        const mid = action.mapID;
        const lid = draft.currentLayerID;
        draft.maps[mid].layers[lid].carto_style = action.styleNew;
        draft.skip = true;
        // draft.maps[action.mapID].layers[
        //   action.layerID
        // ].carto_layer._style._content = action.styleNew;
      });

    //when a filter is manipulated
    case "layer.filter":
      return produce(state, (draft) => {
        // draft.reset = false;
        draft.currentMapID = action.mapID;
        draft.currentCountry[draft.currentLayerID].filters[action.filterIndex] =
          action.filter;

        //TODO: based on the type of filter (range, categorical)
        //use Switch statement to apply appropriate filters
        switch (
          draft.currentCountry[draft.currentLayerID].filters[action.filterIndex]
            .type
        ) {
          case "range":
            //this is how you get the filter out of the carto layer
            const filter = draft.currentCountry[draft.currentLayerID].layer
              .getSource()
              .getFilters()[0] //since this is a filtercollection
              .getFilters()[action.filterIndex];
            //this is how you set the filter. this is specific to range filter
            filter.setFilters({
              gte: action.filter.value[0],
              lte: action.filter.value[1],
            });
            if (
              action.filter.value[0] !== action.filter.min ||
              action.filter.value[1] !== action.filter.max
            ) {
              if (action.filter.subcategory === "accessibility") {
                draft.currentCountry[draft.currentLayerID].accessCounter.add(
                  action.filter.name
                );
              } else if (action.filter.subcategory === "socioeconomic") {
                draft.currentCountry[draft.currentLayerID].socioCounter.add(
                  action.filter.name
                );
              } else if (action.filter.subcategory === "wash") {
                draft.currentCountry[draft.currentLayerID].washCounter.add(
                  action.filter.name
                );
              } else if (action.filter.subcategory === "health") {
                draft.currentCountry[draft.currentLayerID].healthCounter.add(
                  action.filter.name
                );
              }
            } else {
              if (action.filter.subcategory === "accessibility") {
                draft.currentCountry[draft.currentLayerID].accessCounter.delete(
                  action.filter.name
                );
              } else if (action.filter.subcategory === "socioeconomic") {
                draft.currentCountry[draft.currentLayerID].socioCounter.delete(
                  action.filter.name
                );
              } else if (action.filter.subcategory === "wash") {
                draft.currentCountry[draft.currentLayerID].washCounter.delete(
                  action.filter.name
                );
              } else if (action.filter.subcategory === "health") {
                draft.currentCountry[draft.currentLayerID].healthCounter.delete(
                  action.filter.name
                );
              }
            }
            break;
          case "range_non_linear":
            //this is how you get the filter out of the carto layer
            const filter_non = draft.currentCountry[draft.currentLayerID].layer
              .getSource()
              .getFilters()[0] //since this is a filtercollection
              .getFilters()[action.filterIndex];
            //this is how you set the filter. this is specific to range filter
            filter_non.setFilters({
              gte: action.filter.scaledValue[0],
              lte: action.filter.scaledValue[1],
            });
            if (
              action.filter.value[0] !== action.filter.min ||
              action.filter.value[1] !== action.filter.max
            ) {
              draft.currentCountry[draft.currentLayerID].socioCounter.add(
                action.filter.name
              );
            } else {
              draft.currentCountry[draft.currentLayerID].socioCounter.delete(
                action.filter.name
              );
            }
            break;
          case "categorical":
            const filter_c = draft.currentCountry[draft.currentLayerID].layer
              .getSource()
              .getFilters()[0] //since this is a filtercollection
              .getFilters()[action.filterIndex];

            let col_vals_tofilter = [];
            //get the category filter state and create an array
            //of checked=true col values to filter
            let changed = false;
            action.filter.value.forEach((category) => {
              if (category.checked === true) {
                col_vals_tofilter.push(category.value);
              } else if (category.checked === false) {
                changed = true;
              }
            });

            if (changed === true) {
              draft.currentCountry[draft.currentLayerID].accessCounter.add(
                action.filter.name
              );
            } else {
              draft.currentCountry[draft.currentLayerID].accessCounter.delete(
                action.filter.name
              );
            }
            //this is how you set the filter. this is specific to range filter
            filter_c.setFilters({
              in: col_vals_tofilter,
            });
            break;

          case "none":
            break;
          default:
            break;
        }
        draft.download =
          draft.currentCountry[draft.currentLayerID].layer.getSource();
      });

    case "layer.query":
      return produce(state, (draft) => {
        draft.currentCountry[draft.currentLayerID].query = action.query;
      });

    case "layer.queryDist":
      return produce(state, (draft) => {
        if (action.queryDist.indexOf("WHERE") > 0) {
          var clause = action.queryDist.substr(
            action.queryDist.indexOf("WHERE") + "WHERE".length,
            action.queryDist.length
          );
          draft.queryDist = clause;
        } else {
          draft.queryDist = null;
        }
      });

    case "reset.filters":
      return produce(state, (draft) => {
        // draft.reset = true;
        draft.currentMapID = action.mapID;
        const layer = draft.currentCountry[draft.currentLayerID];
        draft.currentCountry[draft.currentLayerID].filters.forEach(
          (filter, filterIndex) => {
            if (filter.type === "categorical") {
              if (
                filter.value[0].checked === true &&
                filter.value[1].checked === true &&
                filter.value[2].checked === true &&
                filter.value[3].checked === true
              ) {
                return null;
              } else {
                const cartofilter_c = layer.layer
                  .getSource()
                  .getFilters()[0] //since this is a filtercollection
                  .getFilters()[filterIndex];

                let col_vals_tofilter = [];
                //get the category filter state and create an array
                //of checked=true col values to filter
                filter.value.forEach((category) => {
                  category.checked = true;
                  col_vals_tofilter.push(category.value);
                });
                cartofilter_c.setFilters({
                  in: col_vals_tofilter,
                });
              }
            } else if (filter.type === "range") {
              if (
                filter.value[0] === filter.min &&
                filter.value[1] === filter.max
              ) {
                return null;
              } else {
                filter.value = [filter.min, filter.max];
                const cartofilter = layer.layer
                  .getSource()
                  .getFilters()[0] //since this is a filtercollection
                  .getFilters()[filterIndex];
                //this is how you set the filter. this is specific to range filter
                cartofilter.setFilters({
                  gte: filter.min,
                  lte: filter.max,
                });
              }
            } else if (filter.type === "range_non_linear") {
              if (
                filter.value[0] === filter.min &&
                filter.value[1] === filter.max
              ) {
                return null;
              } else {
                filter.scaledValue = [filter.scaledMin, filter.scaledMax];
                filter.value = [filter.min, filter.max];
                const cartofilter_non = layer.layer
                  .getSource()
                  .getFilters()[0] //since this is a filtercollection
                  .getFilters()[filterIndex];
                //this is how you set the filter. this is specific to range filter
                cartofilter_non.setFilters({
                  gte: filter.scaledMin,
                  lte: filter.scaledMax,
                });
              }
            }
          }
        );
        draft.currentCountry[draft.currentLayerID].accessCounter = new Set(
          null
        );
        draft.currentCountry[draft.currentLayerID].washCounter = new Set(null);
        draft.currentCountry[draft.currentLayerID].socioCounter = new Set(null);
        draft.currentCountry[draft.currentLayerID].healthCounter = new Set(
          null
        );
      });

    //when a new carto layer is added
    case "layer.addCartoLayer":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        // draft.maps[action.mapID].layers[action.layerID].carto_layer =
        //   action.cartoLayer;
        // draft.maps[action.mapID].layers[action.layerID].carto_source =
        //   action.cartoSource;
        // var add = false;
        // if (draft.currentCountry[action.layerID].layer === null) {
        //   add = true;
        // }
        draft.currentCountry[action.layerID].layer = action.cartoLayer;
        draft.currentCountry[action.layerID].source = action.cartoSource;
        draft.currentCountry[action.layerID].style =
          draft.maps[draft.currentMapID].layers[action.layerID].carto_style;
        draft.currentCountry[action.layerID].filters =
          draft.maps[draft.currentMapID].layers[action.layerID].filters;
        // if (add === true) {
        draft.carto_client.addLayer(draft.currentCountry[action.layerID].layer);
        //   add = false;
        // }
        if (action.layerID !== "0") {
          action.cartoLayer.bringToBack();
        }
        //set default visibility as set in map state
        if (draft.maps[draft.currentMapID].layers[action.layerID].visible) {
          draft.currentCountry[action.layerID].layer.show();
        } else {
          draft.currentCountry[action.layerID].layer.hide();
        }
      });

    case "layer.removeCartoLayers":
      return produce(state, (draft) => {
        if (state.currentMapID !== null && draft.carto_client) {
          // const prevmap = state.maps[state.currentMapID];
          const layerstoremove = [];
          draft.maps[draft.currentMapID].layers.forEach((layer) => {
            if (layer.carto_layer) {
              // layer.carto_layer._source = `SELECT * FROM ${layer.carto_tableName}`;
              layerstoremove.push(layer.carto_layer);
            }
          });
          if (layerstoremove.length > 1) {
            draft.carto_client.removeLayers(layerstoremove);
          }
        }
      });

    case "dropdown.selection":
      return produce(state, (draft) => {
        draft.selectedDistName = action.distName;
      });

    case "dropdown.highlight":
      return produce(state, (draft) => {
        draft.highlightLayer = action.highlightLayer;
      });

    case "boundary.highlight":
      return produce(state, (draft) => {
        draft.highlightBoundary = action.highlightBoundary;
      });

    case "settlement.boundary":
      return produce(state, (draft) => {
        draft.settlementBoundary = action.settlementBoundary;
      });

    case "show.settlements":
      return produce(state, (draft) => {
        draft.showSettlements = action.showSettlements;
      });

    case "allow.settlements":
      return produce(state, (draft) => {
        draft.allowSettlements = action.allowSettlements;
      });

    case "settlement.popup":
      return produce(state, (draft) => {
        draft.settlementPopup = action.settlementPopup;
        draft.settlementHighlight = action.settlementHighlight;
      });
    case "user.upload":
      return produce(state, (draft) => {
        draft.userData = action.userData;
      });

    default:
      return state;
  }
};

//the entire app is wrapped in this context. Using a provider
//we pass the entire app state, and a dispatch function to trigger
//the reducer, to any component (represented by props.children below)
//that is wrapped in this context
export const MapContext = React.createContext();

export const MapContextProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <MapContext.Provider value={[state, dispatch]}>
      {props.children}
    </MapContext.Provider>
  );
};
