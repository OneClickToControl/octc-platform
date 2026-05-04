import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { copyTemplateToRepo } from "./surface-template.mjs";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const DISPATCH_REL = ".github/workflows/octc-portfolio-dispatch.yml";
const PIN_TOKEN = "__OCTC_PORTFOLIO_DISPATCH_PIN__";

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  let force = false;
  let pin = "";
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
    if (a === "--template-dir" && argv[i + 1]) {
      templateDir = argv[++i];
      continue;
    }
    if (a.startsWith("-")) {
      return { error: `unknown option: ${a}`, force, pin, templateDir, positional };
    }
    positional.push(a);
  }
  return { error: null, force, pin, templateDir, positional };
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
    console.error(`Usage: octc init app <targetDir> [--force] [--pin <sha|ref>] [--template-dir <path>]

Scaffold for a future *-app (monorepo.yaml, portfolio dispatch workflow as files only).
Does NOT provision GitHub org, rulesets, secrets, or internal portfolio/registry.

  --pin   SHA/ref for octc-portfolio-dispatch-callable uses: line (default: main if placeholder present)

Next: create repo, run internal NEW_PRODUCT_REPO runbook for org-level steps.
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

  const wfPath = join(targetDir, ...DISPATCH_REL.split("/"));
  if (existsSync(wfPath)) {
    let yml = readFileSync(wfPath, "utf8");
    const pinVal = parsed.pin || "main";
    if (yml.includes(PIN_TOKEN)) {
      yml = yml.replaceAll(PIN_TOKEN, pinVal);
      writeFileSync(wfPath, yml);
    } else if (parsed.pin) {
      yml = yml.replace(
        /octc-portfolio-dispatch-callable\.yml@[^\s]+/,
        `octc-portfolio-dispatch-callable.yml@${parsed.pin}`,
      );
      writeFileSync(wfPath, yml);
    }
  }

  console.log(`octc init app: wrote ${copied.length} files under ${targetDir}`);
  console.log(
    "Next (human/runbook): GitHub repo, rulesets, OCTC_PORTFOLIO_DISPATCH_TOKEN, PORTFOLIO row, then pnpm install && octc verify monorepo.",
  );
  return 0;
}
