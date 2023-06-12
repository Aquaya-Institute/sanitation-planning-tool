export const nepal = {
  name: "Nepal",
  mapID: "nepal",
  lat: 28.3949,
  long: 84.124,
  zoom: 7,
  boundaries: 1,
  /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
  layers: [
    {
      name: "Country Border",
      carto_tableName: "npl_adm0",
      carto_layer: null /* we will insert carto's layer object here */,
      carto_style: `#layer {polygon-fill: #826dba; polygon-opacity: 0;} #layer::outline {line-width: 1.75; line-color: #000000; line-opacity: 1;}`,
      visible: true,
      filters: [],
    },
    {
      name: "1x1km area",
      carto_tableName: "npl_class",
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
          ],
        },
      ],
    },
    {
      name: "5x5km area",
      carto_tableName: "npl_multivariable_pixel2",
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
          max: 91,
          value: [0, 91],
          subcategory: "wash",
        },
        {
          name: "Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timec",
          min: 0,
          max: 2676,
          value: [0, 2676],
          subcategory: "accessibility",
        },
        {
          name: "Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 1.1,
          max: 2.5,
          value: [1.1, 2.5],
          subcategory: "health",
        },
        //   {
        //     name: "Predicted Annual Cholera Incidence",
        //     unit: "cases/100,000pp",
        //     type: "range",
        //     column_name: "chol",
        //     min: 0,
        //     max: 1000,
        //     value: [0, 1000],
        //     subcategory: "health",
        //   },
        {
          name: "Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_uimp",
          min: 0,
          max: 19,
          value: [0, 19],
          subcategory: "wash",
        },
        {
          name: "Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_uimp",
          min: 0,
          max: 80,
          value: [0, 80],
          subcategory: "wash",
        },
        {
          name: "Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "eduw",
          min: 2,
          max: 12,
          value: [2, 12],
          subcategory: "socioeconomic",
        },
        {
          name: "Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edum",
          min: 3,
          max: 11,
          value: [3, 11],
          subcategory: "socioeconomic",
        },
        {
          name: "Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "u5m",
          min: 1.6,
          max: 6.5,
          value: [1.6, 6.5],
          subcategory: "health",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0,
          max: 65.5,
          value: [0, 65.5],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 131.6,
          value: [0, 131.6],
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
          scaledMax: 1530741,
          scaledValue: [0, 1530741], //the actual min/max of column
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
              scaledValue: 1600000,
              label: "1.6M",
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
      carto_tableName: "npl_multivariable_adm2",
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
          min: 0,
          max: 78,
          value: [0, 78],
          subcategory: "wash",
        },
        {
          name: "Average Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timec",
          min: 0,
          max: 1310,
          value: [0, 1310],
          subcategory: "accessibility",
        },
        {
          name: "Average Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "dia",
          min: 1.4,
          max: 2,
          value: [1.4, 2],
          subcategory: "health",
        },
        //   {
        //     name: "Average Predicted Annual Cholera Incidence",
        //     unit: "cases/100,000pp",
        //     type: "range",
        //     column_name: "chol",
        //     min: 0,
        //     max: 1000,
        //     value: [0, 1000],
        //     subcategory: "health",
        //   },
        {
          name: "Average Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "s_uimp",
          min: 0,
          max: 6,
          value: [0, 6],
          subcategory: "wash",
        },
        {
          name: "Average Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "w_uimp",
          min: 0,
          max: 30,
          value: [0, 30],
          subcategory: "wash",
        },
        {
          name: "Average Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "eduw",
          min: 3,
          max: 8,
          value: [3, 8],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "edum",
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
          min: 1.9,
          max: 6,
          value: [1.9, 6],
          subcategory: "health",
        },
        {
          name: "Average Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0.1,
          max: 56.7,
          value: [0.1, 56.7],
          subcategory: "accessibility",
        },
        {
          name: "Average Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 110.9,
          value: [0, 110.9],
          subcategory: "accessibility",
        },
        {
          name: "Population Estimate",
          unit: "people",
          type: "range",
          column_name: "pop",
          min: 0,
          max: 3853778,
          value: [0, 3853778],
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
      carto_tableName: "npl_multivariable_comms_join1",
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
          name: "Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "timec",
          min: 0,
          max: 1905,
          value: [0, 1905],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "dr",
          min: 0,
          max: 65.5,
          value: [0, 65.5],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "dt",
          min: 0,
          max: 111.7,
          value: [0, 111.7],
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
          scaledMax: 7849342,
          scaledValue: [0, 7849342], //the actual min/max of column
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
              scaledValue: 8000000,
              label: "8M",
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
        {
          name: "Rural Typology",
          unit: "",
          type: "categorical",
          column_name: "p_class",
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
          column_name: "p_od",
          min: 0,
          max: 91,
          value: [0, 91],
          subcategory: "wash",
        },
        {
          name: "Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "p_timec",
          min: 0,
          max: 2676,
          value: [0, 2676],
          subcategory: "accessibility",
        },
        {
          name: "Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "p_dia",
          min: 1.1,
          max: 2.5,
          value: [1.1, 2.5],
          subcategory: "health",
        },
        //   {
        //     name: "Predicted Annual Cholera Incidence",
        //     unit: "cases/100,000pp",
        //     type: "range",
        //     column_name: "chol",
        //     min: 0,
        //     max: 1000,
        //     value: [0, 1000],
        //     subcategory: "health",
        //   },
        {
          name: "Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "p_s_uimp",
          min: 0,
          max: 19,
          value: [0, 19],
          subcategory: "wash",
        },
        {
          name: "Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "p_w_uimp",
          min: 0,
          max: 80,
          value: [0, 80],
          subcategory: "wash",
        },
        {
          name: "Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "p_eduw",
          min: 2,
          max: 12,
          value: [2, 12],
          subcategory: "socioeconomic",
        },
        {
          name: "Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "p_edum",
          min: 3,
          max: 11,
          value: [3, 11],
          subcategory: "socioeconomic",
        },
        {
          name: "Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "p_u5m",
          min: 1.6,
          max: 6.5,
          value: [1.6, 6.5],
          subcategory: "health",
        },
        {
          name: "Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "p_dr",
          min: 0,
          max: 65.5,
          value: [0, 65.5],
          subcategory: "accessibility",
        },
        {
          name: "Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "p_dt",
          min: 0,
          max: 131.6,
          value: [0, 131.6],
          subcategory: "accessibility",
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
          scaledMax: 1530741,
          scaledValue: [0, 1530741], //the actual min/max of column
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
              scaledValue: 1600000,
              label: "1.6M",
            },
          ],
        },
        {
          name: "Rural Remote",
          unit: "%",
          type: "none",
          column_name: "p_rr",
          subcategory: "accessibility",
        },
        {
          name: "Rural On-road",
          unit: "%",
          type: "none",
          column_name: "p_rrd",
          subcategory: "accessibility",
        },
        {
          name: "Rural Mixed",
          unit: "%",
          type: "none",
          column_name: "p_rm",
          subcategory: "accessibility",
        },
        {
          name: "Urban",
          unit: "%",
          type: "none",
          column_name: "p_u",
          subcategory: "accessibility",
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
          subcategory: "accessibility",
        },
        {
          name: "Average Population Practicing Open Defecation",
          unit: "%",
          type: "range",
          column_name: "adm2_od",
          min: 0,
          max: 78,
          value: [0, 78],
          subcategory: "wash",
        },
        {
          name: "Average Travel Time to Cities",
          unit: "min.",
          type: "range",
          column_name: "adm2_timec",
          min: 0,
          max: 1310,
          value: [0, 1310],
          subcategory: "accessibility",
        },
        {
          name: "Average Diahrrea Prevalence in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "adm2_dia",
          min: 1.4,
          max: 2,
          value: [1.4, 2],
          subcategory: "health",
        },
        //   {
        //     name: "Average Predicted Annual Cholera Incidence",
        //     unit: "cases/100,000pp",
        //     type: "range",
        //     column_name: "chol",
        //     min: 0,
        //     max: 1000,
        //     value: [0, 1000],
        //     subcategory: "health",
        //   },
        {
          name: "Average Reliance on Unimproved Sanitation",
          unit: "%",
          type: "range",
          column_name: "adm2_s_uimp",
          min: 0,
          max: 6,
          value: [0, 6],
          subcategory: "wash",
        },
        {
          name: "Average Reliance on Unimproved Drinking Water",
          unit: "%",
          type: "range",
          column_name: "adm2_w_uimp",
          min: 0,
          max: 30,
          value: [0, 30],
          subcategory: "wash",
        },
        {
          name: "Average Women's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "adm2_eduw",
          min: 3,
          max: 8,
          value: [3, 8],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Men's Educational Attainment",
          unit: "yrs.",
          type: "range",
          column_name: "adm2_edum",
          min: 5,
          max: 9,
          value: [5, 9],
          subcategory: "socioeconomic",
        },
        {
          name: "Average Mortality in Children <5 Years",
          unit: "%",
          type: "range",
          column_name: "adm2_u5m",
          min: 1.9,
          max: 6,
          value: [1.9, 6],
          subcategory: "health",
        },
        {
          name: "Average Distance to Roads",
          unit: "km.",
          type: "range",
          column_name: "adm2_dr",
          min: 0.1,
          max: 56.7,
          value: [0.1, 56.7],
          subcategory: "accessibility",
        },
        {
          name: "Average Distance to Towns",
          unit: "km.",
          type: "range",
          column_name: "adm2_dt",
          min: 0,
          max: 110.9,
          value: [0, 110.9],
          subcategory: "accessibility",
        },
        {
          name: "Population Estimate",
          unit: "people",
          type: "range",
          column_name: "adm2_pop",
          min: 0,
          max: 3853778,
          value: [0, 3853778],
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
          column_name: "adm2_rr",
          subcategory: "accessibility",
        },
        {
          name: "Rural On-road",
          unit: "%",
          type: "none",
          column_name: "adm2_rrd",
          subcategory: "accessibility",
        },
        {
          name: "Rural Mixed",
          unit: "%",
          type: "none",
          column_name: "adm2_rm",
          subcategory: "accessibility",
        },
        {
          name: "Urban",
          unit: "%",
          type: "none",
          column_name: "adm2_u",
          subcategory: "accessibility",
        },
      ],
    },
  ],
};
