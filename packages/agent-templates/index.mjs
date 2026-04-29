// @1c2c/agent-templates — programmatic API
//
// Lets a consumer load template contents at runtime, e.g. to scaffold
// agent files in a fresh repo, or to verify that an existing repo's
// templates still match the canonical version.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const read = (rel) => readFileSync(join(__dirname, rel), "utf8");

export const templates = {
  claude: () => read("templates/CLAUDE.md"),
  agents: () => read("templates/AGENTS.md"),
  cursorBase: () => read("templates/cursor/00-octc-base.mdc"),
  cursorTooling: () => read("templates/cursor/01-octc-tooling.mdc"),
};

export const schemas = {
  acpManifestV1: () =>
    JSON.parse(read("schemas/octc-agent-provider.manifest.v1.json")),
};

export const VERSION = JSON.parse(read("package.json")).version;
