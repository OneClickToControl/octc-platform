// octc verify copy — voz comercial en repos producto (ADR pendiente; mecanismo
// portado de octc-platform-internal: factory_latam_spanish + radar_quality_gates
// forbidden_bare de ARCO365). Escanea texto visible al cliente y falla si hay
// voseo/regionalismos o jerga interna de fábrica sin traducir.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import YAML from "yaml";

const CONFIG_REL = join(".octc", "copy-voice.yaml");

// Espejo de factory_latam_spanish.py (SSOT voz: OWNER_VOICE.v1.md).
// `\b` de JS no es Unicode-aware (á no cuenta como letra), por eso lookarounds \p{L}.
const VOSEO_RE = new RegExp(
  "(?<=^|[^\\p{L}])(" +
    "decime|pod[eé]s|quer[eé]s|ten[eé]s|hacé|" +
    "completá|agregá|revisá|enviá|avanzá|reenviá|reformulá|repetí|" +
    "respondé|esperá|mapeá|llevá|leé|decí|mirá|mandá|confirmá|pegá|" +
    "llegás|fijate|che|vos" +
    ")(?=$|[^\\p{L}])",
  "iu",
);

// Jerga interna de fábrica / anglicismos prohibidos en copy al cliente.
// [regex, etiqueta, reemplazo sugerido]. La glosa «término (explicación)»,
// «término — explicación» o «término: explicación» se acepta (igual que ARCO365).
const BASE_FORBIDDEN = [
  ["\\bgovernance\\b", "governance", "control"],
  ["\\bgates?\\b", "gate", "aprobación / punto de control"],
  ["\\btiers?\\b", "tier", "nivel"],
  ["\\bowner[- ]in[- ]the[- ]loop\\b", "owner-in-the-loop", "tú apruebas cada paso"],
  ["\\bhuman[- ]in[- ]the[- ]loop\\b", "human-in-the-loop", "con aprobación humana"],
  ["\\bdog\\s?food(ing)?\\b", "dogfood", "lo usamos nosotros primero"],
  ["\\bleads?\\b", "lead", "interesados / clientes potenciales"],
  ["\\bsetup\\b", "setup", "puesta en marcha"],
  ["\\bsuccess fee\\b", "success fee", "comisión por resultados"],
  ["\\bcohortes?\\b", "cohorte", "grupo"],
  ["\\bcohorts?\\b", "cohort", "grupo"],
  ["\\bwhite[- ]label\\b", "white-label", "marca blanca"],
  ["\\bvendors?\\b", "vendor", "proveedor"],
  ["\\bstacks?\\b", "stack", "herramientas / plataforma"],
  ["\\bpitch\\b", "pitch", "presentación"],
  ["\\broadmap\\b", "roadmap", "plan / ruta"],
  ["\\bsprints?\\b", "sprint", "ciclo de trabajo"],
  ["\\bDIY\\b", "DIY", "hacerlo tú mismo"],
  ["\\bKPIs?\\b", "KPI", "indicador"],
  ["\\bmoat\\b", "moat", "ventaja defendible"],
  ["\\bwedge\\b", "wedge", "punto de entrada"],
  ["\\boutcome\\b", "outcome", "resultado"],
  ["\\bGTM\\b", "GTM", "salida al mercado"],
  ["\\baudit trail\\b", "audit trail", "registro de decisiones"],
  ["\\bpreview\\b", "preview", "vista previa"],
  ["\\blifecycle\\b", "lifecycle", "ciclo / etapas"],
];

const TEXT_EXTS = new Set([".md", ".mdx", ".txt"]);
const JSX_EXTS = new Set([".tsx", ".jsx", ".html"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build", "coverage"]);

function parseArgs(argv) {
  let cwd = process.cwd();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--cwd" && argv[i + 1]) {
      cwd = argv[++i];
      continue;
    }
    if (a === "-h" || a === "--help") return { help: true };
    return { error: `octc verify copy: opción desconocida "${a}"` };
  }
  return { cwd };
}

function loadConfig(cwd) {
  const p = join(cwd, CONFIG_REL);
  if (!existsSync(p)) return null;
  const doc = YAML.parse(readFileSync(p, "utf8"));
  return doc && typeof doc === "object" ? doc : {};
}

function ext(path) {
  const i = path.lastIndexOf(".");
  return i === -1 ? "" : path.slice(i).toLowerCase();
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else yield p;
  }
}

/** Texto visible: nodos JSX/HTML `>texto<` + literales string con prosa (≥2 palabras). */
export function extractVisibleText(source) {
  // class/className son estilo, no copy visible al cliente.
  source = source.replace(/\b(?:className|class)\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, "");
  const parts = [];
  for (const m of source.matchAll(/>([^<>{}]+)</g)) {
    const t = m[1].trim();
    if (t) parts.push(t);
  }
  for (const m of source.matchAll(/(['"`])((?:(?!\1)[^\\\n]|\\.){12,}?)\1/g)) {
    const t = m[2].trim();
    if (t.includes(" ") && !/^https?:|^mailto:|^[./]/.test(t)) parts.push(t);
  }
  return parts.join("\n");
}

function hasGloss(text, matchEnd) {
  return /^\s*(\(|—|-|:)/.test(text.slice(matchEnd, matchEnd + 4));
}

/**
 * @returns {{ ok: boolean, violations: {file: string, term: string, hint: string}[], scanned: number }}
 */
export function verifyCopyFromConfig(cwd, config) {
  const cfg = config ?? {};
  const roots = Array.isArray(cfg.paths) && cfg.paths.length ? cfg.paths : ["apps"];
  const allow = new Set(
    (Array.isArray(cfg.allow) ? cfg.allow : []).map((t) => String(t).toLowerCase()),
  );
  const extra = (Array.isArray(cfg.forbidden) ? cfg.forbidden : []).map((t) => [
    `\\b${String(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
    String(t),
    "ver .octc/copy-voice.yaml",
  ]);
  const terms = [...BASE_FORBIDDEN, ...extra].filter(
    ([, label]) => !allow.has(label.toLowerCase()),
  );

  const violations = [];
  let scanned = 0;

  for (const root of roots) {
    const abs = join(cwd, root);
    if (!existsSync(abs)) continue;
    const files = statSync(abs).isDirectory() ? [...walk(abs)] : [abs];
    for (const file of files) {
      const e = ext(file);
      if (!TEXT_EXTS.has(e) && !JSX_EXTS.has(e)) continue;
      const raw = readFileSync(file, "utf8");
      const text = JSX_EXTS.has(e) ? extractVisibleText(raw) : raw;
      if (!text) continue;
      scanned += 1;
      const rel = relative(cwd, file);

      if (VOSEO_RE.test(text)) {
        violations.push({
          file: rel,
          term: "voseo/regionalismo",
          hint: "español neutro LatAm, trato de tú (OWNER_VOICE.v1.md)",
        });
      }
      for (const [pattern, label, hint] of terms) {
        const re = new RegExp(pattern, "giu");
        for (const m of text.matchAll(re)) {
          if (hasGloss(text, m.index + m[0].length)) continue;
          violations.push({ file: rel, term: label, hint });
          break;
        }
      }
    }
  }

  return { ok: violations.length === 0, violations, scanned };
}

export function runVerifyCopy(opts = {}) {
  const parsed = parseArgs(opts.argv ?? []);
  if (parsed.error) {
    console.error(parsed.error);
    return 2;
  }
  if (parsed.help) {
    console.log(`Usage: octc verify copy [--cwd <dir>]

Valida la voz comercial del copy visible al cliente (apps/**/*.tsx|jsx|html|md):
español neutro LatAm sin voseo y sin jerga interna de fábrica (governance, gate,
tier, lead, setup, …). Lexicón base en @1c2c/cli; ajustes por repo en
.octc/copy-voice.yaml (paths / forbidden / allow). Un término con glosa
«término (explicación)» se acepta.

Mecanismo portado de los quality gates ARCO365 (octc-platform-internal).
`);
    return 0;
  }
  const { cwd } = parsed;
  const config = loadConfig(cwd);
  if (config === null) {
    console.log("octc verify copy: sin .octc/copy-voice.yaml — nada que validar (opt-in).");
    return 0;
  }
  const { ok, violations, scanned } = verifyCopyFromConfig(cwd, config);
  if (ok) {
    console.log(`octc verify copy: OK (${scanned} archivos con texto visible).`);
    return 0;
  }
  console.error(`octc verify copy: FAIL — ${violations.length} violación(es) de voz comercial:`);
  for (const v of violations.slice(0, 40)) {
    console.error(`  ${v.file}: «${v.term}» → ${v.hint}`);
  }
  if (violations.length > 40) console.error(`  … +${violations.length - 40} más`);
  return 1;
}
