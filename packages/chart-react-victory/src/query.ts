import type { Observable } from "rxjs";
import type { VictoryLine, VictoryPie } from "victory";

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
import { donutChartWidth } from "@tony/cv-ui/styles/constants";

export type DonutChartProps = React.ComponentProps<typeof VictoryPie>;
export type LineChartProps = React.ComponentProps<typeof VictoryLine>;

export interface Results {
  // Charts
  donutChart: DonutChartProps;
  lineChart: LineChartProps;
}

export const DEFAULT_RESULTS: Results = {
  // Charts
  donutChart: {
    data: [],
    // The typing inside this break almost every time we customize something
    labels: () => "",
    width: donutChartWidth,
  },
  lineChart: {
    data: [],
    style: {
      data: { stroke: "#c43a31" },
      parent: { border: "1px solid #ccc" },
    },
  },
};

export class VictoryChartQuery extends CVQuery {
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
      this.visibleLanguages$(),
      this.visibleLanguageCount$(),
    ]).pipe(
      map(([languages, languageMap]) => {
        const colorScale = Object.values(languages).map(
          (language) => language?.ui?.backgroundColor
        );

        return {
          data: Object.entries(languageMap).map(([languageName, count]) => {
            return {
              x: languageName,
              y: count,
            };
          }),
          colorScale: colorScale,
          ...DEFAULT_RESULTS.donutChart,
        } as DonutChartProps;
      })
    );
  }

  // await $queries.CV.getDonutChart()
  getDonutChart(): Promise<DonutChartProps> {
    return firstValueFrom(this.subDonutChart$().pipe(take(1))).then(
      (val) => val ?? DEFAULT_RESULTS.donutChart
    );
  }

  subLineChart$(): Observable<LineChartProps> {
    return this.visibleActivityYearCount$().pipe(
      map((activityCount) => {
        return {
          data: Object.entries(activityCount).map(([year, count]) => {
            return { x: year, y: count };
          }),
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
