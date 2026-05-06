# OCTC `*-workspace` lane

Repositories with the **`*-workspace`** suffix hold **identity, memory, notes, working channels, and restore/bootstrap procedures**. They are not product monorepos and do not carry the OCTC surface contract.

## Repository families (summary)

| Lane | Contract / primary automation |
|------|------------------------------|
| **`*-app`** | `.octc/monorepo.yaml`, `octc verify monorepo`, `octc add surface`, `octc sync surface`, portfolio dispatch from the monorepo. See [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md). |
| **`*-agents`** | ACP manifest (`agents/<id>/manifest.json`), `octc sync agents` as the usual baseline, schema validation, ACP dispatch → internal registry. See [ADR-0002 — ACP](../adr/ADR-0002-acp-pattern.md). |
| **`*-workspace`** | No `/.octc/monorepo.yaml`. Pointers to canonical truth in `*-agents`; **do not** replace agent policy with long local copies without a PR in `*-agents`. |

Machine-readable articulation with the monorepo: [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md).

## Using `@1c2c/cli` (`octc`) in `*-workspace`

- **`octc verify monorepo`**, **`octc add surface`**, **`octc sync surface`**, and **`octc portfolio suggest`** target **`*-app`** repos with `.octc/monorepo.yaml`. **Do not** use them in a workspace repo; do not add `monorepo.yaml` just to pass verify.
- **`octc sync agents`** and **`octc sync governance`** may be **optional** if the product adopts `package.json`, `@1c2c/cli`, and a templates pin documented in PORTFOLIO (same pattern as other repos). Many workspaces run markdown and scripts **without** npm; that is a **valid exception** when PORTFOLIO states it explicitly.
- **`octc agents init|verify|sync`** without `verify monorepo`: same scope as above — only with conscious adoption of agent-templates.

## Template and org runbook

The **contract** of limits lives in this repo via the reusable workflow [**`octc-workspace-verify-callable.yml`**](../../.github/workflows/octc-workspace-verify-callable.yml). The template tree (`README`, root markdown, **`octc-workspace-verify.yml` wrapper** under `.github/workflows/`) and the bootstrap runbook live in the **private** [`octc-platform-internal`](https://github.com/OneClickToControl/octc-platform-internal) repo (`templates/workspace-repo/`, `docs/runbooks/NEW_WORKSPACE_REPO.md`). OneClickToControl members follow the internal runbook for bootstrap.

### Using the callable (recommended)

In the `*-workspace` repo, `octc-workspace-verify.yml` should delegate to the callable with the **same commit SHA** in `uses:` and `tooling_ref` (single pin; see `scripts/print-workspace-verify-callable-pin.sh` in `octc-platform`):

```yaml
jobs:
  verify:
    permissions:
      contents: read
    uses: OneClickToControl/octc-platform/.github/workflows/octc-workspace-verify-callable.yml@<SHA_OCTC_PLATFORM>
    with:
      tooling_ref: <SHA_OCTC_PLATFORM>
```

Replace `<SHA_OCTC_PLATFORM>` with the `octc-platform` commit that carries the rules and guardrail script version you want to pin. `@main` only is fine for prototypes; org-controlled repos should prefer a SHA to avoid surprise drift.

**Recommended pin (CLI):** with authenticated [`gh`](https://cli.github.com/), from a clone of `octc-platform`:

```bash
./scripts/print-workspace-verify-callable-pin.sh
```

The script prints the latest commit on the chosen branch (`main` by default) that **touched** `octc-workspace-verify-callable.yml` — usually the tightest pin after a rules change. The example uses the same SHA for `with: tooling_ref:`.

## `octc init workspace` (public CLI)

[`@1c2c/cli`](https://github.com/OneClickToControl/octc-platform/tree/main/packages/cli) includes **`octc init workspace <dir>`**: materializes the same tree shape as the public template in `packages/cli/templates/workspace` (**parity** with `octc-platform-internal` `templates/workspace-repo/` — a change should be reflected in both).

It only writes files on disk; it **does not** create GitHub repos, rulesets, or `PORTFOLIO` rows. Use `--pin <SHA>` to substitute `__OCTC_WORKSPACE_VERIFY_PIN__` in the wrapper; `--template-dir` may point at an internal clone for parity checks.

## `octc init app` (optional `*-app` scaffold)

**`octc init app <dir>`** materializes the **`templates/product`** contract (parity with internal `templates/product-repo`). It is a **public-safe scaffold** (files ready for a future `*-app`); it **does not** replace the org repo onboarding runbook. See the CLI package README.

<a id="octc-workspace-root-markdown"></a>

## Root Markdown: CI invariant vs template convention

Callable **v2** requires these **exact filenames** at the **repository root**:

`README.md`, `AGENTS.md`, `CLAUDE.md`, `IDENTITY.md`, `MEMORY.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `HEARTBEAT.md`

- **OCTC invariant (today):** **presence** of those files and names (except **opt-in** exclusions declared in `.octc/workspace-guardrails.yaml`, v2 — a bounded subset in code). Verify does **not** dictate markdown length or internal structure.
- **Template convention** (`octc-platform-internal` / `templates/workspace-repo/` and CLI mirror): initial content is **bootstrap example**; each product family may adapt text inside each file as long as other v2 rules are not broken (e.g. do not turn the repo into an `*-app` lane).
- Skipping names from the list is only valid via `.octc/workspace-guardrails.yaml` (`exceptions.skip_required_root_markdown.files`) within the platform **allowlist** — not via unparsed local bypass.

## Relationship to template adoption

[ADOPTION.md](../agents/ADOPTION.md) describes standard adoption of `@1c2c/agent-templates` in repos that **do** pin templates and run `octc-agents` verify. `*-workspace` repos **are not** required to follow that flow; if you mix both, document PORTFOLIO pin or exception.

## `octc-workspace-verify`: **v2** scope (implementation: callable in `octc-platform`)

The **OCTC workspace verify** job evolves in phases; the canonical implementation is [`.github/workflows/octc-workspace-verify-callable.yml`](../../.github/workflows/octc-workspace-verify-callable.yml).

**v1 (baseline)**

- If `/.octc/monorepo.yaml` exists → CI failure.
- Reject `*-app` YAML patterns under `.github/` (`octc-portfolio-dispatch-callable`, `octc:verify:monorepo`, `octc verify monorepo`), excluding the local **`octc-workspace-verify.yml`** wrapper so verify does not self-flag.

**v2 (current phase)**

- Recursive scan of **all** `*.yml` and `*.yaml` under `.github/` with the same **`octc-workspace-verify.yml`** exclusion.
- Root: forbid `pnpm-workspace.yaml` and `turbo.json` (strong `*-app` signal).
- Forbid workflows with typical product names: `.github/workflows/octc-agents.yml`, `octc-portfolio-dispatch.yml`.
- Forbid `.octc/agents/manifest.schema.json` in a “pure” workspace (typical copy from `*-agents` / `*-app`).
- Forbid `agents/**/manifest.json` tree (ACP manifests belong in `*-agents`).
- If root `package.json` exists, it must not contain literal strings `octc:verify:monorepo` or `octc verify monorepo` (workspaces that adopt only `octc sync agents` may still omit those strings).

**Out of scope for v2**

- No lockfile or transitive dependency inspection, nor generic `*-app` scripts in `package.json` without those strings.
- Does not validate `notes/` content or human snippets pasted in markdown.

## `.octc/workspace-guardrails.yaml` (v1 schema, enforced in CI)

Optional file in the workspace repo. If **missing**, callable defaults apply (full root markdown list, no optional checks).

If present, it must declare `schema_version: 1` and the verifier (Ruby in `scripts/workspace-guardrails-verify.rb`) only enforces what code supports:

| Key | Effect |
|-----|--------|
| `meta.owner` / `meta.reason` | Required when exceptions have effect or `optional_checks` is non-empty. |
| `exceptions.skip_required_root_markdown.files` | Allowed subset (e.g. `HEARTBEAT.md`, `USER.md`, `TOOLS.md`); never relaxes the `*-app` lane. |
| `optional_checks.require_package_json_scripts` | If `package.json` exists, requires keys in `scripts`. |
| `optional_checks.expect_agent_templates_range` | If `package.json` exists, checks `devDependencies['@1c2c/agent-templates']` vs `^` / `~` / exact range (npm subset). |

There is no “disable all”, global globs, or monorepo/app exceptions in this file. Unknown keys → CI failure.

## Evolution (historical phases 3–4)

**Phase 3 — explicit contract and reuse**

- Reusable workflow with `tooling_ref` + second checkout of `octc-platform` for versioned scripts.
- **Implemented:** `.octc/workspace-guardrails.yaml` v1 parsed in CI; explicit `optional_checks` (no generic policy engine).

**Phase 4 — materialization**

- **Implemented in internal:** [`materialize-workspace-from-template.sh`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/scripts/materialize-workspace-from-template.sh).
- **Implemented in CLI:** `octc init workspace` (does not register PORTFOLIO or create the GitHub repo).

**Lane edges (today)**

- Any relaxation **not** covered by the v1 guardrails shape must go through a **PR on `octc-platform`** against the callable and Ruby script, **or** an explicit documented decision (ADR + PORTFOLIO) — a local YAML with invented keys is not enough (the verifier rejects unknown keys).

## Links

- Monorepo `*-app` only: [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md)
- ACP runtime sync (vision): [RUNTIME_SYNC](../agents/RUNTIME_SYNC.md)
