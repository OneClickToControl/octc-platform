# AGENTS — `__PRODUCT__-agents`

Este repositorio es la **verdad de comportamiento** para los agentes del producto **__PRODUCT__**: skills, políticas, ACP y artefactos que consumen Cursor, Claude Code, OpenClaw, u otros runtimes declarados en el manifest.

## Límites

| Pertenece aquí | Pertenece en otro repo |
|----------------|------------------------|
| `agents/<acp-id>/manifest.json`, allowlists L2, perfiles de runtime documentados | Código de producto desplegable → `__PRODUCT__-app` |
| Guardrails y convenciones agénticas | Memoria, identidad, diario, restore → `__PRODUCT__-workspace` |

No uses este repo como almacén de estado operativo humano ni como monorepo de aplicación.

## OCTC

- `pnpm run octc:agents:verify` — alineación con plantillas de agente.
- `pnpm run octc:agents:sync` — baseline en `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/*`, `.octc/agents/manifest.schema.json` (solo sync baseline; no sustituye el ACP manifest en `agents/`).
