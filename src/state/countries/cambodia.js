export const cambodia = {
  name: "Cambodia",
  mapID: "cambodia",
  lat: 12.5657,
  long: 104.991,
  zoom: 7.4,
  /* 
    you can add as many layers for each indicator. 
    do maintain the same structure for all. 
    */
  layers: [
    {
      name: "Country Border",
      carto_tableName: "khm_adm0",
      carto_layer: null /* we will insert carto's layer object here */,
      carto_style: `#layer {polygon-fill: #826dba; polygon-opacity: 0;} #layer::outline {line-width: 1.75; line-color: #000000; line-opacity: 1;}`,
      visible: true,
      filters: [],
    },
    {
      name: "1x1km area",
      carto_tableName: "khm_class",
      carto_source: null,
      carto_layer: null /* we will insert carto's layer object here */,
      carto_style: `#layer {polygon-fill: ramp([classes], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
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
            {
              name: "Urban",
              value: 4,
              checked: true,
            },
          ],
        },
      ],
    },
    {
      name: "5x5km area",
      carto_tableName: "khm_multivariable_pixel",
      carto_source: null,
      carto_layer: null,
      carto_style: `#layer {polygon-fill: ramp([classes], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
      visible: true,
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
      filters: [
        {
          name: "Rural Typology",
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
          max: 100,
          value: [0, 100],
          subcategory: "wash",
        },
        {
          name: "Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timecities",
          min: 0,
          max: 1561,
          value: [0, 1561],
          subcategory: "accessibility",
        },
        {
          name: "Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 1.4,
          max: 4.5,
          value: [1.4, 4.5],
          subcategory: "health",
        },
        {
          name: "Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_unimp",
          min: 0,
          max: 78,
          value: [0, 78],
          subcategory: "wash",
        },
        {
          name: "Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_unimp",
          min: 0,
          max: 58,
          value: [0, 58],
          subcategory: "wash",
        },
        {
          name: "Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edu_w",
          min: 3,
          max: 10,
          value: [3, 10],
          subcategory: "socioeconomic",
        },
        {
          name: "Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edu_m",
          min: 4,
          max: 10,
          value: [4, 10],
          subcategory: "socioeconomic",
        },
        {
          name: "Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "u5m",
          min: 0.5,
          max: 8.5,
          value: [0.5, 8.5],
          subcategory: "health",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0,
          max: 102.6,
          value: [0, 102.6],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 104.7,
          value: [0, 104.7],
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
          scaledMax: 517337,
          scaledValue: [0, 517337], //the actual min/max of column
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
              scaledValue: 520000,
              label: "520K",
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
          name: "Province",
          type: "none",
          column_name: "name_1",
          subcategory: "id",
        },
        {
          name: "District",
          type: "none",
          column_name: "name_2",
          subcategory: "id",
        },
      ],
    },
    {
      name: "District",
      carto_tableName: "khm_multivariable_dist",
      carto_source: null,
      carto_layer: null,
      carto_style: `#layer {polygon-fill: ramp([classes], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 1;line-color: #000000;line-opacity: 1;}`,
      visible: false,
      accessCounter: new Set(null),
      washCounter: new Set(null),
      socioCounter: new Set(null),
      healthCounter: new Set(null),
      filters: [
        {
          name: "Predominant Rural Typology",
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
          min: 0,
          max: 89,
          value: [0, 89],
          subcategory: "wash",
        },
        {
          name: "Average Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timecities",
          min: 0,
          max: 618,
          value: [0, 618],
          subcategory: "accessibility",
        },
        {
          name: "Average Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 2.5,
          max: 3.6,
          value: [2.5, 3.6],
          subcategory: "health",
        },
        {
          name: "Average Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_unimp",
          min: 0,
          max: 7,
          value: [0, 7],
          subcategory: "wash",
        },
        {
          name: "Average Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_unimp",
          min: 0,
          max: 25,
          value: [0, 25],
          subcategory: "wash",
        },
        {
          name: "Average Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edu_w",
          min: 3,
          max: 8,
          value: [3, 8],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edu_m",
          min: 5,
          max: 9,
          value: [5, 9],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "u5m",
          min: 1.6,
          max: 6.6,
          value: [1.6, 6.6],
          subcategory: "health",
        },
        {
          name: "Average Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0.1,
          max: 27.2,
          value: [0.1, 27.2],
          subcategory: "accessibility",
        },
        {
          name: "Average Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 57.8,
          value: [0, 57.8],
          subcategory: "accessibility",
        },
        {
          name: "Population Estimate",
          unit: "people",
          type: "range",
          column_name: "pop",
          min: 2373,
          max: 825131,
          value: [2373, 825131],
          subcategory: "socioeconomic",
        },
        // {
        //   name: "Average Relative Wealth Index",
        //   unit: "index",
        //   type: "range_non_linear",
        //   column_name: "rwi",
        //   scaledMin: -0.53,
        //   scaledMax: 1.35,
        //   scaledValue: [-0.53, 1.35],
        //   subcategory: "socioeconomic",
        //   min: 0,
        //   max: 60,
        //   value: [0, 60], //the actual min/max of column
        //   marks: [
        //     {
        //       value: 0,
        //       scaledValue: -0.53,
        //       label: "-0.53",
        //     },
        //     {
        //       value: 10,
        //       scaledValue: -0.25,
        //       label: "-0.25",
        //     },
        //     {
        //       value: 20,
        //       scaledValue: 0,
        //       label: "0",
        //     },
        //     {
        //       value: 30,
        //       scaledValue: 0.25,
        //       label: "0.25",
        //     },
        //     {
        //       value: 40,
        //       scaledValue: 0.6,
        //       label: "0.6",
        //     },
        //     {
        //       value: 50,
        //       scaledValue: 1,
        //       label: "1",
        //     },
        //     {
        //       value: 60,
        //       scaledValue: 1.4,
        //       label: "1.4",
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
          name: "Province",
          type: "none",
          column_name: "name_1",
          subcategory: "id",
        },
        {
          name: "District",
          type: "none",
          column_name: "name_2",
          subcategory: "id",
        },
      ],
    },
    {
      name: "Estimated settlement",
      carto_tableName: "khm_multivariable_comms",
      carto_layer: null /* we will insert carto's layer object here */,
      carto_source: null,
      carto_style: `#layer {polygon-fill: #826dba; polygon-opacity: 0;} #layer::outline {line-width: 1; line-color: #000000; line-opacity: 1;}`,
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
            {
              name: "Urban",
              value: 4,
              checked: true,
            },
          ] /* declaure col values that should be filtered on */,
        },
        {
          name: "Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timecities",
          min: 0,
          max: 628,
          value: [0, 628],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0,
          max: 54.9,
          value: [0, 54.9],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 98.4,
          value: [0, 98.4],
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
          scaledMax: 2570066,
          scaledValue: [0, 2570066], //the actual min/max of column
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
              scaledValue: 1000,
              label: "1K",
            },
            {
              value: 30,
              scaledValue: 5000,
              label: "5K",
            },
            {
              value: 40,
              scaledValue: 50000,
              label: "50K",
            },
            {
              value: 50,
              scaledValue: 100000,
              label: "100K",
            },
            {
              value: 60,
              scaledValue: 1000000,
              label: "1M",
            },
            {
              value: 70,
              scaledValue: 2600000,
              label: "2.6M",
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
          name: "Province",
          type: "none",
          column_name: "name_1",
          subcategory: "id",
        },
        {
          name: "District",
          type: "none",
          column_name: "name_2",
          subcategory: "id",
        },
        // {
        //   name: "",
        //   type: "none",
        //   column_name: "name_3",
        //   subcategory: "id",
        // },
      ],
    },
  ],
};
