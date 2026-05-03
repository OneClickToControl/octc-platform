import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { ALLOWED_SURFACES } from "./constants.mjs";
import { copyTemplateToRepo } from "./surface-template.mjs";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  let cwd = process.cwd();
  let dryRun = false;
  let force = false;
  let all = false;
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--cwd" && argv[i + 1]) {
      cwd = argv[++i];
      continue;
    }
    if (a === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (a === "--force") {
      force = true;
      continue;
    }
    if (a === "--all") {
      all = true;
      continue;
    }
    if (a.startsWith("-")) {
      return {
        error: `octc sync surface: opción desconocida "${a}"`,
        cwd,
        dryRun,
        force,
        all,
        positional,
      };
    }
    positional.push(a);
  }
  return { cwd, dryRun, force, all, positional, error: null };
}

function syncOne(surface, cwd, dryRun, force) {
  const templateRoot = join(PKG_ROOT, "templates", "surfaces", surface);
  if (!existsSync(templateRoot)) {
    return {
      code: 2,
      msg: `octc sync surface: falta plantilla ${templateRoot}`,
    };
  }
  const { error, copied } = copyTemplateToRepo({
    templateRoot,
    cwd,
    dryRun,
    force,
  });
  if (error) {
    return { code: 2, msg: `octc sync surface ${surface}: ${error}` };
  }
  if (dryRun) {
    console.log(
      `[dry-run] superficie ${surface}: ${copied.length} archivo(s)`,
    );
    for (const r of copied) console.log(`  ${r}`);
  } else {
    console.log(
      `octc sync surface ${surface}: OK (${copied.length} archivo(s))`,
    );
  }
  return { code: 0, msg: null };
}

/**
 * @param {{ argv?: string[] }} [opts]
 * @returns {number}
 */
export function runSyncSurface(opts = {}) {
  const parsed = parseArgs(opts.argv ?? []);
  if (parsed.error) {
    console.error(parsed.error);
    return 2;
  }
  const { cwd, dryRun, force, all, positional } = parsed;

  if (all) {
    if (positional.length > 0) {
      console.error("octc sync surface: no mezcles positional con --all");
      return 2;
    }
    let exit = 0;
    for (const surface of [...ALLOWED_SURFACES].sort()) {
      const r = syncOne(surface, cwd, dryRun, force);
      if (r.code !== 0) {
        console.error(r.msg);
        exit = r.code;
      }
    }
    return exit;
  }

  const surface = positional[0];
  if (positional.length !== 1 || !surface) {
    console.error(`Usage: octc sync surface <surface>|--all [--cwd <dir>] [--dry-run] [--force]

Superficies: ${[...ALLOWED_SURFACES].sort().join(", ")}

  --all       sincroniza todas las superficies con plantilla en el paquete
  --dry-run   no escribe archivos
  --force     sobrescribe archivos existentes
`);
    return 2;
  }
  if (!ALLOWED_SURFACES.has(surface)) {
    console.error(`octc sync surface: superficie desconocida "${surface}"`);
    return 2;
  }
  const r = syncOne(surface, cwd, dryRun, force);
  if (r.msg && r.code !== 0) console.error(r.msg);
  return r.code;
}
