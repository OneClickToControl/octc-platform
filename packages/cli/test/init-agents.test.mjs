import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const octc = join(__dirname, "..", "bin", "octc.mjs");
const templateRoot = join(__dirname, "..", "templates", "agents");

describe("octc init agents", () => {
  it("materializa ACP shell y sustituye __PRODUCT__", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-init-agents-"));
    execSync(
      `node "${octc}" init agents "${root}" --product demo --force --template-dir "${templateRoot}"`,
      { encoding: "utf8" },
    );
    expect(existsSync(join(root, "package.json"))).toBe(true);
    expect(existsSync(join(root, "pnpm-lock.yaml"))).toBe(true);
    expect(existsSync(join(root, "agents/demo-acp/manifest.json"))).toBe(true);
    const manifest = readFileSync(
      join(root, "agents/demo-acp/manifest.json"),
      "utf8",
    );
    expect(manifest).toContain("demo-acp");
    expect(manifest).not.toContain("__PRODUCT__");
  });
});
