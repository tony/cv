import React from "react";
import CSS from "csstype";

import RangeSlider from "nouislider-react";
import "nouislider/dist/nouislider.css";

import { cvService } from "@tony/cv-lib/hub";
import { DEFAULT_FILTERS } from "@tony/cv-lib/search/query";

import "./FilterDateRange.css";

const minYear = DEFAULT_FILTERS.startYear;
const maxYear = DEFAULT_FILTERS.endYear;

export const FilterDateRange: React.FC<{
  lineColor: CSS.Properties["backgroundColor"];
}> = ({ lineColor }) => {
  const histogramRangeSliderRef = React.useRef<RangeSlider>(null);
  const onHistogramChange = (
    values: any[],
    handle: number,
    unencodedValues: number[],
    tap: boolean,
    positions: number[]
  ): void => {
    const yearRange = values;
    if (yearRange) {
      cvService.setYears({
        startYear: parseInt(yearRange[0]),
        endYear: parseInt(yearRange[1]),
      });
    }
  };

  return (
    <RangeSlider
      id="year-range"
      // lineColor={lineColor}
      onSlide={onHistogramChange}
      start={[minYear, maxYear]}
      connect
      animate
      range={{
        min: minYear - 1,
        max: maxYear + 1,
      }}
      step={1}
      format={{
        from: Number,
        to: (value: number) => value.toString(),
      }}
      tooltips={[true, true]}
    />
  );
};
