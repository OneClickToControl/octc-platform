import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

/**
 * @param {string} templateRoot
 * @returns {string[] | null} relative paths from manifest, or null if no manifest
 */
export function readManifestRelativePaths(templateRoot) {
  const m = join(templateRoot, ".octc-manifest.txt");
  if (!existsSync(m)) return null;
  return readFileSync(m, "utf8")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => line.replace(/\\/g, "/"));
}

/**
 * @param {string} dir
 * @param {string} base
 * @param {string[]} acc
 */
function walkFiles(dir, base, acc) {
  for (const name of readdirSync(dir)) {
    if (name === ".octc-manifest.txt") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkFiles(p, base, acc);
    else acc.push(p);
  }
  return acc;
}

/**
 * Files to materialize for a surface template (manifest wins).
 * @param {string} templateRoot
 * @returns {string[]}
 */
export function listTemplateRelativePaths(templateRoot) {
  const fromManifest = readManifestRelativePaths(templateRoot);
  if (fromManifest) return fromManifest;
  const abs = [];
  walkFiles(templateRoot, templateRoot, abs);
  return abs.map((p) => {
    const rel = p.slice(templateRoot.length + 1);
    return rel.replace(/\\/g, "/");
  });
}

/**
 * @param {object} opts
 * @param {string} opts.templateRoot
 * @param {string} opts.cwd
 * @param {boolean} opts.dryRun
 * @param {boolean} opts.force
 * @returns {{ error: string | null, copied: string[] }}
 */
export function copyTemplateToRepo({
  templateRoot,
  cwd,
  dryRun,
  force,
}) {
  const rels = listTemplateRelativePaths(templateRoot);
  const blocked = [];
  for (const rel of rels) {
    const src = join(templateRoot, ...rel.split("/"));
    const dest = join(cwd, ...rel.split("/"));
    if (!existsSync(src)) continue;
    if (existsSync(dest) && !force) blocked.push(dest);
  }
  if (blocked.length) {
    return {
      error:
        "archivos ya existen; usa --force para sobrescribir:\n  " +
        blocked.join("\n  "),
      copied: [],
    };
  }
  const copied = [];
  for (const rel of rels) {
    const src = join(templateRoot, ...rel.split("/"));
    const dest = join(cwd, ...rel.split("/"));
    if (!existsSync(src)) continue;
    if (dryRun) {
      copied.push(rel);
      continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(src));
    copied.push(rel);
  }
  return { error: null, copied };
}
