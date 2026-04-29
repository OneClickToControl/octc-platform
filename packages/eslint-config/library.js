// @1c2c/eslint-config/library — preset for publishable libraries.
import baseConfig from "./index.js";

const libraryConfig = [
  ...baseConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/__tests__/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
];

export default libraryConfig;
