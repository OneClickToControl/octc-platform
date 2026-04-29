# PLATFORM_PLAN

Este archivo es el **espejo canónico vigente** del plan fundacional. La fuente original es `octc-platform_fundacional.plan.md`, mantenida fuera del repo bajo `~/.cursor/plans/` por el dueño de la plataforma. Este espejo se versiona en el repo para que sea referenciable desde todos los archivos `docs/` y desde otros repos.

## Cómo se mantiene sincronizado

- Cualquier cambio sustantivo al plan se discute primero como **RFC** en [docs/comms/RFC_TEMPLATE.md](comms/RFC_TEMPLATE.md).
- Tras aprobación se decanta a un **ADR** en [docs/adr/INDEX.md](adr/INDEX.md) y se actualiza este archivo.
- Cadencia mínima de revisión: trimestral, con **Apéndice C** del plan fundacional renovado.

## Estado actual

- **Fase:** 0 (bootstrap del repo) → 1 (estándares y plantillas).
- **Tiers ACP objetivo Q2 2026:** todos los ACPs en L0; `sensitivity:high` en L2.
- **Hallazgos auditoría inicial:** ver [docs/audit/HISTORY.md](audit/HISTORY.md).

## Resumen del modelo

Tres planos:

1. **Normativa** (este repo): plantillas, schemas, REGISTRY, CONFORMANCE, políticas (security, observabilidad, FinOps, DR/BCP, identidad).
2. **Capacidades** (repos `*-agents` o `agents/` en producto): skills, MCP, GUARDRAILS.
3. **Ejecución** (Cursor, Claude Code, OpenClaw, Paperclip opcional, CI agents): heartbeats, tickets, presupuestos.

> Para detalle, ver el plan fundacional completo. No duplicar el cuerpo del plan aquí — solo punteros y diferencias.
