# Agent Capability Provider — REGISTRY

Inventario vivo de todos los **Agent Capability Providers (ACP)** de OneClickToControl LLC. Cada fila es la versión humana de un manifest validado por el schema [`schemas/octc-agent-provider.manifest.v1.json`](../../schemas/octc-agent-provider.manifest.v1.json) y la CI [`.github/workflows/verify.yml`](../../.github/workflows/verify.yml).

## Convenciones

- `id` debe coincidir con el manifest del ACP.
- `tier_target` y `tier_actual` se actualizan al cerrar checklists de [CONFORMANCE.md](CONFORMANCE.md).
- `sensitivity:high` requiere mínimo `L2`.
- `tools_allowlist_ref` es obligatorio para `L2+` y debe estar versionado.
- `sentry_project` obligatorio para `L3+`.

## ACPs registrados

| id | owning_product | runtimes | tier_target | tier_actual | sensitivity | tools_allowlist_ref | sentry_project | owner | notas |
|----|----------------|----------|-------------|-------------|-------------|---------------------|----------------|-------|-------|
| _(vacío al bootstrap; los ACPs se irán registrando)_ |  |  |  |  |  |  |  |  |  |

## Cómo registrar un ACP nuevo

1. Crear `agents/<acp-id>/manifest.json` en el repo del ACP siguiendo el schema.
2. Añadir fila a este REGISTRY mediante PR (CODEOWNERS exige aprobación de plataforma).
3. Marcar `tier_target` realista según [CONFORMANCE.md](CONFORMANCE.md).
4. Documentar fuentes/destinos en `docs/agents/RUNTIME_SYNC.md` cuando aplique.
5. Si `sensitivity:high`, completar previamente la sección correspondiente del [AGENT_THREAT_MODEL](../security/AGENT_THREAT_MODEL.md).
