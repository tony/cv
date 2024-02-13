import React from "react";

import bb from "billboard.js";
import equal from "fast-deep-equal";
import { autorun, reaction } from "mobx";
import { observer } from "mobx-react-lite";

import { useMst } from "@tony/cv-react/src/mobx";

import {
  type DonutChartProps,
  type LineChartProps,
  stateToDonut,
  stateToLine,
} from "./query";

import "billboard.js/dist/billboard.css";
import "./chart-react-billboard.css";

export const Chart: React.FC<bb.ChartOptions> = observer(
  ({ data, ...props }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [chart, setChart] = React.useState<bb.Chart | null>(null);

    React.useEffect(() => {
      const dispose = autorun(() => {
        if (!chart) {
          const newChart = bb.generate({ bindto: ref.current, data, ...props });
          setChart(newChart);
          return () => newChart.unload();
        }
      });
      return dispose;
    }, [props, data, chart, data]);

    React.useEffect(() => {
      const dispose = autorun(() => {
        if (!chart || !data) {
          return;
        }
        if (chart?.load && data) {
          // @ts-ignore Data structure mismatches: https://github.com/naver/billboard.js/issues/1848
          chart.load(data);
        }
      });
      return dispose;
    }, [data, chart]);
    return <div ref={ref} />;
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

    return <Chart {...chartData} {...props} />;
  },
);

export const ActivityLineChart: React.FC<Partial<bb.ChartOptions>> = observer(
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
    }, [chartData, cvState]);

    if (!chartData) {
      return null;
    }

    return <Chart {...chartData} {...props} />;
  },
);
