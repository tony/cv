import React from "react";

import { cvService } from "@tony/cv-lib/hub";
import type { Results as ReducerState } from "@tony/cv-lib/search/query";

import "@tony/cv-ui-range-slider";
import type {
  RangeSlider,
  CustomEventMap as RangeSliderEvents,
} from "@tony/cv-ui-range-slider";

import { FilterDropdowns } from "./FilterDropdowns";
import { FilterToggles } from "./FilterToggles";

export const Settings: React.FC<{ results: ReducerState }> = ({ results }) => {
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

  const topLanguageColorBg = results.languages.find(
    (language) => language?.ui?.backgroundColor
  )?.ui?.backgroundColor;

  return (
    <div id="settings">
      <FilterDropdowns />
      <range-slider
        id="year-range"
        ref={histogramRangeSliderRef}
        lineColor={topLanguageColorBg}
      />
      <FilterToggles />
    </div>
  );
};
