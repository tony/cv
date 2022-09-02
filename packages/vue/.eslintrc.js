/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    // "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-typescript",
    // "@vue/eslint-config-prettier",
  ],

  parserOptions: {
    ecmaVersion: 18,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    extraFileExtensions: [".vue"],
    project: "./tsconfig.json",
  },
  // plugins: ["vue", "@typescript-eslint"],
  rules: {},
};
