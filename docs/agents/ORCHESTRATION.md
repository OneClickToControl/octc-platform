# Agent orchestration

Política de orquestación multi-agente para octc-platform.

## Principios

- **Plataforma normativa, runtime opcional.** El SSOT de plantillas y políticas es `octc-platform`. Un orquestador (Paperclip, Inngest, Temporal, Cloudflare Workflows…) es **runtime de ejecución**, nunca SSOT.
- **Trazabilidad obligatoria.** Cualquier orquestador debe emitir spans/breadcrumbs hacia el proyecto Sentry adecuado (ver [AGENT_TELEMETRY.md](../observability/AGENT_TELEMETRY.md)) y respetar el `tools_allowlist_ref` del ACP.
- **Presupuesto por agente.** Cada agente que ejecuta un orquestador declara presupuesto LLM (ver [LLM_COSTS.md](../finops/LLM_COSTS.md)).

## Paperclip (evaluación)

- **Casos de uso:** roles, tareas y heartbeats de agentes con UI ligera para humanos.
- **Frontera:** Paperclip nunca contiene `CLAUDE.md` ni `.cursor/rules`. Solo configuración por agente y misión.
- **Estado:** evaluación en Q3 2026; a falta de adoptar, esta sección queda como placeholder.

## Reglas para cualquier orquestador

1. Identidad del agente vinculada al ACP (manifest id).
2. Heartbeats y resultados publicados en canal Slack `#ops-agents`.
3. Errores y costes reportados al proyecto Sentry del ACP/producto.
4. Ningún orquestador ejecuta tools fuera del allowlist del ACP.
