import React from "react";

import equal from "fast-deep-equal";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { VictoryChart, VictoryLine, VictoryPie, VictoryTheme } from "victory";

import { useMst } from "@tony/cv-react/src/mobx";
import {
  donutChartHeight,
  donutChartWidth,
  lineChartWidth,
} from "@tony/cv-ui/styles/constants";

import {
  stateToDonut,
  stateToLine,
  type DonutChartProps,
  type LineChartProps,
} from "./query";

import "./chart-react-victory.css";

export const LanguagePieChart: React.FC<Partial<DonutChartProps>> = observer(
  (props) => {
    const cvState = useMst();
    const [chartData, setChartData] = React.useState<DonutChartProps>();
    const languageChartRef = React.useRef<VictoryPie>(null);

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

    if (!chartData) {
      return null;
    }

    return (
      <VictoryPie
        ref={languageChartRef}
        {...chartData}
        {...props}
        height={donutChartHeight}
        width={donutChartWidth}
        padding={{ top: 18, bottom: 18, left: 18, right: 18 }}
        labelPlacement="perpendicular"
        labelRadius={110}
        animate={{
          duration: 450,
          onLoad: { duration: 0 },
        }}
      />
    );
  },
);

export const ActivityLineChart: React.FC<Partial<LineChartProps>> = observer(
  (props) => {
    const cvState = useMst();
    const [chartData, setChartData] = React.useState<LineChartProps>();
    const chartRef = React.useRef<typeof VictoryLine>(null);

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

    const [width, setWidth] = React.useState(
      document.querySelector("#charts .chartRow--line")?.clientWidth ??
        lineChartWidth,
    );
    const updateWidth = () => {
      const chartElement = document.querySelector("#charts .chartRow--line");
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
    }, []);

    if (!chartData) {
      return null;
    }

    return (
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 20 }}
        padding={{ top: 15, bottom: 30, right: 0, left: 20 }}
        width={width + 170}
      >
        <VictoryLine
          ref={chartRef}
          padding={{ top: 0, bottom: 0, right: 0, left: 0 }}
          animate={{
            duration: 450,
            onLoad: { duration: 0 },
          }}
          {...chartData}
          {...props}
        />
      </VictoryChart>
    );
  },
);
