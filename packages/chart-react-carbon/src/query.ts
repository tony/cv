import type { Observable } from "rxjs";
import {
  ChartConfig,
  DonutChartOptions,
  LineChartOptions,
} from "@carbon/charts/interfaces";
import {
  donutChartHeightWithUnit,
  donutChartWidthWithUnit,
  lineChartHeightWithUnit,
} from "@tony/cv-ui/styles/constants";
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

export type DonutChartProps = ChartConfig<DonutChartOptions>;
export type LineChartProps = ChartConfig<LineChartOptions>;

export interface Results {
  // Charts
  donutChart: DonutChartProps;
  lineChart: LineChartProps;
}

const DONUT_CHART_DEFAULT_OPTIONS: DonutChartOptions = {
  legend: {
    enabled: false, // Disable for now: https://github.com/carbon-design-system/carbon-charts/issues/916
  },
  resizable: true,
  toolbar: {
    enabled: false,
  },
  height: donutChartHeightWithUnit,
  width: donutChartWidthWithUnit,
  donut: {
    center: {
      label: "Results",
    },
  },
  pie: {
    labels: { formatter: () => "", enabled: false },
  },
};

export const LINE_CHART_DEFAULT_OPTIONS: LineChartOptions = {
  // So UX doesn't get:
  // scales-cartesian.js:156 Uncaught TypeError: Cannot read property 'left' of null
  resizable: true,
  legend: {
    enabled: false, // Disable for now: https://github.com/carbon-design-system/carbon-charts/issues/916
  },
  height: lineChartHeightWithUnit,
  toolbar: {
    enabled: false,
  },
  axes: {
    left: {
      stacked: true,
      // @ts-ignore
      scaleType: "linear",
      mapsTo: "value",
    },
    bottom: {
      // @ts-ignore
      scaleType: "time",
      mapsTo: "date",
    },
  },
  curve: "curveMonotoneX",
  experimental: true,
};

export const DEFAULT_RESULTS: Results = {
  // Charts
  donutChart: {
    options: DONUT_CHART_DEFAULT_OPTIONS,
    data: [],
  },
  lineChart: {
    options: LINE_CHART_DEFAULT_OPTIONS, // These also cause a crash if empty
    data: [
      // These are needed to prevent a crash with empty values
      { group: "Rust", value: 90 },
      { group: "Rust 2", value: 20 },
    ],
  },
};

export class CarbonChartQuery extends CVQuery {
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
      this.languagesQuery.selectBackgroundColors$(),
      this.visibleLanguageCount$(),
      this.visibleActivities$(),
    ]).pipe(
      map(([bgColorMap, languageMap, visibleActivities]) => {
        return {
          data: Object.entries(languageMap).map(([languageName, count]) => {
            return { group: languageName, value: count };
          }),
          options: {
            ...DONUT_CHART_DEFAULT_OPTIONS,
            getFillColor: (datasetLabel, label, data, defaultFillColor) => {
              return bgColorMap[datasetLabel] ?? defaultFillColor ?? "";
            },
            donut: {
              center: {
                number: visibleActivities.length, // Prevent multi language activities from summing, show activity count
                label: "Results",
              },
            },
          } as DonutChartOptions,
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
      map((activityYearMap) => {
        return {
          data: Object.values(activityYearMap).length
            ? Object.entries(activityYearMap).map(([year, count]) => {
                return {
                  group: "Results",
                  date: `${year}-01-01T00:00:00.000Z`,
                  value: count,
                };
              })
            : [
                {
                  group: "Results",
                  date: "2019-01-01T06:00:00.000Z",
                  value: 0,
                },
              ],
          options: LINE_CHART_DEFAULT_OPTIONS,
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
