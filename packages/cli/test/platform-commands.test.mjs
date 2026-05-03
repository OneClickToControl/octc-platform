import { execSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const octc = join(__dirname, "..", "bin", "octc.mjs");

function run(args, cwd) {
  return execSync(`node "${octc}" ${args}`, {
    encoding: "utf8",
    cwd: cwd ?? process.cwd(),
  });
}

describe("octc platform commands (0.3)", () => {
  it("help lista sync governance y add surface", () => {
    const out = run("--help");
    expect(out).toMatch(/sync governance/);
    expect(out).toMatch(/add surface/);
    expect(out).toMatch(/sync surface/);
    expect(out).toMatch(/portfolio suggest/);
  });

  it("add surface web crea bootstrap ops", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-add-web-"));
    run("add surface web", root);
    expect(
      existsSync(join(root, "docs", "ops", "octc-surface-web-bootstrap.md")),
    ).toBe(true);
  });

  it("sync surface web --dry-run no escribe", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-sync-web-dry-"));
    run("sync surface web --dry-run", root);
    expect(
      existsSync(join(root, "docs", "ops", "octc-surface-web-bootstrap.md")),
    ).toBe(false);
  });

  it("sync surface web escribe igual que add", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-sync-web-"));
    run("sync surface web", root);
    expect(
      existsSync(join(root, "docs", "ops", "octc-surface-web-bootstrap.md")),
    ).toBe(true);
  });

  it("add surface data crea stubs", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-add-"));
    run("add surface data", root);
    expect(existsSync(join(root, "supabase", "README.md"))).toBe(true);
    expect(existsSync(join(root, "docs", "db", "README.md"))).toBe(true);
  });

  it("add surface data --dry-run no crea archivos", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-add-dry-"));
    run("add surface data --dry-run", root);
    expect(existsSync(join(root, "supabase", "README.md"))).toBe(false);
  });

  it("sync governance --dry-run no escribe", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-sync-"));
    run("sync governance --only doc-contract --dry-run", root);
    expect(existsSync(join(root, "templates", "governance", "doc-contract"))).toBe(
      false,
    );
  });

  it("sync governance copia doc-contract", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-sync2-"));
    run("sync governance --only doc-contract", root);
    expect(
      existsSync(
        join(root, "templates", "governance", "doc-contract", "README.md"),
      ),
    ).toBe(true);
  });

  it("portfolio suggest lee monorepo.yaml", () => {
    const root = mkdtempSync(join(tmpdir(), "octc-port-"));
    mkdirSync(join(root, ".octc"), { recursive: true });
    writeFileSync(
      join(root, ".octc", "monorepo.yaml"),
      "schema_version: 0\nactive_surfaces:\n  - web\n  - data\nportfolio:\n  repo_surfaces_csv: \"web,data\"\n",
    );
    mkdirSync(join(root, "apps", "web"), { recursive: true });
    mkdirSync(join(root, "supabase"), { recursive: true });
    writeFileSync(join(root, "apps", "web", "x.txt"), "");
    const out = run("portfolio suggest --repo test-repo", root);
    expect(out).toMatch(/repo_surfaces_csv: "web,data"/);
    expect(out).toMatch(/test-repo/);
  });
});
