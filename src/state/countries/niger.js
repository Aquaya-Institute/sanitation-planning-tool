export const niger = {
  name: "Niger",
  mapID: "niger",
  lat: 17.6078,
  long: 8.0817,
  zoom: 6,
  currentLayer: "2",
  currentLegend: "0",
  adm2Names: null,
  boundaries: 1,
  /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
  layers: [
    {
      name: "Country Border",
      carto_tableName: "ner_adm0",
      carto_layer: null /* we will insert carto's layer object here */,
      carto_style: `#layer {
            polygon-fill: #826dba;
            polygon-opacity: 0;
          }
          #layer::outline {
            line-width: 1.75;
            line-color: #000000;
            line-opacity: 1;
          }`,
      visible: true,
      filters: [],
    },
    {
      name: "1x1km area",
      carto_tableName: "ner_class",
      carto_source: null,
      carto_layer: null /* we will insert carto's layer object here */,
      carto_style: `#layer {polygon-fill: ramp([class], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
      visible: false,
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
      filters: [
        {
          name: "Rural Typology",
          unit: "",
          type: "categorical",
          column_name: "class",
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
            {
              name: "Urban",
              value: 4,
              checked: true,
            },
          ] /* declaure col values that should be filtered on */,
        },
      ],
    },
    {
      name: "5x5km area",
      carto_tableName: "ner_multivariable_pixel2",
      carto_source: null,
      carto_layer: null,
      carto_style: `#layer {polygon-fill: ramp([class], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
      visible: true,
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
      prefix: "p_",
      filters: [
        {
          name: "Rural Typology",
          unit: "",
          type: "categorical",
          column_name: "class",
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
            {
              name: "Urban",
              value: 4,
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
          max: 99,
          value: [0, 99],
          subcategory: "wash",
        },
        {
          name: "Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timec",
          min: 0,
          max: 5067,
          value: [0, 5067],
          subcategory: "accessibility",
        },
        {
          name: "Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 2.8,
          max: 6.4,
          value: [2.8, 6.4],
          subcategory: "health",
        },
        {
          name: "Predicted Annual Cholera Incidence",
          unit: "cases/100,000pp",
          type: "range",
          column_name: "chol",
          min: 0,
          max: 1529.7,
          value: [0, 1529.7],
          subcategory: "health",
        },
        {
          name: "Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_uimp",
          min: 0,
          max: 82,
          value: [0, 82],
          subcategory: "wash",
        },
        {
          name: "Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_uimp",
          min: 0,
          max: 98,
          value: [0, 98],
          subcategory: "wash",
        },
        {
          name: "Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "eduw",
          min: 1,
          max: 8,
          value: [1, 8],
          subcategory: "socioeconomic",
        },
        {
          name: "Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edum",
          min: 1,
          max: 8,
          value: [1, 8],
          subcategory: "socioeconomic",
        },
        {
          name: "Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "u5m",
          min: 4.1,
          max: 18.5,
          value: [4.1, 18.5],
          subcategory: "health",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0.1,
          max: 309.1,
          value: [0.1, 309.1],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 984.1,
          value: [0, 984.1],
          subcategory: "accessibility",
        },
        {
          name: "Population Estimate",
          unit: "people",
          type: "range_non_linear",
          column_name: "pop",
          min: 0,
          max: 70, //we want 7 breaks not counting start value of 0.
          value: [0, 70], //slider range will be from 0-70, which we will scale to
          scaledMin: 0,
          scaledMax: 297361,
          scaledValue: [0, 297361], //the actual min/max of column
          subcategory: "socioeconomic",
          // define 7+1 non linear marks here, note that value goes from 0-70 only
          marks: [
            {
              value: 0,
              scaledValue: 0,
              label: "0",
            },
            {
              value: 10,
              scaledValue: 100,
              label: "100",
            },
            {
              value: 20,
              scaledValue: 500,
              label: "500",
            },
            {
              value: 30,
              scaledValue: 1000,
              label: "1K",
            },
            {
              value: 40,
              scaledValue: 5000,
              label: "5K",
            },
            {
              value: 50,
              scaledValue: 50000,
              label: "50K",
            },
            {
              value: 60,
              scaledValue: 100000,
              label: "100K",
            },
            {
              value: 70,
              scaledValue: 300000,
              label: "300K",
            },
          ],
        },
        {
          name: "Rural Remote",
          unit: "%",
          type: "none",
          column_name: "rr",
          subcategory: "accessibility",
        },
        {
          name: "Rural On-road",
          unit: "%",
          type: "none",
          column_name: "rrd",
          subcategory: "accessibility",
        },
        {
          name: "Rural Mixed",
          unit: "%",
          type: "none",
          column_name: "rm",
          subcategory: "accessibility",
        },
        {
          name: "Urban",
          unit: "%",
          type: "none",
          column_name: "u",
          subcategory: "accessibility",
        },
        {
          name: "Commune",
          type: "none",
          column_name: "name_3",
          subcategory: "id",
        },
        {
          name: "Department",
          type: "none",
          column_name: "name_2",
          subcategory: "id",
        },
        {
          name: "Region",
          type: "none",
          column_name: "name_1",
          subcategory: "id",
        },
      ],
    },
    {
      name: "Commune",
      carto_tableName: "ner_multivariable_adm2",
      carto_source: null,
      carto_layer: null,
      carto_style: `#layer {polygon-fill: ramp([class], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 1;line-color: #000000;line-opacity: 1;}`,
      visible: false,
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
      prefix: "adm2_",
      filters: [
        {
          name: "Predominant Rural Typology",
          unit: "",
          type: "categorical",
          column_name: "class",
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
            {
              name: "Predominantly Urban",
              value: 4,
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
          min: 31,
          max: 78,
          value: [31, 78],
          subcategory: "wash",
        },
        {
          name: "Average Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timec",
          min: 13,
          max: 2229,
          value: [13, 2229],
          subcategory: "accessibility",
        },
        {
          name: "Average Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 3.1,
          max: 5.6,
          value: [3.1, 5.6],
          subcategory: "health",
        },
        {
          name: "Average Predicted Annual Cholera Incidence",
          unit: "cases/100,000pp",
          type: "range",
          column_name: "chol",
          min: 0,
          max: 330.8,
          value: [0, 330.8],
          subcategory: "health",
        },
        {
          name: "Average Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_uimp",
          min: 5,
          max: 45,
          value: [5, 45],
          subcategory: "wash",
        },
        {
          name: "Average Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_uimp",
          min: 8,
          max: 37,
          value: [8, 37],
          subcategory: "wash",
        },
        {
          name: "Average Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "eduw",
          min: 1,
          max: 3,
          value: [1, 3],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edum",
          min: 2,
          max: 4,
          value: [2, 4],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "u5m",
          min: 4.6,
          max: 15.7,
          value: [4.6, 15.7],
          subcategory: "health",
        },
        {
          name: "Average Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0,
          max: 0,
          value: [0, 0],
          subcategory: "accessibility",
        },
        {
          name: "Average Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 0,
          value: [0, 0],
          subcategory: "accessibility",
        },
        {
          name: "Population Estimate",
          unit: "people",
          type: "range",
          column_name: "pop",
          min: 4766,
          max: 1272506,
          value: [4766, 1272506],
          subcategory: "socioeconomic",
        },
        {
          name: "Rural Remote",
          unit: "%",
          type: "none",
          column_name: "rr",
          subcategory: "accessibility",
        },
        {
          name: "Rural On-road",
          unit: "%",
          type: "none",
          column_name: "rrd",
          subcategory: "accessibility",
        },
        {
          name: "Rural Mixed",
          unit: "%",
          type: "none",
          column_name: "rm",
          subcategory: "accessibility",
        },
        {
          name: "Urban",
          unit: "%",
          type: "none",
          column_name: "u",
          subcategory: "accessibility",
        },
        {
          name: "Commune",
          type: "none",
          column_name: "name_3",
          subcategory: "id",
        },
        {
          name: "Department",
          type: "none",
          column_name: "name_2",
          subcategory: "id",
        },
        {
          name: "Region",
          type: "none",
          column_name: "name_1",
          subcategory: "id",
        },
      ],
    },
    // {
    //   name: "Estimated Settlement",
    //   carto_tableName: "ner_multivariable_comms_join1",
    //   carto_source: null,
    //   carto_layer: null,
    //   carto_style: `#layer {polygon-fill: ramp([class], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 1;line-color: #000000;line-opacity: 1;}`,
    //   visible: false,
    //   accessCounter: new Set(null),
    //   washCounter: new Set(null),
    //   socioCounter: new Set(null),
    //   healthCounter: new Set(null),
    //   filters: [
    //     {
    //       name: "Rural Typology",
    //       unit: "",
    //       type: "categorical",
    //       column_name: "class",
    //       subcategory: "accessibility",
    //       value: [
    //         {
    //           name: "Rural Remote",
    //           value: 1,
    //           checked: true,
    //         },
    //         {
    //           name: "Rural On-road",
    //           value: 2,
    //           checked: true,
    //         },
    //         {
    //           name: "Rural Mixed",
    //           value: 3,
    //           checked: true,
    //         },
    //         {
    //           name: "Urban",
    //           value: 4,
    //           checked: true,
    //         },
    //       ] /* declaure col values that should be filtered on */,
    //     },
    //     {
    //       name: "Population Practicing Open Defecation",
    //       unit: "%",
    //       type: "range",
    //       column_name: "od",
    //       min: 0,
    //       max: 99,
    //       value: [0, 99],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Travel Time to Cities",
    //       unit: "min.",
    //       type: "range",
    //       column_name: "timec",
    //       min: 0,
    //       max: 4040,
    //       value: [0, 4040],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Diahrrea Prevalence in Children <5 Years",
    //       unit: "%",
    //       type: "range",
    //       column_name: "dia",
    //       min: 2.4,
    //       max: 5.9,
    //       value: [2.4, 5.9],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Predicted Annual Cholera Incidence",
    //       unit: "cases/100,000pp",
    //       type: "range",
    //       column_name: "chol",
    //       min: 0,
    //       max: 1529.7,
    //       value: [0, 1529.7],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Reliance on Unimproved Sanitation",
    //       unit: "%",
    //       type: "range",
    //       column_name: "s_uimp",
    //       min: 0,
    //       max: 89,
    //       value: [0, 89],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Reliance on Unimproved Drinking Water",
    //       unit: "%",
    //       type: "range",
    //       column_name: "w_uimp",
    //       min: 0,
    //       max: 98,
    //       value: [0, 98],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Women's Educational Attainment",
    //       unit: "yrs.",
    //       type: "range",
    //       column_name: "eduw",
    //       min: 1,
    //       max: 5,
    //       value: [1, 5],
    //       subcategory: "socioeconomic",
    //     },
    //     {
    //       name: "Men's Educational Attainment",
    //       unit: "yrs.",
    //       type: "range",
    //       column_name: "edum",
    //       min: 1,
    //       max: 7,
    //       value: [1, 7],
    //       subcategory: "socioeconomic",
    //     },
    //     {
    //       name: "Mortality in Children <5 Years",
    //       unit: "%",
    //       type: "range",
    //       column_name: "u5m",
    //       min: 4.2,
    //       max: 18.6,
    //       value: [4.2, 18.6],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Distance to Roads",
    //       unit: "km.",
    //       type: "range",
    //       column_name: "dr",
    //       min: 0,
    //       max: 229,
    //       value: [0, 229],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Distance to Towns",
    //       unit: "km.",
    //       type: "range",
    //       column_name: "dt",
    //       min: 0,
    //       max: 876.5,
    //       value: [0, 876.5],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Population Estimate",
    //       unit: "people",
    //       type: "range_non_linear",
    //       column_name: "pop",
    //       min: 0,
    //       max: 70, //we want 7 breaks not counting start value of 0.
    //       value: [0, 70], //slider range will be from 0-70, which we will scale to
    //       scaledMin: 0,
    //       scaledMax: 1173363,
    //       scaledValue: [0, 1173363], //the actual min/max of column
    //       subcategory: "socioeconomic",
    //       // define 7+1 non linear marks here, note that value goes from 0-70 only
    //       marks: [
    //         {
    //           value: 0,
    //           scaledValue: 0,
    //           label: "0",
    //         },
    //         {
    //           value: 10,
    //           scaledValue: 100,
    //           label: "100",
    //         },
    //         {
    //           value: 20,
    //           scaledValue: 500,
    //           label: "500",
    //         },
    //         {
    //           value: 30,
    //           scaledValue: 1000,
    //           label: "1K",
    //         },
    //         {
    //           value: 40,
    //           scaledValue: 5000,
    //           label: "5K",
    //         },
    //         {
    //           value: 50,
    //           scaledValue: 50000,
    //           label: "50K",
    //         },
    //         {
    //           value: 60,
    //           scaledValue: 250000,
    //           label: "250K",
    //         },
    //         {
    //           value: 70,
    //           scaledValue: 1200000,
    //           label: "1.2M",
    //         },
    //       ],
    //     },
    //     {
    //       name: "Rural Remote",
    //       unit: "%",
    //       type: "none",
    //       column_name: "rr",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Rural On-road",
    //       unit: "%",
    //       type: "none",
    //       column_name: "rrd",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Rural Mixed",
    //       unit: "%",
    //       type: "none",
    //       column_name: "rm",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Urban",
    //       unit: "%",
    //       type: "none",
    //       column_name: "u",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Commune",
    //       type: "none",
    //       column_name: "name_3",
    //       subcategory: "id",
    //     },
    //     {
    //       name: "Department",
    //       type: "none",
    //       column_name: "name_2",
    //       subcategory: "id",
    //     },
    //     {
    //       name: "Region",
    //       type: "none",
    //       column_name: "name_1",
    //       subcategory: "id",
    //     },
    //     {
    //       name: "Rural Typology",
    //       unit: "",
    //       type: "categorical",
    //       column_name: "p_class",
    //       subcategory: "accessibility",
    //       value: [
    //         {
    //           name: "Rural Remote",
    //           value: 1,
    //           checked: true,
    //         },
    //         {
    //           name: "Rural On-road",
    //           value: 2,
    //           checked: true,
    //         },
    //         {
    //           name: "Rural Mixed",
    //           value: 3,
    //           checked: true,
    //         },
    //         {
    //           name: "Urban",
    //           value: 4,
    //           checked: true,
    //         },
    //       ] /* declaure col values that should be filtered on */,
    //     },
    //     {
    //       name: "Population Practicing Open Defecation",
    //       unit: "%",
    //       type: "range",
    //       column_name: "p_od",
    //       min: 0,
    //       max: 99,
    //       value: [0, 99],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Travel Time to Cities",
    //       unit: "min.",
    //       type: "range",
    //       column_name: "p_timec",
    //       min: 0,
    //       max: 5067,
    //       value: [0, 5067],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Diahrrea Prevalence in Children <5 Years",
    //       unit: "%",
    //       type: "range",
    //       column_name: "p_dia",
    //       min: 2.8,
    //       max: 6.4,
    //       value: [2.8, 6.4],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Predicted Annual Cholera Incidence",
    //       unit: "cases/100,000pp",
    //       type: "range",
    //       column_name: "p_chol",
    //       min: 0,
    //       max: 1529.7,
    //       value: [0, 1529.7],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Reliance on Unimproved Sanitation",
    //       unit: "%",
    //       type: "range",
    //       column_name: "p_s_uimp",
    //       min: 0,
    //       max: 82,
    //       value: [0, 82],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Reliance on Unimproved Drinking Water",
    //       unit: "%",
    //       type: "range",
    //       column_name: "p_w_uimp",
    //       min: 0,
    //       max: 98,
    //       value: [0, 98],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Women's Educational Attainment",
    //       unit: "yrs.",
    //       type: "range",
    //       column_name: "p_eduw",
    //       min: 1,
    //       max: 8,
    //       value: [1, 8],
    //       subcategory: "socioeconomic",
    //     },
    //     {
    //       name: "Men's Educational Attainment",
    //       unit: "yrs.",
    //       type: "range",
    //       column_name: "p_edum",
    //       min: 1,
    //       max: 8,
    //       value: [1, 8],
    //       subcategory: "socioeconomic",
    //     },
    //     {
    //       name: "Mortality in Children <5 Years",
    //       unit: "%",
    //       type: "range",
    //       column_name: "p_u5m",
    //       min: 4.1,
    //       max: 18.5,
    //       value: [4.1, 18.5],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Distance to Roads",
    //       unit: "km.",
    //       type: "range",
    //       column_name: "p_dr",
    //       min: 0.1,
    //       max: 309.1,
    //       value: [0.1, 309.1],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Distance to Towns",
    //       unit: "km.",
    //       type: "range",
    //       column_name: "p_dt",
    //       min: 0,
    //       max: 984.1,
    //       value: [0, 984.1],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Population Estimate",
    //       unit: "people",
    //       type: "range_non_linear",
    //       column_name: "p_pop",
    //       min: 0,
    //       max: 70, //we want 7 breaks not counting start value of 0.
    //       value: [0, 70], //slider range will be from 0-70, which we will scale to
    //       scaledMin: 0,
    //       scaledMax: 297361,
    //       scaledValue: [0, 297361], //the actual min/max of column
    //       subcategory: "socioeconomic",
    //       // define 7+1 non linear marks here, note that value goes from 0-70 only
    //       marks: [
    //         {
    //           value: 0,
    //           scaledValue: 0,
    //           label: "0",
    //         },
    //         {
    //           value: 10,
    //           scaledValue: 100,
    //           label: "100",
    //         },
    //         {
    //           value: 20,
    //           scaledValue: 500,
    //           label: "500",
    //         },
    //         {
    //           value: 30,
    //           scaledValue: 1000,
    //           label: "1K",
    //         },
    //         {
    //           value: 40,
    //           scaledValue: 5000,
    //           label: "5K",
    //         },
    //         {
    //           value: 50,
    //           scaledValue: 50000,
    //           label: "50K",
    //         },
    //         {
    //           value: 60,
    //           scaledValue: 100000,
    //           label: "100K",
    //         },
    //         {
    //           value: 70,
    //           scaledValue: 300000,
    //           label: "300K",
    //         },
    //       ],
    //     },
    //     {
    //       name: "Rural Remote",
    //       unit: "%",
    //       type: "none",
    //       column_name: "p_rr",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Rural On-road",
    //       unit: "%",
    //       type: "none",
    //       column_name: "p_rrd",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Rural Mixed",
    //       unit: "%",
    //       type: "none",
    //       column_name: "p_rm",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Urban",
    //       unit: "%",
    //       type: "none",
    //       column_name: "p_u",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Predominant Rural Typology",
    //       unit: "",
    //       type: "categorical",
    //       column_name: "adm2_class",
    //       value: [
    //         {
    //           name: "Predominantly Rural Remote",
    //           value: 1,
    //           checked: true,
    //         },
    //         {
    //           name: "Predominantly Rural on-road",
    //           value: 2,
    //           checked: true,
    //         },
    //         {
    //           name: "Predominantly Rural Mixed",
    //           value: 3,
    //           checked: true,
    //         },
    //         {
    //           name: "Predominantly Urban",
    //           value: 4,
    //           checked: true,
    //         },
    //       ] /* declaure col values that should be filtered on */,
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Average Population Practicing Open Defecation",
    //       unit: "%",
    //       type: "range",
    //       column_name: "adm2_od",
    //       min: 31,
    //       max: 78,
    //       value: [31, 78],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Average Travel Time to Cities",
    //       unit: "min.",
    //       type: "range",
    //       column_name: "adm2_timec",
    //       min: 13,
    //       max: 2229,
    //       value: [13, 2229],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Average Diahrrea Prevalence in Children <5 Years",
    //       unit: "%",
    //       type: "range",
    //       column_name: "adm2_dia",
    //       min: 3.1,
    //       max: 5.6,
    //       value: [3.1, 5.6],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Average Predicted Annual Cholera Incidence",
    //       unit: "cases/100,000pp",
    //       type: "range",
    //       column_name: "adm2_chol",
    //       min: 0,
    //       max: 330.8,
    //       value: [0, 330.8],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Average Reliance on Unimproved Sanitation",
    //       unit: "%",
    //       type: "range",
    //       column_name: "adm2_s_uimp",
    //       min: 5,
    //       max: 45,
    //       value: [5, 45],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Average Reliance on Unimproved Drinking Water",
    //       unit: "%",
    //       type: "range",
    //       column_name: "adm2_w_uimp",
    //       min: 8,
    //       max: 37,
    //       value: [8, 37],
    //       subcategory: "wash",
    //     },
    //     {
    //       name: "Average Women's Educational Attainment",
    //       unit: "yrs.",
    //       type: "range",
    //       column_name: "adm2_eduw",
    //       min: 1,
    //       max: 3,
    //       value: [1, 3],
    //       subcategory: "socioeconomic",
    //     },
    //     {
    //       name: "Average Men's Educational Attainment",
    //       unit: "yrs.",
    //       type: "range",
    //       column_name: "adm2_edum",
    //       min: 2,
    //       max: 4,
    //       value: [2, 4],
    //       subcategory: "socioeconomic",
    //     },
    //     {
    //       name: "Average Mortality in Children <5 Years",
    //       unit: "%",
    //       type: "range",
    //       column_name: "adm2_u5m",
    //       min: 4.6,
    //       max: 15.7,
    //       value: [4.6, 15.7],
    //       subcategory: "health",
    //     },
    //     {
    //       name: "Average Distance to Roads",
    //       unit: "km.",
    //       type: "range",
    //       column_name: "adm2_dr",
    //       min: 0,
    //       max: 0,
    //       value: [0, 0],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Average Distance to Towns",
    //       unit: "km.",
    //       type: "range",
    //       column_name: "adm2_dt",
    //       min: 0,
    //       max: 0,
    //       value: [0, 0],
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Population Estimate",
    //       unit: "people",
    //       type: "range",
    //       column_name: "adm2_pop",
    //       min: 4766,
    //       max: 1272506,
    //       value: [4766, 1272506],
    //       subcategory: "socioeconomic",
    //     },
    //     {
    //       name: "Rural Remote",
    //       unit: "%",
    //       type: "none",
    //       column_name: "adm2_rr",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Rural On-road",
    //       unit: "%",
    //       type: "none",
    //       column_name: "adm2_rrd",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Rural Mixed",
    //       unit: "%",
    //       type: "none",
    //       column_name: "adm2_rm",
    //       subcategory: "accessibility",
    //     },
    //     {
    //       name: "Urban",
    //       unit: "%",
    //       type: "none",
    //       column_name: "adm2_u",
    //       subcategory: "accessibility",
    //     },
    //   ],
    // },
  ],
};
