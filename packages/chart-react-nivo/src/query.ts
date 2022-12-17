import type { LineSvgProps } from "@nivo/line";
import type { PieSvgProps } from "@nivo/pie";
import type { Instance } from "mobx-state-tree";

import { CVState } from "@tony/cv-lib/search/mobx";
import {
  donutChartHeight,
  donutChartWidth,
  lineChartHeight,
} from "@tony/cv-ui/styles/constants";
import { defaultMargin } from "@nivo/core";

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
  lineChart: { data: [] },
};

export const stateToDonut = (
  state: Instance<typeof CVState>
): DonutChartProps => {
  return {
    height: donutChartHeight,
    width: donutChartWidth,
    data: Object.entries(state.languageYearMap).map(([languageName, count]) => {
      return {
        id: languageName,
        label: languageName,
        value: count,
      };
    }),
    colors: (item) => {
      const color = state.languages.find((language) => language.id == item.id)
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
      const color = state.languages.find((language) => language.id == item.id)
        ?.ui?.color;

      if (color && isString(color)) {
        return color;
      }
      return "gray";
    },
  } as PieSvgProps<{ id: string; label: string; value: number }>;
};

export const stateToLine = (
  state: Instance<typeof CVState>
): LineChartProps => {
  const activityYearMap = state.activityYearMap;
  return {
    // @ts-ignore
    data: [
      {
        id: "Year",
        data: Object.entries(activityYearMap).map(([year, count]) => {
          return {
            x: `${year.toString()}-01-01`,
            y: count,
          };
        }),
      },
    ],
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
    axisLeft: {
      legend: "linear scale",
      legendOffset: 12,
    },
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
    height: lineChartHeight,
    margin: {
      left: 25,
      right: 20,
      top: 20,
      bottom: 20,
    },
  } as LineChartProps;
};
