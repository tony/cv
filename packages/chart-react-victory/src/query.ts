import { combineQueries } from "@datorama/akita";
import type { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import type { VictoryLine, VictoryPie } from "victory";

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
  },
  lineChart: {
    data: [],
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
          width: donutChartWidth,
          data: Object.entries(languageMap).map(([languageName, count]) => {
            return {
              x: languageName,
              y: count,
            };
          }),
          colorScale: colorScale,
          // The typing inside this break almost every time we customize something
          labels: () => "",
        } as DonutChartProps;
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
          style: {
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          },
          data: Object.entries(activityCount).map(([year, count]) => {
            return { x: year, y: count };
          }),
        } as LineChartProps;
      })
    );
  }

  // await $queries.CV.getLineChart()
  getLineChart(): Promise<LineChartProps> {
    return this.subLineChart$().pipe(take(1)).toPromise();
  }
}
