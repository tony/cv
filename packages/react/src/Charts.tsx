import React from "react";

import { observer } from "mobx-react-lite";

import { LINE_CHART_MAP, PIE_CHART_MAP } from "./constants";
import { useQueryString } from "./hooks/useQueryString";
import { useMst } from "./mobx";
import { SettingsContext } from "./Settings";
import { Chart } from "./types";

const ChartLinks: React.FC<
  {
    chart: Chart;
    setChart: React.Dispatch<React.SetStateAction<Chart>>;
  } & React.HTMLProps<HTMLDivElement>
> = ({ chart, setChart, ...props }) => {
  const { chart: queryStringChart, setChart: setQueryStringChart } =
    useQueryString();
  console.log({ queryStringChart });

  return (
    <div {...props}>
      📊
      <span
        className="dh-tablet"
        title="Lazily loaded, honors filters and scope"
      >
        {" "}
        Chart system (take your pick):
      </span>{" "}
      {Object.keys(PIE_CHART_MAP).map((c, idx: number) => (
        <React.Fragment key={c}>
          {idx > 0 && ", "}
          <a
            href="#"
            onClick={() => {
              setChart(c as unknown as Chart);
              setQueryStringChart(c as unknown as Chart);
            }}
            {...(c === chart && { className: "active" })}
          >
            {c}
          </a>
        </React.Fragment>
      ))}
    </div>
  );
};

export const Charts = observer(() => {
  const cvState = useMst();
  const [chart, setChart] = React.useState<Chart>(Chart.Carbon);
  const LanguagePieChart = PIE_CHART_MAP[chart];
  const ActivityLineChart = LINE_CHART_MAP[chart];
  const context = React.useContext(SettingsContext);

  if (!context) {
    return null;
  }
  const { showChartsMobile } = context;

  return (
    <>
      <ChartLinks
        chart={chart}
        setChart={setChart}
        id="chart-links"
        className={`fss-tablet ${showChartsMobile ? "active" : ""}`}
      />
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
    </>
  );
});
