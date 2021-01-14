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
      view: [8.059229627200192, -1.0546875000000002],
      zoom: 7,
      /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
      layers: [
        {
          name: "Community Classification",
          carto_tableName: "gha_class_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([classes], (#0d882b, #200ab7, #ad1719), (2, 1, 3), '=', category);}#layer::outline {line-width: 0;line-color: #FFFFFF;line-opacity: 0.5;}`,
          visible: false,
          /* 
          we don't use order yet to order(re) the layers 
          For now the first layer object is the bottom most rendered layer
          */
          order: 4,
          filters: [
            {
              /* 
              a categorical filter, such as this one is not implemented. 
              It might be a good one to implement
             */
              name: "Community Classification",
              type: "categorical",
              column_name: "classes",
              value: [
                {
                  name: "Rural Remote",
                  value: 1,
                  checked: true,
                },
                {
                  name: "Ruralon-road",
                  value: 2,
                  checked: true,
                },
                {
                  name: "Rural Mixed",
                  value: 3,
                  checked: true,
                },
              ] /* declaure col values that should be filtered on */,
            },
          ],
        },
        {
          name: "Reliance on Open Defecation (%)",
          carto_tableName: "gha_od_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([od], (#fbe6c5, #f2a28a, #dc7176, #b24b65, #70284a), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          order: 3,
          filters: [
            {
              name: "Reliance on Open Defecation (%)",
              type: "range",
              column_name: "od",
              min: 0,
              max: 100,
              value: [0, 100],
              subcategory: "wash",
            },
          ],
        },
        {
          name: "Women's Education (yrs.)",
          carto_tableName: "gha_edw_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([edu_w], (#d1eeea, #96d0d1, #68abb8, #45829b, #2a5674), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          order: 2,
          filters: [
            {
              name: "Women's Educational Attainment (yrs.)",
              type: "range",
              column_name: "edu_w",
              min: 2,
              max: 11,
              value: [2, 11],
              subcategory: "socioeconomic",
            },
          ],
        },
        {
          name: "Time to Cities (min.)",
          carto_tableName: "gha_timecities_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([timecities], (#d3f2a3, #82d091, #4c9b82, #19696f, #074050), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: true,
          order: 1,
          filters: [
            {
              name: "Time to Cities (min.)",
              type: "range",
              column_name: "timecities",
              min: 0,
              max: 610,
              value: [0, 610],
              subcategory: "accessibility",
            },
          ],
        },
        {
          name: "Districts",
          carto_tableName: "gha_dist_topo",
          carto_layer: null,
          carto_style: `#layer {
            polygon-fill: transparent;
            polygon-opacity: 0;
            }
            #layer::outline {
              line-width: 1.5;
              line-color: #000000;
              line-opacity: 1;
            }`,
          visible: false,
          order: 5,
          /* These are all range filters and are implemented */
          filters: [
            // {
            //   name: "Population Estimate",
            //   type: "range",
            //   column_name: "pop_est",
            //   min: 0,
            //   max: 6033969,
            //   value: [0, 6033969],
            // },
            {
              name: "Region",
              type: "none",
              column_name: "region",
              subcategory: "id",
            },
            {
              name: "District",
              type: "none",
              column_name: "district",
              subcategory: "id",
            },
            {
              name: "Predominant Community Classification",
              type: "categorical",
              column_name: "classes",
              value: [
                {
                  name: "Predominantly Rural Remote",
                  value: 1,
                  checked: true,
                },
                {
                  name: "Predominantly Rural on-road",
                  value: 2,
                  checked: true,
                },
                {
                  name: "Predominantly Rural Mixed",
                  value: 3,
                  checked: true,
                },
              ] /* declaure col values that should be filtered on */,
              subcategory: "accessibility",
            },
            {
              name: "Average Open Defecation (%)",
              type: "range",
              column_name: "od",
              min: 11,
              max: 91,
              value: [11, 91],
              subcategory: "wash",
            },
            {
              name: "Average Reliance on Unimproved Sanitation (%)",
              type: "range",
              column_name: "s_unimp",
              min: 1,
              max: 33,
              value: [1, 33],
              subcategory: "wash",
            },
            {
              name: "Average Reliance on Unimproved Drinking Water (%)",
              type: "range",
              column_name: "w_unimp",
              min: 0,
              max: 19,
              value: [0, 19],
              subcategory: "wash",
            },
            {
              name: "Average Time To Cities (min.)",
              type: "range",
              column_name: "timecities",
              min: 0,
              max: 304,
              value: [0, 304],
              subcategory: "accessibility",
            },
            {
              name: "Average Distance to Roads (m)",
              type: "range",
              column_name: "dr",
              min: 226,
              max: 17810,
              value: [226, 17810],
              subcategory: "accessibility",
            },
            {
              name: "Average Distance to Towns (m)",
              type: "range",
              column_name: "dt",
              min: 0,
              max: 70401,
              value: [0, 70401],
              subcategory: "accessibility",
            },
            {
              name: "Average Diahrrea Prevalence in Children <5 Years (cases)",
              type: "range",
              column_name: "dia",
              min: 0,
              max: 51505,
              value: [0, 51505],
              subcategory: "health",
            },
            {
              name: "Average Cholera Risk (cases/100,000pp)",
              type: "range",
              column_name: "cholera",
              min: 0.1,
              max: 898.2,
              value: [0.1, 898.2],
              subcategory: "health",
            },
            {
              name: "Average Mortality in Children <5 Years",
              type: "range",
              column_name: "u5m",
              min: 0.0,
              max: 0.075,
              value: [0.0, 0.075],
              subcategory: "health",
            },
            {
              name: "Average Women's Educational Attainment (yrs.)",
              type: "range",
              column_name: "edu_w",
              min: 0,
              max: 10,
              value: [0, 10],
              subcategory: "socioeconomic",
            },
            {
              name: "Average Men's Educational Attainment (yrs.)",
              type: "range",
              column_name: "edu_m",
              min: 0,
              max: 11,
              value: [0, 11],
              subcategory: "socioeconomic",
            },
            
          ],
        },
        {
          name: "Communities (pop.)",
          carto_tableName: "gha_comms_point_topo",
          carto_layer: null,
          carto_style: `#layer {marker-width: 5;marker-fill: ramp([pop_est], (#f9ddda, #eda8bd, #ce78b3, #9955a8, #573b88), quantiles);
            marker-fill-opacity: 1;
            marker-allow-overlap: true;
            marker-line-width: 0.5;
            marker-line-color: #000000;
            marker-line-opacity: 1;}`,
          visible: true,
          order: 5,
          /* These are all range filters and are implemented */
          filters: [
            {
              name: "Population Estimate",
              type: "range",
              column_name: "pop_est",
              min: 0,
              max: 6033969,
              value: [0, 6033969],
              subcategory: "socioeconomic",
            },
            {
              name: "Community Classification",
              type: "categorical",
              column_name: "classes",
              value: [
                {
                  name: "Rural Remote",
                  value: 1,
                  checked: true,
                },
                {
                  name: "Rural on-road",
                  value: 2,
                  checked: true,
                },
                {
                  name: "Rural Mixed",
                  value: 3,
                  checked: true,
                },
              ] /* declaure col values that should be filtered on */,
            },
            {
              name: "Open Defecation (%)",
              type: "range",
              column_name: "od",
              min: 0,
              max: 100,
              value: [0, 100],
              subcategory: "wash",
            },
            {
              name: "Reliance on Unimproved Sanitation (%)",
              type: "range",
              column_name: "s_unimp",
              min: 0,
              max: 100,
              value: [0, 100],
              subcategory: "wash",
            },
            {
              name: "Reliance on Unimproved Drinking Water (%)",
              type: "range",
              column_name: "w_unimp",
              min: 0,
              max: 100,
              value: [0, 100],
              subcategory: "wash",
            },
            {
              name: "Time To Cities (min.)",
              type: "range",
              column_name: "timecities",
              min: 17,
              max: 197,
              value: [0, 197],
              subcategory: "accessibility",
            },
            {
              name: "Distance to Roads (m)",
              type: "range",
              column_name: "dr",
              min: 26,
              max: 36648,
              value: [26, 36648],
              subcategory: "accessibility",
            },
            {
              name: "Distance to Towns (m)",
              type: "range",
              column_name: "dt",
              min: 0,
              max: 91421,
              value: [0, 91421],
              subcategory: "accessibility",
            },
            {
              name: "Diahrrea Prevalence in Children <5 Years (cases)",
              type: "range",
              column_name: "dia",
              min: 0,
              max: 37514,
              value: [0, 37514],
              subcategory: "health",
            },
            {
              name: "Cholera Risk (cases/100,000pp)",
              type: "range",
              column_name: "cholera",
              min: 0.1,
              max: 108.7,
              value: [0.1, 108.7],
              subcategory: "health",
            },
            {
              name: "Mortality in Children <5 Years",
              type: "range",
              column_name: "u5m",
              min: 0.045,
              max: 0.074,
              value: [0.045, 0.074],
              subcategory: "health",
            },
            {
              name: "Women's Educational Attainment (yrs.)",
              type: "range",
              column_name: "edu_w",
              min: 0,
              max: 10,
              value: [0, 10],
              subcategory: "socioeconomic",
            },
            {
              name: "Men's Educational Attainment (yrs.)",
              type: "range",
              column_name: "edu_m",
              min: 0,
              max: 11,
              value: [0, 11],
              subcategory: "socioeconomic",
            },
          ],
        },
      ],
    },
    /* for Cambodia i have just reused the same ghana layers to prototype for now */
    cambodia: {
      name: "Cambodia",
      mapID: "cambodia",
      view: [12.5657, 104.9910],
      zoom: 7.4,
      /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
      layers: [
        // {
        //   name: "Community Classification",
        //   carto_tableName: "gha_class_topo",
        //   carto_layer: null /* we will insert carto's layer object here */,
        //   carto_style: `#layer {polygon-fill: ramp([dn], (#4cd7d7, #1d5e96, #9b38a6), (2, 1, 3), '=', category);}#layer::outline {line-width: 0;line-color: #FFFFFF;line-opacity: 0.5;}`,
        //   visible: true,
        //   /*
        //   we don't use order yet to order(re) the layers
        //   For now the first layer object is the bottom most rendered layer
        //   */
        //   order: 2,
        //   filters: [
        //     {
        //       /*
        //       a categorical filter, such as this one is not implemented.
        //       It might be a good one to implement
        //      */
        //       name: "Community Classification",
        //       type: "categorical",
        //       column_name: "dn",
        //       values: [1, 2, 3],
        //     },
        //   ],
        // },
        // {
        //   name: "Communities",
        //   carto_tableName: "gha_comms_point_topo",
        //   carto_layer: null,
        //   carto_style: `#layer {marker-width: 5;marker-fill: #EE4D5A;marker-fill-opacity: 0.9;marker-allow-overlap: true;marker-line-width: 0;marker-line-color: #FFFFFF;marker-line-opacity: 1;}`,
        //   visible: false,
        //   order: 1,
        //   /* These are all range filters and are implemented */
        //   filters: [
        //     {
        //       name: "Population Estimate",
        //       type: "range",
        //       column_name: "pop_est",
        //       min: 0,
        //       max: 6033969,
        //       value: [0, 6033969],
        //     },
        //     {
        //       name: "Open Defecation (%)",
        //       type: "range",
        //       column_name: "od",
        //       min: 0,
        //       max: 100,
        //       value: [0, 100],
        //     },
        //     {
        //       name: "Time To Cities",
        //       type: "range",
        //       column_name: "timecities",
        //       min: 17,
        //       max: 197,
        //       value: [0, 197],
        //     },
        //   ],
        // },
        {
          name: "Reliance on Open Defecation (%)",
          carto_tableName: "khm_od_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([val], (#fbe6c5, #f2a28a, #dc7176, #b24b65, #70284a), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: true,
          order: 3,
          filters: [
            {
              name: "Reliance on Open Defecation (%)",
              type: "range",
              column_name: "val",
              min: 0,
              max: 100,
              value: [0, 100],
              subcategory: "wash",
            },
          ],
        },
        {
          name: "Women's Education (yrs.)",
          carto_tableName: "khm_edw_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([val], (#d1eeea, #96d0d1, #68abb8, #45829b, #2a5674), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          order: 2,
          filters: [
            {
              name: "Women's Education (yrs.)",
              type: "range",
              column_name: "val",
              min: 2,
              max: 8,
              value: [2, 8],
              subcategory: "socioeconomic",
            },
          ],
        },
        {
          name: "Time to Cities (min.)",
          carto_tableName: "khm_timecities_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([val], (#d3f2a3, #82d091, #4c9b82, #19696f, #074050), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          order: 1,
          filters: [
            {
              name: "Time to Cities (min.)",
              type: "range",
              column_name: "val",
              min: 0,
              max: 1497,
              value: [0, 1497],
              subcategory: "accessibility",
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
        // draft.view=draft.maps[action.mapID].view;
        // map.setView(new L.LatLng(draft.maps[action.mapID].view));
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
            // filter.resetFilters()
            break;
          case "categorical":
            //   return null;
            const filter_c = draft.maps[action.mapID].layers[
              action.layerIndex
            ].carto_layer
              .getSource()
              .getFilters()[0] //since this is a filtercollection
              .getFilters()[action.filterIndex];

            let col_vals_tofilter = [];
            //get the category filter state and create an array
            //of checked=true col values to filter
            action.filter.value.forEach((category) => {
              if (category.checked === true)
                col_vals_tofilter.push(category.value);
            });

            //this is how you set the filter. this is specific to range filter
            filter_c.setFilters({
              // column: action.filter.column_name,
              in: col_vals_tofilter,
            });
            break;
          default:
            return null;
        }
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
          if (layerstoremove.length > 1) {
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
