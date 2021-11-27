module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "tsc"],
  rules: {
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-var-requires": 0,
    "tsc/config": [
      1,
      {
        configFile: "tsconfig.json",
      },
    ],
  },
};
