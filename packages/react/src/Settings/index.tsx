import React from "react";
import Select from "react-select";

import {
  activityTypesQuery,
  cvService,
  languagesQuery,
  orgsQuery,
} from "@tony/cv-lib/hub";
import type { Results as ReducerState } from "@tony/cv-lib/search/query";

import "@tony/cv-ui-range-slider";
import type {
  RangeSlider,
  CustomEventMap as RangeSliderEvents,
} from "@tony/cv-ui-range-slider";

import {
  ActivityMultiValueLabel,
  activityTypeStyles,
  getSelectOptions,
  languagesStyles,
  LanguageOption,
  ActivityTypeOption,
  OrgOption,
  onLanguageChange,
  onOrgChange,
  onActivityTypeChange,
} from "../react-select";
import type { ISelectOption } from "../react-select";

import { FilterToggles } from "./FilterToggles";

export const Settings: React.FC<{ results: ReducerState }> = ({ results }) => {
  const languageSelectRef = React.useRef<Select>(null);
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
      <div className="dropdownRow">
        <Select
          options={getSelectOptions(
            Object.values(languagesQuery?.getValue()?.entities ?? {}).map(
              (lang) => lang.id as string
            )
          )}
          ref={languageSelectRef}
          isMulti
          onChange={onLanguageChange}
          className="react-select"
          placeholder="Language"
          styles={languagesStyles}
          components={{ Option: LanguageOption }}
        />
        <Select
          options={
            activityTypesQuery.getAll().map((a) => ({
              label: a.name,
              value: a.id,
            })) as ISelectOption
          }
          isMulti={true}
          onChange={onActivityTypeChange}
          className="react-select"
          placeholder="Event type"
          styles={activityTypeStyles}
          components={{
            Option: ActivityTypeOption,
            MultiValueLabel: ActivityMultiValueLabel,
          }}
        />
        <Select
          options={
            orgsQuery.getAll().map((org) => ({
              label: org.name,
              value: org.id?.toString() ?? org.id,
            })) as ISelectOption
          }
          isMulti={true}
          onChange={onOrgChange}
          className="react-select"
          placeholder="Topic"
          components={{ Option: OrgOption }}
        />
      </div>
      <range-slider
        id="year-range"
        ref={histogramRangeSliderRef}
        lineColor={topLanguageColorBg}
      />
      <FilterToggles />
    </div>
  );
};
