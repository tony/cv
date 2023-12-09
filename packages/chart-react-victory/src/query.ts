import chroma from "chroma-js";
import type { Instance } from "mobx-state-tree";
import type { VictoryLine, VictoryPie } from "victory";

import { CVState } from "@tony/cv-lib/search/mobx";
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

export const stateToDonut = (state: Instance<typeof CVState>) => {
  const { languageUsageStats } = state;
  const colorScale = Object.values(state.languages).map(
    (language) => language?.ui?.backgroundColor,
  );

  return {
    width: donutChartWidth,
    data: Object.entries(languageUsageStats).map(([languageName, count]) => {
      return {
        x: languageName,
        y: count,
      };
    }),
    colorScale: colorScale,
    labels: ({ datum }) =>
      datum.endAngle - datum.startAngle > 25 ? datum.xName : "",
  } as DonutChartProps;
};

export const stateToLine = (state: Instance<typeof CVState>) => {
  const activityYearMap = state.activityYearMap;
  const strokeColor = chroma(
    state.dominantLanguage?.ui?.backgroundColor ?? "grey",
  )
    ?.darken(0.8)
    .css();

  return {
    style: {
      data: {
        stroke: strokeColor ?? "var(--line-chart-fill-color, #fff)",
        strokeWidth: 5,
        fill: "var(--line-chart-fill-color)",
      },
    },
    data: Object.entries(activityYearMap).map(([year, count]) => {
      return { x: year, y: count };
    }),
    height: 250,
    width: 250,
  } as LineChartProps;
};
