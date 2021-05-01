import type { Observable } from "rxjs";

import { combineQueries } from "@datorama/akita";
import { map, take } from "rxjs/operators";
import { firstValueFrom } from "rxjs";

import { CVQuery } from "@tony/cv-lib/search/query";
import type {
  OrgsQuery,
  OrgTypesQuery,
  LanguagesQuery,
  ActivityTypesQuery,
  ActivitiesQuery,
} from "@tony/cv-lib/search/query";

import { CVStore } from "@tony/cv-lib/search/store";
import type { PlotlyData } from "@tony/cv-chart-react-plotly/src/types";

export type DonutChartProps = PlotlyData;
export type LineChartProps = PlotlyData;

export interface Results {
  // Charts
  donutChart: DonutChartProps;
  lineChart: LineChartProps;
}

export const DEFAULT_RESULTS: Results = {
  // Charts
  donutChart: {
    type: "pie",
    textinfo: "text",
    automargin: true,
    hoverinfo: "text",
  },
  lineChart: {
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "#3572a5" },
    automargin: true,
  },
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
          values: Object.values(languageMap),
          labels: Object.keys(languageMap),
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

          marker: {
            colors: Object.keys(languageMap).map(
              (languageName) => languageBGMap[languageName]
            ),
          },

          ...DEFAULT_RESULTS.donutChart,
        } as PlotlyData;
      })
    );
  }

  // await $queries.CV.getDonutChart()
  getDonutChart(): Promise<DonutChartProps> {
    return firstValueFrom(this.subDonutChart$().pipe(take(1))).then(
      (val) => val || DEFAULT_RESULTS.donutChart
    );
  }

  subLineChart$(): Observable<LineChartProps> {
    return this.visibleActivityYearCount$().pipe(
      map((activityMap) => {
        return {
          x: Object.keys(activityMap),
          y: Object.values(activityMap),
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
          ...DEFAULT_RESULTS.lineChart,
        } as PlotlyData;
      })
    );
  }

  // await $queries.CV.getLineChart()
  getLineChart(): Promise<LineChartProps> {
    return firstValueFrom(this.subLineChart$().pipe(take(1))).then(
      (val) => val || DEFAULT_RESULTS.lineChart
    );
  }
}
