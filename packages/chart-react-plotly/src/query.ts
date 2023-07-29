import type { Instance } from "mobx-state-tree";

import { CVState } from "@tony/cv-lib/search/mobx";
import {
  donutChartHeight,
  donutChartWidth,
  lineChartHeight,
} from "@tony/cv-ui/styles/constants";

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

export const stateToDonut = (state: Instance<typeof CVState>) => {
  const languageYearMap = state.languageYearMap;
  const total = Object.values(languageYearMap).reduce((a, b) => a + b, 0);
  const languageBGMap = state.languages.reduce(
    (languageColorMap, language) => {
      if (language) {
        if (
          !(language.id in languageColorMap) &&
          language.ui?.backgroundColor
        ) {
          languageColorMap[language.id] = language.ui.backgroundColor as string;
        }
      }
      return languageColorMap;
    },
    {} as { [key: string]: string },
  );
  return {
    type: "pie",
    values: Object.values(languageYearMap),
    labels: Object.keys(languageYearMap),
    hoverinfo: "text",
    hovertext: Object.entries(languageYearMap).map(([languageName, value]) => {
      return `${languageName}: ${value} (${((value / total) * 100).toFixed(
        2,
      )}%)`;
    }),
    text: Object.entries(languageYearMap).map(([languageName, value]) => {
      if ((value / total) * 100 > 4) {
        return `${languageName}: ${value}`;
      }
      return "";
    }),
    textinfo: "text",
    marker: {
      colors: Object.keys(languageYearMap).map(
        (languageName) => languageBGMap[languageName],
      ),
    },
    automargin: true,
  } as PlotlyData;
};

export const stateToLine = (state: Instance<typeof CVState>) => {
  const activityYearMap = state.activityYearMap;
  return {
    type: "scatter",
    x: Object.keys(activityYearMap),
    y: Object.values(activityYearMap),
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
};
