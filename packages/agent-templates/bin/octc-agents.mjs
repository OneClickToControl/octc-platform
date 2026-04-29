#!/usr/bin/env node
// octc-agents — CLI for @1c2c/agent-templates.
//
// Commands:
//   init    [--target <dir>] [--force]   scaffold canonical agent files
//   verify  [--target <dir>]              report drift vs the canonical version
//   sync    [--target <dir>]              update drifted files, preserving user blocks
//
// Output is plain text on purpose (no JSON, no frameworks).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..");

const SOURCES = [
  {
    key: "claude",
    src: join(PKG_ROOT, "templates/CLAUDE.md"),
    dest: "CLAUDE.md",
    kind: "markdown-with-blocks",
  },
  {
    key: "agents",
    src: join(PKG_ROOT, "templates/AGENTS.md"),
    dest: "AGENTS.md",
    kind: "markdown-with-blocks",
  },
  {
    key: "cursor-base",
    src: join(PKG_ROOT, "templates/cursor/00-octc-base.mdc"),
    dest: ".cursor/rules/00-octc-base.mdc",
    kind: "verbatim",
  },
  {
    key: "cursor-tooling",
    src: join(PKG_ROOT, "templates/cursor/01-octc-tooling.mdc"),
    dest: ".cursor/rules/01-octc-tooling.mdc",
    kind: "verbatim",
  },
  {
    key: "acp-schema",
    src: join(PKG_ROOT, "schemas/octc-agent-provider.manifest.v1.json"),
    dest: ".octc/agents/manifest.schema.json",
    kind: "verbatim",
  },
];

const BASE_OPEN_RE = /<!--\s*octc:base[^>]*-->/;
const BASE_CLOSE_RE = /<!--\s*octc:end-base\s*-->/;

function parseArgs(argv) {
  const out = { _: [], target: process.cwd(), force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--target") {
      out.target = resolve(argv[++i] ?? ".");
    } else if (a.startsWith("--target=")) {
      out.target = resolve(a.slice("--target=".length));
    } else if (a === "--force") {
      out.force = true;
    } else if (a === "-h" || a === "--help") {
      out.help = true;
    } else if (!a.startsWith("--")) {
      out._.push(a);
    } else {
      out._.push(a);
    }
  }
  return out;
}

function usage() {
  return [
    "octc-agents — manage @1c2c/agent-templates in a target repo",
    "",
    "Usage:",
    "  octc-agents init    [--target <dir>] [--force]",
    "  octc-agents verify  [--target <dir>]",
    "  octc-agents sync    [--target <dir>]",
    "",
    "init    Write canonical files (CLAUDE.md, AGENTS.md, .cursor/rules/*, ACP schema).",
    "        Refuses to overwrite existing files unless --force is given.",
    "verify  Compare each canonical file against the target. Exits 1 on drift.",
    "sync    Update drifted files. For files with octc:base markers, only the",
    "        base block is rewritten; user blocks are preserved.",
  ].join("\n");
}

function readCanonical(src) {
  return readFileSync(src, "utf8");
}

function readTargetMaybe(absPath) {
  if (!existsSync(absPath)) return null;
  return readFileSync(absPath, "utf8");
}

function classify(canonical, current, kind) {
  if (current === null) return "missing";
  if (current === canonical) return "same";
  if (kind === "markdown-with-blocks") {
    const canonicalBase = extractBaseBlock(canonical);
    const currentBase = extractBaseBlock(current);
    if (canonicalBase && currentBase && canonicalBase === currentBase) {
      return "same-base";
    }
  }
  return "drifted";
}

function extractBaseBlock(content) {
  const open = content.match(BASE_OPEN_RE);
  const close = content.match(BASE_CLOSE_RE);
  if (!open || !close) return null;
  const start = open.index;
  const end = close.index + close[0].length;
  if (end <= start) return null;
  return content.slice(start, end);
}

function rewriteBaseBlock(currentContent, canonicalContent) {
  const newBase = extractBaseBlock(canonicalContent);
  if (!newBase) return canonicalContent;
  const open = currentContent.match(BASE_OPEN_RE);
  const close = currentContent.match(BASE_CLOSE_RE);
  if (!open || !close) {
    return canonicalContent;
  }
  const start = open.index;
  const end = close.index + close[0].length;
  return currentContent.slice(0, start) + newBase + currentContent.slice(end);
}

function ensureParent(absPath) {
  mkdirSync(dirname(absPath), { recursive: true });
}

function commandInit(args) {
  const target = args.target;
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }
  let written = 0;
  let skipped = 0;
  for (const s of SOURCES) {
    const dest = join(target, s.dest);
    if (existsSync(dest) && !args.force) {
      console.log(`skip   ${s.dest} (exists; use --force to overwrite)`);
      skipped++;
      continue;
    }
    ensureParent(dest);
    writeFileSync(dest, readCanonical(s.src));
    console.log(`write  ${s.dest}`);
    written++;
  }
  console.log("");
  console.log(`init complete: ${written} written, ${skipped} skipped`);
  return 0;
}

function commandVerify(args) {
  const target = args.target;
  let drift = 0;
  let missing = 0;
  for (const s of SOURCES) {
    const dest = join(target, s.dest);
    const canonical = readCanonical(s.src);
    const current = readTargetMaybe(dest);
    const status = classify(canonical, current, s.kind);
    switch (status) {
      case "same":
        console.log(`same     ${s.dest}`);
        break;
      case "same-base":
        console.log(`same     ${s.dest} (base block matches; user block diverges)`);
        break;
      case "missing":
        console.log(`missing  ${s.dest}`);
        missing++;
        break;
      case "drifted":
        console.log(`drifted  ${s.dest}`);
        drift++;
        break;
      default:
        console.log(`unknown  ${s.dest}`);
        drift++;
    }
  }
  console.log("");
  if (drift === 0 && missing === 0) {
    console.log("verify: clean");
    return 0;
  }
  console.log(`verify: ${drift} drifted, ${missing} missing`);
  return 1;
}

function commandSync(args) {
  const target = args.target;
  let updated = 0;
  let unchanged = 0;
  for (const s of SOURCES) {
    const dest = join(target, s.dest);
    const canonical = readCanonical(s.src);
    const current = readTargetMaybe(dest);
    const status = classify(canonical, current, s.kind);
    if (status === "same" || status === "same-base") {
      console.log(`ok       ${s.dest}`);
      unchanged++;
      continue;
    }
    ensureParent(dest);
    if (status === "missing") {
      writeFileSync(dest, canonical);
      console.log(`create   ${s.dest}`);
      updated++;
      continue;
    }
    if (s.kind === "markdown-with-blocks") {
      const next = rewriteBaseBlock(current, canonical);
      if (next === current) {
        console.log(`ok       ${s.dest}`);
        unchanged++;
      } else {
        writeFileSync(dest, next);
        console.log(`update   ${s.dest} (base block rewritten)`);
        updated++;
      }
    } else {
      writeFileSync(dest, canonical);
      console.log(`update   ${s.dest}`);
      updated++;
    }
  }
  console.log("");
  console.log(`sync complete: ${updated} updated, ${unchanged} unchanged`);
  return 0;
}

function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  const cmd = args._[0];

  if (args.help || !cmd) {
    console.log(usage());
    return cmd ? 0 : 1;
  }

  switch (cmd) {
    case "init":
      return commandInit(args);
    case "verify":
      return commandVerify(args);
    case "sync":
      return commandSync(args);
    default:
      console.error(`octc-agents: unknown command "${cmd}"`);
      console.error("");
      console.error(usage());
      return 2;
  }
}

process.exit(main());
