import { combineQueries } from "@datorama/akita";
import type { Observable } from "rxjs";
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

import type { PlotlyData } from "./types";

export type DonutChartProps = PlotlyData;
export type LineChartProps = PlotlyData;

export interface Results {
  // Charts
  donutChart: DonutChartProps;
  lineChart: LineChartProps;
}

export const DEFAULT_RESULTS: Results = {
  // Charts
  donutChart: {},
  lineChart: {},
};

export class PlotlyChartQuery extends CVQuery {
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
      this.languagesQuery.selectBackgroundColors$(),
    ]).pipe(
      map(([languageMap, languageBGMap]) => {
        const total = Object.values(languageMap).reduce((a, b) => a + b, 0);
        return {
          type: "pie",
          values: Object.values(languageMap),
          labels: Object.keys(languageMap),
          hoverinfo: "text",
          hovertext: Object.entries(languageMap).map(
            ([languageName, value]) => {
              return `${languageName}: ${value} (${(
                (value / total) *
                100
              ).toFixed(2)}%)`;
            }
          ),
          text: Object.entries(languageMap).map(([languageName, value]) => {
            if ((value / total) * 100 > 4) {
              return `${languageName}: ${value}`;
            }
            return "";
          }),
          textinfo: "text",
          marker: {
            colors: Object.keys(languageMap).map(
              (languageName) => languageBGMap[languageName]
            ),
          },
          automargin: true,
        } as PlotlyData;
      })
    );
  }

  // await $queries.CV.getDonutChart()
  getDonutChart(): Promise<DonutChartProps> {
    return this.subDonutChart$().pipe(take(1)).toPromise();
  }

  subLineChart$(): Observable<LineChartProps> {
    return this.visibleActivityYearCount$().pipe(
      map((activityMap) => {
        return {
          type: "scatter",
          x: Object.keys(activityMap),
          y: Object.values(activityMap),
          mode: "lines+markers",
          marker: { color: "#3572a5" },
          // hoverinfo: "text",
          // hovertext: Object.entries(languageMap).map(
          //   ([languageName, value]) => {
          //     return `${languageName}: ${value} (${(
          //       (value / total) *
          //       100
          //     ).toFixed(2)}%)`;
          //   }
          // ),
          // text: Object.entries(languageMap).map(([languageName, value]) => {
          //   if ((value / total) * 100 > 4) {
          //     return `${languageName}: ${value}`;
          //   }
          //   return "";
          // }),
          // textinfo: "text",
          automargin: true,
        } as PlotlyData;
      })
    );
  }

  // await $queries.CV.getLineChart()
  getLineChart(): Promise<LineChartProps> {
    return this.subLineChart$().pipe(take(1)).toPromise();
  }
}
