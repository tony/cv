import React from "react";

import { observer } from "mobx-react-lite";

import { LINE_CHART_MAP, PIE_CHART_MAP } from "./constants";
import { useMst } from "./mobx";
import { Chart } from "./types";

const ChartLinks: React.FC = observer(() => {
  const cvState = useMst();

  return Object.keys(PIE_CHART_MAP).map((c, idx: number) => (
    <React.Fragment key={c}>
      {idx > 0 && ",\u00A0 "}
      <button
        type="button"
        onClick={() => cvState.setChart(c as unknown as Chart)}
        className={`
      chart-link
      ${c === cvState.ui.chart ? "active" : ""}
      `}
      >
        {c}
      </button>
    </React.Fragment>
  ));
});

const ChartMenu: React.FC = observer(() => {
  const cvState = useMst();
  const { setChart } = cvState;
  const chart = cvState.ui.chart;

  return (
    <div
      id="chart-menu"
      className={`
      ${cvState.ui.showChartsMobile ? "active" : "hidden md:flex"}
      pb-0 md:pb-2
      flex
      justify-center
      `}
    >
      📊
      <span
        className="hidden md:inline"
        title="Lazily loaded, honors filters and scope"
      >
        &nbsp;Chart system (take your pick):&nbsp;
      </span>
      <ChartLinks />
    </div>
  );
});

const ChartBody: React.FC = observer(() => {
  const cvState = useMst();
  const { setChart } = cvState;
  const chart = cvState.ui.chart;
  const LanguagePieChart = PIE_CHART_MAP[chart];
  const ActivityLineChart = LINE_CHART_MAP[chart];

  return (
    <div
      id="charts"
      className={`chart-row ${chart}${
        Object.keys(cvState.filteredActivities).length ? "" : " no-charts"
      } ${
        cvState.ui.showChartsMobile ? "active" : "hidden md:flex"
      } md:flex md:w-svw w-full max-w-4xl md:h-64 mx-auto`}
    >
      <div className="chart-row--donut aspect-square flex content-center place-content-center md:flex-none md:content-none h-64 md:h-auto w-full md:w-auto">
        <React.Suspense
          fallback={<div className="loading-chart">Loading Pie Chart</div>}
        >
          <LanguagePieChart />
        </React.Suspense>
      </div>
      <div className="chart-row--line w-full flex-none md:flex-1 px-1 md:px-0 h-64">
        <React.Suspense
          fallback={<div className="loading-chart">Loading Line Chart</div>}
        >
          <ActivityLineChart />
        </React.Suspense>
      </div>
    </div>
  );
});

export const Charts = observer(() => {
  const [chart, setChart] = React.useState<Chart>(Chart.Carbon);
  return (
    <>
      <ChartMenu />
      <ChartBody />
    </>
  );
});
