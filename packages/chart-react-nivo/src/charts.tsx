import React from "react";

import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import type { Observable, Subscription } from "rxjs";

import { nivoChartQuery as query } from "./hub";
import { DonutChartProps, LineChartProps } from "./query";
import equal from "fast-deep-equal";

import "./chart-react-nivo.scss";

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

export const LanguagePieChart: React.FC<
  // Partial<React.ComponentProps<typeof ResponsivePie>>
  Partial<DonutChartProps>
> = (props) => {
  const [chartData, setChartData] = React.useState<DonutChartProps>();
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

  return <ResponsivePie {...chartData} {...props} />;
};

export const ActivityLineChart: React.FC<
  Partial<React.ComponentProps<typeof ResponsiveLine>>
> = (props) => {
  const [chartData, setChartData] = React.useState<LineChartProps>();
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

  return <ResponsiveLine {...chartData} {...props} />;
};
