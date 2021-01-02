import type { CandlestickData, Data, OhclData, ViolinData } from "plotly.js";

export type PlotlyData = Exclude<
  Data,
  Partial<ViolinData> | Partial<OhclData> | Partial<CandlestickData>
>;
