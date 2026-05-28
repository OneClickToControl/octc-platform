import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join, isAbsolute, resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { copyTemplateToRepo } from "./surface-template.mjs";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PRODUCT_TOKEN = "__PRODUCT__";

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  let force = false;
  let product = "";
  let templateDir = "";
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") {
      force = true;
      continue;
    }
    if (a === "--product" && argv[i + 1]) {
      product = argv[++i];
      continue;
    }
    if (a === "--template-dir" && argv[i + 1]) {
      templateDir = argv[++i];
      continue;
    }
    if (a.startsWith("-")) {
      return { error: `unknown option: ${a}`, force, product, templateDir, positional };
    }
    positional.push(a);
  }
  return { error: null, force, product, templateDir, positional };
}

/**
 * @param {string} dir
 */
function replaceProductToken(dir, product) {
  const walk = (p) => {
    for (const name of readdirSync(p, { withFileTypes: true })) {
      const full = join(p, name.name);
      if (name.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(md|json|yml|yaml|mjs)$/i.test(name.name)) {
        continue;
      }
      const raw = readFileSync(full, "utf8");
      if (raw.includes(PRODUCT_TOKEN)) {
        writeFileSync(full, raw.replaceAll(PRODUCT_TOKEN, product));
      }
    }
  };
  walk(dir);
}

/**
 * @param {string} targetDir
 * @param {string} product
 */
function renameAcpDir(targetDir, product) {
  const oldDir = join(targetDir, "agents", `${PRODUCT_TOKEN}-acp`);
  const newDir = join(targetDir, "agents", `${product}-acp`);
  if (existsSync(oldDir)) {
    renameSync(oldDir, newDir);
    return;
  }
  const legacy = join(targetDir, "agents", `${product}-acp`);
  if (!existsSync(legacy)) {
    throw new Error(`missing agents/${product}-acp after template copy`);
  }
}

/**
 * @param {string} targetDir
 * @param {string} product
 */
function personalizePackageJson(targetDir, product) {
  const pkgPath = join(targetDir, "package.json");
  if (!existsSync(pkgPath)) {
    return;
  }
  const folder = basename(targetDir);
  const pkgName = folder.endsWith("-agents") ? folder : `${product}-agents`;
  const raw = readFileSync(pkgPath, "utf8");
  writeFileSync(
    pkgPath,
    raw
      .replace(/"name"\s*:\s*"[^"]+-agents"/, `"name": "${pkgName}"`)
      .replaceAll(PRODUCT_TOKEN, product),
  );
}

/**
 * Public-safe *-agents scaffold (ACP manifest + OCTC npm shell).
 *
 * @param {{ argv?: string[] }} [opts]
 * @returns {number}
 */
export function runInitAgents(opts = {}) {
  const parsed = parseArgs(opts.argv ?? []);
  if (parsed.error) {
    console.error(`octc init agents: ${parsed.error}`);
    return 2;
  }
  const [destRel = ""] = parsed.positional;
  if (!destRel || !parsed.product) {
    console.error(`Usage: octc init agents <targetDir> --product <slug> [--force] [--template-dir <path>]

Scaffold for *-agents (@1c2c/cli + @1c2c/agent-templates, ACP manifest, CI octc-agents).
Does NOT provision GitHub org, ACP allowlist, or dispatch secrets.

  --product   lowercase slug (health, store) — replaces __PRODUCT__ in template

Next: pnpm install && pnpm run octc:agents:verify; internal ACP_DISPATCH_SETUP.md.
`);
    return 2;
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(parsed.product)) {
    console.error(`octc init agents: invalid --product slug: ${parsed.product}`);
    return 2;
  }

  const targetDir = isAbsolute(destRel)
    ? resolve(destRel)
    : resolve(process.cwd(), destRel);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const templateRoot = parsed.templateDir
    ? isAbsolute(parsed.templateDir)
      ? resolve(parsed.templateDir)
      : resolve(process.cwd(), parsed.templateDir)
    : join(PKG_ROOT, "templates", "agents");

  if (!existsSync(templateRoot)) {
    console.error(`octc init agents: template not found: ${templateRoot}`);
    return 2;
  }

  const { error, copied } = copyTemplateToRepo({
    templateRoot,
    cwd: targetDir,
    dryRun: false,
    force: parsed.force,
  });
  if (error) {
    console.error(`octc init agents: ${error}`);
    return 2;
  }

  try {
    renameAcpDir(targetDir, parsed.product);
    replaceProductToken(targetDir, parsed.product);
    personalizePackageJson(targetDir, parsed.product);
  } catch (e) {
    console.error(`octc init agents: ${e.message}`);
    return 2;
  }

  console.log(
    `octc init agents: wrote ${copied.length} files under ${targetDir} (product=${parsed.product})`,
  );
  console.log(
    "Next: pnpm install && pnpm run octc:agents:verify; pin octc-acp-* workflows; ACP allowlist — internal ACP_DISPATCH_SETUP.md.",
  );
  return 0;
}
