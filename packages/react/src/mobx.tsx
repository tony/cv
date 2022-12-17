import React from "react";

import type { Instance } from "mobx-state-tree";

import type { CVState } from "@tony/cv-lib/search/mobx";

export type MobxInstance = Instance<typeof CVState>;
export const MobxStoreContext = React.createContext<null | MobxInstance>(null);

export const MobxProvider = MobxStoreContext.Provider;
export function useMst(): MobxInstance {
  const store = React.useContext(MobxStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
