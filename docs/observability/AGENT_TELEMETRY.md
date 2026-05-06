# Agent telemetry

Telemetry convention for AI agents in Sentry. Applies to any ACP at tier ≥ L3.

## Spans (AI Monitoring)

All agents emit canonical spans:

- `agent.run` — root span per agent execution.
  - attrs: `agent.id`, `agent.acp_id`, `agent.runtime`, `agent.tier`, `task.id`, `task.kind`.
- `agent.tool.call` — tool or MCP call.
  - attrs: `tool.name`, `tool.allowlisted` (bool), `tool.duration_ms`, `tool.success`.
- `agent.llm.call` — LLM provider call.
  - attrs: `model.id`, `model.provider`, `tokens.input`, `tokens.output`, `cost.usd`, `latency.ms`.
- `agent.eval.case` — eval flows only.
  - attrs: `eval.set`, `eval.case_id`, `eval.passed` (bool).

## Breadcrumbs

- Each relevant decision or state change: `agent.decision` type with `category` and `data` redacted of PII.
- Errors captured with `Sentry.captureException` and minimal `extra.agent_context` (no sensitive payload).

## Tags

- `agent_id`, `acp_id`, `task_id`, `tenant_id_hash` (when applicable).
- Never tags with cleartext PII.

## Minimum alerts

- `eval_pass_rate` below threshold (regression alert).
- P95 latency spikes on `agent.llm.call`.
- `tool.allowlisted=false` in any execution → critical alert to product channel.
- Cost per run above budget (cross-check [LLM_COSTS.md](../finops/LLM_COSTS.md)).

## Implementation

- Web/Node: `@sentry/node` or `@sentry/nextjs` + `Sentry.startSpan`.
- Python: `sentry-sdk` + AI integrations.
- Mobile: limited to errors and basic tracing (mobile agents are rare).

## Orchestrator integration

- Paperclip or Inngest (when adopted) must wrap each mission in `agent.run` and propagate tracing.
- Heartbeats to `#ops-agents` are in addition to spans: Sentry is for debugging and metrics, not human notification.

## Verification

Synthetic tests in CI (`verify.yml`) emit a sample `agent.run` to a sandbox project and validate spans appear.
