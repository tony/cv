import React from "react";

import { observer } from "mobx-react-lite";

import * as mobxLib from "@tony/cv-lib/search/mobx";
import { CVNav } from "@tony/cv-nav";

import { Charts } from "./Charts";
import { MobxProvider } from "./mobx";
import { Results } from "./Results";
import { Settings, SettingsContextProvider } from "./Settings";

import "@tony/cv-ui/styles/style.css";

const { state: cvState } = mobxLib;

const AppContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <MobxProvider value={cvState}>
        <SettingsContextProvider>
          <CVNav />
          {children}
        </SettingsContextProvider>
      </MobxProvider>
    </div>
  );
};

const App: React.FC = observer(() => {
  return (
    <AppContainer>
      {cvState.ui.isLoading ? (
        <div id="loading-screen">Loading CV Data</div>
      ) : (
        <>
          <Settings results={cvState} />
          <Charts results={cvState} />
          <Results results={cvState} />
        </>
      )}
    </AppContainer>
  );
});

export default App;
