import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, isAbsolute, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { copyTemplateToRepo } from "./surface-template.mjs";

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const WORKFLOW_REL = ".github/workflows/octc-workspace-verify.yml";
const PIN_TOKEN = "__OCTC_WORKSPACE_VERIFY_PIN__";

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
 * @param {{ argv?: string[] }} [opts]
 * @returns {number}
 */
export function runInitWorkspace(opts = {}) {
  const parsed = parseArgs(opts.argv ?? []);
  if (parsed.error) {
    console.error(`octc init workspace: ${parsed.error}`);
    return 2;
  }
  const [destRel = ""] = parsed.positional;
  if (!destRel) {
    console.error(`Usage: octc init workspace <targetDir> [--force] [--pin <sha>] [--template-dir <path>]

Materializes the *-workspace tree (see WORKSPACE_LANE). Does NOT create a GitHub repo,
rulesets, secrets, or PORTFOLIO rows.

  --pin   same SHA for uses: and tooling_ref (run scripts/print-workspace-verify-callable-pin.sh in octc-platform)
  --template-dir   copy from this tree instead of the bundled template (org parity check)

Next: git init, push, org provisioning per internal runbooks.
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
    : join(PKG_ROOT, "templates", "workspace");

  if (!existsSync(templateRoot)) {
    console.error(`octc init workspace: template not found: ${templateRoot}`);
    return 2;
  }

  const { error, copied } = copyTemplateToRepo({
    templateRoot,
    cwd: targetDir,
    dryRun: false,
    force: parsed.force,
  });
  if (error) {
    console.error(`octc init workspace: ${error}`);
    return 2;
  }

  const wfPath = join(targetDir, ...WORKFLOW_REL.split("/"));
  if (existsSync(wfPath)) {
    let yml = readFileSync(wfPath, "utf8");
    if (parsed.pin) {
      yml = yml.replaceAll(PIN_TOKEN, parsed.pin);
      writeFileSync(wfPath, yml);
    } else if (yml.includes(PIN_TOKEN)) {
      console.warn(
        "octc init workspace: workflow still contains __OCTC_WORKSPACE_VERIFY_PIN__ — set --pin or edit uses:/tooling_ref to the same SHA.",
      );
    }
  }

  console.log(
    `octc init workspace: wrote ${copied.length} files under ${targetDir}`,
  );
  if (!parsed.pin) {
    console.log(
      "Hint: pin callable with octc-platform scripts/print-workspace-verify-callable-pin.sh (uses tooling_ref = same SHA).",
    );
  }
  return 0;
}
