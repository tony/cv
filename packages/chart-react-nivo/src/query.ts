import type { Observable } from "rxjs";

import { combineQueries } from "@datorama/akita";
import type { LineSvgProps } from "@nivo/line";
import type { PieSvgProps } from "@nivo/pie";
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
import {
  donutChartHeight,
  donutChartWidth,
} from "@tony/cv-ui/styles/constants";

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export type DonutChartProps = PieSvgProps<{
  id: string;
  label: string;
  value: number;
}>;
export type LineChartProps = LineSvgProps;

export interface Results {
  // Charts
  donutChart: DonutChartProps;
  lineChart: LineChartProps;
}

export const DEFAULT_RESULTS: Results = {
  // Charts
  donutChart: { data: [], height: donutChartHeight, width: donutChartWidth },
  lineChart: {
    data: [],
    colors: "rgb(53, 114, 165)",
    pointColor: "rgb(37, 80, 115)",
    xScale: {
      type: "time",
      format: "%Y-%m-%d",
      precision: "year",
    },
    xFormat: "time:%Y-%m-%d",
    yScale: {
      type: "linear",
      stacked: false,
    },

    // @ts-ignore
    axisLeft: {
      legend: "linear scale",
      legendOffset: 12,
    },
    // @ts-ignore
    axisBottom: {
      format: "%Y",
      tickValues: "every 1 year",
      legend: "time scale",
      legendOffset: -12,
    },
    enablePointLabel: true,
    pointSize: 16,
    pointBorderWidth: 1,
    pointBorderColor: {
      from: "color",
      modifiers: [["darker", 0.3]],
    },
    useMesh: true,
    enableSlices: false,
  },
};

export class NivoChartQuery extends CVQuery {
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
          height: donutChartHeight,
          width: donutChartWidth,
          data: Object.entries(languageCount).map(([languageName, count]) => {
            return {
              id: languageName,
              label: languageName,
              value: count,
            };
          }),
          colors: (item) => {
            const color = languages.find((language) => language.id == item.id)
              ?.ui?.backgroundColor;

            if (color && isString(color)) {
              return color;
            }
            return "gray";
          },
          // margin: { top: 60, right: 80, bottom: 60, left: 80 },
          innerRadius: 0.5,
          padAngle: 0.7,
          cornerRadius: 3,
          borderWidth: 1,
          radialLabelsSkipAngle: 15,
          radialLabelsLinkOffset: 0.1,
          radialLabelsLinkDiagonalLength: 0.1,
          radialLabelsLinkColor: { from: "color" },
          radialLabelsTextColor: "#333333",
          sortByValue: true,
          sliceLabelsSkipAngle: 10,
          sliceLabelsTextColor: (item: {
            id: string;
            label: string;
            value: number;
          }) => {
            const color = languages.find((language) => language.id == item.id)
              ?.ui?.color;

            if (color && isString(color)) {
              return color;
            }
            return "gray";
          },
        } as PieSvgProps<{ id: string; label: string; value: number }>;
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
          // @ts-ignore
          data: [
            {
              id: "Year",
              data: Object.entries(activityCount).map(([year, count]) => {
                return {
                  x: `${year.toString()}-01-01`,
                  y: count,
                };
              }),
            },
          ],
          ...DEFAULT_RESULTS.lineChart,
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
