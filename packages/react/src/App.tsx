import bb, { donut, line } from "billboard.js";
import moment from "moment";
import React from "react";
import Select from "react-select";
import type { Subscription } from "rxjs";
import equal from "fast-deep-equal";

import type { IActivity, Language } from "@tony/cv-lib/data/types";
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
  DonutChartProps,
  LineChartProps,
  Results as ReducerState,
} from "@tony/cv-lib/search/query";
import { DEFAULT_RESULTS } from "@tony/cv-lib/search/query";
import type { fetchDataFn } from "@tony/cv-lib/data/fetch";
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

import "billboard.js/dist/billboard.css";
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

      // Charts
      donutChart: DonutChartProps;
      lineChart: LineChartProps;
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
  return import(/* webpackChunkName: "cvData" */ "@tony/cv-lib/data/raw");
};

const AppContainer: React.FC = ({ children }) => {
  return (
    <div>
      <cv-nav />
      <header className="site-name">Tony Narlock{"'"}s CV</header>
      {children}
    </div>
  );
};

// tks akita https://github.com/datorama/akita/blob/49b6391934ba1f5c6ca63eebcf4a118955c14f65/libs/akita/src/lib/isObject.ts
// export function isObject(value: any) {
//   const type = typeof value;
//   return value != null && (type == "object" || type == "function");
// }
// // https://github.com/datorama/akita/blob/49b6391934ba1f5c6ca63eebcf4a118955c14f65/libs/akita/src/lib/isUndefined.ts
// export function isUndefined(value: any): value is undefined {
//   return value === undefined;
// }
export const Chart: React.FC<bb.ChartOptions> = ({ data, ...props }) => {
  //| Parameters<bb.Chart["load"]>
  const ref = React.useRef<HTMLDivElement>(null);
  const [chart, setChart] = React.useState<bb.Chart | null>(null);
  // const data = props?.data ? props?.data : undefined;
  // data.json = undefined;
  // // if (isObject(data?.json) || isUndefined(data?.json)) {
  // //   data.json = [] as bb.Data["json"];
  // // }
  React.useEffect(() => {
    if (!chart) {
      const newChart = bb.generate({ bindto: ref.current, data, ...props });
      setChart(newChart);
      return () => newChart.unload();
    }
  }, [props, data]);

  React.useEffect(() => {
    if (!chart || !data) {
      return;
    }
    if (chart && chart?.load && data) {
      // @ts-ignore Data structure mismatches: https://github.com/naver/billboard.js/issues/1848
      chart.load(data);
    }
  }, [data]);

  // React.useLayoutEffect(() => {
  //   if (chart?.resize) {
  //     chart.resize();
  //   }
  // });
  //
  return <div ref={ref} />;
};

const App: React.FC = () => {
  const [results, dispatch] = React.useReducer(reducer, DEFAULT_RESULTS);

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

        // Charts
        donutChart: (await query.getDonutChart()) as DonutChartProps,
        lineChart: (await query.getLineChart()) as LineChartProps,
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

  const activitiesYearCountMap = results.activities.reduce(
    (jsonData, activity) => {
      if (activity.createdDate) {
        const year = moment(activity.createdDate).get("year").toString();
        if (year in jsonData) {
          jsonData[year] += 1;
        } else {
          jsonData[year] = 1;
        }
      }
      return jsonData;
    },
    {} as { [key: string]: number }
  );

  console.log("activitiesYearCountMap", activitiesYearCountMap);

  const resultsCount = results?.activities ? results.activities.length : 0;

  return (
    <AppContainer>
      {results.ui.isLoading ? (
        <div id="loading-screen">Loading CV Data</div>
      ) : (
        <>
          <div
            className={`chartRow ${
              Object.keys(results.donutChart).length ? "" : "noCharts"
            }`}
          >
            <div className="chartRow--donut">
              <Chart
                data={{
                  columns: Object.entries(results.languageCount).map(
                    ([languageName, count]) => {
                      return [languageName, count];
                    }
                  ),
                  type: donut(),
                  color: (color, d) =>
                    languagesQuery.getEntity(d.id)?.ui?.backgroundColor ??
                    color,
                  labels: {
                    // billboard.js doesn't accept callbacks here
                    // issue: https://github.com/naver/billboard.js/issues/1845
                    colors: languagesQuery
                      .getAll()
                      .reduce((languageColorMap, language) => {
                        if (language) {
                          if (!(language.id in languageColorMap)) {
                            languageColorMap[language.id] = language.ui
                              .color as string;
                          }
                        }
                        return languageColorMap;
                      }, {} as { [key: string]: string }),
                  },
                }}
                legend={{
                  show: false,
                }}
                size={{
                  height: 300,
                  width: 300,
                }}
              />
            </div>
            <div className="chartRow--line">
              <Chart
                data={{
                  x: "x",
                  columns: [
                    [
                      "x",
                      ...Object.keys(activitiesYearCountMap).map(
                        (year) => `${year}-01-01`
                      ),
                    ],
                    ["activityCount", ...Object.values(activitiesYearCountMap)],
                  ],
                  type: line(),
                }}
                axis={{
                  x: {
                    type: "timeseries",
                    tick: {
                      format: "%Y-%m-%d",
                    },
                  },
                }}
                legend={{
                  show: false,
                }}
              />
            </div>
          </div>

          <div className="dropdownRow">
            <Select
              options={getSelectOptions(
                Object.values(languagesQuery?.getValue()?.entities ?? {}).map(
                  (lang) => lang.id as string
                )
              )}
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
