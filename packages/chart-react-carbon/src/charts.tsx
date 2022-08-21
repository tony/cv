import React from "react";

import { DonutChart, StackedAreaChart } from "@carbon/charts-react";
import equal from "fast-deep-equal";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";

import { useMst } from "@tony/cv-react/src/mobx";

import type { DonutChartProps, LineChartProps } from "./query";
import { stateToLine, stateToDonut } from "./query";

import "@carbon/charts/styles.css";
import "./chart-react-carbon.css";

export const LanguagePieChart: React.FC<Partial<DonutChartProps>> = observer(
  (props) => {
    const cvState = useMst();
    const [chartData, setChartData] = React.useState<DonutChartProps>();
    const languageChartRef = React.useRef<DonutChart>(null);

    React.useEffect(
      () =>
        reaction(
          () => stateToDonut(cvState),
          (v: DonutChartProps, prevData: DonutChartProps) => {
            const isChanged = !equal(v, prevData);

            if (isChanged) {
              setChartData(v);
            }
          }
        ),
      [cvState]
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

    return (
      <DonutChart ref={languageChartRef} {...chartData} {...props}></DonutChart>
    );
  }
);

export const ActivityLineChart: React.FC<Partial<LineChartProps>> = observer(
  (props) => {
    const cvState = useMst();
    const [chartData, setChartData] = React.useState<LineChartProps>();
    const lineChartRef = React.useRef<StackedAreaChart>(null);

    React.useEffect(
      () =>
        reaction(
          () => stateToLine(cvState),
          (v: LineChartProps, prevData: LineChartProps) => {
            const isChanged = !equal(v, prevData);

            if (isChanged) {
              setChartData(v);
            }
          }
        ),
      [cvState]
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

    return (
      <StackedAreaChart
        ref={lineChartRef}
        {...chartData}
        {...props}
      ></StackedAreaChart>
    );
  }
);
