# Architecture Decision Records — INDEX

Standard ADRs (Markdown Any Decision Records) for platform architectural decisions. Each ADR is numbered sequentially and referenced from here.

## Statuses

- **proposed**: under discussion.
- **accepted**: in force.
- **deprecated**: superseded historically; keep as reference.
- **superseded**: replaced by another ADR (reference the successor).

## Index

| no. | title | status | date | tags |
|----|--------|--------|-------|------|
| [0001](ADR-0001-polyrepo-platform.md) | Polyrepo + `octc-platform` as SSOT | accepted | 2026-04-29 | platform, repo |
| [0002](ADR-0002-acp-pattern.md) | Agent Capability Provider (ACP) pattern | accepted | 2026-04-29 | agents, governance |
| [0003](ADR-0003-monorepo-cli-machine-ssot.md) | Machine-readable `.octc/monorepo.yaml` SSOT and CLI `verify` / `add surface` (Phase 4) | accepted | 2026-05-01 | platform, cli, monorepo |

1. Copy `_TEMPLATE.md`.
2. Number consecutively (`ADR-XXXX-slug.md`).
3. PR to `octc-platform` with discussion in the PR; on merge, mark `accepted`.
4. Update this INDEX.
