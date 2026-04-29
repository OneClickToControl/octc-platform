# AUDIT 2026-Q2 — bootstrap

Auditoría inicial post-bootstrap de `octc-platform`. Cubre la creación del repo, estructura, plantillas, observabilidad, supply chain, FinOps, identidad, ADR, comms, DR/BCP y gobernanza.

## Alcance

- Repo `octc-platform` creado en local + GitHub bajo `OneClickToControl/`.
- Plan fundacional `octc-platform_fundacional.plan.md` (fuera del repo, en `~/.cursor/plans/`) reflejado en [PLATFORM_PLAN](../PLATFORM_PLAN.md).
- 18 entregables clave (ver §16 del plan) implementados como base mínima viable.
- Branch protection en `main` con 4 status checks requeridos.
- Primer extracto de paquetes `@1c2c/*` (`@1c2c/tsconfig`, `@1c2c/eslint-config`) iniciado en rama feature.

## Hallazgos

| id | severidad | hallazgo | acción | owner | fecha objetivo | estado |
|----|-----------|----------|--------|-------|----------------|--------|
| H-Q2-001 | media | Falta repo en GitHub (solo local). | Crear repo, push inicial, branch protection. | @1click2control | 2026-04-30 | **cerrado** 2026-04-29 (commit `e0fa286`, branch protection con 4 status checks) |
| H-Q2-002 | media | Aún no hay paquetes `@1c2c/*` extraídos. | Iniciar `@1c2c/eslint-config` y `@1c2c/tsconfig` desde `product`. | @1click2control | 2026-05-15 | **cerrado** 2026-04-29 (PR `feat/packages-bootstrap-tsconfig-eslint`) |
| H-Q2-003 | alta | Sentry org única todavía no creada formalmente. | Verificar org `oneclicktocontrol`, crear proyectos canónicos. | @1click2control | 2026-05-10 | abierto |
| H-Q2-004 | alta | SSO + 2FA enforcement por confirmar en GitHub/Vercel/Supabase/Sentry. | Auditar y forzar. | @1click2control | 2026-05-10 | **parcial** 2026-04-29: 2FA enforced en GitHub org (verificado API). Vercel/Supabase/Sentry/npm pendientes de auditoría. |
| H-Q2-005 | media | `tools_allowlist_ref` aún no definido para health-acp. | Documentar lista L2 en `product-acp`. | @1click2control | 2026-06-01 | abierto |
| H-Q2-006 | media | `verify.yml` aún no probado en CI real (repo sin push). | Push y verificar primer run verde. | @1click2control | 2026-04-30 | en progreso (tras fixes lychee) |
| H-Q2-007 | baja | DR/BCP no probado con drill real. | Programar drill anual antes de cierre Q3. | @1click2control | 2026-09-30 | abierto |
| H-Q2-008 | baja | Plantillas Sentry sin probar en stack real. | Smoke test en `product` y `product-b`. | @1click2control | 2026-05-30 | abierto |
| H-Q2-009 | media | FinOps LLM sin presupuesto numérico declarado. | Establecer baseline org y por producto en `LLM_COSTS.md`. | @1click2control | 2026-05-31 | abierto |
| H-Q2-010 | media | Falta gateway central LLM para enforcement modelo aprobado. | RFC y plan en Q3. | @1click2control | 2026-09-30 | abierto |
| H-Q2-011 | baja | Lychee falló en CI por links a `.cursor/plans/...` y fragmento `#retencion-por-sensibilidad`. | Cerrar enlaces externos al repo y añadir anchor explícito. | @1click2control | 2026-04-29 | **cerrado** 2026-04-29 (commit `38aa38b`) |

## Resumen

- Estructura base: **OK**.
- Documentación normativa cubre 18/18 entregables.
- Branch protection y CODEOWNERS activos.
- Quedan abiertos: setup Sentry, 2FA org, presupuestos LLM, drill DR, smoke tests Sentry, gateway LLM.

## Próxima auditoría

- 2026-Q3 (julio 2026), enfoque en adopción real (PORTFOLIO consumiendo `@1c2c/*` y Sentry vivo).
