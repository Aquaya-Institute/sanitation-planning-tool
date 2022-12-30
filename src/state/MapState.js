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
import { senegal } from "./countries/senegal";
import { tanzania } from "./countries/tanzania";
import { madagascar } from "./countries/madagascar";
import { mali } from "./countries/mali";
import { kenya } from "./countries/kenya";
import { nepal } from "./countries/nepal";
import { dem_rep_congo } from "./countries/dem_rep_congo";
import { uganda } from "./countries/uganda";
import { sudan } from "./countries/sudan";

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
    madagascar,
    mozambique,
    niger,
    rwanda,
    nigeria,
    s_sudan,
    senegal,
    tanzania,
    mali,
    kenya,
    nepal,
    dem_rep_congo,
    uganda,
    sudan,
  },
  currentLayerID: "2",
  activeLegend: "0",
  settlementLayerId: null,
  adm1LayerId: null,
  adm2LayerId: null,
  userData: null,
  queryDist: null,
  skip: true,
  allDistricts: [],
  allAdm1Names: [],
  selectedDistName: [],
  selectedAdm1Name: [],
  highlightLayer: null,
  highlightBoundary: null,
  settlementBoundary: null,
  showSettlements: false,
  allowSettlements: false,
  settlementHighlight: null,
  settlementPopup: null,
  surveyPrompt: false,
  column: null,
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
    /* when a different country is selected */
    case "map.select":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        if (action.mapID !== null) {
          draft.settlementLayerId = (
            draft.maps[action.mapID].boundaries + 3
          ).toString();
          draft.adm2LayerId = "3";
          if (draft.maps[action.mapID].boundaries > 1) {
            draft.adm1LayerId = "4";
          }
          var index = 3;
          for (; index >= 0; index--) {
            if (draft.maps[action.mapID].layers[index].visible === true) {
              draft.currentLayerID = index.toString();
              break;
            }
          }
          var i;
          var x;
          if (draft.currentCountry[draft.currentLayerID].filters !== null) {
            for (i = 0; i < legendStylesObj.length; i++) {
              for (
                x = 0;
                x < draft.currentCountry[draft.currentLayerID].filters.length;
                x++
              ) {
                if (
                  legendStylesObj[i].name_pixel ===
                    draft.currentCountry[draft.currentLayerID].filters[x]
                      .name ||
                  legendStylesObj[i].name_bounds ===
                    draft.currentCountry[draft.currentLayerID].filters[x].name
                ) {
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
            }
          }
        }
      });
    /* when a different resolution is selected */
    case "current.layer":
      return produce(state, (draft) => {
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
    /* saving link to Carto client */
    case "map.addCartoClient":
      return produce(state, (draft) => {
        draft.carto_client = action.carto_client;
      });
    /* saving leaflet map */
    case "map.saveMap":
      return produce(state, (draft) => {
        draft.leafletMap = action.leafletMap;
      });
    /* when a layer is toggled */
    case "layer.toggle":
      return produce(state, (draft) => {
        draft.currentCountry[draft.currentLayerID].layer.hide();
        draft.currentLayerID = action.newLayerID;
        draft.currentCountry[draft.currentLayerID].layer.show();
        if (draft.showSettlements === true) {
          draft.currentCountry[draft.currentLayerID].layer.bringToBack();
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
        if (draft.queryDist && draft.currentLayerID > 1) {
          let queryedit =
            `SELECT * FROM ${
              draft.maps[draft.currentMapID].layers[draft.currentLayerID]
                .carto_tableName
            } WHERE` + draft.queryDist;
          draft.currentCountry[draft.currentLayerID].source.setQuery(queryedit);
          draft.currentCountry[draft.currentLayerID].layer
            .getSource()
            .setQuery(queryedit);
        }
      });
    /* when a legend is selected */
    case "legend.select":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        draft.currentCountry[draft.currentLayerID].style = action.styleNew;
        draft.currentCountry[draft.currentLayerID].layer
          .getStyle()
          .setContent(action.styleNew);
        draft.activeLegend = action.legendIndex;
        draft.currentCountry[draft.currentLayerID].layer.show();
        if (draft.showSettlements === true) {
          draft.currentCountry[draft.currentLayerID].layer.bringToBack();
        }
      });
    /* IN DEVELOPMENT: when the opacity slider is manipulated */
    case "layer.opacity":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        const mid = action.mapID;
        const lid = draft.currentLayerID;
        draft.maps[mid].layers[lid].carto_style = action.styleNew;
        draft.skip = true;
      });
    /* when a filter is manipulated */
    case "layer.filter":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        draft.currentCountry[draft.currentLayerID].filters[action.filterIndex] =
          action.filter;
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
            const filter_non = draft.currentCountry[draft.currentLayerID].layer
              .getSource()
              .getFilters()[0]
              .getFilters()[action.filterIndex];
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
              .getFilters()[0]
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
    /* clip settlements layer along with 5x5km layer */
    case "layer.query":
      return produce(state, (draft) => {
        draft.currentCountry[draft.currentLayerID].query = action.query;
      });
    /* when a district is selected from the dropdown */
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
    /* when the reset filters button is pressed */
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
                  .getFilters()[0]
                  .getFilters()[filterIndex];
                let col_vals_tofilter = [];
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
                  .getFilters()[0]
                  .getFilters()[filterIndex];
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
                  .getFilters()[0]
                  .getFilters()[filterIndex];
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
    /* when a new carto layer is added */
    case "layer.addCartoLayer":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        draft.currentCountry[action.layerID].layer = action.cartoLayer;
        draft.currentCountry[action.layerID].source = action.cartoSource;
        draft.currentCountry[action.layerID].style =
          draft.maps[draft.currentMapID].layers[action.layerID].carto_style;
        draft.currentCountry[action.layerID].filters =
          draft.maps[draft.currentMapID].layers[action.layerID].filters;
        draft.carto_client.addLayer(draft.currentCountry[action.layerID].layer);
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
    /* when a carto layer is removed */
    case "layer.removeCartoLayers":
      return produce(state, (draft) => {
        if (state.currentMapID !== null && draft.carto_client) {
          const layerstoremove = [];
          draft.maps[draft.currentMapID].layers.forEach((layer) => {
            if (layer.carto_layer) {
              layerstoremove.push(layer.carto_layer);
            }
          });
          if (layerstoremove.length > 1) {
            draft.carto_client.removeLayers(layerstoremove);
          }
        }
      });
    /* when the district dropdown is loaded */
    case "layer.column":
      return produce(state, (draft) => {
        draft.column = action.column;
      });
    /* when a district is selected from the dropdown */
    case "dropdown.selection.adm1":
      return produce(state, (draft) => {
        draft.selectedAdm1Name = action.adm1Name;
      });
    /* when a district is selected from the dropdown */
    case "dropdown.selection":
      return produce(state, (draft) => {
        draft.selectedDistName = action.distName;
      });
    /* when a new map is loaded, fetches all district options */
    case "dropdown.options.adm1":
      return produce(state, (draft) => {
        draft.allAdm1Names = action.allAdm1Names;
      });
    /* when a new map is loaded, fetches all district options */
    case "dropdown.options":
      return produce(state, (draft) => {
        draft.allDistricts = action.allDistricts;
      });
    /* saves the district highlight layer from dropdown selection */
    case "dropdown.highlight":
      return produce(state, (draft) => {
        draft.highlightLayer = action.highlightLayer;
      });
    /* saves the feature clicked pixel or admin boundary highlight layer */
    case "boundary.highlight":
      return produce(state, (draft) => {
        if (draft.highlightBoundary) {
          draft.leafletMap.removeLayer(draft.highlightBoundary);
        }
        draft.highlightBoundary = action.highlightBoundary;
        draft.leafletMap.addLayer(action.highlightBoundary);
      });
    /* saves the feature clicked settlement boundary highlight layer */
    case "settlement.boundary":
      return produce(state, (draft) => {
        draft.settlementBoundary = action.settlementBoundary;
      });
    /* when the show settlements layer checkbox is manipulated */
    case "show.settlements":
      return produce(state, (draft) => {
        draft.showSettlements = action.showSettlements;
      });
    /* when the disclaimer for the settlements layer is agreed to */
    case "allow.settlements":
      return produce(state, (draft) => {
        draft.allowSettlements = action.allowSettlements;
      });
    /* CHECK IF NEEDED */
    case "settlement.popup":
      return produce(state, (draft) => {
        draft.settlementPopup = action.settlementPopup;
        draft.settlementHighlight = action.settlementHighlight;
      });
    /* when the user uploads a CSV file */
    case "user.upload":
      return produce(state, (draft) => {
        draft.userData = action.userData;
      });
    case "survey.prompt":
      return produce(state, (draft) => {
        draft.surveyPrompt = action.surveyPrompt;
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
