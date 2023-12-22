import React from "react";

import { useMst } from "../mobx";
import { FilterDateRange } from "./FilterDateRange";
import { FilterDropdowns } from "./FilterDropdowns";
import { FilterToggles } from "./FilterToggles";

export interface SettingsContextInterface {
  showChartsMobile: boolean;
  showOptionsMobile: boolean;
  setShowChartsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOptionsMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsContext =
  React.createContext<SettingsContextInterface | null>(null);

export const SettingsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [showChartsMobile, setShowChartsMobile] =
    React.useState<boolean>(false);
  const [showOptionsMobile, setShowOptionsMobile] =
    React.useState<boolean>(false);

  return (
    <SettingsContext.Provider
      value={{
        showChartsMobile,
        showOptionsMobile,
        setShowChartsMobile,
        setShowOptionsMobile,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const Settings: React.FC = () => {
  const cvState = useMst();
  const topLanguageColorBg = cvState.languages.find(({ id }) => id)?.ui
    ?.backgroundColor;

  const context = React.useContext(SettingsContext);
  if (!context) {
    return null;
  }
  const {
    setShowOptionsMobile,
    setShowChartsMobile,
    showOptionsMobile,
    showChartsMobile,
  } = context;

  return (
    <>
      <div id="mobile-buttons">
        <button
          type="button"
          className={`toggle-btn ${showOptionsMobile ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setShowOptionsMobile(!showOptionsMobile);
          }}
        >
          🎛️ Settings
        </button>
        <button
          type="button"
          className={`toggle-btn ${showChartsMobile ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setShowChartsMobile(!showChartsMobile);
          }}
        >
          📊 Charts
        </button>
      </div>

      <div id="settings" className={`${showOptionsMobile ? " active" : ""}`}>
        <FilterDropdowns />
        <FilterDateRange lineColor={topLanguageColorBg} />
        <FilterToggles />
      </div>
    </>
  );
};
