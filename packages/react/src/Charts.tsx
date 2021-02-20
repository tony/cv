import React from "react";

import type { Results as ReducerState } from "@tony/cv-lib/search/query";

import { LINE_CHART_MAP, PIE_CHART_MAP } from "./constants";
import { Chart } from "./types";

const ChartLinks: React.FC<{
  chart: Chart;
  setChart: React.Dispatch<React.SetStateAction<Chart>>;
}> = ({ chart, setChart }) => (
  <div id="chart-links" className="fss-tablet">
    📊<span className="dh-tablet"> Chart frameworks:</span>{" "}
    {Object.keys(PIE_CHART_MAP).map((c, idx: number) => (
      <React.Fragment key={c}>
        {idx > 0 && ", "}
        <a
          href="#"
          onClick={() => setChart((c as unknown) as Chart)}
          {...(c === chart && { className: "active" })}
        >
          {c}
        </a>
      </React.Fragment>
    ))}
  </div>
);

export const Charts: React.FC<{
  results: ReducerState;
}> = ({ results }) => {
  const [chart, setChart] = React.useState<Chart>(Chart.Carbon);
  const LanguagePieChart = PIE_CHART_MAP[chart];
  const ActivityLineChart = LINE_CHART_MAP[chart];

  return (
    <>
      {" "}
      <ChartLinks chart={chart} setChart={setChart} />
      <div
        id="charts"
        className={`chartRow ${chart}${
          Object.keys(results.activityCount).length ? "" : " noCharts"
        }`}
      >
        <div className="chartRow--donut">
          <React.Suspense
            fallback={<div className="loading-chart">Loading Pie Chart</div>}
          >
            <LanguagePieChart />
          </React.Suspense>
        </div>
        <div className="chartRow--line">
          <React.Suspense
            fallback={<div className="loading-chart">Loading Line Chart</div>}
          >
            <ActivityLineChart />
          </React.Suspense>
        </div>
      </div>
    </>
  );
};
