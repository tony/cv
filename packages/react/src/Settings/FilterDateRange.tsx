import React from "react";
import CSS from "csstype";

import { cvService } from "@tony/cv-lib/hub";

import "@tony/cv-ui-range-slider";
import type {
  RangeSlider,
  CustomEventMap as RangeSliderEvents,
} from "@tony/cv-ui-range-slider";

export const FilterDateRange: React.FC<{
  lineColor: CSS.Properties["backgroundColor"];
}> = ({ lineColor }) => {
  const histogramRangeSliderRef = React.useRef<RangeSlider>(null);
  const onHistogramChange = (e: RangeSliderEvents["change.one"]) => {
    const yearRange = e?.detail?.values;
    if (yearRange) {
      cvService.setYears({
        startYear: parseInt(yearRange[0]),
        endYear: parseInt(yearRange[1]),
      });
    }
  };

  React.useLayoutEffect(() => {
    const histogram = histogramRangeSliderRef?.current;
    if (!histogram) {
      return;
    }

    if (histogram.addEventListener) {
      histogram.addEventListener("change.one", onHistogramChange);
    }
    return () => {
      histogram.removeEventListener("change.one", onHistogramChange);
    };
  });

  return (
    <range-slider
      id="year-range"
      ref={histogramRangeSliderRef}
      lineColor={lineColor}
    />
  );
};
