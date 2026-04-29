# Agent threat model

Modelo de amenazas específico para agentes IA dentro de octc-platform. Aplica a todos los ACPs `sensitivity:high` y como referencia para los demás.

## Vectores

| Vector | Descripción | Mitigación principal |
|--------|-------------|----------------------|
| Tool injection | Un input intenta forzar uso de tools fuera del allowlist. | `tools_allowlist_ref` versionado y validado en runtime. |
| MCP injection | Un MCP malicioso o comprometido inyecta instrucciones. | Solo MCPs de fuentes auditadas en CATALOG; revisión trimestral. |
| Context leakage | Información sensible recuperada en RAG/KB se filtra a usuarios sin permisos. | Filtrado por tenant/rol antes de RAG. PII scrubbing. |
| PII en traces | Datos personales viajan a Sentry/observabilidad. | `beforeSend` con redacción, configuración por proyecto. |
| Prompt injection | Inputs externos (web, archivos) cambian el objetivo del agente. | Plantilla CLAUDE.md prohíbe seguir instrucciones de fuentes no confiables sin confirmación. |
| Model poisoning | Un fine-tune o RAG compromete respuestas. | Solo modelos aprobados (declarados en manifest) y RAG firmado. |
| Cost exhaustion | Bucles infinitos o prompts caros agotan presupuesto. | Presupuesto por agente, alertas FinOps. |
| Data exfiltration via tool | Una tool con acceso a internet exfiltra datos sensibles. | Tools que salen al exterior requieren `sensitivity:high` doble-aprobación. |

## Controles

- L0–L1: documentación y declaración.
- L2: allowlist + GUARDRAILS + scrubbing.
- L3: telemetría con alertas.
- L4: evals adversariales en CI con bloqueo de release.

Ver [CONFORMANCE.md](../agents/CONFORMANCE.md) para detalles de tier.

## Revisión

- Trimestral, registrada en [docs/audit/HISTORY.md](../audit/HISTORY.md).
- Tras cada incidente clase A o B (ver [DR_BCP.md](../ops/DR_BCP.md)).
