/// <reference path="./custom.d.ts" />
import React from "react";

import equal from "fast-deep-equal";
import { autorun, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import Plotly from "plotly.js/dist/plotly";

import { useMst } from "@tony/cv-react/src/mobx";
import {
  donutChartHeightWithUnit,
  lineChartHeightWithUnit,
} from "@tony/cv-react/src/styles/constants";

import {
  DonutChartProps,
  LineChartProps,
  stateToDonut,
  stateToLine,
} from "./query";

import "./chart-react-plotly.css";

export interface ChartProps {
  data?: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  frames?: Plotly.Frame[];
  config?: Partial<Plotly.Config>;

  // react-specific
  style?: React.CSSProperties;
}

export const Chart: React.FC<ChartProps> = observer(
  ({ style = {}, data, ...props }) => {
    const ref = React.useRef<Plotly.Chart>(null);

    React.useEffect(() => {
      if (!Object.prototype.hasOwnProperty.call(ref?.current, "data")) {
        Plotly.newPlot(ref.current, { data, ...props });
      } else {
        Plotly.animate(
          ref.current,
          { data, ...props },
          {
            transition: {
              duration: 500,
              easing: "cubic-in-out",
            },
            frame: {
              duration: 100,
            },
          },
        );
      }
    }, [props, data, props]);
    return <div ref={ref} style={style} />;
  },
);

export const LanguagePieChart: React.FC<Partial<DonutChartProps>> = observer(
  (props) => {
    const cvState = useMst();
    const [chartData, setChartData] = React.useState<DonutChartProps>();

    React.useEffect(
      () =>
        reaction(
          () => stateToDonut(cvState),
          (v: DonutChartProps, prevData: DonutChartProps) => {
            const isChanged = !equal(v, prevData);

            if (isChanged) {
              setChartData(v);
            }
          },
        ),
      [cvState],
    );

    React.useEffect(() => {
      const dispose = autorun(() => {
        if (!chartData) {
          setChartData(stateToDonut(cvState) as DonutChartProps);
        }
      });
      return dispose;
    }, [cvState, chartData]);

    if (!chartData) {
      return null;
    }

    return (
      <Chart
        data={[chartData]}
        config={{ displayModeBar: false }}
        layout={{
          margin: { t: 0, b: 0, l: 0, r: 0 },
          showlegend: false,
        }}
        style={{ width: "100%", maxHeight: donutChartHeightWithUnit }}
        {...props}
      />
    );
  },
);

export const ActivityLineChart: React.FC<Partial<LineChartProps>> = observer(
  (props) => {
    const cvState = useMst();
    const [chartData, setChartData] = React.useState<LineChartProps>();

    React.useEffect(
      () =>
        reaction(
          () => stateToLine(cvState),
          (v: LineChartProps, prevData: LineChartProps) => {
            const isChanged = !equal(v, prevData);

            if (isChanged) {
              setChartData(v);
            }
          },
        ),
      [cvState],
    );

    React.useEffect(() => {
      const dispose = autorun(() => {
        if (!chartData) {
          setChartData(stateToLine(cvState) as LineChartProps);
        }
      });
      return dispose;
    }, [cvState, chartData]);

    if (!chartData) {
      return null;
    }

    return (
      <Chart
        data={[chartData]}
        config={{ responsive: true, displayModeBar: false }}
        layout={{
          margin: { t: 0, b: 15, l: 20, r: 0 },
          xaxis: {
            fixedrange: true,
          },
          yaxis: {
            fixedrange: true,
          },
          // Overridden via !important selector for css variable
          // Plotly does not support css variables yet plotly.js#4915
          paper_bgcolor: "rgba(255, 255, 255, .2)",
          showlegend: false,
        }}
        style={{ width: "100%", maxHeight: lineChartHeightWithUnit }}
        {...props}
      />
    );
  },
);
