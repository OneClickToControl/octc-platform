# Adoption

Cómo se mide y promueve la adopción de octc-platform en los repos de la org.

## Señales

- `agent_templates_pin` actualizado (≤ 1 minor de retraso).
- `at1c2c_pin` actualizado (≤ 1 minor de retraso).
- ACPs registrados con tier ≥ L1.
- Sentry projects vivos con eventos las últimas 24h.
- CODEOWNERS poblado con humanos reales.

## Programa

- Cada trimestre la plataforma publica una **release notes** ([template](../comms/RELEASE_NOTES_TEMPLATE.md)) con cambios destacados y migraciones pendientes.
- Repos con KPIs en rojo reciben **office hours** específicas y pair sessions.
- Repos en verde 4 trimestres consecutivos figuran como “gold standard” en el SCORECARD.

## Métricas

Se reportan en [PLATFORM_SCORECARD.md](../metrics/PLATFORM_SCORECARD.md).

## Monorepos de producto

Repos con varias superficies (web, mobile, datos Supabase, ML, etc.) deben seguir el patrón [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md), declarar `active_surfaces` en `docs/architecture.md` y usar [MONOREPO_CONFORMANCE_CHECKLIST.md](MONOREPO_CONFORMANCE_CHECKLIST.md) en cambios estructurales. El camino de bootstrap sigue en [GOLDEN_PATH.md](GOLDEN_PATH.md).
