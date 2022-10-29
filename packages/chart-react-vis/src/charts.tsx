import React from "react";
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  FlexibleXYPlot,
} from "react-vis";

import type { Observable, Subscription } from "rxjs";
import equal from "fast-deep-equal";
import { FlexRadialChart } from "./constants";
import { visChartQuery as query } from "./hub";
import { DonutChartProps, LineChartProps } from "./query";

import "react-vis/dist/style.css";
import "./chart-react-vis.scss";

// Todo consolidate this into common code somewhere
export function onEmit<T>(
  source$: Observable<T>,
  nextFn: (value: T) => void
): Subscription {
  return source$.subscribe(nextFn, console.error);
}

// Same as onEmit
export const useAsyncEffect = (
  effect: React.EffectCallback | (() => Promise<void>),
  dependencies?: unknown[]
): void =>
  React.useEffect(() => {
    effect();
    return () => void 0;
  }, dependencies);

export const LanguagePieChart: React.FC<Partial<DonutChartProps>> = (props) => {
  const [chartData, setChartData] = React.useState<DonutChartProps>();
  const languageChartRef = React.useRef<typeof FlexRadialChart>(null);

  useAsyncEffect(async () => {
    if (!chartData) {
      setChartData((await query.getDonutChart()) as DonutChartProps);
    }
    return void 0;
  });

  React.useEffect(() => void 0, [chartData]);
  React.useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<DonutChartProps>(query.subDonutChart$(), (newChart) => {
        const isChanged = !equal(newChart, chartData);

        if (isChanged) {
          setChartData(newChart);
        }
      }),
    ];

    return () => {
      subscriptions.map((it) => it.unsubscribe());
    };
  }, []);

  if (!chartData) {
    return null;
  }

  return <FlexRadialChart ref={languageChartRef} {...chartData} {...props} />;
};

export const ActivityLineChart: React.FC<Partial<LineChartProps>> = (props) => {
  const [chartData, setChartData] = React.useState<LineChartProps>();
  const lineChartRef = React.useRef<FlexibleXYPlot>(null);

  useAsyncEffect(async () => {
    if (!chartData) {
      setChartData((await query.getLineChart()) as LineChartProps);
    }
    return void 0;
  });

  React.useEffect(() => void 0, [chartData]);
  React.useEffect(() => {
    const subscriptions: Subscription[] = [
      onEmit<LineChartProps>(query.subLineChart$(), (newChart) => {
        const isChanged = !equal(newChart, chartData);

        if (isChanged) {
          setChartData(newChart);
        }
      }),
    ];

    return () => {
      subscriptions.map((it) => it.unsubscribe());
    };
  }, []);

  if (!chartData) {
    return null;
  }

  return (
    <FlexibleXYPlot xType="ordinal" ref={lineChartRef} {...props}>
      <LineSeries animation {...chartData} />
      <HorizontalGridLines />
      <VerticalGridLines />
      <XAxis />
      <YAxis />
    </FlexibleXYPlot>
  );
};
