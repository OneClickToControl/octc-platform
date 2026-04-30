import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function parseArgs(argv) {
  let cwd = process.cwd();
  let repo = process.env.OCTC_PORTFOLIO_REPO ?? "REPO_NAME";
  let cliPin = process.env.OCTC_PORTFOLIO_CLI_PIN ?? "0.3.0";

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--cwd" && argv[i + 1]) {
      cwd = argv[++i];
      continue;
    }
    if (a === "--repo" && argv[i + 1]) {
      repo = argv[++i];
      continue;
    }
    if (a === "--cli-pin" && argv[i + 1]) {
      cliPin = argv[++i];
      continue;
    }
    if (a === "-h" || a === "--help") {
      return { help: true };
    }
    if (a.startsWith("-")) {
      return { error: `octc portfolio suggest: opción desconocida "${a}"` };
    }
    return { error: "octc portfolio suggest: argumentos inesperados" };
  }
  return { cwd, repo, cliPin };
}

function normalizeCsv(s) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .join(",");
}

/**
 * @param {{ argv?: string[] }} [opts]
 * @returns {number}
 */
export function runPortfolioSuggest(opts = {}) {
  const parsed = parseArgs(opts.argv ?? []);
  if (parsed.help) {
    console.log(`Usage: octc portfolio suggest [--cwd <dir>] [--repo <name>] [--cli-pin <x.y.z>]

Lee .octc/monorepo.yaml y emite fragmentos para pegar en octc-platform-internal docs/PORTFOLIO.md.
Sin acceso a GitHub: no abre PRs. Ver:
https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/PORTFOLIO_BRIDGE.md

Variables de entorno opcionales: OCTC_PORTFOLIO_REPO, OCTC_PORTFOLIO_CLI_PIN.
`);
    return 0;
  }
  if (parsed.error) {
    console.error(parsed.error);
    return 2;
  }

  const { cwd, repo, cliPin } = parsed;
  const configPath = join(cwd, ".octc", "monorepo.yaml");
  if (!existsSync(configPath)) {
    console.error(
      `octc portfolio suggest: no existe ${join(".octc", "monorepo.yaml")}\n` +
        "  Crea el manifiesto o pasa --cwd a la raíz del repo.",
    );
    return 2;
  }
  let doc;
  try {
    doc = YAML.parse(readFileSync(configPath, "utf8"));
  } catch (e) {
    console.error(`octc portfolio suggest: YAML inválido: ${e.message}`);
    return 2;
  }
  if (!isPlainObject(doc) || !Array.isArray(doc.active_surfaces)) {
    console.error("octc portfolio suggest: active_surfaces ausente o inválido");
    return 2;
  }
  const surfaces = doc.active_surfaces.filter(
    (s) => typeof s === "string" && s.trim(),
  );
  const csv = normalizeCsv(surfaces.join(","));

  console.log(`# --- Fragmentos sugeridos (revisar tipo/owner/notas antes de pegar) ---
# repo=${repo}  octc_cli_pin=${cliPin}  repo_surfaces=${csv}

portfolio:
  repo_surfaces_csv: "${csv}"

# Fila tabular (completar columnas TBD: type, owner, data_sensitivity, agent_templates_pin, …):
# | ${repo} | product | @1click2control | … | ${cliPin} | … | … | … | … | ${csv} | … |
`);
  return 0;
}
