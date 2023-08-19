import React from "react";

import "./ColorScheme.css";

import {
  ColorScheme,
  getColorScheme,
  getSystemColorScheme,
  hasCustomColorScheme,
  toggleHtmlClassNames,
} from "../colorScheme";

export const ColorSchemeToggle: React.FC = () => {
  const systemIcon = "🖥️";
  const darkModeIcon = "🌙";
  const lightModeIcon = "☀️";
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
  React.useLayoutEffect(() => {
    applyColorScheme(colorScheme);
    setHasCustomColorScheme(hasCustomColorScheme());
  }, [colorScheme]);

  return (
    <div className="color-scheme-toggle">
      <div
        className={`color-scheme-toggle--icon ${
          _hasCustomColorScheme ? "" : "disabled"
        }`}
      >
        <div
          className={`color-scheme-toggle--icon--clear ${
            _hasCustomColorScheme ? "" : "disabled"
          }`}
          title={
            _hasCustomColorScheme
              ? "Back to OS default"
              : "Using OS color scheme"
          }
          onClick={setSystemTheme}
        >
          {systemIcon}
        </div>
      </div>
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
    </div>
  );
};
