module.exports = {
  extends: "../react/.eslintrc.js",
  overrides: [
    {
      files: ["**/*.tsx", "**/*.ts"],
      rules: {
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
  ],
};
