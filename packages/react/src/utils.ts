import React from "react";

import type { Observable, Subscription } from "rxjs";

export const useAsyncEffect = (
  effect: React.EffectCallback | (() => Promise<void>),
  dependencies?: unknown[]
): void =>
  React.useEffect(() => {
    effect();
    return () => void 0;
  }, dependencies);

export function onEmit<T>(
  source$: Observable<T>,
  nextFn: (value: T) => void
): Subscription {
  return source$.subscribe(nextFn, console.error);
}
