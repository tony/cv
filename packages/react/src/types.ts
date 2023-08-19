export enum Chart {
  Carbon = "carbon",
  Plotly = "plotly",
  Billboard = "billboard",
  Nivo = "nivo",
  Victory = "victory",
}

export type ChartType = typeof Chart;
export type ChartKey = keyof ChartType;
