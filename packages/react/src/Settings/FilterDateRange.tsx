import React from "react";
import { useRanger } from "react-ranger";

import CSS from "csstype";

import { cvService } from "@tony/cv-lib/hub";
import { DEFAULT_FILTERS } from "@tony/cv-lib/search/query";

import "./FilterDateRange.css";

const minYear = DEFAULT_FILTERS.startYear;
const maxYear = DEFAULT_FILTERS.endYear;
const initialRange = [minYear, maxYear];

export const FilterDateRange: React.FC<{
  lineColor: CSS.Properties["backgroundColor"];
}> = ({ lineColor }) => {
  const [values, setValues] = React.useState(initialRange);

  const onChange = (values: number[]) => {
    console.log("onChange", values);

    cvService.setYears({
      startYear: values[0],
      endYear: values[1],
    });

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
        <div className="tick" {...getTickProps()} key={value}>
          <div className="tick-label">{value}</div>
        </div>
      ))}
      {segments.map(({ getSegmentProps }, i) => (
        <div {...getSegmentProps()} key={i} />
      ))}
      {handles.map(({ getHandleProps }, j) => (
        <button
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
          key={j}
        />
      ))}
    </div>
  );
};
