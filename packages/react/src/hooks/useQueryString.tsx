import React from "react";

import { ChartKey } from "../types";

export interface QueryStringContextInterface {
  chart?: ChartKey;
}

export const QueryStringContext =
  React.createContext<QueryStringContextInterface | null>(null);

const patchPushState = (history: History) => {
  const originalPushState = history.pushState;

  history.pushState = (state) => {
    if (typeof history.onpushstate === "function") {
      history.onpushstate({ state });
    }

    return pushState.apply(history, arguments);
  };
  history.isPatched = true;
  console.log(`patchPushState, isPatched: ${history.isPatched}`);
};

export const QueryStringProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [chart, setChart] = React.useState<ChartKey>(null);

  React.useEffect(() => {
    if (!(history as unknown)?.isPatched) {
      patchPushState(window.history);
    }
    return () => {};
  }, []);

  return (
    <QueryStringContext.Provider
      value={{
        chart,
      }}
    >
      {children}
    </QueryStringContext.Provider>
  );
};
