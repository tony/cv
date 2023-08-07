import React from "react";

import { observer } from "mobx-react-lite";

import * as mobxLib from "@tony/cv-lib/search/mobx";

import { Charts } from "./Charts";
import { MobxProvider } from "./mobx";
import { Results } from "./Results";
import { Settings, SettingsContextProvider } from "./Settings";
import { TopNav } from "./TopNav/TopNav";

import "@tony/cv-ui/styles/style.css";

const { state: cvState } = mobxLib;

const AppContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <MobxProvider value={cvState}>
        <SettingsContextProvider>
          <TopNav />
          {children}
        </SettingsContextProvider>
      </MobxProvider>
    </div>
  );
};

const App: React.FC = observer(() => {
  // window.cvState = cvState;

  return (
    <AppContainer>
      {cvState.ui.isLoading ? (
        <div id="loading-screen">Loading CV Data</div>
      ) : (
        <>
          <Settings />
          <Charts />
          <Results />
        </>
      )}
    </AppContainer>
  );
});

export default App;
