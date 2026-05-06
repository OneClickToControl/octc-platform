# Product family bootstrap (internal layer)

OCTC splits **three lanes** per family (`*-app`, `*-agents`, `*-workspace`). **Org-specific** orchestration (chained templates, checklists for non-automated GitHub steps) lives in the org **internal** repository, not in the public CLI.

## Where the flow lives

In the platform internal repo (same place as `templates/` and `materialize-*`):

- Script: `scripts/bootstrap-product-family.sh`
- Runbook: `docs/runbooks/NEW_PRODUCT_FAMILY.md`
- Example manifest: `config/examples/product-family.store.yaml`

Exact links and internal repo names are not duplicated here (public repo); use the internal runbook catalog.

## What stays in this public layer (`octc-platform`)

- CLI **`octc init app`**, **`octc init workspace`**, **`octc add|sync surface`**, **`octc verify monorepo`**: reusable contracts and templates in `@1c2c/cli` (see [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md), [WORKSPACE_LANE](./WORKSPACE_LANE.md)).
- Reusable workflows (portfolio dispatch, ACP dispatch, workspace verify callable) and pin scripts under `scripts/print-*-callable-pin.sh`.

**Multi-product meta-factory:** lifecycle stages, lanes, and surfaces are declared in the **Paperclip** plane (`factory/initiatives/`); bootstrap orchestration and **org-agents/org-workspace** templates live in the **internal** layer — public vision in [ORG_PRODUCT_FACTORY](./ORG_PRODUCT_FACTORY.md).

**Do not** centralize whole family creation plus org checklist in the CLI: it decouples external consumers and keeps org coupling in internal.

## Typical next rollout

To complete a family where a *-app* lane already exists but *-agents* / *-workspace* are missing: in the internal repo, run bootstrap with `--lanes agents,workspace` (or only missing lanes) and complete the printed checklist (rulesets, portfolio row, ACP allowlist, secrets). Complex *-app* surfaces still use `octc add surface` per surface after the initial stub.
