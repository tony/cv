import type { Observable } from "rxjs";
import type { LineSeries, LineSeriesPoint } from "react-vis";

import { combineQueries } from "@datorama/akita";
import { firstValueFrom } from "rxjs";
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

import type { FlexRadialChart } from "./constants";

export type DonutChartProps = React.ComponentProps<typeof FlexRadialChart>;
export type LineChartProps = React.ComponentProps<typeof LineSeries>;

export interface Results {
  // Charts
  donutChart: DonutChartProps;
  lineChart: LineChartProps;
}

export const DEFAULT_RESULTS: Results = {
  // Charts
  donutChart: {
    data: [],
    getAngle: (data: { count: number }) => {
      return data.count;
    },

    colorType: "literal",
    colorDomain: [0, 100],
    colorRange: [0, 10],
    labelsRadiusMultiplier: 0.85,
    labelsStyle: {
      fontSize: 12,
    },
    showLabels: true,
    labelsAboveChildren: true,
    getLabel: (d: { label: string }) => {
      return d.label;
    },
  },
  lineChart: {
    data: [],
  },
};

export class VisChartQuery extends CVQuery {
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
      this.visibleActivities$(),
    ]).pipe(
      map(([languageMap, languages, visibleActivities]) => {
        return {
          data: Object.entries(languageMap).map(([languageName, count]) => {
            const total = Object.keys(visibleActivities).length;
            const percent = (count / total) * 100;
            const language = languages.find(
              (language) => language.id == languageName
            );
            return {
              languageName,
              ...(percent > 4 ? { label: languageName } : {}),
              ...language,
              count,
            };
          }),
          getColor: (d: { label: string; languageName: string }) => {
            const language = languages.find(
              (language) => language.id == d.languageName
            );
            return language?.ui?.backgroundColor;
          },
          ...DEFAULT_RESULTS.donutChart,
        } as DonutChartProps;
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
      map((activityCount) => {
        return {
          data: Object.entries(activityCount).map(
            ([year, count]) =>
              ({
                x: parseInt(year),
                y: count,
              } as LineSeriesPoint)
          ),
        } as LineChartProps;
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
