export enum ColorScheme {
  DARK = "DARK",
  LIGHT = "LIGHT",
}

export const toggleHtmlClassNames = ({
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

export const getCustomColorScheme = () => {
  return window.localStorage.getItem("color-scheme") as ColorScheme | undefined;
};
export const hasCustomColorScheme = (): boolean =>
  Boolean(getCustomColorScheme());
export const getSystemColorScheme = () => {
  return window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? ColorScheme.DARK
    : ColorScheme.LIGHT;
};
export const getColorScheme = () => {
  return getCustomColorScheme() || getSystemColorScheme();
};

() => {
  const htmlTag = document.querySelector("html");
  if (
    htmlTag &&
    !htmlTag.classList.contains("dark") &&
    !htmlTag.classList.contains("light")
  ) {
    if (getColorScheme() === ColorScheme.DARK) {
      toggleHtmlClassNames({ add: "dark", remove: "light" });
    } else {
      toggleHtmlClassNames({ add: "light", remove: "dark" });
    }
  }
};
