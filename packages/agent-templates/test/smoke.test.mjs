import { stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { templates, schemas, VERSION } from "../index.mjs";

describe("@1c2c/agent-templates", () => {
  it("templates.claude() returns content with octc:base markers", () => {
    const content = templates.claude();
    expect(content).toMatch(/<!-- octc:base/);
    expect(content).toMatch(/<!-- octc:end-base -->/);
  });

  it("templates.agents() returns content with octc:base markers", () => {
    const content = templates.agents();
    expect(content).toMatch(/<!-- octc:base/);
    expect(content).toMatch(/<!-- octc:end-base -->/);
  });

  it("templates.cursorBase() and cursorTooling() are non-empty", () => {
    expect(templates.cursorBase().length).toBeGreaterThan(0);
    expect(templates.cursorTooling().length).toBeGreaterThan(0);
  });

  it("schemas.acpManifestV1 is JSON Schema 2020-12", () => {
    const s = schemas.acpManifestV1();
    expect(s.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
    expect(s.title).toBeTruthy();
  });

  it("VERSION is a non-empty string", () => {
    expect(typeof VERSION).toBe("string");
    expect(VERSION.length).toBeGreaterThan(0);
  });

  it("CLI binary exists and is executable", async () => {
    const s = await stat(new URL("../bin/octc-agents.mjs", import.meta.url));
    expect(s.mode & 0o100).toBeTruthy();
  });
});
