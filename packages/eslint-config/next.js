// @1c2c/eslint-config/next — preset for Next.js 15+ (App Router)
import nextPlugin from "@next/eslint-plugin-next";
import baseConfig, { baseLanguageOptions, baseIgnores } from "./index.js";

const nextCoreWebVitals = nextPlugin.configs["core-web-vitals"] || {};
const nextTypeScript =
  nextPlugin.configs.typescript || nextPlugin.configs["next-typescript"] || {};

const config = [
  ...baseConfig,
  baseIgnores,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: baseLanguageOptions,
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...(nextCoreWebVitals.rules || {}),
      ...(nextTypeScript.rules || {}),
    },
  },
];

export default config;
