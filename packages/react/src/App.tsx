import React from "react";
import type { Subscription } from "rxjs";
import equal from "fast-deep-equal";

import type { IActivity, Language } from "@tony/cv-data/types";
import { activitiesStore, loadStores, query } from "@tony/cv-lib/hub";
import type {
  ActivityCount,
  LanguageCount,
  Results as ReducerState,
} from "@tony/cv-lib/search/query";
import { DEFAULT_RESULTS } from "@tony/cv-lib/search/query";
import type { fetchDataFn } from "@tony/cv-data/fetch";
import { onEmit, useAsyncEffect } from "./utils";

import "@tony/cv-nav";

import { LINE_CHART_MAP, PIE_CHART_MAP } from "./constants";
import { Chart } from "./types";
import { Results, ResultsHeader } from "./Results";
import { Settings } from "./Settings";

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

const ChartLinks: React.FC<{
  chart: Chart;
  setChart: React.Dispatch<React.SetStateAction<Chart>>;
}> = ({ chart, setChart }) => (
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

const AppContainer: React.FC<{
  chart: Chart;
  setChart: React.Dispatch<React.SetStateAction<Chart>>;
}> = ({ children, chart, setChart }) => {
  return (
    <div>
      <cv-nav />
      <ChartLinks chart={chart} setChart={setChart} />
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

          <Settings results={results} />
          <ResultsHeader results={results} />
          <Results results={results} />
        </>
      )}
    </AppContainer>
  );
};

export default App;
