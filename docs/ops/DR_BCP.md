# DR / BCP — octc-platform

Disaster Recovery and Business Continuity Plan **for the platform**. This document covers total or partial loss of normative assets and critical infrastructure controlled by `octc-platform`. Each product maintains its own DR for product data.

## Critical assets

| Asset | Owner | Criticality | Repository | RTO | RPO |
|--------|-------|------------|-------------|-----|-----|
| GitHub repos under the org | @1click2control | critical | github.com/<org>/* | 4h | 24h |
| Sentry org configuration | @1click2control | critical | monthly JSON export | 24h | 30d |
| OIDC secrets and vault | @1click2control | critical | secrets manager | 4h | 24h |
| `@1c2c/*` published on npm | @1click2control | high | npmjs.com | 24h | 0 (immutable) |
| REGISTRY + ADRs (public policy) | @1click2control | high | `octc-platform` repo | 1h | 0 (git) |
| PORTFOLIO (private repo inventory) | @1click2control | high | `octc-platform-internal` repo | 1h | 0 (git) |
| DNS domains | @1click2control | high | external registrar | 12h | 24h |

## Incident classes

- **Class A**: loss of access or integrity to a critical asset (deleted repo, compromised Sentry org, malicious published package).
- **Class B**: partial but recoverable loss < 24h (CI down, rotated secrets, active security alert).
- **Class C**: operational degradation (FinOps alerts, release errors).

## Procedures

### Backup

- **Repos**: weekly mirror clone to external encrypted storage (S3/Cloudflare R2).
- **Sentry**: weekly export of per-project configuration (alerts, members, retention) via API.
- **REGISTRY (policy) + ADRs**: monthly tag `snapshots/<YYYY>-<MM>` on `octc-platform`.
- **PORTFOLIO (inventory)**: same snapshot scheme on `octc-platform-internal` (not in this public repo).
- **Secrets**: monthly encrypted backup + quarterly rotation.
- **Package mirror**: weekly snapshot of `@1c2c/*` to backup storage (via `npm pack`).

### Restoration

1. Identify class and affected assets.
2. Activate `#ops-incidents` channel.
3. Run playbook ([PLATFORM_RUNBOOK.md](PLATFORM_RUNBOOK.md)).
4. Communicate timeline and expected RTO.
5. Post-mortem within ≤ 7 days.

### Drills

- **Semi-annual** drill simulating class A (deleted repo, compromised secrets).
- Result documented in `docs/audit/HISTORY.md` with `last_drill_days`.

## Communication

- Class A → `#ops-incidents` + stakeholder email within ≤ 30 min.
- Class B → `#ops-incidents` within ≤ 2h.
- Class C → `#ops` with normal follow-up.

## Indicators

- `last_drill_days`: days since last successful drill.
- `backup_freshness_hours`: age of latest backup per asset.
- `restore_test_pass_rate`: % of drills meeting RTO.

Reported in [PLATFORM_SCORECARD](../metrics/PLATFORM_SCORECARD.md).
