import { execSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyMonorepoFromConfig } from "../lib/verify-monorepo.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const octc = join(__dirname, "..", "bin", "octc.mjs");

function runVerify(cwd, extra = "") {
  return execSync(`node "${octc}" verify monorepo ${extra}`, {
    encoding: "utf8",
    cwd,
  });
}

describe("verifyMonorepoFromConfig", () => {
  it("rechaza superficie desconocida", () => {
    const r = verifyMonorepoFromConfig("/tmp", {
      schema_version: 0,
      active_surfaces: ["nope"],
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("desconocida"))).toBe(true);
  });

  it("falla si portfolio.repo_surfaces_csv no coincide", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-verify-"));
    mkdirSync(join(root, "apps", "web"), { recursive: true });
    writeFileSync(join(root, "apps", "web", "x.txt"), "");
    const r = verifyMonorepoFromConfig(root, {
      schema_version: 0,
      active_surfaces: ["web"],
      portfolio: { repo_surfaces_csv: "web,data" },
    });
    expect(r.ok).toBe(false);
  });
});

describe("octc verify monorepo (integration)", () => {
  it("exit 2 sin archivo", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-noyaml-"));
    expect(() => runVerify(root)).toThrow();
  });

  it("exit 0 con web y directorio apps/web", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-ok-"));
    mkdirSync(join(root, ".octc"), { recursive: true });
    mkdirSync(join(root, "apps", "web"), { recursive: true });
    writeFileSync(join(root, "apps", "web", "keep.txt"), "");
    writeFileSync(
      join(root, ".octc", "monorepo.yaml"),
      "schema_version: 0\nactive_surfaces:\n  - web\n",
    );
    const out = runVerify(root);
    expect(out).toMatch(/OK/);
  });
});
