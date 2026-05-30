import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const octc = join(__dirname, "..", "bin", "octc.mjs");
const templateRoot = join(__dirname, "..", "templates", "product");

describe("octc init app", () => {
  it("materializa shell @1c2c/cli y aplica pins", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-init-app-"));
    execSync(
      `node "${octc}" init app "${root}" --force --portfolio-pin pinA --factory-oao-pin pinB --template-dir "${templateRoot}"`,
      { encoding: "utf8" },
    );
    expect(existsSync(join(root, "package.json"))).toBe(true);
    expect(existsSync(join(root, "pnpm-lock.yaml"))).toBe(true);
    expect(existsSync(join(root, ".github/workflows/octc-platform-verify.yml"))).toBe(
      true,
    );
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    expect(pkg.devDependencies["@1c2c/cli"]).toBe("^0.5.1");
    expect(pkg.packageManager).toBe("pnpm@9.12.3");
    const verify = readFileSync(
      join(root, ".github/workflows/octc-platform-verify.yml"),
      "utf8",
    );
    expect(verify).toContain("version: 9.12.3");
    const disp = readFileSync(
      join(root, ".github/workflows/octc-portfolio-dispatch.yml"),
      "utf8",
    );
    expect(disp).toContain("pinA");
    const oao = readFileSync(
      join(root, ".github/workflows/octc-factory-operation-notify.yml"),
      "utf8",
    );
    expect(oao).toContain("pinB");
  });
});
