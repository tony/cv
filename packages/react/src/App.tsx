import React from "react";

import { observer } from "mobx-react-lite";

import * as mobxLib from "@tony/cv-lib/search/mobx";

import { Charts } from "./Charts";
import { MobxProvider } from "./mobx";
import { Results } from "./Results";
import { Settings, SettingsContextProvider } from "./Settings";

import "@tony/cv-ui/styles/nav.css";
import "@tony/cv-ui/styles/style.css";

const { state: cvState } = mobxLib;

const AppContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <MobxProvider value={cvState}>
        <SettingsContextProvider>
          <nav id="top-nav">
            <div className="site-info" title="Tony Narlock's CV">
              <div className="site-info--logo">
                <div className="site-info--logo--img">&nbsp;</div>
              </div>
              <div className="site-info--site-name">Tony Narlock&apos;s CV</div>
            </div>
          </nav>
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
