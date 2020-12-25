import React from "react";

export const useAsyncEffect = (
  effect: () => Promise<void>,
  dependencies?: any[]
) =>
  React.useEffect(() => {
    effect();
    return () => {};
  }, dependencies);
