import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const CONFIGS = ["base.json", "library.json", "nextjs.json"];

describe("@1c2c/tsconfig", () => {
  it.each(CONFIGS)("%s is valid JSON with compilerOptions", (name) => {
    const raw = readFileSync(join(pkgRoot, name), "utf8");
    const json = JSON.parse(raw);
    expect(json.compilerOptions).toBeDefined();
    expect(typeof json.compilerOptions).toBe("object");
  });
});
