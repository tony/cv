import React from "react";
import { VictoryChart, VictoryLine, VictoryPie, VictoryTheme } from "victory";
import equal from "fast-deep-equal";
import type { Observable, Subscription } from "rxjs";

import {
  donutChartHeight,
  donutChartWidth,
} from "@tony/cv-ui/styles/constants";

import { victoryChartQuery as query } from "./hub";
import { DonutChartProps, LineChartProps } from "./query";

import "./chart-react-victory.scss";

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
  const languageChartRef = React.useRef<typeof VictoryPie>(null);

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
    <>
      {/* @ts-ignore */}
      <VictoryPie
        ref={languageChartRef}
        {...chartData}
        {...props}
        height={donutChartHeight}
        width={donutChartWidth}
        padding={0}
      />
    </>
  );
};

export const ActivityLineChart: React.FC<Partial<LineChartProps>> = (props) => {
  const [chartData, setChartData] = React.useState<LineChartProps>();
  const chartRef = React.useRef<typeof VictoryLine>(null);

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

  const [width, setWidth] = React.useState(window.innerWidth);
  const updateWidth = (ev: Event) => {
    const event = ev as WindowEventMap["resize"];
    const target = event.target as Window;
    if (!target?.innerWidth) {
      return;
    }
    setWidth(target.innerWidth);
  };

  // thanks @jasonhealy https://github.com/FormidableLabs/victory/issues/396#issuecomment-348182325
  React.useEffect(() => {
    window.addEventListener("resize", updateWidth);

    // Removes listener on unmount
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  if (!chartData) {
    return null;
  }

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={{ x: 5 }}
      padding={{ top: 0, bottom: 0, right: 0, left: 0 }}
      width={width}
    >
      {/* @ts-ignore */}
      <VictoryLine ref={chartRef} {...chartData} {...props} />
    </VictoryChart>
  );
};
