import React from "react";

import { ChartKey } from "../types";

export interface QueryStringContextInterface {
  chart?: ChartKey;
}

export const QueryStringContext =
  React.createContext<QueryStringContextInterface | null>(null);

function patchHistoryMethod(
  methodName: "pushState" | "replaceState",
  history: History,
  callbackFn: (state: any) => void,
) {
  const originalMethod = history[methodName];

  history[methodName] = function (state: any): void {
    const result = originalMethod.apply(this, arguments);
    // if (typeof history.onpushstate === "function") {
    //   history.onpushstate({ state });
    // }

    callbackFn(state);

    return result;
  };
  history[`${methodName}IsPatched`] = true;

  console.log(`patchHistoryMethod, isPatched: ${history.isPatched}`);
}

export const QueryStringProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const currentParams = new URLSearchParams<QueryStringContextInterface>(
    document.location.search,
  );
  const [chart, _setChart] = React.useState<ChartKey>(
    currentParams.get("chart"),
  );

  const setChart = (chart: ChartKey) => {
    currentParams.set("chart", chart);
    window.history.pushState({ search: currentParams.toString() });
    // setChart(chart);
  };

  const onPushState = (state: QueryStringContextInterface) => {
    if (state.chart !== chart) {
      _setChart(chart);
    }
  };

  React.useEffect(() => {
    if (!(history as unknown)["pushStateIsPatched"]) {
      patchHistoryMethod("pushState", window.history, onPushState);
    }
    if (!(history as unknown)["replaceStateIsPatched"]) {
      patchHistoryMethod("replaceState", window.history, onPushState);
    }
    return () => {};
  }, []);

  return (
    <QueryStringContext.Provider
      value={{
        chart,
        setChart,
      }}
    >
      {children}
    </QueryStringContext.Provider>
  );
};

export const useQueryString = () => {
  const context = React.useContext(QueryStringContext);

  if (!context) {
    throw new Error("useQueryString must be used inside a QueryStringProvider");
  }
  return context;
};
