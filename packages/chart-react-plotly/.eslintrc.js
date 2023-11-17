module.exports = {
  extends: "../react/.eslintrc.cjs",
  overrides: [
    {
      files: ["**/*.tsx", "**/*.ts"],
      rules: {
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
  ],
};
