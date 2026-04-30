import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const octc = join(__dirname, "..", "bin", "octc.mjs");

function run(args) {
  return execSync(`node "${octc}" ${args}`, { encoding: "utf8" });
}

describe("@1c2c/cli", () => {
  it("prints help with --help (exit 0)", () => {
    const out = run("--help");
    expect(out).toMatch(/octc sync agents/);
  });

  it("forwards sync --help to octc-agents usage", () => {
    const out = run("sync agents --help");
    expect(out).toMatch(/octc-agents/);
  });

  it("accepts agents verify --help", () => {
    const out = run("agents verify --help");
    expect(out).toMatch(/octc-agents/);
  });

  it("verify monorepo --help", () => {
    const out = run("verify monorepo --help");
    expect(out).toMatch(/monorepo\.yaml/);
  });
});
