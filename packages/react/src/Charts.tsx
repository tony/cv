import React from "react";

import { observer } from "mobx-react-lite";

import { LINE_CHART_MAP, PIE_CHART_MAP } from "./constants";
import { useMst } from "./mobx";
import { SettingsContext } from "./Settings";
import { Chart } from "./types";

const ChartLinks: React.FC<
  {
    chart: Chart;
    setChart: React.Dispatch<React.SetStateAction<Chart>>;
  } & React.HTMLProps<HTMLDivElement>
> = ({ chart, setChart, ...props }) => {
  return Object.keys(PIE_CHART_MAP).map((c, idx: number) => (
    <React.Fragment key={c}>
      {idx > 0 && ", "}
      <button
        type="button"
        onClick={() => setChart(c as unknown as Chart)}
        className={c === chart ? "active" : ""}
      >
        {c}
      </button>
    </React.Fragment>
  ));
};

const ChartMenu: React.FC<
  {
    chart: Chart;
    setChart: React.Dispatch<React.SetStateAction<Chart>>;
  } & React.HTMLProps<HTMLDivElement>
> = ({ chart, setChart, ...props }) => {
  const context = React.useContext(SettingsContext);

  if (!context) {
    return null;
  }

  const { showChartsMobile } = context;

  return (
    <div
      id="chart-menu"
      className={`fss-tablet ${showChartsMobile ? "active" : ""}`}
    >
      📊
      <span
        className="dh-tablet"
        title="Lazily loaded, honors filters and scope"
      >
        {" "}
        Chart system (take your pick):
      </span>{" "}
      <ChartLinks setChart={setChart} chart={chart} />
    </div>
  );
};

const ChartBody: React.FC<{
  chart: Chart;
  setChart: React.Dispatch<React.SetStateAction<Chart>>;
}> = observer(({ chart, setChart }) => {
  const cvState = useMst();
  const LanguagePieChart = PIE_CHART_MAP[chart];
  const ActivityLineChart = LINE_CHART_MAP[chart];
  const context = React.useContext(SettingsContext);

  if (!context) {
    return null;
  }
  const { showChartsMobile } = context;

  return (
    <div
      id="charts"
      className={`chartRow ${chart}${
        Object.keys(cvState.filteredActivities).length ? "" : " noCharts"
      } ${showChartsMobile ? "active" : ""}`}
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
  );
});

export const Charts = observer(() => {
  const [chart, setChart] = React.useState<Chart>(Chart.Carbon);
  return (
    <>
      <ChartMenu chart={chart} setChart={setChart} />
      <ChartBody chart={chart} setChart={setChart} />
    </>
  );
});
