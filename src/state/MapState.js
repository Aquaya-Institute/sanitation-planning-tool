import * as React from "react";
import produce from "immer";

//this is the "global map state". this is where state is maintained and updated
const initialState = {
  currentMapID: null /* current country map */,
  carto_client: null,
  /* all the maps in the tool organised by country */
  maps: {
    ghana: {
      name: "Ghana",
      mapID: "ghana",
      /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
      layers: [
        {
          name: "Community Classification",
          carto_tableName: "gha_class_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([dn], (#4cd7d7, #1d5e96, #9b38a6), (2, 1, 3), '=', category);}#layer::outline {line-width: 0;line-color: #FFFFFF;line-opacity: 0.5;}`,
          visible: true,
          /* 
          we don't use order yet to order(re) the layers 
          For now the first layer object is the bottom most rendered layer
          */
          order: 2,
          filters: [
            {
              /* 
              a categorical filter, such as this one is not implemented. 
              It might be a good one to implement
             */
              type: "categorical",
              column_name: "dn",
              column_values: [1, 2, 3],
            },
          ],
        },
        {
          name: "Communities",
          carto_tableName: "gha_comms_point_topo",
          carto_layer: null,
          carto_style: `#layer {marker-width: 5;marker-fill: #EE4D5A;marker-fill-opacity: 0.9;marker-allow-overlap: true;marker-line-width: 0;marker-line-color: #FFFFFF;marker-line-opacity: 1;}`,
          visible: true,
          order: 1,
          /* These are all range filters and are implemented */
          filters: [
            {
              name: "Population Estimate",
              type: "range",
              column_name: "pop_est",
              min: 0,
              max: 6033969,
              value: [0, 6033969],
            },
            {
              name: "Open Defecation (%)",
              type: "range",
              column_name: "od",
              min: 0,
              max: 100,
              value: [0, 100],
            },
            {
              name: "Time To Cities",
              type: "range",
              column_name: "timecities",
              min: 17,
              max: 197,
              value: [0, 197],
            },
          ],
        },
      ],
    },
    /* for Cambodia i have just reused the same ghana layers to prototype for now */
    cambodia: {
      name: "Cambodia",
      mapID: "cambodia",
      /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
      layers: [
        {
          name: "Community Classification",
          carto_tableName: "gha_class_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([dn], (#4cd7d7, #1d5e96, #9b38a6), (2, 1, 3), '=', category);}#layer::outline {line-width: 0;line-color: #FFFFFF;line-opacity: 0.5;}`,
          visible: true,
          /* 
          we don't use order yet to order(re) the layers 
          For now the first layer object is the bottom most rendered layer
          */
          order: 2,
          filters: [
            {
              /* 
              a categorical filter, such as this one is not implemented. 
              It might be a good one to implement
             */
              type: "categorical",
              column_name: "dn",
              column_values: [1, 2, 3],
            },
          ],
        },
        {
          name: "Communities",
          carto_tableName: "gha_comms_point_topo",
          carto_layer: null,
          carto_style: `#layer {marker-width: 5;marker-fill: #EE4D5A;marker-fill-opacity: 0.9;marker-allow-overlap: true;marker-line-width: 0;marker-line-color: #FFFFFF;marker-line-opacity: 1;}`,
          visible: false,
          order: 1,
          /* These are all range filters and are implemented */
          filters: [
            {
              name: "Population Estimate",
              type: "range",
              column_name: "pop_est",
              min: 0,
              max: 6033969,
              value: [0, 6033969],
            },
            {
              name: "Open Defecation (%)",
              type: "range",
              column_name: "od",
              min: 0,
              max: 100,
              value: [0, 100],
            },
            {
              name: "Time To Cities",
              type: "range",
              column_name: "timecities",
              min: 17,
              max: 197,
              value: [0, 197],
            },
          ],
        },
      ],
    },
  },
};

//the reducer is essentially the place where the state is manipulated/maintained.
//We also modify any carto layer level states from here - hiding, filtering etc.
//Inside the reducer we check for actions dispatched using "dispatch" from the
//UI elements..such as apply carto filters, show hide the carto layer etc.
const reducer = (state, action) => {
  switch (action.type) {
    //when a different country is selected
    case "map.select":
      return produce(state, (draft) => {
        console.log("set current map to", action.mapID);
        draft.currentMapID = action.mapID;
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
        const mid = action.mapID;
        const lid = action.layerID;
        const cartoLayer = draft.maps[mid].layers[lid].carto_layer;
        //update the state
        draft.maps[mid].layers[lid].visible = !draft.maps[mid].layers[lid]
          .visible;
        //toggle the carto layer visibility
        if (draft.maps[mid].layers[lid].visible) {
          cartoLayer.show();
        } else {
          cartoLayer.hide();
        }
      });

    //when a filter is manipulated
    case "layer.filter":
      return produce(state, (draft) => {
        draft.maps[action.mapID].layers[action.layerIndex].filters[
          action.filterIndex
        ] = action.filter;
        //TODO: based on the type of filter (range, categorical)
        //use Switch statement to apply appropriate filters

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
      });

    //when a new carto layer is added
    case "layer.addCartoLayer":
      return produce(state, (draft) => {
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
          if (layerstoremove.length > 1){
            console.log("Cleanup: layertoremove", layerstoremove);
            draft.carto_client.removeLayers(layerstoremove);
          }
        }
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
