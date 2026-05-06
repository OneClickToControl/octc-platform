# Platform SCORECARD

Live platform KPIs. **Quarterly** refresh aligned with the visible audit.

## Cadence

- **Quarterly** review of plan + scorecard + visible audit (foundational plan Appendix C).
- **Monthly** review of release notes and LLM FinOps (see [comms/RELEASE_NOTES_TEMPLATE.md](../comms/RELEASE_NOTES_TEMPLATE.md)).
- **Snapshot** of the SCORECARD is versioned in git with tag `scorecard/<YYYY>-Q<n>`.

## KPIs

### Adoption

- **agent_templates_adoption_rate** = % PORTFOLIO repos with `agent_templates_pin` ≤ 1 minor behind.
- **at1c2c_adoption_rate** = % repos with `at1c2c_pin` ≤ 1 minor behind.
- **acp_registered_count** = ACPs in REGISTRY with tier ≥ L1.

### Agent conformance

- **acps_at_or_above_l2** = % ACPs with tier_actual ≥ L2.
- **acps_at_l4** = count of ACPs with tier_actual = L4.
- **eval_pass_rate** = quarterly average of L4 ACPs’ `eval_pass_rate`.

### Observability

- **sentry_uptime** = % Sentry projects receiving events in the last 24h.
- **sourcemaps_coverage** = % recent releases with source maps uploaded via OIDC.
- **alerts_active** = count of configured alerts vs minimum baseline (see [OBSERVABILITY](../observability/OBSERVABILITY.md)).

### LLM FinOps

- **llm_budget_utilization** = % org budget consumed in the period.
- **cost_overrun_rate** = % runs over per-agent budget.
- **tokens_per_resolution** (avg) = baseline for optimizations.

### Governance

- **codeowners_coverage** = % critical paths covered by real CODEOWNERS.
- **adr_freshness** = days since last accepted ADR.
- **review_lag_p50** = median hours from PR open to first review.

### DR / resilience

- **last_drill_days** = days since last successful DR drill.
- **backup_freshness_hours** = age of latest mirror backup.
- **incidents_class_a_quarter** = class A incidents in the quarter.

### Onboarding

- **time_to_first_pr_days** = median days from onboarding to first merged PR for new contributors.
- **bootstrap_time_hours** = total time to bootstrap a new repo following GOLDEN_PATH.

### Monorepo and internal PORTFOLIO

- **monorepo_verify_adoption_rate** = % product repos with `.octc/monorepo.yaml` and a `octc verify monorepo` CI step on the default branch.
- **portfolio_surfaces_drift_open** = count of findings or documented debt comparing `repo_surfaces` (internal) with `docs/architecture.md` / manifest (**P2-11** in companion backlog; see [PORTFOLIO_BRIDGE](../adoption/PORTFOLIO_BRIDGE.md)).

## Current quarter board (2026-Q2)

| KPI | value | target | trend |
|-----|-------|----------|-----------|
| agent_templates_adoption_rate | 0% | 60% Q2 | bootstrap |
| at1c2c_adoption_rate | 0% | 60% Q2 | bootstrap |
| acp_registered_count | 0 | ≥ 2 Q2 | bootstrap |
| acps_at_or_above_l2 | 0% | high → L2 Q2 | pending |
| sentry_uptime | n/a | ≥ 99% | 8/8 projects created 2026-04-29; measurement starts with first events |
| codeowners_coverage | 100% (this repo) | 100% | OK |
| last_drill_days | n/a | ≤ 180 | drill pending |
| llm_budget_utilization | n/a | ≤ 90% | no baseline yet |

## Owners

- SCORECARD maintainer: @ferflechas.
- Each KPI may reference a different owner in its section.

## Next review

- 2026-Q3 (July 2026).
