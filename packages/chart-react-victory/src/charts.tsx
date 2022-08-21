import React from "react";

import equal from "fast-deep-equal";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { VictoryChart, VictoryLine, VictoryPie, VictoryTheme } from "victory";

import { useMst } from "@tony/cv-react/src/mobx";
import {
  donutChartHeight,
  donutChartWidth,
} from "@tony/cv-ui/styles/constants";

import type { DonutChartProps, LineChartProps } from "./query";
import { stateToLine, stateToDonut } from "./query";

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
          }
        ),
      [cvState]
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
  }
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
          }
        ),
      [cvState]
    );

    React.useEffect(() => {
      if (!chartData) {
        setChartData(stateToLine(cvState) as LineChartProps);
      }
      return void 0;
    }, [cvState]);

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
  }
);
