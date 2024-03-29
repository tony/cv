import type { Instance } from "mobx-state-tree";

import type { CVState } from "@tony/cv-lib/search/mobx";

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
  const languageUsageStats = state.languageUsageStats;
  const total = Object.values(languageUsageStats).reduce((a, b) => a + b, 0);
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
    values: Object.values(languageUsageStats),
    labels: Object.keys(languageUsageStats),
    hoverinfo: "text",
    hovertext: Object.entries(languageUsageStats).map(
      ([languageName, value]) => {
        return `${languageName}: ${value} (${((value / total) * 100).toFixed(
          2,
        )}%)`;
      },
    ),
    text: Object.entries(languageUsageStats).map(([languageName, value]) => {
      if ((value / total) * 100 > 4) {
        return `${languageName}: ${value}`;
      }
      return "";
    }),
    textinfo: "text",
    textposition: "inside",
    marker: {
      colors: Object.keys(languageUsageStats).map(
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
    hovertext: Object.entries(activityYearMap).map(
      ([year, count]) => `${year} (${count})`,
    ),
    hoverinfo: "text",
    mode: "text+lines+markers",
    hoverlabel: {
      bgcolor: "var(--line-chart-tooltip-background)",
      font: {
        color: "var(--line-chart-tooltip-text)",
      },
    },
    textposition: "middle center",
    automargin: true,
    fill: "tonexty",
  } as PlotlyData;
};
