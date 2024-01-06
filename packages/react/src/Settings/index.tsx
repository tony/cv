import React from "react";

import { observer } from "mobx-react-lite";
import { useMst } from "../mobx";
import { FilterDateRange } from "./FilterDateRange";
import { FilterDropdowns } from "./FilterDropdowns";
import { FilterToggles } from "./FilterToggles";

export const Settings: React.FC = observer(() => {
  const cvState = useMst();
  const topLanguageColorBg = cvState.languages.find(({ id }) => id)?.ui
    ?.backgroundColor;

  return (
    <>
      <div id="mobile-buttons">
        <button
          type="button"
          className={`toggle-btn ${cvState.ui.showOptionsMobile ? "active" : ""}
          focus:shadow-[0_0_3px_#3e94cf]
          focus:shadow-[0_0_7px_#3e94cf]
          active:shadow-[0_0_3px_#3e94cf]
          active:shadow-[0_0_7px_#3e94cf]
            `}
          onClick={(e) => {
            e.preventDefault();
            cvState.setShowOptionsMobile(!cvState.ui.showOptionsMobile);
          }}
        >
          🎛️ Settings
        </button>
        <button
          type="button"
          className={`toggle-btn ${cvState.ui.showChartsMobile ? "active" : ""}
          focus:shadow-[0_0_3px_#3e94cf]
          focus:shadow-[0_0_7px_#3e94cf]
          active:shadow-[0_0_3px_#3e94cf]
          active:shadow-[0_0_7px_#3e94cf]
            `}
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
        <FilterDateRange />
        <FilterToggles />
      </div>
    </>
  );
});
