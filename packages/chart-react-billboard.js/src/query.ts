import bb, { donut, line } from "billboard.js";
import type { Observable } from "rxjs";

import { combineQueries } from "@datorama/akita";
import { map, take } from "rxjs/operators";

import { CVQuery } from "@tony/cv-lib/search/query";
import type {
  OrgsQuery,
  OrgTypesQuery,
  LanguagesQuery,
  ActivityTypesQuery,
  ActivitiesQuery,
} from "@tony/cv-lib/search/query";

import { CVStore } from "@tony/cv-lib/search/store";

export type DonutChartProps = bb.ChartOptions;
export type LineChartProps = bb.ChartOptions;

export interface Results {
  // Charts
  donutChart: DonutChartProps;
  lineChart: LineChartProps;
}

export const DEFAULT_RESULTS: Results = {
  // Charts
  donutChart: { data: {} },
  lineChart: { data: {} },
};

export class BillboardJSChartQuery extends CVQuery {
  constructor(
    protected store: CVStore,
    protected cvQuery: CVQuery,
    protected activitiesQuery: ActivitiesQuery,
    protected activityTypesQuery: ActivityTypesQuery,
    protected languagesQuery: LanguagesQuery,
    protected orgsQuery: OrgsQuery,
    protected orgTypesQuery: OrgTypesQuery
  ) {
    super(
      store,
      activitiesQuery,
      activityTypesQuery,
      languagesQuery,
      orgsQuery,
      orgTypesQuery
    );
  }

  //
  // Chart
  //
  subDonutChart$(): Observable<DonutChartProps> {
    return combineQueries([
      this.visibleLanguageCount$(),
      this.visibleLanguages$(),
    ]).pipe(
      map(([languageCount, languages]) => {
        return {
          data: {
            columns: Object.entries(languageCount).map(
              ([languageName, count]) => {
                return [languageName, count];
              }
            ),
            type: donut(),
            color: (color, languageName) =>
              languages.find((language) => language.id === languageName.id)?.ui
                ?.backgroundColor ?? color,
            labels: {
              // billboard.js doesn't accept callbacks here
              // issue: https://github.com/naver/billboard.js/issues/1845
              colors: languages.reduce((languageColorMap, language) => {
                if (language) {
                  if (!(language.id in languageColorMap)) {
                    languageColorMap[language.id] = language.ui.color as string;
                  }
                }
                return languageColorMap;
              }, {} as { [key: string]: string }),
            },
          },
          legend: {
            show: false,
          },
          size: {
            height: 300,
            width: 300,
          },
        } as bb.ChartOptions;
      })
    );
  }

  // await $queries.CV.getDonutChart()
  getDonutChart(): Promise<DonutChartProps> {
    return this.subDonutChart$().pipe(take(1)).toPromise();
  }

  subLineChart$(): Observable<LineChartProps> {
    return this.visibleActivityYearCount$().pipe(
      map((activityCount) => {
        return {
          data: {
            x: "x",
            columns: [
              [
                "x",
                ...Object.keys(activityCount).map((year) => `${year}-01-01`),
              ],
              ["activityCount", ...Object.values(activityCount)],
            ],
            type: line(),
          },
          axis: {
            x: {
              type: "timeseries",
              tick: {
                format: "%Y-%m-%d",
              },
            },
          },
          legend: {
            show: false,
          },
        } as bb.ChartOptions;
      })
    );
  }

  // await $queries.CV.getLineChart()
  getLineChart(): Promise<LineChartProps> {
    return this.subLineChart$().pipe(take(1)).toPromise();
  }
}
