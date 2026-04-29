# ACP Conformance — Tiers L0–L4

Los Agent Capability Providers (ACP) declaran un `conformance_tier_target` en su manifest. Los tiers son acumulativos: L1 incluye todo lo de L0, etc.

## L0 — Declarado

- Manifest válido contra el schema y referenciado en [REGISTRY.md](REGISTRY.md).
- `owner` declarado.
- `repositories[]` apunta a destinos reales.

## L1 — Documentado

- README del ACP con propósito, alcance, runtimes soportados.
- `upstream_sources[]` y `downstream_deployments[]` poblados (mínimo 1 cada uno).
- Plantillas `CLAUDE.md` y `.cursor/rules/` extendiendo `@1c2c/agent-templates` versionado.

## L2 — Seguridad mínima

- `tools_allowlist_ref` apuntando a archivo versionado en el repo del ACP.
- GUARDRAILS documentados (qué no debe hacer el agente).
- PII scrubbing en logs/traces (alineado con [SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md) y `beforeSend` Sentry).
- Datos de entrada clasificados (none/low/high) según [DATA_CLASSIFICATION.md](../compliance/DATA_CLASSIFICATION.md).

## L3 — Observado

- Telemetría agéntica activa: breadcrumbs Sentry y AI Monitoring spans configurados (ver [AGENT_TELEMETRY.md](../observability/AGENT_TELEMETRY.md)).
- `sentry_project` declarado en manifest y vivo.
- Alertas mínimas: `eval_pass_rate` < umbral, picos de latencia/coste, errores no manejados.
- Tablero FinOps por ACP en [LLM_COSTS.md](../finops/LLM_COSTS.md).

## L4 — Auditado en continuo

- Suite de **evals** ejecutada en CI (golden set + adversarial).
- Reporte de evals adjunto a cada release del ACP.
- Revisión trimestral del `tools_allowlist_ref` registrada en [docs/audit/HISTORY.md](../audit/HISTORY.md).
- Métricas de calidad agéntica reportadas en [QUALITY_METRICS.md](QUALITY_METRICS.md) y agregadas en el SCORECARD.

## Promociones y retrocesos

- La promoción se aprueba por PR con evidencia (links, screenshots, logs).
- Un ACP puede **retroceder** a un tier inferior si pierde alertas, allowlist o evals; documentar en HISTORY.
