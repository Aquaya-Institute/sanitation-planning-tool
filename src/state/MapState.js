import * as React from "react";
import produce from "immer";
import { enableMapSet } from "immer";
import { legendStyles } from "../components/subcomponents/LegendStyles";
import { ghana } from "./ghana";
import { liberia } from "./liberia";
import { niger } from "./niger";
import { rwanda } from "./rwanda";
import { nigeria } from "./nigeria";
enableMapSet();
const legendStylesObj = legendStyles;
//this is the "global map state". this is where state is maintained and updated
const initialState = {
  currentMapID: null /* current country map */,
  carto_client: null,
  leafletMap: null,
  /* all the maps in the tool organised by country */
  maps: {
    ghana,
    liberia,
    niger,
    rwanda,
    nigeria,
  },
  activeLayer: "2",
  activeLegend: "0",
  userData: null,
  query: null,
  queryDist: null,
  skip: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    //when a different country is selected
    case "map.select":
      return produce(state, (draft) => {
        console.log("set current map to", action.mapID);
        draft.currentMapID = action.mapID;
        if (action.mapID !== null) {
          // var index = draft.maps[action.mapID].layers.length - 1;
          var index = 3;
          for (; index >= 0; index--) {
            if (draft.maps[action.mapID].layers[index].visible === true) {
              draft.activeLayer = index.toString();
              draft.query = null;
              break;
            }
          }
          var i;
          for (i = 0; i < legendStylesObj.length; i++) {
            if (
              legendStylesObj[i].style_pixel ===
                draft.maps[action.mapID].layers[draft.activeLayer]
                  .carto_style ||
              legendStylesObj[i].style_bounds ===
                draft.maps[action.mapID].layers[draft.activeLayer].carto_style
            ) {
              draft.activeLegend = i.toString();
              break;
            }
          }
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
        const mid = action.mapID;
        draft.activeLayer = action.layerID;
        const cartoLayer = draft.maps[mid].layers[action.layerID].carto_layer;
        //update the state
        for (var index in draft.maps[mid].layers) {
          if (index === action.layerID || index === "0") {
            draft.maps[mid].layers[action.layerID].visible = true;
            cartoLayer.show();
            console.log("vistoggle");
          } else {
            draft.maps[mid].layers[index].visible = false;
            draft.maps[mid].layers[index].carto_layer.hide();
            console.log("vistoggle");
          }
        }
        var i;
        for (i = 0; i < legendStylesObj.length; i++) {
          if (
            legendStylesObj[i].style_pixel ===
              draft.maps[action.mapID].layers[draft.activeLayer].carto_style ||
            legendStylesObj[i].style_bounds ===
              draft.maps[action.mapID].layers[draft.activeLayer].carto_style
          ) {
            draft.activeLegend = i.toString();
            break;
          }
        }
      });

    // case "clear.filter":
    // cycle over initial filter states, see which filters are on, and reset the carto API

    case "legend.select":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        const mid = action.mapID;
        const lid = draft.activeLayer;
        draft.maps[mid].layers[lid].carto_style = action.styleNew;
        draft.activeLegend = action.legendIndex;
      });

    case "layer.opacity":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        const mid = action.mapID;
        const lid = draft.activeLayer;
        draft.maps[mid].layers[lid].carto_style = action.styleNew;
        draft.skip = true;
        // draft.maps[action.mapID].layers[
        //   action.layerID
        // ].carto_layer._style._content = action.styleNew;
        // console.log(action.styleNew);
      });

    //when a filter is manipulated
    case "layer.filter":
      return produce(state, (draft) => {
        // draft.reset = false;
        draft.currentMapID = action.mapID;
        draft.maps[action.mapID].layers[action.layerIndex].filters[
          action.filterIndex
        ] = action.filter;
        const layer = draft.maps[action.mapID].layers[action.layerIndex];
        //TODO: based on the type of filter (range, categorical)
        //use Switch statement to apply appropriate filters
        switch (
          draft.maps[action.mapID].layers[action.layerIndex].filters[
            action.filterIndex
          ].type
        ) {
          case "range":
            //this is how you get the filter out of the carto layer
            const filter = draft.maps[action.mapID].layers[
              action.layerIndex
            ].carto_layer
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
                layer.accessCounter.add(action.filter.name);
              } else if (action.filter.subcategory === "socioeconomic") {
                layer.socioCounter.add(action.filter.name);
              } else if (action.filter.subcategory === "wash") {
                layer.washCounter.add(action.filter.name);
              } else if (action.filter.subcategory === "health") {
                layer.healthCounter.add(action.filter.name);
              }
            } else {
              if (action.filter.subcategory === "accessibility") {
                layer.accessCounter.delete(action.filter.name);
              } else if (action.filter.subcategory === "socioeconomic") {
                layer.socioCounter.delete(action.filter.name);
              } else if (action.filter.subcategory === "wash") {
                layer.washCounter.delete(action.filter.name);
              } else if (action.filter.subcategory === "health") {
                layer.healthCounter.delete(action.filter.name);
              }
            }
            break;
          case "range_non_linear":
            //this is how you get the filter out of the carto layer
            const filter_non = draft.maps[action.mapID].layers[
              action.layerIndex
            ].carto_layer
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
              layer.socioCounter.add(action.filter.name);
            } else {
              layer.socioCounter.delete(action.filter.name);
            }
            break;
          case "categorical":
            const filter_c = draft.maps[action.mapID].layers[
              action.layerIndex
            ].carto_layer
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
              layer.accessCounter.add(action.filter.name);
            } else {
              layer.accessCounter.delete(action.filter.name);
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
          draft.maps[action.mapID].layers[
            action.layerIndex
          ].carto_layer.getSource();
      });

    case "layer.query":
      return produce(state, (draft) => {
        draft.query = action.query;
      });

    case "layer.queryDist":
      return produce(state, (draft) => {
        if (action.queryDist.indexOf("WHERE") > 0) {
          var clause = action.queryDist.substr(
            action.queryDist.indexOf("WHERE") + "WHERE".length,
            action.queryDist.length
          );
          console.log(clause);
          draft.queryDist = clause;
        } else {
          draft.queryDist = null;
        }
      });

    case "reset.filters":
      return produce(state, (draft) => {
        // draft.reset = true;
        draft.currentMapID = action.mapID;
        const layer = draft.maps[action.mapID].layers[draft.activeLayer];
        layer.filters.forEach((filter, filterIndex) => {
          if (filter.type === "categorical") {
            const cartofilter_c = layer.carto_layer
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
          } else if (filter.type === "range") {
            filter.value = [filter.min, filter.max];
            const cartofilter = layer.carto_layer
              .getSource()
              .getFilters()[0] //since this is a filtercollection
              .getFilters()[filterIndex];
            //this is how you set the filter. this is specific to range filter
            cartofilter.setFilters({
              gte: filter.min,
              lte: filter.max,
            });
          } else if (filter.type === "range_non_linear") {
            filter.scaledValue = [filter.scaledMin, filter.scaledMax];
            filter.value = [filter.min, filter.max];
            const cartofilter_non = layer.carto_layer
              .getSource()
              .getFilters()[0] //since this is a filtercollection
              .getFilters()[filterIndex];
            //this is how you set the filter. this is specific to range filter
            cartofilter_non.setFilters({
              gte: filter.scaledMin,
              lte: filter.scaledMax,
            });
          }
        });
        layer.accessCounter = new Set(null);
        layer.washCounter = new Set(null);
        layer.socioCounter = new Set(null);
        layer.healthCounter = new Set(null);
      });
    //when a new carto layer is added
    case "layer.addCartoLayer":
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        draft.maps[action.mapID].layers[action.layerID].carto_layer =
          action.cartoLayer;
        draft.maps[action.mapID].layers[action.layerID].carto_source =
          action.cartoSource;
      });
    case "layer.refresh":
      return produce(state, (draft) => {
        draft.maps[action.mapID].layers[action.layerID].carto_source =
          action.source;
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
            console.log("Cleanup: layertoremove", layerstoremove);
            draft.carto_client.removeLayers(layerstoremove);
          }
        }
      });

    case "dropdown.names":
      return produce(state, (draft) => {
        draft.maps[action.mapID].layers[action.layerID].distNames =
          action.distNames;
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
