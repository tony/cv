import React from "react";

import { useMst } from "../mobx";
import { FilterDateRange } from "./FilterDateRange";
import { FilterDropdowns } from "./FilterDropdowns";
import { FilterToggles } from "./FilterToggles";
import { observer } from "mobx-react-lite";

export const Settings: React.FC = observer(() => {
  const cvState = useMst();
  const topLanguageColorBg = cvState.languages.find(({ id }) => id)?.ui
    ?.backgroundColor;

  return (
    <>
      <div id="mobile-buttons">
        <button
          type="button"
          className={`toggle-btn ${
            cvState.ui.showOptionsMobile ? "active" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            cvState.setShowOptionsMobile(!cvState.ui.showOptionsMobile);
          }}
        >
          🎛️ Settings
        </button>
        <button
          type="button"
          className={`toggle-btn ${
            cvState.ui.showChartsMobile ? "active" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            cvState.setShowChartsMobile(!cvState.ui.showChartsMobile);
          }}
        >
          📊 Charts
        </button>
      </div>

      <div
        id="settings"
        className={`${cvState.ui.showOptionsMobile ? " active" : ""}`}
      >
        <FilterDropdowns />
        <FilterDateRange lineColor={topLanguageColorBg} />
        <FilterToggles />
      </div>
    </>
  );
});
