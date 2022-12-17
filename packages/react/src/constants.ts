import React from "react";

import { Chart } from "./types";

export const PIE_CHART_MAP = {
  [Chart.Carbon]: React.lazy(() =>
    import(
      /* webpackChunkName: "carbon-pie" */
      "@tony/cv-chart-react-carbon/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Chart.Billboard]: React.lazy(() =>
    import(
      /* webpackChunkName: "billboard-pie" */
      "@tony/cv-chart-react-billboard/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Chart.Plotly]: React.lazy(() =>
    import(
      /* webpackChunkName: "plotly-pie" */
      "@tony/cv-chart-react-plotly/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Chart.Victory]: React.lazy(() =>
    import(
      /* webpackChunkName: "victory-pie" */
      "@tony/cv-chart-react-victory/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
  [Chart.Nivo]: React.lazy(() =>
    import(
      /* webpackChunkName: "nivo-pie" */
      "@tony/cv-chart-react-nivo/src/charts"
    ).then((module) => ({ default: module.LanguagePieChart }))
  ),
};

export const LINE_CHART_MAP = {
  [Chart.Carbon]: React.lazy(() =>
    import(
      /* webpackChunkName: "carbon-line" */
      "@tony/cv-chart-react-carbon/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Chart.Billboard]: React.lazy(() =>
    import(
      /* webpackChunkName: "billboard-line" */
      "@tony/cv-chart-react-billboard/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Chart.Plotly]: React.lazy(() =>
    import(
      /* webpackChunkName: "plotly-line" */
      "@tony/cv-chart-react-plotly/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Chart.Victory]: React.lazy(() =>
    import(
      /* webpackChunkName: "victory-line" */
      "@tony/cv-chart-react-victory/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
  [Chart.Nivo]: React.lazy(() =>
    import(
      /* webpackChunkName: "nivo-line" */
      "@tony/cv-chart-react-nivo/src/charts"
    ).then((module) => ({ default: module.ActivityLineChart }))
  ),
};
