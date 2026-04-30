# Agent Capability Provider — REGISTRY

Inventario de **Agent Capability Providers (ACP)** de OneClickToControl LLC. Cada fila productiva debe corresponder a un manifest validado por [`schemas/octc-agent-provider.manifest.v1.json`](../../schemas/octc-agent-provider.manifest.v1.json) y a la CI [`.github/workflows/verify.yml`](../../.github/workflows/verify.yml).

## Convenciones

- `id` debe coincidir con el manifest del ACP.
- `tier_target` y `tier_actual` se actualizan al cerrar checklists de [CONFORMANCE.md](CONFORMANCE.md).
- `sensitivity:high` requiere mínimo `L2`.
- `tools_allowlist_ref` es obligatorio para `L2+` y debe estar versionado.
- `sentry_project` obligatorio para `L3+`.

## Inventario de la organización

**No se publica aquí** el listado de ACPs reales ni nombres de repos privados (ver [PUBLIC_REPO_POLICY.md](../security/PUBLIC_REPO_POLICY.md)). El registro vivo con IDs, tiers y punteros a repos está en el companion **`octc-platform-internal`**: [`docs/agents/REGISTRY.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/agents/REGISTRY.md) (**access-restricted**), alineado a [PORTFOLIO.md](../PORTFOLIO.md).

## Fila ilustrativa (sintaxis únicamente)

| id | owning_product | runtimes | tier_target | tier_actual | sensitivity | tools_allowlist_ref | sentry_project | owner | notas |
|----|----------------|----------|-------------|-------------|-------------|---------------------|----------------|-------|-------|
| example-product-acp | *(ejemplo; no es un ACP real)* | cursor, http | L0 | L0 | low | `docs/agents/TOOLS_ALLOWLIST_L2.md` (ruta en repo del ACP) | n/a | @1click2control | Manifest en `agents/example-product-acp/manifest.json` en el repo del ACP. Sustituir por IDs reales solo en documentación interna. |

## Cómo registrar un ACP nuevo

1. Crear `agents/<acp-id>/manifest.json` en el repo del ACP siguiendo el schema.
2. Añadir la fila al **REGISTRY interno** y coherencia en **PORTFOLIO** mediante PR al repo privado (y aquí solo cambios genéricos al proceso si aplica).
3. Marcar `tier_target` realista según [CONFORMANCE.md](CONFORMANCE.md).
4. Documentar fuentes/destinos en `docs/agents/RUNTIME_SYNC.md` cuando aplique.
5. Si `sensitivity:high`, completar previamente la sección correspondiente del [AGENT_THREAT_MODEL](../security/AGENT_THREAT_MODEL.md).
