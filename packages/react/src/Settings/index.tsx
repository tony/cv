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
import "@tony/cv-ui-switch";
import type {
  RangeSlider,
  CustomEventMap as RangeSliderEvents,
} from "@tony/cv-ui-range-slider";
import type {
  Switcher,
  CustomEventMap as SwitcherEvents,
} from "@tony/cv-ui-switch";

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

export const Settings: React.FC<{ results: ReducerState }> = ({ results }) => {
  const languageSelectRef = React.useRef<Select>(null);
  const histogramRangeSliderRef = React.useRef<RangeSlider>(null);
  const onShowSpellingContributionsRef = React.useRef<Switcher>(null);
  const onShowDocumentationContributionsRef = React.useRef<Switcher>(null);
  const onShowCodeStyleContributionsRef = React.useRef<Switcher>(null);
  const onShowUnmergedContributionsRef = React.useRef<Switcher>(null);

  const onHistogramChange = (e: RangeSliderEvents["change.one"]) => {
    const yearRange = e?.detail?.values;
    if (yearRange) {
      cvService.setYears({
        startYear: parseInt(yearRange[0]),
        endYear: parseInt(yearRange[1]),
      });
    }
  };

  const onShowSpellingContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showTypos: checked,
      });
    }
  };
  const onShowDocumentationContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showDocImprovements: checked,
      });
    }
  };
  const onShowCodeStyleContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showCodeStyleTweaks: checked,
      });
    }
  };
  const onShowUnmergedContributionsChange = (
    e: SwitcherEvents["change.one"]
  ) => {
    const checked = e?.detail?.checked;
    if (checked !== null) {
      cvService.setActivityFilters({
        showUnmerged: checked,
      });
    }
  };

  React.useLayoutEffect(() => {
    const histogram = histogramRangeSliderRef?.current;
    const spellingSwitcher = onShowSpellingContributionsRef?.current;
    const documentationSwitcher = onShowDocumentationContributionsRef?.current;
    const codeStyleSwitcher = onShowCodeStyleContributionsRef?.current;
    const unmergedSwitcher = onShowUnmergedContributionsRef?.current;
    if (
      !histogram ||
      !spellingSwitcher ||
      !documentationSwitcher ||
      !codeStyleSwitcher ||
      !unmergedSwitcher
    ) {
      return;
    }

    if (histogram.addEventListener) {
      histogram.addEventListener("change.one", onHistogramChange);
    }
    if (spellingSwitcher.addEventListener) {
      console.log("add listener");
      spellingSwitcher.addEventListener(
        "change.one",
        onShowSpellingContributionsChange
      );
      documentationSwitcher.addEventListener(
        "change.one",
        onShowDocumentationContributionsChange
      );
      codeStyleSwitcher.addEventListener(
        "change.one",
        onShowCodeStyleContributionsChange
      );
      unmergedSwitcher.addEventListener(
        "change.one",
        onShowUnmergedContributionsChange
      );
    }
    return () => {
      histogram.removeEventListener("change.one", onHistogramChange);
      spellingSwitcher.removeEventListener(
        "change.one",
        onShowSpellingContributionsChange
      );
      documentationSwitcher.removeEventListener(
        "change.one",
        onShowDocumentationContributionsChange
      );
      codeStyleSwitcher.removeEventListener(
        "change.one",
        onShowCodeStyleContributionsChange
      );
      unmergedSwitcher.removeEventListener(
        "change.one",
        onShowUnmergedContributionsChange
      );
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
      <div className="toggles">
        <simple-switcher
          id="show-spelling"
          ref={onShowSpellingContributionsRef}
        >
          Spelling Contributions
        </simple-switcher>
        <simple-switcher
          id="show-documentation"
          ref={onShowDocumentationContributionsRef}
        >
          Documentation Tweaks
        </simple-switcher>
        <simple-switcher
          id="show-code-style"
          ref={onShowCodeStyleContributionsRef}
        >
          Code Style / Bikeshedding
        </simple-switcher>
        <simple-switcher
          id="show-unmerged"
          ref={onShowUnmergedContributionsRef}
        >
          Unmerged
        </simple-switcher>
      </div>
    </div>
  );
};
