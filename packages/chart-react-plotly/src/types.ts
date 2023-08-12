import type { CandlestickData, Data, OhlcData, ViolinData } from "plotly.js";

export type PlotlyData = Exclude<
  Data,
  Partial<ViolinData> | Partial<OhlcData> | Partial<CandlestickData>
>;
