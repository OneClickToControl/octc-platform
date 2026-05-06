# Template — `*-workspace` repository (memory / identity / restore)

Copy this directory to the **root** of `OneClickToControl/<product>-workspace` (or use as a **GitHub Template**). To materialize the tree from a clone of `octc-platform-internal`, use `scripts/materialize-workspace-from-template.sh` (see [NEW_WORKSPACE_REPO.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_WORKSPACE_REPO.md) §1).

## What belongs here

- Stable operator / team identity and preferences.
- Long-term memory and pointers to context (not product code).
- Notes, diary, working channels, and **restore / bootstrap** procedures.
- Personal or ops scripts that are not canonical agent policy.

## What **does not** belong here

- **ACP manifests** (`agents/<id>/manifest.json`) → `*-agents` repo.
- **Canonical runtime profiles, MCP allowlists stored as policy**, product guardrails → `*-agents` or `octc-platform`.
- **Application code** → `*-app`.
- **Do not** add `/.octc/monorepo.yaml` or use `octc add surface` / `octc sync surface` / `octc verify monorepo` (surface contract and commands are `*-app` only).
- **Do not** copy portfolio dispatch workflows from the monorepo (`octc-portfolio-dispatch.yml` or `octc-portfolio-dispatch-callable`) or `octc:verify:monorepo` / `octc verify monorepo` CI strings — `octc-workspace-verify` rejects them.

## `.octc/` policy

- **`/.octc/monorepo.yaml`:** **forbidden** in `*-workspace` (`*-app` only).
- **Any other file under `.octc/`:** not part of this template. It should exist only if an **OCTC ADR or runbook** explicitly introduces it for this lane; otherwise keep the repo **without** a `.octc/` tree.

## CI verification (`octc-workspace-verify`)

- `.github/workflows/octc-workspace-verify.yml` is a **wrapper** that invokes the public reusable workflow [`octc-workspace-verify-callable.yml`](https://github.com/OneClickToControl/octc-platform/blob/main/.github/workflows/octc-workspace-verify-callable.yml) in `octc-platform` with a **commit SHA pin** (avoids rules drift).
- Runs on every `pull_request` and `push` to **`main`** (and manually via `workflow_dispatch`).
- **v2:** besides forbidding `/.octc/monorepo.yaml`, rejects root `pnpm-workspace.yaml` and `turbo.json`, fixed product workflows `octc-agents.yml` / `octc-portfolio-dispatch.yml`, `.octc/agents/manifest.schema.json`, any `agents/**/manifest.json`, and `package.json` strings for monorepo verify; scans **all** `.github/**/*.yml` (incl. actions) except this `octc-workspace-verify.yml`. Details and phases 3–4: [WORKSPACE_LANE](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/WORKSPACE_LANE.md).
- **Template convention:** initial markdown is **example** content; see [WORKSPACE_LANE — root Markdown](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/WORKSPACE_LANE.md#octc-workspace-root-markdown) (CI invariant vs free text inside each file).
- **Honest limit:** v2 does not cover every possible `*-app` variant; the public doc tracks the roadmap.
- **Bump the pin:** after updating the callable on `octc-platform`, edit the SHA in `octc-workspace-verify.yml` and open a PR in the corresponding `*-workspace`.

## Org runbook

For creating a new repo: in **octc-platform-internal**, follow [NEW_WORKSPACE_REPO.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_WORKSPACE_REPO.md).
