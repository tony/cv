import React from "react";

import { DonutChart, StackedAreaChart } from "@carbon/charts-react";
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

    const [animateDonutLabel, setAnimateDonutLabel] =
      React.useState<boolean>(false);

    // Part 1: Prevent re-render when switching chart tops
    React.useLayoutEffect(() => {
      if (!chartData) {
        return;
      }
      if (!animateDonutLabel) {
        setAnimateDonutLabel(true);
      }
    }, [animateDonutLabel, chartData]);

    if (!chartData) {
      return null;
    }

    // Part 2: Prevent re-render when switching chart tops
    chartData.options.animations = animateDonutLabel;

    return <DonutChart ref={languageChartRef} {...chartData} {...props} />;
  },
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

    return <StackedAreaChart ref={lineChartRef} {...chartData} {...props} />;
  },
);
