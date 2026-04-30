# Golden path

Camino estándar para crear o adoptar un repo nuevo en la plataforma.

## Pasos

1. Abrir issue en `octc-platform` con plantilla `repo-bootstrap`.
2. Crear repo en GitHub bajo la org. Activar branch protection y SSO.
3. Registrar el repo en **PORTFOLIO** del companion privado [`octc-platform-internal`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/PORTFOLIO.md) (PR a ese repo; ver [PORTFOLIO en este repo](../PORTFOLIO.md) como puntero).
4. Adoptar `@1c2c/eslint-config`, `@1c2c/tsconfig`, `@1c2c/agent-templates` y, para la CLI unificada, **`@1c2c/cli`** (`npx @1c2c/cli sync agents` delega en `octc-agents`).
5. Copiar la estructura mínima de [DOCUMENTATION_TREE.md](DOCUMENTATION_TREE.md); si habrá más de un cliente o backend servido, leer [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md) y elegir [arquetipo](REPO_ARCHETYPES.md).
6. En `docs/architecture.md`, declarar **`active_surfaces`** y la tabla **superficie ↔ rutas** (`apps/*`, `supabase/`, `packages/*`, …). Opcional: duplicar el contrato en **`.octc/monorepo.yaml`** (plantilla [`templates/monorepo/monorepo.yaml.example`](../../templates/monorepo/monorepo.yaml.example)) y validar con `pnpm exec octc verify monorepo` (`@1c2c/cli` ≥ 0.2.0, ver [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md)). Tras el primer despliegue real, validar con [MONOREPO_CONFORMANCE_CHECKLIST.md](MONOREPO_CONFORMANCE_CHECKLIST.md).
7. Si el repo expone capacidades a agentes: declarar manifest en `agents/<acp>/manifest.json`, registrar en [REGISTRY](../agents/REGISTRY.md), apuntar a tier objetivo.
8. Configurar Sentry: crear proyectos en la org única siguiendo `octc-{producto}-{surface}` y subir source maps en CI ([SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md)).
9. Configurar CI de verificación: copiar y adaptar [`templates/governance/ci/octc-consumer-verify.yml`](../../templates/governance/ci/octc-consumer-verify.yml) (instalar → `pnpm dlx audit-signatures || npm audit signatures` → lint/build; opcional `octc agents verify` y **`octc verify monorepo`** si usas `.octc/monorepo.yaml`). En monorepos multi-superficie, añadir matriz de jobs y `paths` como en [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md) § Matriz CI. Detalle en [README de la plantilla](../../templates/governance/ci/README.md).
10. PR final cierra el issue del paso 1 con checklist completo.

## Indicadores de adopción

- Tiempo medio de bootstrap < 1 día.
- 100% de repos nuevos con SCORECARD verde en su primera revisión.

## Plantilla de issue

Ver [templates/governance/ISSUE_TEMPLATE/repo_bootstrap.yml](../../templates/governance/ISSUE_TEMPLATE/repo_bootstrap.yml) (creada en bootstrap).
