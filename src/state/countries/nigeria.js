export const nigeria = {
  name: "Nigeria",
  mapID: "nigeria",
  lat: 9.8501,
  long: 7.8471,
  zoom: 6,
  /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
  layers: [
    {
      name: "Country Border",
      carto_tableName: "nga_adm0",
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
      carto_tableName: "nga_class",
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
      carto_tableName: "nga_multivariable_pixel2",
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
          max: 97,
          value: [0, 97],
          subcategory: "wash",
        },
        {
          name: "Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timec",
          min: 0,
          max: 892,
          value: [0, 892],
          subcategory: "accessibility",
        },
        {
          name: "Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 1.5,
          max: 7.5,
          value: [1.5, 7.5],
          subcategory: "health",
        },
        {
          name: "Predicted Annual Cholera Incidence",
          unit: "cases/100,000pp",
          type: "range",
          column_name: "chol",
          min: 0,
          max: 2088,
          value: [0, 2088],
          subcategory: "health",
        },
        {
          name: "Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_uimp",
          min: 0,
          max: 99,
          value: [0, 99],
          subcategory: "wash",
        },
        {
          name: "Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_uimp",
          min: 0,
          max: 100,
          value: [0, 100],
          subcategory: "wash",
        },
        {
          name: "Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "eduw",
          min: 1,
          max: 12,
          value: [1, 12],
          subcategory: "socioeconomic",
        },
        {
          name: "Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edum",
          min: 1,
          max: 12,
          value: [1, 12],
          subcategory: "socioeconomic",
        },
        {
          name: "Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "u5m",
          min: 4.9,
          max: 21,
          value: [4.9, 21],
          subcategory: "health",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0.1,
          max: 60.9,
          value: [0.1, 60.9],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 89.2,
          value: [0, 89.2],
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
          scaledMax: 911365,
          scaledValue: [0, 911365], //the actual min/max of column
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
              scaledValue: 920000,
              label: "920K",
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
          name: "State",
          type: "none",
          column_name: "name_1",
          subcategory: "id",
        },
        {
          name: "Local Gov Area",
          type: "none",
          column_name: "name_2",
          subcategory: "id",
        },
      ],
    },
    {
      name: "Local Gov Area",
      carto_tableName: "nga_multivariable_adm2",
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
          min: 1,
          max: 80,
          value: [1, 80],
          subcategory: "wash",
        },
        {
          name: "Average Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timec",
          min: 0,
          max: 425,
          value: [0, 425],
          subcategory: "accessibility",
        },
        {
          name: "Average Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 1.5,
          max: 5.2,
          value: [1.5, 5.2],
          subcategory: "health",
        },
        {
          name: "Average Predicted Annual Cholera Incidence",
          unit: "cases/100,000pp",
          type: "range",
          column_name: "chol",
          min: 0,
          max: 421.4,
          value: [0, 421.4],
          subcategory: "health",
        },
        {
          name: "Average Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_uimp",
          min: 0,
          max: 63,
          value: [0, 63],
          subcategory: "wash",
        },
        {
          name: "Average Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_uimp",
          min: 0,
          max: 63,
          value: [0, 63],
          subcategory: "wash",
        },
        {
          name: "Average Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "eduw",
          min: 1,
          max: 11,
          value: [1, 11],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edum",
          min: 3,
          max: 12,
          value: [3, 12],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "u5m",
          min: 5.8,
          max: 20.1,
          value: [5.8, 20.1],
          subcategory: "health",
        },
        {
          name: "Average Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0.1,
          max: 32.3,
          value: [0.1, 32.3],
          subcategory: "accessibility",
        },
        {
          name: "Average Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 40.9,
          value: [0, 40.9],
          subcategory: "accessibility",
        },
        {
          name: "Population Estimate",
          unit: "people",
          type: "range",
          column_name: "pop",
          min: 46588,
          max: 2687814,
          value: [46588, 2687814],
          subcategory: "socioeconomic",
        },
        // {
        //   name: "Average Relative Wealth Index",
        //   unit: "index",
        //   type: "range_non_linear",
        //   column_name: "rwi",
        //   scaledMin: -0.77,
        //   scaledMax: 1.53,
        //   scaledValue: [-0.77, 1.53],
        //   subcategory: "socioeconomic",
        //   min: 0,
        //   max: 60,
        //   value: [0, 60], //the actual min/max of column
        //   marks: [
        //     {
        //       value: 0,
        //       scaledValue: -0.8,
        //       label: "-0.8",
        //     },
        //     {
        //       value: 10,
        //       scaledValue: -0.4,
        //       label: "-0.25",
        //     },
        //     {
        //       value: 20,
        //       scaledValue: 0,
        //       label: "0",
        //     },
        //     {
        //       value: 30,
        //       scaledValue: 0.4,
        //       label: "0.25",
        //     },
        //     {
        //       value: 40,
        //       scaledValue: 0.8,
        //       label: "0.6",
        //     },
        //     {
        //       value: 50,
        //       scaledValue: 1.2,
        //       label: "1.3",
        //     },
        //     {
        //       value: 60,
        //       scaledValue: 1.6,
        //       label: "1.6",
        //     },
        //   ],
        // },
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
          name: "State",
          type: "none",
          column_name: "name_1",
          subcategory: "id",
        },
        {
          name: "Local Gov Area",
          type: "none",
          column_name: "name_2",
          subcategory: "id",
        },
      ],
    },
    {
      name: "Estimated settlement",
      carto_tableName: "nga_multivariable_comms_join1",
      carto_layer: null /* we will insert carto's layer object here */,
      carto_source: null,
      carto_style: `#layer {polygon-fill: ramp([class], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 1;line-color: #000000;line-opacity: 1;}`,
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
      visible: false,
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
          max: 743,
          value: [0, 743],
          subcategory: "accessibility",
        },
        {
          name: "Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 1.4,
          max: 7.3,
          value: [1.4, 7.3],
          subcategory: "health",
        },
        {
          name: "Predicted Annual Cholera Incidence",
          unit: "cases/100,000pp",
          type: "range",
          column_name: "chol",
          min: 0,
          max: 2088,
          value: [0, 2088],
          subcategory: "health",
        },
        {
          name: "Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_uimp",
          min: 0,
          max: 100,
          value: [0, 100],
          subcategory: "wash",
        },
        {
          name: "Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_uimp",
          min: 0,
          max: 100,
          value: [0, 100],
          subcategory: "wash",
        },
        {
          name: "Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "eduw",
          min: 1,
          max: 12,
          value: [1, 12],
          subcategory: "socioeconomic",
        },
        {
          name: "Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edum",
          min: 1,
          max: 12,
          value: [1, 12],
          subcategory: "socioeconomic",
        },
        {
          name: "Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "u5m",
          min: 4.6,
          max: 21.1,
          value: [4.6, 12.1],
          subcategory: "health",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0,
          max: 61,
          value: [0, 61],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 87.9,
          value: [0, 87.9],
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
          scaledMax: 12756682,
          scaledValue: [0, 12756682], //the actual min/max of column
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
              scaledValue: 500,
              label: "500",
            },
            {
              value: 20,
              scaledValue: 5000,
              label: "5K",
            },
            {
              value: 30,
              scaledValue: 50000,
              label: "50K",
            },
            {
              value: 40,
              scaledValue: 100000,
              label: "100K",
            },
            {
              value: 50,
              scaledValue: 500000,
              label: "500K",
            },
            {
              value: 60,
              scaledValue: 1000000,
              label: "1M",
            },
            {
              value: 70,
              scaledValue: 13000000,
              label: "13M",
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
          name: "State",
          type: "none",
          column_name: "name_1",
          subcategory: "id",
        },
        {
          name: "Local Gov Area",
          type: "none",
          column_name: "name_2",
          subcategory: "id",
        },
        {
          name: "Rural Typology",
          unit: "",
          type: "p_categorical",
          column_name: "class",
          subcategory: "",
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
          column_name: "p_od",
          min: 0,
          max: 97,
          value: [0, 97],
          subcategory: "",
        },
        {
          name: "Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "p_timec",
          min: 0,
          max: 892,
          value: [0, 892],
          subcategory: "",
        },
        {
          name: "Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "p_dia",
          min: 1.5,
          max: 7.5,
          value: [1.5, 7.5],
          subcategory: "",
        },
        {
          name: "Predicted Annual Cholera Incidence",
          unit: "cases/100,000pp",
          type: "range",
          column_name: "p_chol",
          min: 0,
          max: 2088,
          value: [0, 2088],
          subcategory: "",
        },
        {
          name: "Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "p_s_uimp",
          min: 0,
          max: 99,
          value: [0, 99],
          subcategory: "",
        },
        {
          name: "Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "p_w_uimp",
          min: 0,
          max: 100,
          value: [0, 100],
          subcategory: "",
        },
        {
          name: "Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "p_eduw",
          min: 1,
          max: 12,
          value: [1, 12],
          subcategory: "",
        },
        {
          name: "Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "p_edum",
          min: 1,
          max: 12,
          value: [1, 12],
          subcategory: "",
        },
        {
          name: "Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "p_u5m",
          min: 4.9,
          max: 21,
          value: [4.9, 21],
          subcategory: "",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "p_dr",
          min: 0.1,
          max: 60.9,
          value: [0.1, 60.9],
          subcategory: "",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "p_dt",
          min: 0,
          max: 89.2,
          value: [0, 89.2],
          subcategory: "",
        },
        {
          name: "Population Estimate",
          unit: "people",
          type: "range_non_linear",
          column_name: "p_pop",
          min: 0,
          max: 70, //we want 7 breaks not counting start value of 0.
          value: [0, 70], //slider range will be from 0-70, which we will scale to
          scaledMin: 0,
          scaledMax: 911365,
          scaledValue: [0, 911365], //the actual min/max of column
          subcategory: "",
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
              scaledValue: 920000,
              label: "920K",
            },
          ],
        },
        {
          name: "Predominant Rural Typology",
          unit: "",
          type: "categorical",
          column_name: "adm2_class",
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
          subcategory: "",
        },
        {
          name: "Average Population Practicing Open Defecation",
          unit: "%",
          type: "range",
          column_name: "adm2_od",
          min: 1,
          max: 80,
          value: [1, 80],
          subcategory: "",
        },
        {
          name: "Average Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "adm2_timec",
          min: 0,
          max: 425,
          value: [0, 425],
          subcategory: "",
        },
        {
          name: "Average Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "adm2_dia",
          min: 1.5,
          max: 5.2,
          value: [1.5, 5.2],
          subcategory: "",
        },
        {
          name: "Average Predicted Annual Cholera Incidence",
          unit: "cases/100,000pp",
          type: "range",
          column_name: "adm2_chol",
          min: 0,
          max: 421.4,
          value: [0, 421.4],
          subcategory: "",
        },
        {
          name: "Average Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "adm2_s_uimp",
          min: 0,
          max: 63,
          value: [0, 63],
          subcategory: "",
        },
        {
          name: "Average Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "adm2_w_uimp",
          min: 0,
          max: 63,
          value: [0, 63],
          subcategory: "",
        },
        {
          name: "Average Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "adm2_eduw",
          min: 1,
          max: 11,
          value: [1, 11],
          subcategory: "",
        },
        {
          name: "Average Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "adm2_edum",
          min: 3,
          max: 12,
          value: [3, 12],
          subcategory: "",
        },
        {
          name: "Average Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "adm2_u5m",
          min: 5.8,
          max: 20.1,
          value: [5.8, 20.1],
          subcategory: "",
        },
        {
          name: "Average Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "adm2_dr",
          min: 0.1,
          max: 32.3,
          value: [0.1, 32.3],
          subcategory: "",
        },
        {
          name: "Average Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "adm2_dt",
          min: 0,
          max: 40.9,
          value: [0, 40.9],
          subcategory: "",
        },
        {
          name: "Population Estimate",
          unit: "people",
          type: "range",
          column_name: "adm2_pop",
          min: 46588,
          max: 2687814,
          value: [46588, 2687814],
          subcategory: "",
        },
      ],
    },
  ],
};
