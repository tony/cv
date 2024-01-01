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
      colors: {
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
        "black-pearl": {
          50: "#f3f7fc",
          100: "#e5eff9",
          200: "#c6def1",
          300: "#93c3e6",
          400: "#5aa4d6",
          500: "#3488c3",
          600: "#246ca5",
          700: "#1f5785",
          800: "#1d4a6f",
          900: "#1d3f5d",
          950: "#0b1723",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
