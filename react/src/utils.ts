import React from "react";

export const useAsyncEffect = (
  // effect: () => Promise<void>,
  effect: React.EffectCallback,
  dependencies?: unknown[]
): void =>
  React.useEffect(() => {
    effect();
    return () => void 0;
  }, dependencies);
