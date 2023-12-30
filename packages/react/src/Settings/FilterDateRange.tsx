import React from "react";
import { useRanger } from "react-ranger";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

import CSS from "csstype";

import { useMst } from "../mobx";
import { INITIAL_SEARCH_OPTIONS } from "@tony/cv-lib/search/mobx";

import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

import "./FilterDateRange.css";

const minYear = INITIAL_SEARCH_OPTIONS.startYear;
const maxYear = INITIAL_SEARCH_OPTIONS.endYear;
const initialRange = [minYear, maxYear];

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const FilterDateRange: React.FC<{
  lineColor: CSS.Properties["backgroundColor"];
}> = ({ lineColor }) => {
  const cvState = useMst();

  const [values, setValues] = React.useState(initialRange);
  const [value, setValue] = React.useState<Value>([
    new Date(minYear, 1, 1),
    new Date(maxYear, 1, 1),
  ]);
  const onDateChange = (values: Value) => {
    cvState.setYears({
      startYear: values[0].getFullYear(),
      endYear: values[1].getFullYear(),
    });
    setValue(values);
  };

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
    <div id="year-range">
      <DateRangePicker onChange={onDateChange} value={value} />
    </div>
  );
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
        <div key={`filter-date-range-segment-${i}`} {...getSegmentProps()} />
      ))}
      {handles.map(({ getHandleProps }, j) => (
        <button
          key={`filter-date-range-handle-${j}`}
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
