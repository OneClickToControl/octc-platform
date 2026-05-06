# Documentation tree

Minimum `docs/` structure any OneClickToControl LLC repo should have to be “platform-conformant”.

```
docs/
  product/
    PRD.md
    ROADMAP.md
  brand/
    BRAND.md
    VOICE.md
  market/
    MARKET.md
    COMPETITORS.md
  research/
    RESEARCH.md
  strategy/
    STRATEGY.md
    OKRS.md
  design/
    DESIGN_TOKENS.md
    PARITY_WEB_MOBILE.md
  agents/
    REGISTRY.md (if the repo is an ACP)
  ops/
    RUNBOOK.md
  security/
    THREAT_MODEL.md (if sensitivity:high)
```

## Recommended extensions (multi-surface monorepos)

Repos combining `web`, `mobile`, `data`, `ml`, etc. usually add, beyond the minimum:

```
docs/
  audits/
  features/
  db/
  architecture/
    (living maps: sync, modules, boundaries)
  plans/
  ops/
  memory/          # or decisions/ + ADR; keep an index linked from architecture
  getting-started.md
ops/
  (operator runbooks: rollback, on-call, flags — complement to docs/ops)
scripts/
  README.md
  db/
  supabase/        # local ↔ cloud verification where applicable
  governance/
  i18n/
  security/
  github/          # or other issue tracker: project/backlog sync if the org uses it
  ci/
packages/
  (TS contracts, internal SDKs — each with a README)
assets/
  brand/           # logos and tokens exportable to clients
```

The **surface ↔ folders** mapping lives in `docs/architecture.md` (SSOT table). Full pattern: [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md) and [MONOREPO_CONFORMANCE_CHECKLIST.md](MONOREPO_CONFORMANCE_CHECKLIST.md). **ACP / agent-heavy** repos may adopt the optional [doc-contract](../../templates/governance/doc-contract/README.md) (also `pnpm exec octc sync governance --only doc-contract` with `@1c2c/cli` ≥ 0.3.0).

## Rules

- Every new repo starts with this structure (see [GOLDEN_PATH.md](GOLDEN_PATH.md)).
- Missing files are documented in `docs/README.md` as “N/A” with justification.
- Platform repos live under `octc-platform/docs/` and may use a different subset.
- Roadmap priority changes that affect deliverables → update `docs/features/` or operations in the same cycle (or explicit debt in an audit).
