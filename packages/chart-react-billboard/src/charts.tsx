import React from "react";

import bb from "billboard.js";
import equal from "fast-deep-equal";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";

import { useMst } from "@tony/cv-react/src/mobx";

import {
  stateToDonut,
  stateToLine,
  type DonutChartProps,
  type LineChartProps,
} from "./query";

import "billboard.js/dist/billboard.css";
import "./chart-react-billboard.css";

export const Chart: React.FC<bb.ChartOptions> = observer(
  ({ data, ...props }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [chart, setChart] = React.useState<bb.Chart | null>(null);

    React.useEffect(() => {
      if (!chart) {
        const newChart = bb.generate({ bindto: ref.current, data, ...props });
        setChart(newChart);
        return () => newChart.unload();
      }
    }, [props, data]);

    React.useEffect(() => {
      if (!chart || !data) {
        return;
      }
      if (chart?.load && data) {
        // @ts-ignore Data structure mismatches: https://github.com/naver/billboard.js/issues/1848
        chart.load(data);
      }
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
      if (!chartData) {
        setChartData(stateToDonut(cvState) as DonutChartProps);
      }
      return void 0;
    }, [cvState]);

    React.useEffect(() => void 0, [chartData]);

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
      if (!chartData) {
        setChartData(stateToLine(cvState) as LineChartProps);
      }
      return void 0;
    }, [cvState]);

    React.useEffect(() => void 0, [chartData]);

    if (!chartData) {
      return null;
    }

    return <Chart {...chartData} {...props} />;
  },
);
