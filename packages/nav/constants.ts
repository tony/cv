enum Framework {
  React = "React",
  Angular = "Angular",
  Vue = "Vue",
}
enum Chart {
  Plotly = "Plotly",
  Billboard = "Billboard",
  BillboardNext = "BillboardNext",
  CarbonCharts = "CarbonCharts",
  ReactVis = "ReactVis",
  Victory = "Victory",
  Nivo = "Nivo",
}

const FrameworkURLMapping: Record<Framework, string> = {
  [Framework.React]: "https://cv-react-v2.git-pull.com",
  [Framework.Angular]: "https://cv-angular-v2.git-pull.com",
  [Framework.Vue]: "https://cv-vue-v2.git-pull.com",
};

const ChartBranchMapping: Record<Chart, string> = {
  [Chart.Plotly]: "v2-plotly",
  [Chart.Billboard]: "v2-billboard.js",
  [Chart.BillboardNext]: "v2-billboard.js-next",
  [Chart.CarbonCharts]: "v2-carboncharts",
  [Chart.ReactVis]: "v2-react-vis",
  [Chart.Victory]: "v2-victory",
  [Chart.Nivo]: "v2-nivo",
};

type FWChartRecord = Record<Framework, Partial<Record<Chart, string>>>;

const FrameworkChartMapping: Record<Framework, Chart[]> = {
  [Framework.React]: [
    Chart.CarbonCharts,
    Chart.Plotly,
    Chart.BillboardNext,
    Chart.Billboard,
    Chart.ReactVis,
    Chart.Victory,
    Chart.Nivo,
  ],
  [Framework.Angular]: [],
  [Framework.Vue]: [],
};

export const FWChartPRMapping: FWChartRecord = {
  [Framework.React]: {
    [Chart.CarbonCharts]: "https://github.com/tony/cv/pull/1154",
    [Chart.Plotly]: "https://github.com/tony/cv/pull/1153",
    [Chart.BillboardNext]: "https://github.com/tony/cv/pull/1171",
    [Chart.Billboard]: "https://github.com/tony/cv/pull/1152",
    [Chart.ReactVis]: "https://github.com/tony/cv/pull/1159",
    [Chart.Victory]: "https://github.com/tony/cv/pull/1161",
    [Chart.Nivo]: "https://github.com/tony/cv/pull/1160",
  },
  [Framework.Angular]: {},
  [Framework.Vue]: {},
};

export const projectUrl = `https://www.github.com/tony/cv`;
export const projectBranchPrefixUrl = `${projectUrl}/tree/`;

export const FWChartSourceURLMapping: FWChartRecord = {
  [Framework.React]: {
    [Chart.CarbonCharts]: `${projectBranchPrefixUrl}${ChartBranchMapping[Chart.CarbonCharts]}`,
    [Chart.Plotly]: `${projectBranchPrefixUrl}${ChartBranchMapping[Chart.Plotly]}`,
    [Chart.BillboardNext]: `${projectBranchPrefixUrl}${ChartBranchMapping[Chart.BillboardNext]}`,
    [Chart.Billboard]: `${projectBranchPrefixUrl}${ChartBranchMapping[Chart.Billboard]}`,
    [Chart.ReactVis]: `${projectBranchPrefixUrl}${ChartBranchMapping[Chart.ReactVis]}`,
    [Chart.Victory]: `${projectBranchPrefixUrl}${ChartBranchMapping[Chart.Victory]}`,
    [Chart.Nivo]: `${projectBranchPrefixUrl}${ChartBranchMapping[Chart.Nivo]}`,
  },
  [Framework.Angular]: {},
  [Framework.Vue]: {},
};

const createFrameworkChartUrls = (frameworkIndex: Framework) => {
  const framework = Framework[frameworkIndex];
  const mapping = FrameworkChartMapping[framework];
  if (!mapping?.length) return {};
  return mapping.reduce((urlMapping, chartFrameworkIndex) => {
    const chartFramework = Chart[chartFrameworkIndex];
    urlMapping[
      chartFramework
    ] = `${FrameworkURLMapping[framework]}/dev/branch/${ChartBranchMapping[chartFrameworkIndex]}/`;

    return urlMapping;
  }, {} as Partial<Record<Chart, string>>);
};

export const FWChartURLMapping = Object.values(Framework).reduce((urlMapping, framework) => {
  urlMapping[framework] = createFrameworkChartUrls(framework);
  return urlMapping;
}, {} as FWChartRecord);
