/// <reference path="./custom.d.ts" />
import React from "react";
import Plotly from "plotly.js/dist/plotly";
import equal from "fast-deep-equal";
import type { Observable, Subscription } from "rxjs";

import { plotlyJSChartQuery as query } from "./hub";
import { DonutChartProps, LineChartProps } from "./query";
import {
  lineChartHeightWithUnit,
  donutChartHeightWithUnit,
} from "@tony/cv-ui/styles/constants";

import "./chart-react-plotly.scss";

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

export interface ChartProps {
  data?: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  frames?: Plotly.Frame[];
  config?: Partial<Plotly.Config>;

  // react-specific
  style?: React.CSSProperties;
}

export const Chart: React.FC<ChartProps> = ({ style = {}, data, ...props }) => {
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
        }
      );
    }
  }, [props, data]);
  return <div ref={ref} style={style} />;
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

  return (
    <Chart
      data={[chartData]}
      layout={{
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: false,
      }}
      style={{ width: "100%", maxHeight: donutChartHeightWithUnit }}
      {...props}
    />
  );
};

export const ActivityLineChart: React.FC<Partial<LineChartProps>> = (props) => {
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

  return (
    <Chart
      data={[chartData]}
      config={{ responsive: true }}
      layout={{
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: false,
      }}
      style={{ width: "100%", maxHeight: lineChartHeightWithUnit }}
      {...props}
    />
  );
};
