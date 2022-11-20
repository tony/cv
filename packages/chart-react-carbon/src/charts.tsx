import { DonutChart, StackedAreaChart } from "@carbon/charts-react";
import React from "react";
import equal from "fast-deep-equal";
import type { Observable, Subscription } from "rxjs";

import { carbonChartQuery as query } from "./hub";
import { DonutChartProps, LineChartProps } from "./query";

import "@carbon/charts/styles.css";
import "./chart-react-carbon.css";

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
  const languageChartRef = React.useRef<DonutChart>(null);

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

  return <DonutChart ref={languageChartRef} {...chartData} {...props} />;
};

export const ActivityLineChart: React.FC<Partial<LineChartProps>> = (props) => {
  const [chartData, setChartData] = React.useState<LineChartProps>();
  const lineChartRef = React.useRef<StackedAreaChart>(null);

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
    <StackedAreaChart
      ref={lineChartRef}
      {...chartData}
      {...props}
    ></StackedAreaChart>
  );
};
