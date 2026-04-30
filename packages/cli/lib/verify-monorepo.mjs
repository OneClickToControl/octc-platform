import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import fg from "fast-glob";
import YAML from "yaml";
import {
  ALLOWED_SURFACES,
  DEFAULT_PATH_GLOBS,
} from "./constants.mjs";

const CONFIG_REL = join(".octc", "monorepo.yaml");

function parseArgs(argv) {
  let cwd = process.cwd();
  const out = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--cwd" && argv[i + 1]) {
      cwd = resolve(argv[++i]);
      continue;
    }
    out.push(argv[i]);
  }
  return { cwd, rest: out };
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * @param {unknown} doc
 * @returns {{ errors: string[], warnings: string[], config: object | null }}
 */
function validateSchema(doc) {
  const errors = [];
  const warnings = [];

  if (doc == null) {
    errors.push("monorepo.yaml: documento vacío o ausente");
    return { errors, warnings, config: null };
  }

  if (!isPlainObject(doc)) {
    errors.push("monorepo.yaml: la raíz debe ser un objeto");
    return { errors, warnings, config: null };
  }

  let schemaVersion = doc.schema_version;
  if (schemaVersion === undefined) {
    warnings.push(
      "monorepo.yaml: falta schema_version; se asume 0 (ADR-0003 v0)",
    );
    schemaVersion = 0;
  }
  if (typeof schemaVersion !== "number" || !Number.isInteger(schemaVersion)) {
    errors.push("monorepo.yaml: schema_version debe ser un entero");
  } else if (schemaVersion !== 0) {
    warnings.push(
      `monorepo.yaml: schema_version ${schemaVersion} no probado con esta versión de @1c2c/cli (soportado: 0)`,
    );
  }

  const surfaces = doc.active_surfaces;
  if (!Array.isArray(surfaces) || surfaces.length === 0) {
    errors.push(
      "monorepo.yaml: active_surfaces debe ser una lista no vacía",
    );
  } else {
    const seen = new Set();
    for (const s of surfaces) {
      if (typeof s !== "string" || !s.trim()) {
        errors.push(
          "monorepo.yaml: cada active_surfaces debe ser string no vacío",
        );
        continue;
      }
      if (!ALLOWED_SURFACES.has(s)) {
        errors.push(
          `monorepo.yaml: superficie desconocida "${s}" (vocabulario: ${[...ALLOWED_SURFACES].sort().join(", ")})`,
        );
      }
      if (seen.has(s)) {
        errors.push(`monorepo.yaml: active_surfaces duplicada "${s}"`);
      }
      seen.add(s);
    }
  }

  if (doc.paths !== undefined) {
    if (!isPlainObject(doc.paths)) {
      errors.push(
        "monorepo.yaml: paths debe ser un objeto (mapa superficie → lista de globs)",
      );
    } else {
      for (const [k, v] of Object.entries(doc.paths)) {
        if (!ALLOWED_SURFACES.has(k)) {
          warnings.push(
            `monorepo.yaml: paths tiene clave "${k}" que no es superficie canónica`,
          );
        }
        if (
          !Array.isArray(v) ||
          !v.every((x) => typeof x === "string" && x.trim())
        ) {
          errors.push(
            `monorepo.yaml: paths.${k} debe ser lista de strings no vacíos`,
          );
        }
      }
    }
  }

  if (doc.portfolio !== undefined) {
    if (!isPlainObject(doc.portfolio)) {
      errors.push("monorepo.yaml: portfolio debe ser un objeto");
    } else if (
      doc.portfolio.repo_surfaces_csv !== undefined &&
      typeof doc.portfolio.repo_surfaces_csv !== "string"
    ) {
      errors.push("monorepo.yaml: portfolio.repo_surfaces_csv debe ser string");
    }
  }

  return { errors, warnings, config: errors.length ? null : doc };
}

function normalizeCsv(s) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .join(",");
}

/**
 * @param {string} root
 * @param {string[]} patterns
 * @returns {boolean}
 */
function anyGlobMatches(root, patterns) {
  for (const pattern of patterns) {
    const hits = fg.sync(pattern, {
      cwd: root,
      onlyFiles: false,
      dot: true,
      suppressErrors: true,
    });
    if (hits.length > 0) return true;
  }
  return false;
}

function verifyPaths(root, config) {
  const errors = [];
  const surfaces = config.active_surfaces;
  const customPaths = isPlainObject(config.paths) ? config.paths : {};

  for (const surface of surfaces) {
    if (surface === "data") {
      const supabase = join(root, "supabase");
      if (!existsSync(supabase) || !isDir(supabase)) {
        errors.push(
          "verify: superficie `data` declarada pero no existe directorio supabase/",
        );
      }
      continue;
    }

    const globs =
      Array.isArray(customPaths[surface]) && customPaths[surface].length > 0
        ? customPaths[surface]
        : DEFAULT_PATH_GLOBS[surface];

    if (!globs || globs.length === 0) {
      errors.push(
        `verify: superficie "${surface}" sin paths en YAML y sin convención por defecto; añade paths.${surface}`,
      );
      continue;
    }

    if (!anyGlobMatches(root, globs)) {
      errors.push(
        `verify: superficie "${surface}" no cumple ningún glob: ${globs.join(" | ")}`,
      );
    }
  }

  if (
    isPlainObject(config.portfolio) &&
    typeof config.portfolio.repo_surfaces_csv === "string"
  ) {
    const fromYaml = normalizeCsv(surfaces.join(","));
    const fromPortfolio = normalizeCsv(config.portfolio.repo_surfaces_csv);
    if (fromYaml !== fromPortfolio) {
      errors.push(
        `verify: portfolio.repo_surfaces_csv "${fromPortfolio}" no coincide con active_surfaces (${fromYaml})`,
      );
    }
  }

  return errors;
}

export function verifyMonorepoFromConfig(root, config) {
  const { errors: schemaErrors, warnings, config: valid } =
    validateSchema(config);
  if (!valid) {
    return { ok: false, errors: schemaErrors, warnings };
  }
  const pathErrors = verifyPaths(root, valid);
  const errors = [...schemaErrors, ...pathErrors];
  return { ok: errors.length === 0, errors, warnings };
}

/**
 * @param {{ cwd?: string, argv?: string[] }} [opts]
 * @returns {number} exit code
 */
export function runVerifyMonorepo(opts = {}) {
  const { cwd: cwdOpt, rest } = parseArgs(opts.argv ?? []);
  const root = cwdOpt;

  if (rest.length > 0 && (rest[0] === "-h" || rest[0] === "--help")) {
    console.log(`Usage: octc verify monorepo [--cwd <dir>]

Comprueba .octc/monorepo.yaml (ADR-0003 v0): schema, active_surfaces, globs y reglas mínimas.
Plantilla: https://github.com/OneClickToControl/octc-platform/blob/main/templates/monorepo/monorepo.yaml.example
`);
    return 0;
  }

  if (rest.length > 0) {
    console.error("octc verify monorepo: argumentos inesperados");
    return 2;
  }

  const configPath = join(root, CONFIG_REL);
  if (!existsSync(configPath)) {
    console.error(
      `octc verify monorepo: no existe ${CONFIG_REL}\n` +
        "  Crea el archivo desde la plantilla en octc-platform: templates/monorepo/monorepo.yaml.example",
    );
    return 2;
  }

  let raw;
  try {
    raw = readFileSync(configPath, "utf8");
  } catch (e) {
    console.error(
      `octc verify monorepo: no se pudo leer ${CONFIG_REL}: ${e.message}`,
    );
    return 2;
  }

  let doc;
  try {
    doc = YAML.parse(raw);
  } catch (e) {
    console.error(`octc verify monorepo: YAML inválido: ${e.message}`);
    return 2;
  }

  const { ok, errors, warnings } = verifyMonorepoFromConfig(root, doc);

  for (const w of warnings) {
    console.warn(`warning: ${w}`);
  }
  if (!ok) {
    for (const err of errors) {
      console.error(`error: ${err}`);
    }
    console.error(`\noctc verify monorepo: ${errors.length} error(s)`);
    return 1;
  }

  console.log("octc verify monorepo: OK");
  return 0;
}
