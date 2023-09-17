import React from "react";

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";

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
    setHasCustomColorScheme(true);
  };
  const setLightTheme = () => {
    window.localStorage.setItem("color-scheme", ColorScheme.LIGHT);
    setColorScheme(ColorScheme.LIGHT);
    setHasCustomColorScheme(true);
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

  const [isTooltipOpen, setIsTooltipOpen] = React.useState<boolean>(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isTooltipOpen,
    onOpenChange: setIsTooltipOpen,
    middleware: [
      offset(1),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);
  const headingId = useId();

  return (
    <div className="color-scheme-toggler">
      <FloatingFocusManager context={context} modal={false}>
        <>
          {isTooltipOpen && (
            <div
              className="color-scheme-popover"
              ref={refs.setFloating}
              style={floatingStyles}
              aria-labelledby={headingId}
              {...getFloatingProps()}
            >
              <div
                className={`color-scheme-toggle ${
                  _hasCustomColorScheme && colorScheme == ColorScheme.LIGHT
                    ? "active"
                    : ""
                }`}
                onClick={setLightTheme}
              >
                <div className="color-scheme-toggle--icon">
                  <div
                    className="color-scheme-toggle--icon--mode color-scheme-toggle--icon--light-mode"
                    title="Switch to light mode"
                  >
                    {lightModeIcon}
                  </div>
                </div>
                Light
              </div>
              <div
                className={`color-scheme-toggle ${
                  _hasCustomColorScheme && colorScheme == ColorScheme.DARK
                    ? "active"
                    : ""
                }`}
                onClick={setDarkTheme}
              >
                <div className="color-scheme-toggle--icon">
                  <div
                    className="color-scheme-toggle--icon--mode color-scheme-toggle--icon--dark-mode"
                    title="Switch to dark mode"
                  >
                    {darkModeIcon}
                  </div>
                </div>
                Dark
              </div>
              <div
                className={`color-scheme-toggle ${
                  _hasCustomColorScheme ? "" : "active"
                }`}
                onClick={setSystemTheme}
              >
                <div className="color-scheme-toggle--icon">
                  <div
                    className="color-scheme-toggle--icon--mode color-scheme-toggle--icon--clear"
                    title={
                      _hasCustomColorScheme
                        ? "Back to OS default"
                        : "Using OS color scheme"
                    }
                  >
                    {systemIcon}
                  </div>
                </div>
                System
              </div>
            </div>
          )}
        </>
      </FloatingFocusManager>
      <div
        className="color-scheme-toggler-button"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div className="color-scheme-toggle">
          <div className="color-scheme-toggle--icon">
            {colorScheme == ColorScheme.DARK ? (
              <div
                className="color-scheme-toggle--icon--mode color-scheme-toggle--icon--dark-mode"
                title="Switch to dark mode"
              >
                {darkModeIcon}
              </div>
            ) : (
              <div
                className="color-scheme-toggle--icon--mode color-scheme-toggle--icon--light-mode"
                title="Switch to light mode"
              >
                {lightModeIcon}
              </div>
            )}
          </div>
          Theme
        </div>
      </div>
    </div>
  );
};
