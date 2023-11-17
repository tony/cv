module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "@typescript-eslint", "tsc"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": 0,
    "tsc/config": [
      1,
      {
        configFile: "tsconfig.json",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.tsx", "**/*.ts"],
      rules: {
        "react/prop-types": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
      },
    },
    {
      env: {
        es2021: true,
        node: true,
      },
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
      parserOptions: {
        ecmaVersion: 2020,
        project: "./tsconfig.node.json",
      },
      files: "vite.config.ts",
      plugins: ["@typescript-eslint", "tsc"],
      rules: {
        "@typescript-eslint/ban-ts-comment": 0,
        "tsc/config": [
          1,
          {
            configFile: "tsconfig.node.json",
          },
        ],
      },
    },
  ],
};
