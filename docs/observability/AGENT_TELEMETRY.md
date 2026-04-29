# Agent telemetry

Convención de telemetría para agentes IA en Sentry. Aplica a cualquier ACP con tier ≥ L3.

## Spans (AI Monitoring)

Todos los agentes emiten spans canónicos:

- `agent.run` — root span por ejecución del agente.
  - attrs: `agent.id`, `agent.acp_id`, `agent.runtime`, `agent.tier`, `task.id`, `task.kind`.
- `agent.tool.call` — llamada a una herramienta o MCP.
  - attrs: `tool.name`, `tool.allowlisted` (bool), `tool.duration_ms`, `tool.success`.
- `agent.llm.call` — llamada a un proveedor LLM.
  - attrs: `model.id`, `model.provider`, `tokens.input`, `tokens.output`, `cost.usd`, `latency.ms`.
- `agent.eval.case` — solo en flujos de evals.
  - attrs: `eval.set`, `eval.case_id`, `eval.passed` (bool).

## Breadcrumbs

- Cada decisión o cambio de estado relevante: tipo `agent.decision` con `category` y `data` redactados de PII.
- Errores capturados con `Sentry.captureException` y `extra.agent_context` mínimo (sin payload sensible).

## Tags

- `agent_id`, `acp_id`, `task_id`, `tenant_id_hash` (cuando aplique).
- Nunca tags con PII en claro.

## Alertas mínimas

- `eval_pass_rate` por debajo de umbral (regression alert).
- Picos de latencia P95 en `agent.llm.call`.
- `tool.allowlisted=false` en cualquier ejecución → alerta crítica al canal del producto.
- Coste por ejecución superior a presupuesto (cruza con [LLM_COSTS.md](../finops/LLM_COSTS.md)).

## Implementación

- Web/Node: `@sentry/node` o `@sentry/nextjs` + `Sentry.startSpan`.
- Python: `sentry-sdk` + AI integrations.
- Mobile: limitado a errores y tracing básico (los agentes mobile son escasos).

## Integración con orquestadores

- Paperclip o Inngest (cuando se adopten) deben envolver cada misión en un `agent.run` y propagar tracing.
- Heartbeats a `#ops-agents` van además del span: la finalidad de Sentry es debugging y métricas, no notificación humana.

## Verificación

Tests sintéticos en CI (`verify.yml`) emiten un `agent.run` de muestra a un proyecto sandbox y validan que los spans aparecen.
