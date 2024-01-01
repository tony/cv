const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: {
    relative: true,
    files: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "Inter var", ...defaultTheme.fontFamily.sans],
      },
      theme: {
        // blue: "#0854a0",
        // https://uicolors.app/create
        blue: {
          50: "#f0f7ff",
          100: "#e1eefd",
          200: "#bcdcfb",
          300: "#81c1f8",
          400: "#3ea1f2",
          500: "#1584e2",
          600: "#0867c1",
          700: "#0854a0",
          800: "#0b4781",
          900: "#0f3c6b",
          950: "#0a2647",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
