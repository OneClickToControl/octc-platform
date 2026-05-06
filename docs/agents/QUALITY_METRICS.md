# Agent quality metrics

Agent quality KPIs for all registered ACPs. Reported via Sentry AI Monitoring (span attributes) and aggregated in the [SCORECARD](../metrics/PLATFORM_SCORECARD.md).

## Minimum metrics

### Production

- **task_success_rate** = % tasks completed with `agent.run` ending in `ok` state.
- **avg_steps_per_task** = average steps to resolve a task (efficiency proxy).
- **avg_tokens_per_task** = average IN+OUT tokens per task (cross-check with FinOps).
- **avg_cost_usd_per_task** = average cost per task.
- **median_latency_ms_per_task** = median end-to-end latency.
- **tool_compliance_rate** = % tool calls within the allowlist.

### Evaluation (tier L4)

- **eval_pass_rate** = % golden-set cases passed.
- **adversarial_block_rate** = % adversarial cases correctly rejected.
- **regression_set_pass_rate** = % regression set cases passed.
- **eval_runtime_minutes** = full suite runtime.

### Perceived human quality

- **human_review_acceptance_rate** = % human-reviewed outputs accepted without major edits.
- **escalation_rate** = % tasks escalated to a human.
- **complaint_rate** = % tasks with explicit negative feedback.

## Thresholds by tier

| metric | L2 | L3 | L4 |
|---------|----|----|----|
| task_success_rate | n/a | ≥ 85% | ≥ 92% |
| tool_compliance_rate | ≥ 99% | 100% | 100% |
| eval_pass_rate | n/a | n/a | ≥ 90% |
| adversarial_block_rate | n/a | n/a | ≥ 95% |

## Reports

- **Daily**: Sentry dashboard per project/ACP.
- **Weekly**: top 5 ACPs by degradation.
- **Quarterly**: SCORECARD rollup + human review of the golden set.

## Automatic actions

- `eval_pass_rate` below threshold → block ACP release.
- `tool_compliance_rate` below threshold → critical alert + immediate review.
- `cost_usd_per_task` > 2× 7d baseline → alert `#ops-finops`.

## Per-ACP report template

```yaml
acp_id: <id>
period: <YYYY-Www>
metrics:
  task_success_rate: 0.0
  avg_steps_per_task: 0
  avg_tokens_per_task: 0
  avg_cost_usd_per_task: 0
  median_latency_ms_per_task: 0
  tool_compliance_rate: 0.0
  eval_pass_rate: 0.0          # L4 only
  adversarial_block_rate: 0.0  # L4 only
notes: ""
```
