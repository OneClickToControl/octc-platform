#!/usr/bin/env node
// Copies the canonical agent template assets from the monorepo SSOT
// (templates/agents/ and schemas/) into this package so they ship with
// the published tarball. Run automatically by `npm run build` and by the
// `prepack` lifecycle hook before `npm publish`.

import { mkdir, copyFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..");
const SSOT_ROOT = resolve(PKG_ROOT, "..", "..");

const COPIES = [
  {
    from: join(SSOT_ROOT, "templates/agents/CLAUDE.md"),
    to: join(PKG_ROOT, "templates/CLAUDE.md"),
  },
  {
    from: join(SSOT_ROOT, "templates/agents/AGENTS.md"),
    to: join(PKG_ROOT, "templates/AGENTS.md"),
  },
  {
    from: join(SSOT_ROOT, "schemas/octc-agent-provider.manifest.v1.json"),
    to: join(PKG_ROOT, "schemas/octc-agent-provider.manifest.v1.json"),
  },
];

const CURSOR_DIR_FROM = join(SSOT_ROOT, "templates/agents/cursor");
const CURSOR_DIR_TO = join(PKG_ROOT, "templates/cursor");

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function copyOne(from, to) {
  if (!existsSync(from)) {
    throw new Error(`SSOT source missing: ${from}`);
  }
  await ensureDir(dirname(to));
  await copyFile(from, to);
  return { from, to };
}

async function main() {
  const copied = [];

  for (const { from, to } of COPIES) {
    copied.push(await copyOne(from, to));
  }

  if (!existsSync(CURSOR_DIR_FROM)) {
    throw new Error(`SSOT cursor dir missing: ${CURSOR_DIR_FROM}`);
  }
  const entries = await readdir(CURSOR_DIR_FROM);
  for (const name of entries) {
    if (!name.endsWith(".mdc")) continue;
    const from = join(CURSOR_DIR_FROM, name);
    const s = await stat(from);
    if (!s.isFile()) continue;
    const to = join(CURSOR_DIR_TO, name);
    copied.push(await copyOne(from, to));
  }

  console.log(`@1c2c/agent-templates: synced ${copied.length} file(s) from SSOT`);
  for (const { from, to } of copied) {
    console.log(
      `  ${relative(SSOT_ROOT, from)} -> ${relative(PKG_ROOT, to)}`,
    );
  }
}

main().catch((err) => {
  console.error(`sync-from-ssot failed: ${err.message}`);
  process.exit(1);
});
