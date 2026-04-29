# PORTFOLIO

Inventario vivo de todos los repositorios de OneClickToControl LLC. Cada repo declara tipo, dueño, sensibilidad de datos, integración con la plataforma (versión `@1c2c/*` y plantilla agente), y referencia a su Agent Capability Provider (ACP) cuando aplique.

## Convenciones de columnas

| Columna | Descripción |
|---------|-------------|
| `repo` | Nombre del repo en GitHub. |
| `type` | `platform` · `product` · `acp` · `runtime` · `brand` · `legacy`. |
| `owner` | Persona o rol responsable. |
| `data_sensitivity` | `none` · `low` · `high`. |
| `agent_templates_pin` | Versión consumida de `@1c2c/agent-templates` (TBD si aún no adoptado). |
| `at1c2c_pin` | Versión consumida de `@1c2c/eslint-config` y/o `@1c2c/tsconfig`. |
| `acp_id` | id del manifest del ACP que provee skills/MCP a este repo. |
| `acp_tier` | `L0`–`L4` declarado en el manifest. |
| `sentry_project` | nombre `octc-{producto}-{surface}` o `n/a`. |
| `notes` | observaciones (excepciones, plan de migración, etc.). |

## Repos registrados

| repo | type | owner | data_sensitivity | agent_templates_pin | at1c2c_pin | acp_id | acp_tier | sentry_project | notes |
|------|------|-------|------------------|---------------------|------------|--------|----------|-----------------|-------|
| octc-platform | platform | @1click2control | low | n/a (origen) | n/a (origen) | n/a | n/a | octc-platform-meta | bootstrap Q2 2026 |
| 1click2control | brand | @1click2control | low | TBD | TBD | TBD | TBD | TBD | producto plantilla marca |
| product | product | @1click2control | high | TBD | TBD | health-acp | TBD | octc-health-{web,mobile,ml} | donante maduro |
| product-acp | acp | @1click2control | high | TBD | TBD | health-acp | TBD | octc-health-acp | canon skills/MCP histórico |
| product-b | product | @1click2control | low | TBD | TBD | store-acp (futuro) | TBD | octc-store-{web} | MVP region-x |
| product-c | product | @1click2control | low | TBD | TBD | strategy-acp (futuro) | TBD | octc-strategy-{ml,api} | python heavy |
| workspace-runtime | runtime | @1click2control | high | TBD | n/a | n/a | n/a | octc-openclaw-enlaza | runtime workspace |
| legacy-copilot | legacy | @1click2control | low | TBD | TBD | TBD | TBD | TBD | revisar pertinencia |

## Casos de negocio (no inflar el cuerpo del plan)

Cualquier iniciativa de negocio se refleja como **fila adicional o nota** en este archivo y documentación detallada en el repo del producto. La frontera producto vs plataforma se documenta usando [docs/boundaries/_TEMPLATE_product-vs-platform.md](boundaries/_TEMPLATE_product-vs-platform.md).

## Cadencia

Revisión **trimestral** alineada con el SCORECARD ([docs/metrics/PLATFORM_SCORECARD.md](metrics/PLATFORM_SCORECARD.md)).
