import React from "react";

import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
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

import "./chart-react-nivo.css";

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
      [cvState, setChartData],
    );

    React.useEffect(() => {
      if (!chartData) {
        setChartData(stateToDonut(cvState) as DonutChartProps);
      }
      return void 0;
    }, [cvState, setChartData, chartData]);

    React.useEffect(() => void 0, []);

    if (!chartData) {
      return null;
    }

    return <ResponsivePie {...chartData} {...props} />;
  },
);

const AreaLayer: React.FC<{ innerWidth: number; innerHeight: number }> = ({
  innerWidth,
  innerHeight,
}) => {
  return (
    <path
      d={`M${innerWidth} 0 L${innerWidth} ${innerHeight} L0 ${innerHeight} L0 0 Z`}
      fill="var(--chart-background-color)"
      fillOpacity={1}
    />
  );
};

export const ActivityLineChart: React.FC<
  Partial<React.ComponentProps<typeof ResponsiveLine>>
> = observer((props) => {
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
    [cvState, setChartData],
  );

  React.useEffect(() => {
    if (!chartData) {
      setChartData(stateToLine(cvState) as LineChartProps);
    }
    return void 0;
  }, [cvState, chartData, setChartData]);

  React.useEffect(() => void 0, []);

  if (!chartData) {
    return null;
  }

  return (
    <ResponsiveLine
      {...chartData}
      {...props}
      layers={[
        AreaLayer,
        "grid",
        "markers",
        "areas",
        "lines",
        "slices",
        "axes",
        "points",
        "legends",
      ]}
    />
  );
});
