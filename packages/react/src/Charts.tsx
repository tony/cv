import React from "react";

import { observer } from "mobx-react-lite";
import { useQueryParam, withDefault } from "use-query-params";

import { LINE_CHART_MAP, PIE_CHART_MAP } from "./constants";
import { useMst } from "./mobx";
import { SettingsContext } from "./Settings";
import { Chart, type ChartKey } from "./types";

const ChartLinks: React.FC<
  {
    chart: Chart;
    setChart: React.Dispatch<React.SetStateAction<Chart>>;
  } & React.HTMLProps<HTMLDivElement>
> = ({ chart, setChart, ...props }) => (
  <div {...props}>
    📊
    <span className="dh-tablet" title="Lazily loaded, honors filters and scope">
      {" "}
      Chart system (take your pick):
    </span>{" "}
    {Object.keys(PIE_CHART_MAP).map((c, idx: number) => (
      <React.Fragment key={c}>
        {idx > 0 && ", "}
        <a
          onClick={() => setChart(c as unknown as Chart)}
          {...(c === chart && { className: "active" })}
        >
          {c}
        </a>
      </React.Fragment>
    ))}
  </div>
);

const DEFAULT_CHART = Chart.Carbon;
const ChartParam = withDefault(
  {
    encode(value: Chart): string {
      return value;
    },

    // decode(strValue: string | undefined | null) {
    decode(strValue: string | (string | null)[] | null | undefined) {
      if (!strValue || typeof strValue !== "string") {
        return null;
      }
      const chartValue = strValue.charAt(0).toUpperCase() + strValue.slice(1);
      function isChart(
        val: string | (string | null)[] | null | undefined,
      ): val is ChartKey {
        return typeof val === "string" && val in Chart;
      }
      return isChart(chartValue) ? Chart[chartValue] : null;
    },
  },
  DEFAULT_CHART,
);

export const Charts = observer(() => {
  const cvState = useMst();
  const [queryChart, setQueryChart] = useQueryParam("chart", ChartParam);
  const [chart, setChart] = React.useState<Chart>(queryChart || DEFAULT_CHART);
  const LanguagePieChart = PIE_CHART_MAP[chart];
  const ActivityLineChart = LINE_CHART_MAP[chart];
  const context = React.useContext(SettingsContext);

  if (!context) {
    return null;
  }
  const { showChartsMobile } = context;

  React.useEffect(() => {
    if (chart !== queryChart) {
      setQueryChart(chart);
    }
  }, [chart]);

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
