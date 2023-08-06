() => {
  const getCustomColorScheme = () => {
    return window.localStorage.getItem("color-scheme");
  };
  const getSystemColorScheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "DARK"
      : "LIGHT";
  };
  const getColorScheme = () => {
    return getCustomColorScheme() || getSystemColorScheme();
  };

  const toggleHtmlClassNames = ({ add, remove }) => {
    const htmlTag = document.querySelector("html");
    if (htmlTag?.classList.contains(remove)) {
      htmlTag?.classList.remove(remove);
    }
    if (!htmlTag?.classList.contains(add)) {
      htmlTag?.classList.add(add);
    }
  };
  const htmlTag = document.querySelector("html");
  if (
    htmlTag &&
    !htmlTag.classList.contains("dark") &&
    !htmlTag.classList.contains("light")
  ) {
    if (getColorScheme() === "DARK") {
      toggleHtmlClassNames({ add: "dark", remove: "light" });
    } else {
      toggleHtmlClassNames({ add: "light", remove: "dark" });
    }
  }
};
