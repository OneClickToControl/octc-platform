#!/usr/bin/env node
// @1c2c/cli — umbrella CLI (MVP: delegate agent template sync to octc-agents).

import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

function resolveAgentsBin() {
  try {
    const entry = require.resolve("@1c2c/agent-templates");
    return join(dirname(entry), "bin/octc-agents.mjs");
  } catch {
    console.error(
      "octc: missing dependency @1c2c/agent-templates. Install with:\n" +
        "  pnpm add -D @1c2c/cli\n" +
        "or\n" +
        "  npm install -D @1c2c/cli",
    );
    process.exit(1);
  }
}

function usage() {
  return [
    "octc — OneClickToControl platform CLI",
    "",
    "Usage:",
    "  octc sync agents [--target <dir>]     update agent templates (delegates to octc-agents sync)",
    "  octc agents init|verify|sync [...]   shorthand for octc-agents <cmd>",
    "",
    "Examples:",
    "  npx @1c2c/cli sync agents",
    "  npx @1c2c/cli sync agents --target ./my-repo",
    "",
    "Future: octc sync governance … (governance templates from octc-platform).",
    "",
    "See @1c2c/agent-templates for semantics of init / verify / sync.",
  ].join("\n");
}

/**
 * Forward argv to octc-agents (first arg must be init|verify|sync).
 * @param {string[]} agentArgs
 */
function forwardAgents(agentArgs) {
  const bin = resolveAgentsBin();
  const proc = spawnSync(process.execPath, [bin, ...agentArgs], {
    stdio: "inherit",
  });
  if (proc.error) {
    console.error(proc.error.message);
    process.exit(1);
  }
  process.exit(proc.status === null ? 1 : proc.status);
}

function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help") {
    console.log(usage());
    process.exit(argv.length === 0 ? 1 : 0);
  }

  if (argv[0] === "sync" && argv[1] === "agents") {
    forwardAgents(["sync", ...argv.slice(2)]);
    return;
  }

  if (argv[0] === "agents") {
    const sub = argv[1];
    if (sub === "init" || sub === "verify" || sub === "sync") {
      forwardAgents(argv.slice(1));
      return;
    }
    console.error(`octc: unknown agents subcommand "${sub ?? ""}"`);
    console.error("");
    console.error(usage());
    process.exit(2);
  }

  console.error(`octc: unknown command "${argv[0]}"`);
  console.error("");
  console.error(usage());
  process.exit(2);
}

main();
