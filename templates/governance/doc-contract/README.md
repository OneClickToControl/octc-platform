# Template — documentation contract (ACP / agent-heavy repos)

**Optional** pattern for repos that version many normative artifacts (skills, manifests, allowlists) and want **traceability** (“change ↔ review”) without mixing client content into the public `octc-platform`.

## When to use it

- The repo is an **ACP** or heavily uses the “manifest + schema + normative docs” model.
- You want to record **what** changed in normative documentation (e.g. new skill, tier bump) with a small, PR-reviewable artifact.

## What to copy into the repo

1. From the consumer, with `@1c2c/cli` ≥ 0.3.0:
   ```bash
   pnpm exec octc sync governance --only doc-contract
   ```
   (or manually copy this folder to `templates/governance/doc-contract/` in the target repo.)

2. Optionally add a CI step that fails if recent changesets lack `schema_version` or that validates the ACP manifest against `.octc/agents/manifest.schema.json` (pattern already used in org repos).

## Reference files

| File | Use |
|---------|-----|
| `changeset.example.yaml` | Suggested format for describing a doc-contract change (no sensitive data). Copy to `changesets/` or `docs/changes/` with another name. |

## Limits

- Does not replace **ADRs** or **PUBLIC_REPO_POLICY**: sensitive data stays out of the public repo.
- Strict validation (JSON Schema, secret grep) remains the repo workflow’s responsibility.

## Links

- [REFERENCE_PRODUCT_MONOREPO](../../../docs/adoption/REFERENCE_PRODUCT_MONOREPO.md) — surfaces in product monorepos.
- [REGISTRY](../../../docs/agents/REGISTRY.md) — ACP registry.
- Golden path — ACP / doc-contract step: [GOLDEN_PATH](../../../docs/adoption/GOLDEN_PATH.md).
