import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter";
import reactSvg from "@tony/cv-data/img/icons/react.svg";
import angularSvg from "@tony/cv-data/img/icons/angular.svg";
import vueSvg from "@tony/cv-data/img/icons/vue.svg";

import { CustomElement, Prop } from "custom-elements-ts";

import template from "./nav.html";
import style from "!raw-loader!sass-loader!./nav.scss";

enum Framework {
  React,
  Angular,
  Vue,
}
enum ChartFramework {
  Plotly,
  Billboard,
  BillboardNext,
  CarbonCharts,
  ReactVis,
  Victory,
}

const FrameworkURLMapping: Record<Framework, string> = {
  [Framework.React]: "https://cv-react-v2.git-pull.com",
  [Framework.Angular]: "https://cv-angular-v2.git-pull.com",
  [Framework.Vue]: "https://cv-vue-v2.git-pull.com",
};

const ChartFrameworkBranchMapping: Record<ChartFramework, string> = {
  [ChartFramework.Plotly]: "v2-plotly",
  [ChartFramework.Billboard]: "v2-billboard.js",
  [ChartFramework.BillboardNext]: "v2-billboard.js-next",
  [ChartFramework.CarbonCharts]: "v2-carboncharts",
  [ChartFramework.ReactVis]: "v2-react-vis",
  [ChartFramework.Victory]: "v2-victory",
};

const FrameworkChartMapping: Record<Framework, ChartFramework[]> = {
  [Framework.React]: [
    ChartFramework.CarbonCharts,
    ChartFramework.Plotly,
    ChartFramework.BillboardNext,
    ChartFramework.Billboard,
    ChartFramework.ReactVis,
    ChartFramework.Victory,
  ],
  [Framework.Angular]: [],
  [Framework.Vue]: [],
};

const createFrameworkChartUrls = (
  frameworkIndex: Framework
): Partial<Record<ChartFramework, string>> => {
  const framework = Framework[frameworkIndex];
  // @ts-ignore
  const mapping = FrameworkChartMapping[framework];
  // console.log(
  //   "mapping",
  //   mapping,
  //   framework,
  //   Framework[framework],
  //   FrameworkChartMapping,
  //
  //   Framework[framework],
  //   // @ts-ignore
  //   Framework[Framework[framework]]
  // );
  if (!mapping?.length) return {};
  // @ts-ignore
  return mapping.reduce((urlMapping, chartFrameworkIndex) => {
    const chartFramework = ChartFramework[chartFrameworkIndex];
    urlMapping[
      chartFramework
      // @ts-ignore
    ] = `${FrameworkURLMapping[framework]}/dev/branch/${ChartFrameworkBranchMapping[chartFrameworkIndex]}/`;

    return urlMapping;
  }, {} as Partial<Record<ChartFramework, string>>);
};

const ChartFrameworkURLMapping: Partial<
  Record<Framework, string>
> = Object.values(Framework).reduce((urlMapping, framework) => {
  console.log("current", framework);
  if (typeof framework === "string") {
    console.log("skipping", framework);

    return urlMapping;
  }
  // @ts-ignore
  console.log("woo", Framework[framework]);
  // @ts-ignore
  urlMapping[Framework[framework]] = createFrameworkChartUrls(
    // @ts-ignore
    Framework[framework]
  );

  return urlMapping;
}, {});

console.log("ChartFrameworkURLMapping", ChartFrameworkURLMapping);

@CustomElement({
  tag: "cv-nav",
  template: template
    .replace("${reactSvg}", reactSvg)
    .replace("${angularSvg}", angularSvg)
    .replace("${vueSvg}", vueSvg),
  style,
})
export class MyNav extends HTMLElement {
  @Prop() message = "test";
  @Prop() reactSvg: string = reactSvg;

  constructor() {
    // Always call super first in constructor
    super();

    this.message = "test";
  }

  connectedCallback(): void {
    const div = this.shadowRoot?.querySelector("#our-nav");
    console.log(div);
    if (div) {
      // div.innerHTML = "trying this out";
    }
  }
}
