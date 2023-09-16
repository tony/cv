import React from "react";

import { observer } from "mobx-react-lite";

import * as mobxLib from "@tony/cv-lib/search/mobx";

import { Charts } from "./Charts";
import { QueryStringProvider } from "./hooks/useQueryString";
import { MobxProvider, useMst } from "./mobx";
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
        <QueryStringProvider>
          <SettingsContextProvider>
            <TopNav />
            {children}
          </SettingsContextProvider>
        </QueryStringProvider>
      </MobxProvider>
    </div>
  );
};

export interface CVDominantLanguageCSS extends React.CSSProperties {
  "--cv-dominant-language-color": React.CSSProperties["color"];
  "--cv-dominant-language-background": React.CSSProperties["backgroundColor"];
}

const DominantLanguageCSSVariable: React.FC = observer(() => {
  const cvState = useMst();
  const dominantLanguage = cvState.dominantLanguage;

  return dominantLanguage ? (
    <style
      dangerouslySetInnerHTML={{
        __html: `
  :root {
    --cv-dominant-language-color: ${dominantLanguage.ui.color};
    --cv-dominant-language-background: ${dominantLanguage.ui.backgroundColor};
  }
  `,
      }}
    ></style>
  ) : (
    <></>
  );
});

const App: React.FC = observer(() => {
  // window.cvState = cvState;

  return (
    <AppContainer>
      {cvState.ui.isLoading ? (
        <div id="loading-screen">Loading CV Data</div>
      ) : (
        <>
          <DominantLanguageCSSVariable />
          <Settings />
          <Charts />
          <Results />
        </>
      )}
    </AppContainer>
  );
});

export default App;
