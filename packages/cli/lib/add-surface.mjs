import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALLOWED_SURFACES } from "./constants.mjs";

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

const GENERIC_BOOTSTRAP = (surface) => `# Bootstrap — superficie \`${surface}\`

Generado por \`octc add surface ${surface}\`. Completar según [REFERENCE_PRODUCT_MONOREPO](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/REFERENCE_PRODUCT_MONOREPO.md) y \`docs/architecture.md\`.

- Actualizar **\`active_surfaces\`**, **\`.octc/monorepo.yaml\`** (si aplica) y **PORTFOLIO** (\`repo_surfaces\`) en el mismo PR estructural.
- Añadir jobs CI \`paths:\` y observabilidad **octc-{producto}-${surface}** cuando corresponda.
`;

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
  --force     sobrescribe stubs existentes (data: re-copiar plantilla)

Plantillas versionadas en el paquete; no crea proyectos cloud ni RLS (ver ADR-0003).
`);
    return 2;
  }
  if (!ALLOWED_SURFACES.has(surface)) {
    console.error(`octc add surface: superficie desconocida "${surface}"`);
    return 2;
  }

  const { cwd, dryRun, force } = parsed;

  if (surface === "data") {
    const src = join(PKG_ROOT, "templates/surfaces/data");
    if (!existsSync(src)) {
      console.error(`octc add surface: falta plantilla empaquetada ${src}`);
      return 2;
    }
    const markers = [
      join(cwd, "supabase", "README.md"),
      join(cwd, "docs", "db", "README.md"),
    ];
    const blocked = markers.filter((p) => existsSync(p));
    if (blocked.length && !force) {
      console.error(
        "octc add surface data: ya existen stubs; usa --force para sobrescribir:\n  " +
          blocked.join("\n  "),
      );
      return 2;
    }
    if (dryRun) {
      console.log(`[dry-run] copiaría plantilla data: ${src} -> ${cwd}`);
      return 0;
    }
    cpSync(src, cwd, { recursive: true });
    console.log("octc add surface data: OK (supabase/README.md, docs/db/README.md)");
    return 0;
  }

  const docDir = join(cwd, "docs", "ops");
  const dest = join(docDir, `octc-surface-${surface}-bootstrap.md`);
  if (existsSync(dest) && !force) {
    console.error(
      `octc add surface: ya existe ${dest}; usa --force para sobrescribir`,
    );
    return 2;
  }
  if (dryRun) {
    console.log(`[dry-run] crearía ${dest}`);
    return 0;
  }
  mkdirSync(docDir, { recursive: true });
  writeFileSync(dest, GENERIC_BOOTSTRAP(surface), "utf8");
  console.log(`octc add surface: OK (${dest})`);
  return 0;
}
