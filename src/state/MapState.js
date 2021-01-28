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
      minzoom: 7,
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
          visible: true,
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
              unit: "",
              type: "categorical",
              column_name: "classes",
              value: [
                {
                  name: "Rural Remote",
                  value: 1,
                  checked: true,
                },
                {
                  name: "Rural On-road",
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
          name: "Population Practicing Open Defecation (%)",
          carto_tableName: "gha_od_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([od], (#fbe6c5, #f2a28a, #dc7176, #b24b65, #70284a), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          source: "Institute for Health Metrics and Evaluation",
          year: 2017,
          order: 3,
          filters: [
            {
              name: "Population Practicing Open Defecation",
              unit: "%",
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
          name: "Women's Educational Attainment (yrs.)",
          carto_tableName: "gha_edw_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([edu_w], (#d1eeea, #96d0d1, #68abb8, #45829b, #2a5674), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          source: "Institute for Health Metrics and Evaluation",
          year: 2017,
          order: 2,
          filters: [
            {
              name: "Women's Educational Attainment",
              unit: "yrs.",
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
          name: "Travel Time to Cities (min.)",
          carto_tableName: "gha_timecities_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([timecities], (#d3f2a3, #82d091, #4c9b82, #19696f, #074050), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          order: 1,
          source: "Malaria Atlas Project",
          year: 2015,
          filters: [
            {
              name: "Travel Time to Cities",
              unit: "min.",
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
          carto_tableName: "gha_dist",
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
          visible: true,
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
              name: "Predominant Community Classification",
              unit: "",
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
              name: "Average Population Practicing Open Defecation",
              unit: "%",
              type: "range",
              column_name: "od",
              min: 11,
              max: 91,
              value: [11, 91],
              subcategory: "wash",
            },
            {
              name: "Average Reliance on Unimproved Sanitation",
              unit: "%",
              type: "range",
              column_name: "s_unimp",
              min: 1,
              max: 33,
              value: [1, 33],
              subcategory: "wash",
            },
            {
              name: "Average Reliance on Unimproved Drinking Water",
              unit: "%",
              type: "range",
              column_name: "w_unimp",
              min: 0,
              max: 19,
              value: [0, 19],
              subcategory: "wash",
            },
            {
              name: "Average Travel Time To Cities",
              unit: "min.",
              type: "range",
              column_name: "timecities",
              min: 0,
              max: 304,
              value: [0, 304],
              subcategory: "accessibility",
            },
            {
              name: "Average Distance to Roads",
              unit: "meters",
              type: "range",
              column_name: "dr",
              min: 226,
              max: 17810,
              value: [226, 17810],
              subcategory: "accessibility",
            },
            {
              name: "Average Distance to Towns",
              unit: "meters",
              type: "range",
              column_name: "dt_km",
              min: 0,
              max: 70.4,
              value: [0, 70.4],
              subcategory: "accessibility",
            },
            {
              name: "Average Diahrrea Prevalence in Children <5 Years",
              unit: "%",
              type: "range",
              column_name: "dia",
              min: 2.5,
              max: 5.2,
              value: [2.5, 5.5],
              subcategory: "health",
            },
            {
              name: "Average Predicted Annual Cholera Incidence",
              unit: "cases/100,000pp",
              type: "range",
              column_name: "cholera",
              min: 0.1,
              max: 898.2,
              value: [0.1, 898.2],
              subcategory: "health",
            },
            {
              name: "Average Mortality in Children <5 Years",
              unit: "%",
              type: "range",
              column_name: "u5m",
              min: 4.6,
              max: 7.5,
              value: [4.6, 7.5],
              subcategory: "health",
            },
            {
              name: "Average Women's Educational Attainment",
              unit: "yrs.",
              type: "range",
              column_name: "edu_w",
              min: 3,
              max: 10,
              value: [3, 10],
              subcategory: "socioeconomic",
            },
            {
              name: "Average Men's Educational Attainment",
              unit: "yrs.",
              type: "range",
              column_name: "edu_m",
              min: 4,
              max: 11,
              value: [4, 11],
              subcategory: "socioeconomic",
            },
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
          ],
        },
        {
          name: "Settlement Areas and Estimated Population (pop.)",
          carto_tableName: "gha_comms_points",
          carto_layer: null,
          carto_style: `#layer {
            [zoom >10] {marker-width: 20}
            [zoom =10] {marker-width: 15}
            [zoom =9] {marker-width: 10}
            [zoom =8] {marker-width: 7.5}
            [zoom =7] {marker-width: 5}
            [zoom <7] {marker-width: 0}
            
            marker-fill: ramp([pop_est], (#f9ddda, #eda8bd, #ce78b3, #9955a8, #573b88), quantiles);
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
              unit: "pop.",
              type: "range",
              column_name: "pop_est",
              column_slider: "pop_log",
              min: 0,
              max: 6033969,
              value: [0, 6033969],
              subcategory: "socioeconomic",
            },
            {
              name: "Community Classification",
              unit: "",
              type: "categorical",
              column_name: "classes",
              subcategory: "accessibility",
              value: [
                {
                  name: "Rural Remote",
                  value: 1,
                  checked: true,
                },
                {
                  name: "Rural On-road",
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
              name: "Population Practicing Open Defecation",
              unit: "%",
              type: "range",
              column_name: "od",
              min: 0,
              max: 100,
              value: [0, 100],
              subcategory: "wash",
            },
            {
              name: "Reliance on Unimproved Sanitation",
              unit: "%",
              type: "range",
              column_name: "s_unimp",
              min: 0,
              max: 100,
              value: [0, 100],
              subcategory: "wash",
            },
            {
              name: "Reliance on Unimproved Drinking Water",
              unit: "%",
              type: "range",
              column_name: "w_unimp",
              min: 0,
              max: 100,
              value: [0, 100],
              subcategory: "wash",
            },
            {
              name: "Travel Time To Cities",
              unit: "min.",
              type: "range",
              column_name: "timecities",
              min: 0,
              max: 546,
              value: [0, 546],
              subcategory: "accessibility",
            },
            {
              name: "Distance to Roads",
              unit: "meters",
              type: "range",
              column_name: "dr",
              min: 26,
              max: 36648,
              value: [26, 36648],
              subcategory: "accessibility",
            },
            {
              name: "Distance to Towns",
              unit: "km.",
              type: "range",
              column_name: "dt_km",
              min: 0,
              max: 91.4,
              value: [0, 91.4],
              subcategory: "accessibility",
            },
            {
              name: "Diahrrea Prevalence in Children <5 Years",
              unit: "%",
              type: "range",
              column_name: "dia",
              min: 2.3,
              max: 47,
              value: [2.3, 47],
              subcategory: "health",
            },
            {
              name: "Predicted Annual Cholera Incidence",
              unit: "cases/100,000pp",
              type: "range",
              column_name: "cholera",
              min: 0,
              max: 6410.7,
              value: [0, 6410.7],
              subcategory: "health",
            },
            {
              name: "Mortality in Children <5 Years",
              unit: "%",
              type: "range",
              column_name: "u5m",
              min: 0.05,
              max: 12.7,
              value: [0.05, 12.7],
              subcategory: "health",
            },
            {
              name: "Women's Educational Attainment",
              unit: "yrs.",
              type: "range",
              column_name: "edu_w",
              min: 1,
              max: 10,
              value: [1, 10],
              subcategory: "socioeconomic",
            },
            {
              name: "Men's Educational Attainment",
              unit: "yrs.",
              type: "range",
              column_name: "edu_m",
              min: 3,
              max: 11,
              value: [3, 11],
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
      view: [12.5657, 104.991],
      zoom: 7.4,
      /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
      layers: [
        {
          name: "Population Practicing Open Defecation (%)",
          carto_tableName: "khm_od_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([od], (#fbe6c5, #f2a28a, #dc7176, #b24b65, #70284a), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          source: "Institute for Health Metrics and Evaluation",
          year: 2017,
          order: 3,
          filters: [
            {
              name: "Population Practicing Open Defecation (%)",
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
          name: "Women's Educational Attainment (yrs.)",
          carto_tableName: "khm_edw_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([edu_w], (#d1eeea, #96d0d1, #68abb8, #45829b, #2a5674), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: false,
          source: "Institute for Health Metrics and Evaluation",
          year: 2017,
          order: 2,
          filters: [
            {
              name: "Women's Educational Attainment (yrs.)",
              type: "range",
              column_name: "edu_w",
              min: 0,
              max: 8,
              value: [0, 8],
              subcategory: "socioeconomic",
            },
          ],
        },
        {
          name: "Travel Time to Cities (min.)",
          carto_tableName: "khm_timecities_topo",
          carto_layer: null /* we will insert carto's layer object here */,
          carto_style: `#layer {polygon-fill: ramp([timecities], (#d3f2a3, #82d091, #4c9b82, #19696f, #074050), quantiles);}
            #layer::outline {line-width: 0; line-color: #ffffff; line-opacity: 0;}`,
          visible: true,
          order: 1,
          source: "Malaria Atlas Project",
          year: 2015,
          filters: [
            {
              name: "Travel Time to Cities (min.)",
              type: "range",
              column_name: "timecities",
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
        const mid = draft.currentMapID;
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
        draft.maps[draft.currentMapID].layers[action.layerIndex].filters[
          action.filterIndex
        ] = action.filter;
        //TODO: based on the type of filter (range, categorical)
        //use Switch statement to apply appropriate filters
        switch (
          draft.maps[draft.currentMapID].layers[action.layerIndex].filters[
            action.filterIndex
          ].type
        ) {
          case "range":
            //this is how you get the filter out of the carto layer
            const filter = draft.maps[draft.currentMapID].layers[
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
            const filter_c = draft.maps[draft.currentMapID].layers[
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
          case "none":
            return null;
          default:
            return null;
        }
      });

    //when a new carto layer is added
    case "layer.addCartoLayer":
      return produce(state, (draft) => {
        draft.maps[draft.currentMapID].layers[action.layerID].carto_layer =
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
