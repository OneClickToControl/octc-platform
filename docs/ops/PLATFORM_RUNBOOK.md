# Platform runbook

Step-by-step procedures for critical `octc-platform` operations.

## On-call

- Primary owner: @1click2control.
- Escalation: TBD as the team grows.
- Channel: `#ops-incidents`.

## Procedures

### Deleted or compromised repo

1. Verify latest mirror.
2. Re-create repo from mirror.
3. Restore branch protection and CODEOWNERS.
4. Force token rotation and review webhooks.
5. Post-mortem in `docs/audit/HISTORY.md`.

### Secret leak

1. Rotate the secret immediately in the secrets manager.
2. Revoke live tokens at providers (npm, Sentry, Vercel, etc.).
3. Review access logs for the prior 30 days.
4. Notify `#security`.
5. Post-mortem.

### Malicious `@1c2c/*` package published

1. `npm deprecate @1c2c/<pkg>@<version> "<reason>"`.
2. If critical: `npm unpublish` (within allowed 72h window).
3. Publish patch with version bump.
4. Announce in `#release` + `#security`.
5. Audit how it was published (OIDC, identities).

### Compromised Sentry org

1. Pause ingestion of sensitive events (change DSNs in production).
2. Audit members and rotate tokens.
3. Restore configuration from backup.
4. Resume ingestion per verified project.

### LLM FinOps alerts above threshold

1. Identify agent and product.
2. Pause execution (orchestrator or feature flag).
3. Audit prompts and loops.
4. Adjust budget or model.

### `verify.yml` CI outage

1. Reproduce locally.
2. If flaky on one action, consider alternate pin or cache invalidation.
3. If a real regression, open an issue and block merges.

## Periodic checklists

- **Weekly**: review Dependabot, Sentry alerts, FinOps KPIs.
- **Monthly**: verify mirror backup, export Sentry config, PORTFOLIO snapshot.
- **Quarterly**: DR drill, visible audit, L4 `tools_allowlist_ref` review.
