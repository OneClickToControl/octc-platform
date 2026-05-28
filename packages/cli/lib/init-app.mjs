import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, isAbsolute, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { copyTemplateToRepo } from "./surface-template.mjs";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const PORTFOLIO_PIN_TOKEN = "__OCTC_PORTFOLIO_DISPATCH_PIN__";
const FACTORY_OAO_PIN_TOKEN = "__OCTC_FACTORY_OAO_NOTIFY_PIN__";

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  let force = false;
  let pin = "";
  let portfolioPin = "";
  let factoryOaoPin = "";
  let templateDir = "";
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") {
      force = true;
      continue;
    }
    if (a === "--pin" && argv[i + 1]) {
      pin = argv[++i];
      continue;
    }
    if (a === "--portfolio-pin" && argv[i + 1]) {
      portfolioPin = argv[++i];
      continue;
    }
    if (a === "--factory-oao-pin" && argv[i + 1]) {
      factoryOaoPin = argv[++i];
      continue;
    }
    if (a === "--template-dir" && argv[i + 1]) {
      templateDir = argv[++i];
      continue;
    }
    if (a.startsWith("-")) {
      return {
        error: `unknown option: ${a}`,
        force,
        pin,
        portfolioPin,
        factoryOaoPin,
        templateDir,
        positional,
      };
    }
    positional.push(a);
  }
  return { error: null, force, pin, portfolioPin, factoryOaoPin, templateDir, positional };
}

/**
 * @param {string} targetDir
 * @param {{ portfolioPin: string; factoryOaoPin: string }} pins
 */
function applyWorkflowPins(targetDir, pins) {
  const wfDir = join(targetDir, ".github", "workflows");
  if (!existsSync(wfDir)) {
    return;
  }
  for (const name of readdirSync(wfDir)) {
    if (!name.endsWith(".yml") && !name.endsWith(".yaml")) {
      continue;
    }
    const wfPath = join(wfDir, name);
    let yml = readFileSync(wfPath, "utf8");
    let changed = false;
    if (pins.portfolioPin && yml.includes(PORTFOLIO_PIN_TOKEN)) {
      yml = yml.replaceAll(PORTFOLIO_PIN_TOKEN, pins.portfolioPin);
      changed = true;
    }
    if (pins.factoryOaoPin && yml.includes(FACTORY_OAO_PIN_TOKEN)) {
      yml = yml.replaceAll(FACTORY_OAO_PIN_TOKEN, pins.factoryOaoPin);
      changed = true;
    }
    if (pins.portfolioPin) {
      const next = yml.replace(
        /octc-portfolio-dispatch-callable\.yml@[^\s]+/g,
        `octc-portfolio-dispatch-callable.yml@${pins.portfolioPin}`,
      );
      if (next !== yml) {
        yml = next;
        changed = true;
      }
    }
    if (pins.factoryOaoPin) {
      const next = yml.replace(
        /octc-factory-oao-notify-callable\.yml@[^\s]+/g,
        `octc-factory-oao-notify-callable.yml@${pins.factoryOaoPin}`,
      );
      if (next !== yml) {
        yml = next;
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(wfPath, yml);
    }
  }
}

/**
 * @param {string} targetDir
 */
function personalizePackageJson(targetDir) {
  const pkgPath = join(targetDir, "package.json");
  if (!existsSync(pkgPath)) {
    return;
  }
  const folder = basename(targetDir);
  const pkgName = folder.endsWith("-app") ? folder : `${folder}-app`;
  const raw = readFileSync(pkgPath, "utf8");
  writeFileSync(
    pkgPath,
    raw.replace(/"name"\s*:\s*"octc-product-app"/, `"name": "${pkgName}"`),
  );
}

/**
 * Public-safe *-app scaffold only (files on disk). Does NOT create GitHub repo,
 * rulesets, org secrets, or PORTFOLIO rows.
 *
 * @param {{ argv?: string[] }} [opts]
 * @returns {number}
 */
export function runInitApp(opts = {}) {
  const parsed = parseArgs(opts.argv ?? []);
  if (parsed.error) {
    console.error(`octc init app: ${parsed.error}`);
    return 2;
  }
  const [destRel = ""] = parsed.positional;
  if (!destRel) {
    console.error(`Usage: octc init app <targetDir> [--force] [--pin <sha|ref>] [--portfolio-pin <sha>] [--factory-oao-pin <sha>] [--template-dir <path>]

Scaffold for a future *-app (@1c2c/cli shell, monorepo.yaml, OCTC workflows).
Does NOT provision GitHub org, rulesets, secrets, or internal portfolio/registry.

  --pin              shorthand for both portfolio and factory-oao callable pins (default: main)
  --portfolio-pin    octc-portfolio-dispatch-callable @ref
  --factory-oao-pin  octc-factory-oao-notify-callable @ref

Next: pnpm install && pnpm exec octc verify monorepo; internal NEW_PRODUCT_REPO for org steps.
`);
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
    : join(PKG_ROOT, "templates", "product");

  if (!existsSync(templateRoot)) {
    console.error(`octc init app: template not found: ${templateRoot}`);
    return 2;
  }

  const { error, copied } = copyTemplateToRepo({
    templateRoot,
    cwd: targetDir,
    dryRun: false,
    force: parsed.force,
  });
  if (error) {
    console.error(`octc init app: ${error}`);
    return 2;
  }

  const defaultPin = parsed.pin || "main";
  const portfolioPin = parsed.portfolioPin || defaultPin;
  const factoryOaoPin = parsed.factoryOaoPin || defaultPin;
  applyWorkflowPins(targetDir, { portfolioPin, factoryOaoPin });
  personalizePackageJson(targetDir);

  console.log(`octc init app: wrote ${copied.length} files under ${targetDir}`);
  console.log(
    "Next: pnpm install && pnpm exec octc verify monorepo; GitHub — rulesets, OCTC_PORTFOLIO_DISPATCH_TOKEN, PORTFOLIO row (internal NEW_PRODUCT_REPO).",
  );
  return 0;
}
