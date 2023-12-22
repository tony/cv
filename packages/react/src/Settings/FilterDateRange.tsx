import React from "react";
import { useRanger } from "react-ranger";

import CSS from "csstype";

import { useMst } from "../mobx";

import "./FilterDateRange.css";

const DEFAULT_FILTERS = {
  showReleases: false,
  showTypos: false,
  showDocImprovements: false,
  showCodeStyleTweaks: false,
  showUnmerged: false,
  startYear: 2007,
  endYear: 2023,
};

const minYear = DEFAULT_FILTERS.startYear;
const maxYear = DEFAULT_FILTERS.endYear;
const initialRange = [minYear, maxYear];

export const FilterDateRange: React.FC<{
  lineColor: CSS.Properties["backgroundColor"];
}> = ({ lineColor }) => {
  const cvState = useMst();

  const [values, setValues] = React.useState(initialRange);

  const onChange = (values: number[]) => {
    cvState.setYears({ startYear: values[0], endYear: values[1] });
    setValues(values);
  };

  const { ticks, segments, getTrackProps, handles } = useRanger({
    min: minYear - 1,
    max: maxYear + 1,
    stepSize: 1,
    values,
    onChange,
    tickSize: 1,
  });
  return (
    <div
      {...getTrackProps({
        style: {
          height: "4px",
          background: lineColor,
          boxShadow: "inset 0 1px 2px rgba(0,0,0,.6)",
          borderRadius: "2px",
        },
      })}
      id="year-range"
    >
      {ticks.map(({ value, getTickProps }) => (
        <div className="tick" key={value} {...getTickProps()}>
          <div className="tick-label">{value}</div>
        </div>
      ))}
      {segments.map(({ getSegmentProps }, i) => (
        <div key={i} {...getSegmentProps()} />
      ))}
      {handles.map(({ getHandleProps }, j) => (
        <button
          key={j}
          type="button"
          {...getHandleProps({
            style: {
              width: "14px",
              height: "14px",
              outline: "none",
              borderRadius: "100%",
              background: "linear-gradient(to bottom, #eee 45%, #ddd 55%)",
              border: "solid 1px #888",
            },
          })}
        />
      ))}
    </div>
  );
};
