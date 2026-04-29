# ADR-0002: Patrón Agent Capability Provider (ACP)

- **Estado**: accepted
- **Fecha**: 2026-04-29
- **Tags**: agents, governance, platform

## Contexto

OneClickToControl LLC tiene múltiples agentes IA (coding, ops, client, eval) que se ejecutan en runtimes distintos (Cursor, Claude Code/Desktop, OpenClaw, Codex, posible Paperclip). Necesitamos:

- Catálogo único de capacidades (skills, MCP, tools).
- Política única de seguridad y telemetría agéntica.
- Sin SSOT distribuido en cada runtime.

## Decisión

Adoptamos el patrón **Agent Capability Provider (ACP)**:

- Cada repo que provee skills/MCP/tools a agentes es un **ACP**.
- Cada ACP publica un `agents/<acp-id>/manifest.json` validado por `schemas/octc-agent-provider.manifest.v1.json`.
- ACPs se registran en `docs/agents/REGISTRY.md`.
- Tiers L0–L4 ([CONFORMANCE](../agents/CONFORMANCE.md)) clasifican madurez.
- Plantillas, observabilidad, FinOps y allowlists son normativas en `octc-platform`.

## Consecuencias

### Positivas
- Capacidades reutilizables sin duplicar código.
- Política única auditada (CONFORMANCE).
- Soporte natural a multi-runtime con `octc-sync` (planeado).

### Negativas
- Carga de gobernanza (cada ACP debe mantener manifest, allowlist, telemetría).
- Curva de adopción para repos pequeños (mitigada con tier L0).

## Alternativas consideradas

- **Sin abstracción** (cada repo declara sus skills ad hoc): descartado por imposibilidad de auditoría.
- **Plataforma como mono-ACP centralizado**: descartado, no escala con la heterogeneidad de productos.

## Notas y referencias

- [REGISTRY](../agents/REGISTRY.md).
- [CONFORMANCE](../agents/CONFORMANCE.md).
- [Schema](../../schemas/octc-agent-provider.manifest.v1.json).
