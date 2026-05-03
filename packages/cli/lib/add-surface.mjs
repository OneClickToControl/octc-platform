import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { ALLOWED_SURFACES } from "./constants.mjs";
import { copyTemplateToRepo } from "./surface-template.mjs";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseCommon(argv) {
  let cwd = process.cwd();
  let dryRun = false;
  let force = false;
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
    if (a.startsWith("-")) {
      return {
        error: `octc add surface: opción desconocida "${a}"`,
        cwd,
        dryRun,
        force,
        positional,
      };
    }
    positional.push(a);
  }
  return { cwd, dryRun, force, positional, error: null };
}

/**
 * @param {{ argv?: string[] }} [opts]
 * @returns {number}
 */
export function runAddSurface(opts = {}) {
  const parsed = parseCommon(opts.argv ?? []);
  if (parsed.error) {
    console.error(parsed.error);
    return 2;
  }
  const surface = parsed.positional[0];
  if (parsed.positional.length !== 1 || !surface) {
    console.error(`Usage: octc add surface <surface> [--cwd <dir>] [--dry-run] [--force]

Superficies: ${[...ALLOWED_SURFACES].sort().join(", ")}

  --dry-run   no escribe archivos
  --force     sobrescribe stubs existentes

Plantillas en el paquete (ADR-0003). Ver también: octc sync surface.
`);
    return 2;
  }
  if (!ALLOWED_SURFACES.has(surface)) {
    console.error(`octc add surface: superficie desconocida "${surface}"`);
    return 2;
  }

  const { cwd, dryRun, force } = parsed;
  const templateRoot = join(PKG_ROOT, "templates", "surfaces", surface);
  if (!existsSync(templateRoot)) {
    console.error(`octc add surface: falta plantilla ${templateRoot}`);
    return 2;
  }

  const { error, copied } = copyTemplateToRepo({
    templateRoot,
    cwd,
    dryRun,
    force,
  });

  if (error) {
    console.error(`octc add surface: ${error}`);
    return 2;
  }
  if (dryRun) {
    console.log(
      `[dry-run] copiaría ${copied.length} archivo(s) para superficie ${surface}`,
    );
    for (const r of copied) console.log(`  ${r}`);
    return 0;
  }
  console.log(
    `octc add surface ${surface}: OK (${copied.length} archivo(s): ${copied.join(", ")})`,
  );
  return 0;
}
