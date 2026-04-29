import test from "node:test";
import assert from "node:assert/strict";
import { templates, schemas, VERSION } from "../index.mjs";

test("templates.claude() returns content with octc:base markers", () => {
  const content = templates.claude();
  assert.match(content, /<!-- octc:base/);
  assert.match(content, /<!-- octc:end-base -->/);
});

test("templates.agents() returns content with octc:base markers", () => {
  const content = templates.agents();
  assert.match(content, /<!-- octc:base/);
  assert.match(content, /<!-- octc:end-base -->/);
});

test("templates.cursorBase() and cursorTooling() are non-empty", () => {
  assert.ok(templates.cursorBase().length > 0);
  assert.ok(templates.cursorTooling().length > 0);
});

test("schemas.acpManifestV1 is JSON Schema 2020-12", () => {
  const s = schemas.acpManifestV1();
  assert.equal(s.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.ok(s.title);
});

test("VERSION is a non-empty string", () => {
  assert.equal(typeof VERSION, "string");
  assert.ok(VERSION.length > 0);
});

test("CLI binary exists and is executable", async () => {
  const { stat } = await import("node:fs/promises");
  const s = await stat(new URL("../bin/octc-agents.mjs", import.meta.url));
  assert.ok(s.mode & 0o100, "bin/octc-agents.mjs should be executable");
});
