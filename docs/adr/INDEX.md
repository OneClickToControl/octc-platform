# Architecture Decision Records — INDEX

ADR estándar (Markdown Any Decision Records) para decisiones arquitectónicas de la plataforma. Cada ADR se numera consecutivamente y se referencia desde aquí.

## Estados

- **proposed**: en debate.
- **accepted**: vigente.
- **deprecated**: superado, mantenerse como referencia histórica.
- **superseded**: reemplazado por otro ADR (referenciar el sucesor).

## Índice

| nº | título | estado | fecha | tags |
|----|--------|--------|-------|------|
| [0001](ADR-0001-polyrepo-platform.md) | Polyrepo + repo `octc-platform` como SSOT | accepted | 2026-04-29 | platform, repo |
| [0002](ADR-0002-acp-pattern.md) | Patrón Agent Capability Provider (ACP) | accepted | 2026-04-29 | agents, governance |

## Cómo crear un ADR nuevo

1. Copiar `_TEMPLATE.md`.
2. Numerar consecutivamente (`ADR-XXXX-slug.md`).
3. PR a `octc-platform` con discusión en el PR; al mergear, marcar `accepted`.
4. Actualizar este INDEX.
