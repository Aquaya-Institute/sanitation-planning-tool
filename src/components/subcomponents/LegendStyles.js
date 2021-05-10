export const legendStyles = [
  {
    name: "Community Classification",
    style: `#layer {polygon-fill: ramp([classes], (#3d4bc7, #4f9130, #bf4343, #c49755), (1, 2, 3, 4), '=', category);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Population Estimate",
    style: `#layer {polygon-fill: ramp([pop], (#355070, #6d597a, #b56576, #e56b6f, #eaac8b), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Population Practicing Open Defecation",
    style: `#layer {polygon-fill: ramp([od], (#d4e09b, #f6f4d2, #cbdfbd, #f19c79, #a44a3f), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Reliance on Unimproved Sanitation",
    style: `#layer {polygon-fill: ramp([s_unimp], (#335c67, #fff3b0, #e09f3e, #9e2a2b, #540b0e), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Reliance on Unimproved Drinking Water",
    style: `#layer {polygon-fill: ramp([w_unimp], (#003049, #d62828, #f77f00, #fcbf49, #eae2b7), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Travel Time to Cities",
    style: `#layer {polygon-fill: ramp([timecities], (#006d77, #83c5be, #edf6f9, #ffddd2, #e29578), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Distance to Roads",
    style: `#layer {polygon-fill: ramp([dr], (#264653, #2a9d8f, #e9c46a, #f4a261, #e76f51), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Distance to Towns",
    style: `#layer {polygon-fill: ramp([dt], (#233d4d, #fe7f2d, #fcca46, #a1c181, #619b8a), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Diahrrea Prevalence in Children <5 Years",
    style: `#layer {polygon-fill: ramp([dia], (#22223b, #4a4e69, #9a8c98, #c9ada7, #f2e9e4), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Predicted Annual Cholera Incidence",
    style: `#layer {polygon-fill: ramp([cholera], (#5f0f40, #9a031e, #fb8b24, #e36414, #0f4c5c), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Mortality in Children <5 Years",
    style: `#layer {polygon-fill: ramp([u5m], (#461220, #8c2f39, #b23a48, #fcb9b2, #fed0bb), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Women's Educational Attainment",
    style: `#layer {polygon-fill: ramp([edu_w], (#c9cba3, #ffe1a8, #e26d5c, #723d46, #472d30), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
  {
    name: "Men's Educational Attainment",
    style: `#layer {polygon-fill: ramp([edu_m], (#132a13, #31572c, #4f772d, #90a955, #ecf39e), quantiles);} #layer::outline {line-width: 0;line-color: #ffffff;line-opacity: 0;}`,
  },
];
