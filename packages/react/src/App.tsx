import React from "react";
import Select from "react-select";
import type { Subscription } from "rxjs";
import equal from "fast-deep-equal";

import type { IActivity, Language } from "@tony/cv-data/types";
import {
  activitiesStore,
  activitiesQuery,
  activityTypesQuery,
  loadStores,
  orgsQuery,
  query,
  languagesQuery,
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
import "@tony/cv-nav/components";

import "./style.scss";

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

const AppContainer: React.FC = ({ children }) => {
  return (
    <div>
      <cv-nav />
      {children}
    </div>
  );
};

enum Charts {
  ReactVis = "react-vis",
  Carbon = "@carbon/charts",
  Plotly = "plotly",
  Billboard = "billboard.js",
  Nivo = "nivo",
  Victory = "victory",
}
const PIE_CHART_MAP = {
  [Charts.Carbon]: React.lazy(() =>
    import(
      /* webpackChunkName: "carbon-pie" */
      "@tony/cv-chart-react-carbon/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Charts.Billboard]: React.lazy(() =>
    import(
      /* webpackChunkName: "billboard-pie" */
      "@tony/cv-chart-react-billboard.js/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Charts.Plotly]: React.lazy(() =>
    import(
      /* webpackChunkName: "plotly-pie" */
      "@tony/cv-chart-react-plotly/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Charts.Victory]: React.lazy(() =>
    import(
      /* webpackChunkName: "victory-pie" */
      "@tony/cv-chart-react-victory/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Charts.ReactVis]: React.lazy(() =>
    import(
      /* webpackChunkName: "vis-pie" */
      "@tony/cv-chart-react-vis/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Charts.Nivo]: React.lazy(() =>
    import(
      /* webpackChunkName: "nivo-pie" */
      "@tony/cv-chart-react-nivo/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
};

const LINE_CHART_MAP = {
  [Charts.Carbon]: React.lazy(() =>
    import(
      /* webpackChunkName: "carbon-line" */
      "@tony/cv-chart-react-carbon/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Charts.Billboard]: React.lazy(() =>
    import(
      /* webpackChunkName: "billboard-line" */
      "@tony/cv-chart-react-billboard.js/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Charts.Plotly]: React.lazy(() =>
    import(
      /* webpackChunkName: "plotly-line" */
      "@tony/cv-chart-react-plotly/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Charts.Victory]: React.lazy(() =>
    import(
      /* webpackChunkName: "victory-line" */
      "@tony/cv-chart-react-victory/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Charts.ReactVis]: React.lazy(() =>
    import(
      /* webpackChunkName: "vis-line" */
      "@tony/cv-chart-react-vis/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Charts.Nivo]: React.lazy(() =>
    import(
      /* webpackChunkName: "nivo-line" */
      "@tony/cv-chart-react-nivo/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
};

const App: React.FC = () => {
  const [results, dispatch] = React.useReducer(reducer, DEFAULT_RESULTS);
  const [chart, setChart] = React.useState<Charts>(Charts.Carbon);
  const LanguagePieChart = PIE_CHART_MAP[chart];
  const ActivityLineChart = LINE_CHART_MAP[chart];

  const ChartLinks = () => (
    <div id="chart-links" className="fss-tablet">
      📊<span className="dh-tablet"> Chart frameworks:</span>{" "}
      {Object.keys(PIE_CHART_MAP).map((c, idx: number) => (
        <React.Fragment key={c}>
          {idx > 0 && ", "}
          <a
            href="#"
            onClick={() => setChart((c as unknown) as Charts)}
            {...(c === chart && { className: "active" })}
          >
            {c}
          </a>
        </React.Fragment>
      ))}
    </div>
  );

  useAsyncEffect(async () => {
    const data = await fetchData();
    if (Object.keys(activitiesStore.getValue().entities ?? {}).length) {
      return void 0;
    }

    loadStores(data);
    if (!results?.activities.length) {
      dispatch({
        type: ActionType.SetResults,
        activities: activitiesQuery.getAll() as IActivity[],

        // Counts
        languageCount: (await query.getVisibleLanguageCount()) as LanguageCount,
        activityCount: (await query.getVisibleActivityYearCount()) as ActivityCount,
      });
    }
    return void 0;
  });

  const languageSelectRef = React.useRef<Select>(null);

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

  const resultsCount = results?.activities ? results.activities.length : 0;
  return (
    <AppContainer>
      {results.ui.isLoading ? (
        <div id="loading-screen">Loading CV Data</div>
      ) : (
        <>
          <ChartLinks />
          <div
            className={`chartRow ${
              Object.keys(results.activityCount).length ? "" : "noCharts"
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
