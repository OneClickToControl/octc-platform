# FinOps LLM

Cost control policy for LLM and agent usage at OneClickToControl LLC.

## Goals

- Predictable monthly spend.
- Visibility per agent / ACP / product.
- Discourage expensive loops and oversized models.
- Model choices driven by **quality / cost**, not habit.

## Budgets

### Levels

- **Org budget** (monthly): global aggregate cap.
- **Product budget** (monthly): per product in [PORTFOLIO](../PORTFOLIO.md).
- **Agent budget** (per run): cap per agent execution.

Budgets are declared as environment variables and enforced at runtime.

### Tier mapping (guidance)

| ACP tier | Recommended default model | Exceptions |
|----------|---------------------------|------------|
| L0–L1 | Medium-cost models (sonnet-class) | One-off exploratory tasks. |
| L2 | Sonnet-class for implementation, small models for classification. | Heavy RAG may move to opus-class with justification. |
| L3 | Sonnet-class default. | User-facing time-sensitive endpoints: faster models. |
| L4 | Sonnet-class baseline + evals with opus-class for validation. | Review quarterly. |

## Metrics

- USD cost per agent / day.
- USD cost per task / request.
- IN/OUT tokens per model.
- `tokens_per_resolution`: average tokens until task resolution.
- `cost_overrun_rate`: % of runs exceeding per-agent budget.

Reported via Sentry AI Monitoring (attributes on `agent.llm.call` spans) and rolled up in the SCORECARD.

## Alerts

- Daily org cost > 1.2× 7-day baseline → critical alert to `#ops-finops`.
- Per-agent `cost_overrun_rate` > 5% / day → optimization ticket to ACP owner.
- Unapproved model appears in spans → critical alert.

## Optimizations

- Prompt caching (`@1c2c/prompt-cache` planned).
- Reuse retrievals via vector store.
- Aggressive truncation of historical context where appropriate.
- Dynamic model selection by detected complexity.

## Reports

- Weekly: top 5 agents by cost, top 5 ACPs by cost per task.
- Monthly: close vs product budget in [comms/RELEASE_NOTES](../comms/RELEASE_NOTES_TEMPLATE.md).
- Quarterly: review tier mapping and approved models.

## Approved models

A versioned list per provider is maintained. New models enter via RFC. Unapproved models are blocked by orchestrator and/or central gateway configuration (planned).
