# Parity with internal PORTFOLIO (without promising “npm-only” sync)

The live inventory (`repo_surfaces`, `octc_cli_pin`, …) lives in the private **`octc-platform-internal`** repo (`docs/PORTFOLIO.md`). This document describes **what the public tooling can do** and **what requires org credentials**.

## What `@1c2c/cli` does without a token

| Command | Outcome |
|---------|---------|
| `octc verify monorepo` | Fails CI if `.octc/monorepo.yaml` does not match the filesystem (see [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md)). |
| `octc portfolio suggest` | Prints snippets (YAML `portfolio.repo_surfaces_csv`, table row template) to **paste** into a manual PR to internal. |

Optional environment variables: `OCTC_PORTFOLIO_REPO`, `OCTC_PORTFOLIO_CLI_PIN`.

## What requires GitHub authentication

- Opening or updating PRs against `octc-platform-internal` automatically.
- Reading org metadata that is not in the public clone.

Patterns aligned with [ADR-0003 § bridge](../adr/ADR-0003-monorepo-cli-machine-ssot.md):

1. **Workflow in the internal repo** triggered by `repository_dispatch` / `workflow_dispatch` receiving an exported artifact (e.g. manifest JSON) produced in the product repo’s CI.
2. **PAT or GitHub App** with `contents` + `pull_requests` on the private repo, used only on org-approved runners — not in published packages without a secure context.
3. **Manual process** using `octc portfolio suggest` + a human PR (valid for many orgs).

## Runbook

Cadence and diff between PORTFOLIO ↔ `docs/architecture.md` / `.octc/monorepo.yaml`: see companion [REFERENCE_MONOREPO_SYNC](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/REFERENCE_MONOREPO_SYNC.md) (org members).

## References

- [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md)
- [MONOREPO_CONFORMANCE_CHECKLIST](MONOREPO_CONFORMANCE_CHECKLIST.md)
