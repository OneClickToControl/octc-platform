#!/usr/bin/env node
// @1c2c/cli — umbrella CLI: agent templates + monorepo verify (ADR-0003).

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
    "  octc sync agents [--target <dir>]      agent templates (delegates to octc-agents)",
    "  octc sync governance [--only <all|doc-contract|ci>] [--cwd <dir>] [--dry-run]",
    "  octc agents init|verify|sync [...]     shorthand for octc-agents <cmd>",
    "  octc verify monorepo [--cwd <dir>]     lint .octc/monorepo.yaml vs filesystem",
    "  octc add surface <surface> [--cwd <dir>] [--dry-run] [--force]",
    "  octc sync surface <surface>|--all [--cwd <dir>] [--dry-run] [--force]",
    "  octc portfolio suggest [--cwd <dir>] [--repo <name>] [--cli-pin <x.y.z>]",
    "",
    "Examples:",
    "  npx @1c2c/cli sync agents",
    "  npx @1c2c/cli verify monorepo",
    "  npx @1c2c/cli add surface data",
    "  npx @1c2c/cli sync governance --only doc-contract",
    "  npx @1c2c/cli sync surface web --dry-run",
    "  npx @1c2c/cli portfolio suggest --repo my-product",
    "",
    "See @1c2c/agent-templates for semantics of init / verify / sync.",
    "",
    "Monorepo: https://github.com/OneClickToControl/octc-platform/blob/main/docs/adr/ADR-0003-monorepo-cli-machine-ssot.md",
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

async function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help") {
    console.log(usage());
    process.exit(argv.length === 0 ? 1 : 0);
  }

  if (argv[0] === "sync" && argv[1] === "agents") {
    forwardAgents(["sync", ...argv.slice(2)]);
    return;
  }

  if (argv[0] === "sync" && argv[1] === "governance") {
    const { runSyncGovernance } = await import("../lib/sync-governance.mjs");
    process.exit(runSyncGovernance({ argv: argv.slice(2) }));
  }

  if (argv[0] === "add" && argv[1] === "surface") {
    const { runAddSurface } = await import("../lib/add-surface.mjs");
    process.exit(runAddSurface({ argv: argv.slice(2) }));
  }

  if (argv[0] === "sync" && argv[1] === "surface") {
    const { runSyncSurface } = await import("../lib/sync-surface.mjs");
    process.exit(runSyncSurface({ argv: argv.slice(2) }));
  }

  if (argv[0] === "portfolio" && argv[1] === "suggest") {
    const { runPortfolioSuggest } = await import(
      "../lib/portfolio-suggest.mjs"
    );
    process.exit(runPortfolioSuggest({ argv: argv.slice(2) }));
  }

  if (argv[0] === "agents") {
    const sub = argv[1];
    if (sub === "init" || sub === "verify" || sub === "sync") {
      if (sub === "verify" && argv[2] === "monorepo") {
        const { runVerifyMonorepo } = await import(
          "../lib/verify-monorepo.mjs",
        );
        process.exit(runVerifyMonorepo({ argv: argv.slice(3) }));
      }
      forwardAgents(argv.slice(1));
      return;
    }
    console.error(`octc: unknown agents subcommand "${sub ?? ""}"`);
    console.error("");
    console.error(usage());
    process.exit(2);
  }

  if (argv[0] === "verify" && argv[1] === "monorepo") {
    const { runVerifyMonorepo } = await import("../lib/verify-monorepo.mjs");
    process.exit(runVerifyMonorepo({ argv: argv.slice(2) }));
  }

  console.error(`octc: unknown command "${argv[0]}"`);
  console.error("");
  console.error(usage());
  process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
