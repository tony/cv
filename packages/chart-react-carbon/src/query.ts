import type {
  ChartConfig,
  DonutChartOptions,
  LineChartOptions,
} from "@carbon/charts";
import type { Instance } from "mobx-state-tree";

import type { CVState } from "@tony/cv-lib/search/mobx";
import {
  donutChartHeightWithUnit,
  donutChartWidthWithUnit,
  lineChartHeightWithUnit,
} from "@tony/cv-react/src/styles/constants";

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
  donut: {
    center: {
      label: "Results",
    },
  },
  height: donutChartHeightWithUnit,
  width: donutChartWidthWithUnit,
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

export const stateToDonut = (state: Instance<typeof CVState>) => {
  const bgColorMap = state.backgroundColors;
  return {
    data: Object.entries(state.languageUsageStats).map(
      ([languageName, count]) => {
        return { group: languageName, value: count };
      },
    ),
    options: {
      ...DONUT_CHART_DEFAULT_OPTIONS,
      getFillColor: (datasetLabel, label, data, defaultFillColor) => {
        return bgColorMap[datasetLabel] ?? defaultFillColor ?? "";
      },
      donut: {
        center: {
          number: state.filteredActivities.length, // Prevent multi language activities from summing, show activity count
          label: "Results",
        },
      },
      pie: {
        labels: { formatter: () => "", enabled: false },
      },
    } as DonutChartOptions,
  } as DonutChartProps;
};

export const stateToLine = (state: Instance<typeof CVState>) => {
  const activityYearMap = state.activityYearMap;
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
    options: {
      ...LINE_CHART_DEFAULT_OPTIONS,
      getStrokeColor: () => "var(--line-chart-fill-color)",
      getFillColor: () => "var(--line-chart-fill-color)",
    },
  } as LineChartProps;
};
