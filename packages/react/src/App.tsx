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

const toggleHtmlClassNames = ({
  add,
  remove,
}: {
  add: "dark" | "light";
  remove: "dark" | "light";
}) => {
  const htmlTag = document.querySelector("html");
  if (htmlTag?.classList.contains(remove)) {
    htmlTag?.classList.remove(remove);
  }
  if (!htmlTag?.classList.contains(add)) {
    htmlTag?.classList.add(add);
  }
};
enum ColorScheme {
  DARK = "DARK",
  LIGHT = "LIGHT",
}

const ColorSchemeToggle: React.FC = () => {
  const darkModeIcon = "🌙";
  const lightModeIcon = "☀️";
  const getCustomColorScheme = () => {
    return window.localStorage.getItem("color-scheme") as
      | ColorScheme
      | undefined;
  };
  const hasCustomColorScheme = (): boolean => Boolean(getCustomColorScheme());
  const getSystemColorScheme = () => {
    return window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches
      ? ColorScheme.DARK
      : ColorScheme.LIGHT;
  };
  const getColorScheme = () => {
    return getCustomColorScheme() || getSystemColorScheme();
  };
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(
    getColorScheme(),
  );
  const [_hasCustomColorScheme, setHasCustomColorScheme] =
    React.useState<boolean>(hasCustomColorScheme());

  const setDarkTheme = () => {
    window.localStorage.setItem("color-scheme", ColorScheme.DARK);
    setColorScheme(ColorScheme.DARK);
  };
  const setLightTheme = () => {
    window.localStorage.setItem("color-scheme", ColorScheme.LIGHT);
    setColorScheme(ColorScheme.LIGHT);
  };
  const setSystemTheme = () => {
    window.localStorage.removeItem("color-scheme");
    setColorScheme(getSystemColorScheme());
    setHasCustomColorScheme(false);
  };
  const applyColorScheme = (scheme: ColorScheme) => {
    const htmlTag = document.querySelector("html");
    if (htmlTag) {
      if (scheme === ColorScheme.DARK) {
        toggleHtmlClassNames({ add: "dark", remove: "light" });
      } else if (scheme === ColorScheme.LIGHT) {
        toggleHtmlClassNames({ add: "light", remove: "dark" });
      }
    }
  };
  React.useLayoutEffect(() => {
    applyColorScheme(colorScheme);
    setHasCustomColorScheme(hasCustomColorScheme());
  }, [colorScheme]);

  return (
    <div className="color-scheme-toggle">
      <div className="color-scheme-toggle--icon">
        {colorScheme == ColorScheme.LIGHT ? (
          <div
            className="color-scheme-toggle--icon--mode color-scheme-toggle--icon--dark-mode"
            title="Switch to dark mode"
            onClick={setDarkTheme}
          >
            {darkModeIcon}
          </div>
        ) : (
          <div
            className="color-scheme-toggle--icon--mode color-scheme-toggle--icon--light-mode"
            title="Switch to light mode"
            onClick={setLightTheme}
          >
            {lightModeIcon}
          </div>
        )}
      </div>
      <div className="color-scheme-toggle--icon">
        <div
          className={`color-scheme-toggle--icon--clear ${
            _hasCustomColorScheme ? "" : "disabled"
          }`}
          title="Back to default theme"
          onClick={setSystemTheme}
        >
          ❌
        </div>
      </div>
    </div>
  );
};

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
              <div className="site-info--filler">&nbsp;</div>
              <div className="site-info--color-scheme-toggle--container">
                <ColorSchemeToggle />
              </div>
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
