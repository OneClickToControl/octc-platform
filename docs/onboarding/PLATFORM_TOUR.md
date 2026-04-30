# Platform tour (30 min)

Tour humano de `octc-platform` para nuevos contribuidores. Léelo de principio a fin antes de tu primer PR.

## 1. Qué es octc-platform (5 min)

- Repo SSOT de OneClickToControl LLC.
- Lo que vive aquí: paquetes `@1c2c/*`, plantillas de agentes, schemas, políticas, registry de ACPs.
- Lo que **no** vive aquí: roadmap de productos, código de productos, datos de usuarios.

Lectura mínima:
- [README](../../README.md)
- [PORTFOLIO](../PORTFOLIO.md)
- [ADR-0001](../adr/ADR-0001-polyrepo-platform.md)

## 2. Arquitectura mental (5 min)

Tres planos:
1. **Normativa** (este repo): plantillas, schemas, políticas.
2. **Capacidades** (ACPs en repos `*-agents` o `agents/<acp>/` en producto): skills, MCP, GUARDRAILS.
3. **Ejecución** (Cursor, Claude Code, OpenClaw, Paperclip, CI): heartbeats y resultados.

Lectura mínima:
- [ADR-0002](../adr/ADR-0002-acp-pattern.md)
- [agents/REGISTRY](../agents/REGISTRY.md)
- [agents/CONFORMANCE](../agents/CONFORMANCE.md)

## 3. Cómo se cambia algo (5 min)

- Cambios pequeños: PR directo con CODEOWNERS.
- Cambios estructurales: RFC ([template](../comms/RFC_TEMPLATE.md)) → debate → ADR ([template](../adr/_TEMPLATE.md)) → PR.
- Cambios en plantillas o schemas: doble revisión obligatoria.

## 4. Observabilidad (5 min)

- Sentry org única, un proyecto por (producto, surface).
- AI Monitoring para agentes.
- Sourcemaps subidos via OIDC.
- Lectura: [OBSERVABILITY](../observability/OBSERVABILITY.md), [AGENT_TELEMETRY](../observability/AGENT_TELEMETRY.md).

## 5. Seguridad y supply chain (5 min)

- OIDC para publish y deploy.
- Provenance consumer-side obligatorio.
- SSO + 2FA enforced.
- Lectura: [SUPPLY_CHAIN](../security/SUPPLY_CHAIN.md), [IDENTITY_ACCESS](../governance/IDENTITY_ACCESS.md).

## 6. FinOps LLM (3 min)

- Cada agente declara presupuesto y modelo aprobado.
- Métricas por agente / producto.
- Lectura: [LLM_COSTS](../finops/LLM_COSTS.md).

## 7. Operación e incidentes (2 min)

- DR/BCP con drills semestrales.
- Runbook con procedimientos.
- Canales: `#ops`, `#ops-incidents`, `#ops-agents`, `#ops-finops`.
- Lectura: [DR_BCP](../ops/DR_BCP.md), [PLATFORM_RUNBOOK](../ops/PLATFORM_RUNBOOK.md), [CHANNELS](../comms/CHANNELS.md).

## 8. Monorepos de producto (cuando apliquen)

- Superficies (`landing`, `web`, `data`, `mobile`, `ml`, `api`, `chat`) declaradas en `docs/architecture.md` y espejadas en PORTFOLIO (`repo_surfaces`).
- Patrón de referencia (CI por `paths`, docs-only, scripts, paquetes compartidos): [REFERENCE_PRODUCT_MONOREPO](../adoption/REFERENCE_PRODUCT_MONOREPO.md), [REPO_ARCHETYPES](../adoption/REPO_ARCHETYPES.md), [checklist](../adoption/MONOREPO_CONFORMANCE_CHECKLIST.md).
- Camino de adopción: [GOLDEN_PATH](../adoption/GOLDEN_PATH.md).

## Tu primera contribución

Sigue [CONTRIBUTING](../../CONTRIBUTING.md) y abre un issue tagueado `good-first-issue` o pide al owner una entrada concreta.

## Recursos

- [Plan fundacional](../PLATFORM_PLAN.md)
- [SCORECARD vigente](../metrics/PLATFORM_SCORECARD.md)
- [Auditoría visible](../audit/HISTORY.md)
