import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  let cwd = process.cwd();
  let only = "all";
  let dryRun = false;
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--cwd" && argv[i + 1]) {
      cwd = argv[++i];
      continue;
    }
    if (a === "--only" && argv[i + 1]) {
      only = argv[++i];
      continue;
    }
    if (a === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (a === "-h" || a === "--help") {
      return { help: true };
    }
    if (a.startsWith("-")) {
      return { error: `octc sync governance: opción desconocida "${a}"` };
    }
    rest.push(a);
  }
  if (rest.length > 0) {
    return { error: "octc sync governance: argumentos inesperados" };
  }
  return { cwd, only, dryRun };
}

/**
 * @param {{ argv?: string[] }} [opts]
 * @returns {number}
 */
export function runSyncGovernance(opts = {}) {
  const parsed = parseArgs(opts.argv ?? []);
  if (parsed.error) {
    console.error(parsed.error);
    return 2;
  }
  if (parsed.help) {
    console.log(`Usage: octc sync governance [--cwd <dir>] [--only all|doc-contract|ci] [--dry-run]

Copia plantillas governance empaquetadas en @1c2c/cli hacia <cwd>/templates/governance/.

  doc-contract — contrato doc para repos ACP (ver templates/governance/doc-contract en octc-platform)
  ci           — snippet CI consumidor OCTC
`);
    return 0;
  }
  const { cwd, only, dryRun } = parsed;
  if (!["all", "doc-contract", "ci"].includes(only)) {
    console.error(
      'octc sync governance: --only debe ser "all", "doc-contract" o "ci"',
    );
    return 2;
  }

  /** @type {readonly [string, string][]} */
  const pairs = [];
  if (only === "all" || only === "doc-contract") {
    pairs.push([
      "doc-contract",
      join(PKG_ROOT, "templates/governance/doc-contract"),
    ]);
  }
  if (only === "all" || only === "ci") {
    pairs.push(["ci", join(PKG_ROOT, "templates/governance/ci")]);
  }

  for (const [name, src] of pairs) {
    if (!existsSync(src)) {
      console.error(`octc sync governance: falta plantilla ${src}`);
      return 2;
    }
    const dest = join(cwd, "templates", "governance", name);
    if (dryRun) {
      console.log(`[dry-run] copiaría ${name}: ${src} -> ${dest}`);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest, { recursive: true });
    console.log(`octc sync governance: copied ${name} -> ${dest}`);
  }

  return 0;
}
