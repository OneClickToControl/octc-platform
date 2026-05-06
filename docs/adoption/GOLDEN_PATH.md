# Golden path

Standard path to create or adopt a new repo on the platform.

## Steps

1. Open an issue in `octc-platform` using the `repo-bootstrap` template.
2. Create the repo under the GitHub org. Enable branch protection and SSO.
3. Register the repo in the private companion **PORTFOLIO** [`octc-platform-internal`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/PORTFOLIO.md) (PR to that repo; see [PORTFOLIO in this repo](../PORTFOLIO.md) as a pointer).
4. Adopt `@1c2c/eslint-config`, `@1c2c/tsconfig`, `@1c2c/agent-templates`, and for the unified CLI **`@1c2c/cli`** (`npx @1c2c/cli sync agents` delegates to `octc-agents`).
5. Copy the minimum structure from [DOCUMENTATION_TREE.md](DOCUMENTATION_TREE.md); if you will serve more than one client or backend, read [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md) and choose an [archetype](REPO_ARCHETYPES.md).
6. In `docs/architecture.md`, declare **`active_surfaces`** and the **surface ↔ paths** table (`apps/*`, `supabase/`, `packages/*`, …). Optional: duplicate the contract in **`.octc/monorepo.yaml`** (template [`templates/monorepo/monorepo.yaml.example`](../../templates/monorepo/monorepo.yaml.example)) and validate with `pnpm exec octc verify monorepo` (`@1c2c/cli` ≥ 0.2.0, see [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md)). After the first real deploy, validate with [MONOREPO_CONFORMANCE_CHECKLIST.md](MONOREPO_CONFORMANCE_CHECKLIST.md).
7. **ACP / agent-heavy repos (optional):** sync the **doc-contract** template for normative doc changes reviewable in PR (`pnpm exec octc sync governance --only doc-contract`, requires `@1c2c/cli` ≥ 0.3.0; see [templates/governance/doc-contract](../../templates/governance/doc-contract/README.md) and [PORTFOLIO_BRIDGE](PORTFOLIO_BRIDGE.md) for the no-token flow to internal).
8. If the repo exposes capabilities to agents: declare the manifest at `agents/<acp>/manifest.json`, register in [REGISTRY](../agents/REGISTRY.md), and target tier.
9. Configure Sentry: create projects in the single org following `octc-{product}-{surface}` and upload source maps in CI ([SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md)).
10. Configure verification CI: copy and adapt [`templates/governance/ci/octc-consumer-verify.yml`](../../templates/governance/ci/octc-consumer-verify.yml) (install → `pnpm dlx audit-signatures || npm audit signatures` → lint/build; optional `octc agents verify` and **`octc verify monorepo`** if you use `.octc/monorepo.yaml`). For multi-surface monorepos, add a job matrix and `paths` as in [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md) § CI matrix. Details in the [template README](../../templates/governance/ci/README.md).
11. Final PR closes the step-1 issue with a complete checklist.

## Adoption indicators

- Mean bootstrap time < 1 day.
- 100% of new repos green on SCORECARD at first review.

## Issue template

See [templates/governance/ISSUE_TEMPLATE/repo_bootstrap.yml](../../templates/governance/ISSUE_TEMPLATE/repo_bootstrap.yml) (created at bootstrap).
