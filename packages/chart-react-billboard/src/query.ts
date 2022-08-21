import bb, { donut, line } from "billboard.js";
import type { Instance } from "mobx-state-tree";

import type { CVState } from "@tony/cv-lib/search/mobx";
import {
  donutChartHeight,
  donutChartWidth,
  lineChartHeight,
} from "@tony/cv-ui/styles/constants";

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

export const stateToDonut = (state: Instance<typeof CVState>) => {
  return {
    data: {
      columns: Object.entries(state.languageYearMap).map(
        ([languageName, count]) => {
          return [languageName, count];
        }
      ),
      type: donut(),
      color: (color, data) =>
        state.languages.find((language) => language.id === data.id)?.ui
          ?.backgroundColor ?? color,
      labels: {
        // billboard.js doesn't accept callbacks here
        // issue: https://github.com/naver/billboard.js/issues/1845
        colors: state.languages.reduce((languageColorMap, language) => {
          if (language) {
            if (!(language.id in languageColorMap) && language.ui?.color) {
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
      height: donutChartHeight,
      width: donutChartWidth,
    },
  } as bb.ChartOptions;
};

export const stateToLine = (state: Instance<typeof CVState>) => {
  const activityYearMap = state.activityYearMap;
  return {
    data: {
      x: "x",
      columns: [
        ["x", ...Object.keys(activityYearMap).map((year) => `${year}-01-01`)],
        ["activityYearMap", ...Object.values(activityYearMap)],
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
    size: {
      height: lineChartHeight,
    },
  } as bb.ChartOptions;
};
