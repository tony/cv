import React from "react";

import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import equal from "fast-deep-equal";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";

import { useMst } from "@tony/cv-react/src/mobx";

import {
  type DonutChartProps,
  type LineChartProps,
  stateToDonut,
  stateToLine,
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

  const getDonutDimensions = () => {
    const donutChartContainer = document.querySelector("#charts .chart-row--donut")
    return donutChartContainer?.getBoundingClientRect()
  }

  const getLineDimensions = () => {
    const lineChartContainer = document.querySelector("#charts .chart-row--line")
    return lineChartContainer?.getBoundingClientRect()
  }
  const getRemainingWidth = () => {
    const chartContainer = document.querySelector("#charts")
    const chartContainerDimensions = chartContainer?.getBoundingClientRect()

    const donutChartContainer = document.querySelector("#charts .chart-row--donut")
    const donutChartContainerDimensions = donutChartContainer?.getBoundingClientRect()

    if (!chartContainerDimensions?.width || !donutChartContainerDimensions?.width) {
      return 0
    }

    return chartContainerDimensions?.width - donutChartContainerDimensions?.width
  }

    const [width, setWidth] = React.useState(
      document.querySelector("#charts .chart-row--line")?.getBoundingClientRect().width ??
        lineChartWidth,
    );
    const updateWidth = () => {
      const chartElement = document.querySelector("#charts .chart-row--line");
      if (!chartElement?.clientWidth) {
        return;
      }
      setWidth(chartElement.clientWidth);
    };

    // thanks @jasonhealy https://github.com/FormidableLabs/victory/issues/396#issuecomment-348182325
    React.useEffect(() => {
      window.addEventListener("resize", updateWidth);

      // Removes listener on unmount
      return () => {
        window.removeEventListener("resize", updateWidth);
      };
    }, [updateWidth]);



  if (!chartData) {
    return null;
  }

  console.log({width, remainingWidth: getRemainingWidth()})

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
      width={getRemainingWidth()}
    />
  );
});
