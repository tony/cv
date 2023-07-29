import React from "react";

import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import equal from "fast-deep-equal";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";

import { useMst } from "@tony/cv-react/src/mobx";

import type { DonutChartProps, LineChartProps } from "./query";
import { stateToDonut, stateToLine } from "./query";

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

    return <ResponsivePie {...chartData} {...props} />;
  },
);

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

  return <ResponsiveLine {...chartData} {...props} />;
});
