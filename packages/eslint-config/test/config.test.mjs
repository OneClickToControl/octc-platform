import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";
import base from "../index.js";
import library from "../library.js";

describe("@1c2c/eslint-config", () => {
  it("default export is a non-empty flat config array", () => {
    expect(Array.isArray(base)).toBe(true);
    expect(base.length).toBeGreaterThan(0);
  });

  it("lints valid TypeScript without fatal errors", async () => {
    const eslint = new ESLint({
      overrideConfig: base,
      overrideConfigFile: true,
    });
    const results = await eslint.lintText("const x = 1\nexport {}\n", {
      filePath: "fixture.ts",
    });
    expect(results[0].fatalErrorCount).toBe(0);
  });

  it("library config loads and lints", async () => {
    const eslint = new ESLint({
      overrideConfig: library,
      overrideConfigFile: true,
    });
    const results = await eslint.lintText("export const v = 2\n", {
      filePath: "lib.ts",
    });
    expect(results[0].fatalErrorCount).toBe(0);
  });
});
