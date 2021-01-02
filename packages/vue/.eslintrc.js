module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],

  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    extraFileExtensions: [".vue"],
    project: "./tsconfig.json",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {},
};
