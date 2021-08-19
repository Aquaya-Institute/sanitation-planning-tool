import { Slider } from "@material-ui/core";

export const SliderNonLinear = (props) => {
  const scale = (value) => {
    const previousMarkIndex = Math.floor(value / 10);
    const previousMark = props.marks[previousMarkIndex];
    const remainder = value % 10;
    if (remainder === 0) {
      return previousMark.scaledValue;
    }
    const nextMark = props.marks[previousMarkIndex + 1];
    const increment = (nextMark.scaledValue - previousMark.scaledValue) / 10;
    return remainder * increment + previousMark.scaledValue;
  };

  const numFormatter = (num) => {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + "M"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  };

  return (
    <Slider
      value={props.value}
      min={props.min}
      max={props.max}
      aria-labelledby="non-linear-input-slider"
      valueLabelDisplay="auto"
      marks={props.marks}
      scale={scale}
      valueLabelFormat={numFormatter}
      step={1}
      onChange={(e, newValue) => {
        let scaled_val_min = scale(newValue[0]);
        let scaled_val_max = scale(newValue[1]);
        props.callback(e, newValue, [scaled_val_min, scaled_val_max]);
      }}
    ></Slider>
  );
};
