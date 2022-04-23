import bb from "billboard.js";
import React from "react";

import type { Observable, Subscription } from "rxjs";

import { billboardJSChartQuery as query } from "./hub";
import { DonutChartProps, LineChartProps } from "./query";
import equal from "fast-deep-equal";

import "billboard.js/dist/billboard.css";
import "./chart-react-billboard.scss";

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

export const Chart: React.FC<bb.ChartOptions> = ({ data, ...props }) => {
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
    if (chart && chart?.load && data) {
      // @ts-ignore Data structure mismatches: https://github.com/naver/billboard.js/issues/1848
      chart.load(data);
    }
  }, [data, chart]);
  return <div ref={ref} />;
};

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
        console.log("pie published", newChart, chartData, { isChanged });

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

  return <Chart {...chartData} {...props} />;
};

export const ActivityLineChart: React.FC<Partial<bb.ChartOptions>> = (
  props
) => {
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
        console.log("pie published", newChart, chartData, { isChanged });

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

  return <Chart {...chartData} {...props} />;
};
