import React from "react";

import { useIsomorphicLayoutEffect, useEventListener } from "./hooks";
export const CHART_SELECTOR = "#charts";
export const DONUT_SELECTOR = `${CHART_SELECTOR} .chart-row--donut`;
export const LINE_SELECTOR = `${CHART_SELECTOR} .chart-row--line`;

export const getChartDimensions = () => {
  const chartContainer = document.querySelector(CHART_SELECTOR);
  return chartContainer?.getBoundingClientRect();
};

export const getDonutDimensions = () => {
  const donutChartContainer = document.querySelector(DONUT_SELECTOR);
  return donutChartContainer?.getBoundingClientRect();
};

export const getLineDimensions = () => {
  const lineChartContainer = document.querySelector(LINE_SELECTOR);
  return lineChartContainer?.getBoundingClientRect();
};

export const getRemainingWidthForLineChart = () => {
  const chartContainerWidth = getChartDimensions()?.width;
  const donutChartWidth = getDonutDimensions()?.width;
  if (!chartContainerWidth || !donutChartWidth) {
    return 0;
  }

  return chartContainerWidth - donutChartWidth;
};

export function useRemainingWidthSpaceForLineChart() {
  const [remainingWidth, setRemainingWidth] = React.useState<number>(
    getRemainingWidthForLineChart(),
  );

  const handleResize = () => {
    setRemainingWidth(getRemainingWidthForLineChart());
  };

  useEventListener("resize", handleResize);

  return remainingWidth;
}
