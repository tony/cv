import React from "react";
import Select from "react-select";
import type { Subscription } from "rxjs";
import equal from "fast-deep-equal";

import type { IActivity, Language } from "@tony/cv-data/types";
import {
  activitiesStore,
  activityTypesQuery,
  loadStores,
  orgsQuery,
  query,
  languagesQuery,
  cvService,
} from "@tony/cv-lib/hub";
import type {
  ActivityCount,
  LanguageCount,
  Results as ReducerState,
} from "@tony/cv-lib/search/query";
import { DEFAULT_RESULTS } from "@tony/cv-lib/search/query";
import type { fetchDataFn } from "@tony/cv-data/fetch";
import { ActivityCard } from "./Card";
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
} from "./react-select";
import type { ISelectOption } from "./react-select";
import { onEmit, useAsyncEffect } from "./utils";

import christmasTreeSvg from "@tony/cv-data/img/icons/christmas-tree.svg";
import "@tony/cv-nav";
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

import { LINE_CHART_MAP, PIE_CHART_MAP } from "./constants";
import { Chart } from "./types";

import "@tony/cv-ui/styles/style.scss";

enum ActionType {
  SetResults,
  IsLoading,
}

type Action =
  | {
      type: ActionType.SetResults;
      activities?: IActivity[];
      languages?: Language[];

      // Counts
      activityCount?: ActivityCount;
      languageCount?: LanguageCount;
    }
  | { type: ActionType.IsLoading; isLoading: boolean };

const reducer = (state: ReducerState, action: Action) => {
  switch (action.type) {
    case ActionType.SetResults: {
      return {
        ...state,
        ...action,
      };
    }
    case ActionType.IsLoading: {
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.isLoading,
        },
      };
    }
    default:
      return state;
  }
};

const fetchData: fetchDataFn = async () => {
  return import(/* webpackChunkName: "cvData" */ "@tony/cv-data/raw");
};

const AppContainer: React.FC<{
  chart: Chart;
  setChart: React.Dispatch<React.SetStateAction<Chart>>;
}> = ({ children, chart, setChart }) => {
  const ChartLinks = () => (
    <div id="chart-links" className="fss-tablet">
      📊<span className="dh-tablet"> Chart frameworks:</span>{" "}
      {Object.keys(PIE_CHART_MAP).map((c, idx: number) => (
        <React.Fragment key={c}>
          {idx > 0 && ", "}
          <a
            href="#"
            onClick={() => setChart((c as unknown) as Chart)}
            {...(c === chart && { className: "active" })}
          >
            {c}
          </a>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div>
      <cv-nav />
      <ChartLinks />
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [results, dispatch] = React.useReducer(reducer, DEFAULT_RESULTS);
  const [chart, setChart] = React.useState<Chart>(Chart.Carbon);
  const LanguagePieChart = PIE_CHART_MAP[chart];
  const ActivityLineChart = LINE_CHART_MAP[chart];

  useAsyncEffect(async () => {
    const data = await fetchData();
    if (Object.keys(activitiesStore.getValue().entities ?? {}).length) {
      return void 0;
    }

    loadStores(data);
    if (!results?.activities.length) {
      dispatch({
        type: ActionType.SetResults,
        // activities: activitiesQuery.getAll() as IActivity[],

        // Counts
        languageCount: (await query.getVisibleLanguageCount()) as LanguageCount,
        activityCount: (await query.getVisibleActivityYearCount()) as ActivityCount,
      });
    }
    return void 0;
  });

  const languageSelectRef = React.useRef<Select>(null);
  const histogramRangeSliderRef = React.useRef<RangeSlider>(null);
  const onShowSpellingContributionsRef = React.useRef<Switcher>(null);
  const onShowDocumentationContributionsRef = React.useRef<Switcher>(null);
  const onShowCodeStyleContributionsRef = React.useRef<Switcher>(null);
  const onShowUnmergedContributionsRef = React.useRef<Switcher>(null);

  React.useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<ReducerState>(query.subResults$(), (newResults) => {
        const isChanged = !equal(newResults, results);
        console.log("results published", newResults, results, { isChanged });

        if (isChanged) {
          dispatch({
            type: ActionType.SetResults,
            ...newResults,
          });
        }
      }),
    ];

    return () => {
      subscriptions.map((it) => it.unsubscribe());
    };
  }, []);

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

  const resultsCount = results?.activities ? results.activities.length : 0;
  return (
    <AppContainer chart={chart} setChart={setChart}>
      {results.ui.isLoading ? (
        <div id="loading-screen">Loading CV Data</div>
      ) : (
        <>
          <div
            className={`chartRow ${chart}${
              Object.keys(results.activityCount).length ? "" : " noCharts"
            }`}
          >
            <div className="chartRow--donut">
              <React.Suspense
                fallback={
                  <div className="loading-chart">Loading Pie Chart</div>
                }
              >
                <LanguagePieChart />
              </React.Suspense>
            </div>
            <div className="chartRow--line">
              <React.Suspense
                fallback={
                  <div className="loading-chart">Loading Line Chart</div>
                }
              >
                <ActivityLineChart />
              </React.Suspense>
            </div>
          </div>
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
          <div className="resultsMessage">
            Found {resultsCount} results{" "}
            <img src={christmasTreeSvg} width="16" />
          </div>
          <div className="activityCardList">
            {results.activities &&
              results.activities.map((activity, idx) => {
                const org = orgsQuery.getEntity(activity.orgId);
                if (!org) return;
                return <ActivityCard activity={activity} org={org} key={idx} />;
              })}
          </div>
        </>
      )}
    </AppContainer>
  );
};

export default App;
