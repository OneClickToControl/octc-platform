# ACP Conformance — Tiers L0–L4

Agent Capability Providers (ACP) declare `conformance_tier_target` in their manifest. Tiers are cumulative: L1 includes all of L0, etc.

## L0 — Declared

- Valid manifest against schema referenced in [REGISTRY.md](REGISTRY.md).
- `owner` declared.
- `repositories[]` points to real destinations.

## L1 — Documented

- ACP README with purpose, scope, supported runtimes.
- `upstream_sources[]` and `downstream_deployments[]` populated (at least 1 each).
- `CLAUDE.md` and `.cursor/rules/` templates extending versioned `@1c2c/agent-templates`.

## L2 — Minimum security

- `tools_allowlist_ref` pointing to a versioned file in the ACP repo.
- GUARDRAILS documented (what the agent must not do).
- PII scrubbing in logs/traces (aligned with [SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md) and Sentry `beforeSend`).
- Input data classified (none/low/high) per [DATA_CLASSIFICATION.md](../compliance/DATA_CLASSIFICATION.md).

## L3 — Observed

- Agent telemetry active: Sentry breadcrumbs and AI Monitoring spans (see [AGENT_TELEMETRY.md](../observability/AGENT_TELEMETRY.md)).
- `sentry_project` declared in manifest and healthy.
- Minimum alerts: `eval_pass_rate` below threshold, latency/cost spikes, unhandled errors.
- FinOps dashboard per ACP in [LLM_COSTS.md](../finops/LLM_COSTS.md).

## L4 — Continuously audited

- **Eval** suite runs in CI (golden + adversarial).
- Eval report attached to every ACP release.
- Quarterly `tools_allowlist_ref` review recorded in [docs/audit/HISTORY.md](../audit/HISTORY.md).
- Agent quality metrics in [QUALITY_METRICS.md](QUALITY_METRICS.md) and rolled up in the SCORECARD.

## Promotions and rollbacks

- Promotion approved by PR with evidence (links, screenshots, logs).
- An ACP may **roll back** to a lower tier if it loses alerts, allowlist, or evals; document in HISTORY.
