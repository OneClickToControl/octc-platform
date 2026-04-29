# ADR-0001: Polyrepo + repo `octc-platform` como SSOT

- **Estado**: accepted
- **Fecha**: 2026-04-29
- **Tags**: platform, repo, governance

## Contexto

OneClickToControl LLC opera múltiples productos (`product`, `product-b`, `product-c`, `1click2control`) y servicios de soporte (agentes, runtimes). La pregunta: ¿monorepo único o polyrepo con un repo de plataforma compartido?

Restricciones:
- Equipos pequeños, alta exigencia de DX.
- Productos con stacks heterogéneos (Next.js, Flutter, Python ML).
- Necesidad de reglas y plantillas comunes para agentes IA.
- Seguridad/observabilidad consistentes.

## Decisión

Adoptamos **polyrepo** con un repo dedicado `octc-platform` como **Single Source of Truth** para:

- Paquetes compartidos publicados como `@1c2c/*`.
- Plantillas de agentes (`CLAUDE.md`, `.cursor/rules`, `AGENTS.md`).
- Schemas, políticas, governance, observabilidad, FinOps, supply chain.
- Documentación transversal y registry de capacidades agénticas (ACP).

Cada producto vive en su repo y consume la plataforma por **versión** (`@1c2c/*` y plantillas).

## Consecuencias

### Positivas
- Aislamiento por producto: blast radius reducido.
- Releases independientes y rollback granular.
- Onboarding más simple por repo.
- Permite stacks heterogéneos sin contagio de tooling.

### Negativas
- Coordinación de versiones entre repos requiere disciplina.
- Cambios cross-cutting necesitan PRs en múltiples repos.

### Neutras
- Necesidad de un PORTFOLIO vivo y un SCORECARD para rastrear adopción.

## Alternativas consideradas

- **Monorepo (Turborepo/Nx)**: descartado por tamaño actual del equipo y coste de tooling unificado para stacks dispares.
- **Repo único `1click2control` con submódulos**: descartado por fricción operativa.

## Notas y referencias

- Plan fundacional ([PLATFORM_PLAN](../PLATFORM_PLAN.md)).
- [PORTFOLIO](../PORTFOLIO.md).
