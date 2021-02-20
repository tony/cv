import React from "react";

import type { Results as ReducerState } from "@tony/cv-lib/search/query";

import { FilterDateRange } from "./FilterDateRange";
import { FilterDropdowns } from "./FilterDropdowns";
import { FilterToggles } from "./FilterToggles";

export const Settings: React.FC<{ results: ReducerState }> = ({ results }) => {
  const topLanguageColorBg = results.languages.find(
    (language) => language?.ui?.backgroundColor
  )?.ui?.backgroundColor;

  return (
    <div id="settings">
      <FilterDropdowns />
      <FilterDateRange lineColor={topLanguageColorBg} />
      <FilterToggles />
    </div>
  );
};
