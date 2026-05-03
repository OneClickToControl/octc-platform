# Agent Capability Provider — REGISTRY

Inventario de **Agent Capability Providers (ACP)** de OneClickToControl LLC. Cada fila productiva debe corresponder a un manifest validado por [`schemas/octc-agent-provider.manifest.v1.json`](../../schemas/octc-agent-provider.manifest.v1.json) y a la CI [`.github/workflows/verify.yml`](../../.github/workflows/verify.yml).

## Convenciones

- `id` debe coincidir con el manifest del ACP.
- `tier_target` y `tier_actual` se actualizan al cerrar checklists de [CONFORMANCE.md](CONFORMANCE.md).
- `sensitivity:high` requiere mínimo `L2`.
- `tools_allowlist_ref` es obligatorio para `L2+` y debe estar versionado.
- `sentry_project` obligatorio para `L3+`.
- En documentación **interna**, la tabla `REGISTRY.md` incluye **`manifest_version`**: debe coincidir con el campo `version` (semver) del manifest en el repo `*-agents`.

## Inventario de la organización

**No se publica aquí** el listado de ACPs reales ni nombres de repos privados (ver [PUBLIC_REPO_POLICY.md](../security/PUBLIC_REPO_POLICY.md)). En el companion **`octc-platform-internal`** (restringido) conviven tres capas, todas alineadas a [PORTFOLIO.md](../PORTFOLIO.md):

| Capa | Ubicación (internal) | Rol |
|------|----------------------|-----|
| Manifest en cada repo **`*-agents`** | `agents/<acp-id>/manifest.json` | **SSOT normativa** del ACP (JSON Schema público). |
| Registry **automatizado** | `docs/agents/registry/<acp-id>.json` | **SSOT operativo / máquina**: snapshot generado por `octc_acp_sync` (PRs automáticos). No sustituye al manifest; lo refleja + metadata de sync. |
| REGISTRY **humano** | [`docs/agents/REGISTRY.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/agents/REGISTRY.md) | Tabla resumida para la org (incluye columna **`manifest_version`**, semver del campo `version` del manifest); se actualiza en hitos o cuando cambian tiers, semver o punteros notables. |

**Este archivo** (`octc-platform`) conserva **solo política, convenciones y ejemplos**; no duplica filas productivas ni JSON de catálogo.

Runbook operativo (smoke, merge de PRs del registry): [`ACP_REGISTRY_OPERATIONS.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/ACP_REGISTRY_OPERATIONS.md) en internal.

## Fila ilustrativa (sintaxis únicamente)

| id | owning_product | runtimes | tier_target | tier_actual | sensitivity | tools_allowlist_ref | sentry_project | owner | manifest_version | notas |
|----|----------------|----------|-------------|-------------|-------------|---------------------|----------------|-------|------------------|-------|
| example-product-acp | *(ejemplo; no es un ACP real)* | cursor, http | L0 | L0 | low | `docs/agents/TOOLS_ALLOWLIST_L2.md` (ruta en repo del ACP) | n/a | @1click2control | **0.1.0** | Manifest en `agents/example-product-acp/manifest.json` en el repo del ACP. En internal, alinear `manifest_version` con ese campo. |

## Cómo registrar un ACP nuevo

1. Crear `agents/<acp-id>/manifest.json` en el repo del ACP siguiendo el schema.
2. Añadir la fila al **REGISTRY interno** (tabla humana) y coherencia en **PORTFOLIO** mediante PR al repo privado; el archivo **`docs/agents/registry/<acp-id>.json`** aparecerá **solo** cuando el repo `*-agents` esté en allowlist y el dispatch `octc_acp_sync` haya corrido (PR automático en internal).
3. Marcar `tier_target` realista según [CONFORMANCE.md](CONFORMANCE.md).
4. Documentar fuentes/destinos en `docs/agents/RUNTIME_SYNC.md` cuando aplique.
5. Si `sensitivity:high`, completar previamente la sección correspondiente del [AGENT_THREAT_MODEL](../security/AGENT_THREAT_MODEL.md).
