import * as React from "react";
import produce from "immer";
import { enableMapSet } from "immer";
import { legendStyles } from "../components/subcomponents/LegendStyles";
import { ghana } from "./ghana";
import { liberia } from "./liberia";
import { niger } from "./niger";
enableMapSet();
//this is the "global map state". this is where state is maintained and updated
const initialState = {
  currentMapID: null /* current country map */,
  carto_client: null,
  /* all the maps in the tool organised by country */
  maps: {
    ghana,
    liberia,
    niger,
  },
  activeLayer: "2",
  activeLegend: "0",
  userData: null,
  legendStyles: legendStyles,
};

const reducer = (state, action) => {
  switch (action.type) {
    //when a different country is selected
    case "map.select":
      return produce(state, (draft) => {
        console.log("set current map to", action.mapID);
        draft.currentMapID = action.mapID;
        var index = draft.maps[action.mapID].layers.length - 1;
        for (; index >= 0; index--) {
          if (draft.maps[action.mapID].layers[index].visible === true) {
            draft.activeLayer = index.toString();
            break;
          }
        }
        var i;
        for (i = 0; i < draft.legendStyles.length; i++) {
          if (
            draft.legendStyles[i].style ===
            draft.maps[action.mapID].layers[draft.activeLayer].carto_style
          ) {
            draft.activeLegend = i.toString();
            break;
          }
        }
        // draft.activeLegend = draft.legendStyles.findIndex(
        //   (x) =>
        //     x.style ===
        //     draft.maps[action.mapID].layers[draft.activeLayer].carto_style
        // );
        // if (draft.activeLegend < 0) {
        //   draft.activeLegend = 0;
        // }
      });

    case "map.addCartoClient":
      return produce(state, (draft) => {
        draft.carto_client = action.carto_client;
      });

    //when layer is toggled
    case "layer.toggle":
      /* 
      produce(immer) lets us manipulate the state in a 
      immutable manner easily, see immer lib doc 
      */
      return produce(state, (draft) => {
        draft.currentMapID = action.mapID;
        const mid = action.mapID;
        draft.activeLayer = action.layerID;
        const cartoLayer = draft.maps[mid].layers[action.layerID].carto_layer;
        //update the state
        for (var i in draft.maps[mid].layers) {
          if (i === action.layerID || i === "0") {
            draft.maps[mid].layers[action.layerID].visible = true;
            cartoLayer.show();
          } else {
            draft.maps[mid].layers[i].visible = false;
            draft.maps[mid].layers[i].carto_layer.hide();
          }
        }
        var i = draft.legendStyles.length - 1;
        for (; i >= 0; i--) {
          if (
            draft.legendStyles[i].style ===
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

    //when a filter is manipulated
    case "layer.filter":
      return produce(state, (draft) => {
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
              layer.accessCounter.add(action.filter.name);
            } else {
              layer.accessCounter.delete(action.filter.name);
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
      });

    case "reset.filters":
      return produce(state, (draft) => {
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
      });

    case "layer.removeCartoLayers":
      return produce(state, (draft) => {
        if (state.currentMapID !== null && draft.carto_client) {
          const prevmap = state.maps[state.currentMapID];
          const layerstoremove = [];
          prevmap.layers.forEach((layer) => {
            if (layer.carto_layer) {
              layerstoremove.push(layer.carto_layer);
            }
          });
          if (layerstoremove.length > 1) {
            console.log("Cleanup: layertoremove", layerstoremove);
            draft.carto_client.removeLayers(layerstoremove);
          }
        }
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
