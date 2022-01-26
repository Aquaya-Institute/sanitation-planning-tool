export const tanzania = {
    name: "Tanzania",
    mapID: "tanzania",
    lat: -6.3690,
    long: 34.8888,
    zoom: 6,
    /* 
      you can add as many layers for each indicator. 
      do maintain the same structure for all. 
      */
    layers: [
      {
        name: "Country Border",
        carto_tableName: "tza_adm0",
        carto_layer: null /* we will insert carto's layer object here */,
        carto_style: `#layer {polygon-fill: #826dba; polygon-opacity: 0;} #layer::outline {line-width: 1.75; line-color: #000000; line-opacity: 1;}`,
        visible: true,
        filters: [],
      },
      {
        name: "1x1km area",
        carto_tableName: "tza_class",
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
        carto_tableName: "tza_multivariable_pixel",
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
            max: 90,
            value: [0, 90],
            subcategory: "wash",
          },
          {
            name: "Travel Time to Cities",
            unit: "min.",
            type: "range",
            column_name: "timecities",
            min: 0,
            max: 1162,
            value: [0, 1162],
            subcategory: "accessibility",
          },
          {
            name: "Diahrrea Prevalence in Children <5 Years",
            unit: "%",
            type: "range",
            column_name: "dia",
            min: 1.8,
            max: 5,
            value: [1.8, 5],
            subcategory: "health",
          },
          {
            name: "Predicted Annual Cholera Incidence",
            unit: "cases/100,000pp",
            type: "range",
            column_name: "cholera",
            min: 0,
            max: 3435.6,
            value: [0, 3435.6],
            subcategory: "health",
          },
          {
            name: "Reliance on Unimproved Sanitation",
            unit: "%",
            type: "range",
            column_name: "s_unimp",
            min: 1,
            max: 98,
            value: [1, 98],
            subcategory: "wash",
          },
          {
            name: "Reliance on Unimproved Drinking Water",
            unit: "%",
            type: "range",
            column_name: "w_unimp",
            min: 0,
            max: 89,
            value: [0, 89],
            subcategory: "wash",
          },
          {
            name: "Women's Educational Attainment",
            unit: "yrs.",
            type: "range",
            column_name: "edu_w",
            min: 3,
            max: 9,
            value: [3, 9],
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
            min: 2.3,
            max: 10.6,
            value: [2.3, 10.6],
            subcategory: "health",
          },
          {
            name: "Distance to Roads",
            unit: "km.",
            type: "range",
            column_name: "dr",
            min: 0,
            max: 101.3,
            value: [0, 101.3],
            subcategory: "accessibility",
          },
          {
            name: "Distance to Towns",
            unit: "km.",
            type: "range",
            column_name: "dt",
            min: 0,
            max: 156.1,
            value: [0, 156.1],
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
            scaledMax: 670357,
            scaledValue: [0, 670357], //the actual min/max of column
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
                scaledValue: 700000,
                label: "700K",
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
            name: "Region",
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
            name: "Division",
            type: "none",
            column_name: "name_3",
            subcategory: "id",
          },
        ],
      },
      {
        name: "District",
        carto_tableName: "tza_multivariable_dist",
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
            min: 3,
            max: 57,
            value: [3, 57],
            subcategory: "wash",
          },
          {
            name: "Average Travel Time to Cities",
            unit: "min.",
            type: "range",
            column_name: "timecities",
            min: 0,
            max: 669,
            value: [0, 669],
            subcategory: "accessibility",
          },
          {
            name: "Average Diahrrea Prevalence in Children <5 Years",
            unit: "%",
            type: "range",
            column_name: "dia",
            min: 1.9,
            max: 3.5,
            value: [1.9, 3.5],
            subcategory: "health",
          },
          {
            name: "Average Predicted Annual Cholera Incidence",
            unit: "cases/100,000pp",
            type: "range",
            column_name: "cholera",
            min: 0,
            max: 159.7,
            value: [0, 159.7],
            subcategory: "health",
          },
          {
            name: "Average Reliance on Unimproved Sanitation",
            unit: "%",
            type: "range",
            column_name: "s_unimp",
            min: 22,
            max: 76,
            value: [22, 76],
            subcategory: "wash",
          },
          {
            name: "Average Reliance on Unimproved Drinking Water",
            unit: "%",
            type: "range",
            column_name: "w_unimp",
            min: 0,
            max: 35,
            value: [0, 35],
            subcategory: "wash",
          },
          {
            name: "Average Women's Educational Attainment",
            unit: "yrs.",
            type: "range",
            column_name: "edu_w",
            min: 4,
            max: 9,
            value: [4, 9],
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
            min: 3.8,
            max: 8.3,
            value: [3.8, 8.3],
            subcategory: "health",
          },
          {
            name: "Average Distance to Roads",
            unit: "km.",
            type: "range",
            column_name: "dr",
            min: 0.5,
            max: 44.7,
            value: [0.5, 44.7],
            subcategory: "accessibility",
          },
          {
            name: "Average Distance to Towns",
            unit: "km.",
            type: "range",
            column_name: "dt",
            min: 0,
            max: 74.2,
            value: [0, 74.2],
            subcategory: "accessibility",
          },
          {
            name: "Population Estimate",
            unit: "people",
            type: "range",
            column_name: "pop",
            min: 8,
            max: 2538968,
            value: [8, 2538968],
            subcategory: "socioeconomic",
          },
        //   {
        //     name: "Average Relative Wealth Index",
        //     unit: "index",
        //     type: "range_non_linear",
        //     column_name: "rwi",
        //     scaledMin: -0.53,
        //     scaledMax: 1.35,
        //     scaledValue: [-0.53, 1.35],
        //     subcategory: "socioeconomic",
        //     min: 0,
        //     max: 60,
        //     value: [0, 60], //the actual min/max of column
        //     marks: [
        //       {
        //         value: 0,
        //         scaledValue: -0.53,
        //         label: "-0.53",
        //       },
        //       {
        //         value: 10,
        //         scaledValue: -0.25,
        //         label: "-0.25",
        //       },
        //       {
        //         value: 20,
        //         scaledValue: 0,
        //         label: "0",
        //       },
        //       {
        //         value: 30,
        //         scaledValue: 0.25,
        //         label: "0.25",
        //       },
        //       {
        //         value: 40,
        //         scaledValue: 0.6,
        //         label: "0.6",
        //       },
        //       {
        //         value: 50,
        //         scaledValue: 1,
        //         label: "1",
        //       },
        //       {
        //         value: 60,
        //         scaledValue: 1.4,
        //         label: "1.4",
        //       },
        //     ],
        //   },
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
            name: "Region",
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
            name: "Division",
            type: "none",
            column_name: "name_3",
            subcategory: "id",
          },
        ],
      },
      {
        name: "Estimated settlement",
        carto_tableName: "tza_multivariable_comms",
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
            max: 900,
            value: [0, 900],
            subcategory: "accessibility",
          },
          {
            name: "Distance to Roads",
            unit: "km.",
            type: "range",
            column_name: "dr",
            min: 0,
            max: 70.5,
            value: [0, 70.5],
            subcategory: "accessibility",
          },
          {
            name: "Distance to Towns",
            unit: "km.",
            type: "range",
            column_name: "dt",
            min: 0,
            max: 149.9,
            value: [0, 149.9],
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
            scaledMax: 7011248,
            scaledValue: [0, 7011248], //the actual min/max of column
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
                scaledValue: 7020000,
                label: "7M",
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
            name: "Region",
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
            name: "Division",
            type: "none",
            column_name: "name_3",
            subcategory: "id",
          },
        ],
      },
    ],
  };
  