# Release notes template

Template for monthly or quarterly platform release notes. Copy to `docs/comms/releases/<YYYY>-<MM>.md` or `docs/comms/releases/<YYYY>-Q<n>.md` and post in `#release`.

---

# octc-platform — release notes <period>

## Highlights

- 1–3 bullets with the most important items in the period.

## Changes by area

### Normative platform
- New and accepted ADRs.
- Policy changes (security, observability, FinOps, governance).

### `@1c2c/*` packages
- Notable releases (major/minor) with changelog.
- Migration plan if majors shipped.

### Agent templates
- Current `@1c2c/agent-templates` version.
- Short list of repos pending adoption.

### Observability
- Sentry project changes, sampling, retention.
- Notable incidents linked to alerts.

### LLM FinOps
- Org and per-product cost vs budget.
- Top 3 savings and top 3 increases.

### Governance
- ADRs accepted/deprecated.
- CODEOWNERS or branch protection changes.

## Next steps

- Plan for the next period (3–5 bullets).

## Key metrics

| KPI | value | trend |
|-----|-------|-----------|
| eval_pass_rate (avg L4) |  |  |
| codeowners_coverage (%) |  |  |
| sentry_uptime |  |  |
| llm_budget_utilization (%) |  |  |

## Appendices

- Links to visible quarterly audit.
- Links to new ADRs.
