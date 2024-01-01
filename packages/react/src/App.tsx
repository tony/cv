import React from "react";

import { observer } from "mobx-react-lite";

import * as mobxLib from "@tony/cv-lib/search/mobx";

import { Charts } from "./Charts";
import { Results } from "./Results";
import { Settings } from "./Settings";
import { TopNav } from "./TopNav/TopNav";
import { MobxProvider, useMst } from "./mobx";

import "./styles/style.css";

const { state: cvState } = mobxLib;

const AppContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <MobxProvider value={cvState}>
        <TopNav />
        {children}
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
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Simplest way with JSX?
      dangerouslySetInnerHTML={{
        __html: `
  :root {
    --cv-dominant-language-color: ${dominantLanguage.ui.color};
    --cv-dominant-language-background: ${dominantLanguage.ui.backgroundColor};
  }
  `,
      }}
    />
  ) : null;
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
