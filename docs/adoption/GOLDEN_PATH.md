# Golden path

Camino estándar para crear o adoptar un repo nuevo en la plataforma.

## Pasos

1. Abrir issue en `octc-platform` con plantilla `repo-bootstrap`.
2. Crear repo en GitHub bajo la org. Activar branch protection y SSO.
3. Registrar el repo en [PORTFOLIO.md](../PORTFOLIO.md) (PR a octc-platform).
4. Adoptar `@1c2c/eslint-config`, `@1c2c/tsconfig`, `@1c2c/agent-templates`.
5. Copiar la estructura mínima de [DOCUMENTATION_TREE.md](DOCUMENTATION_TREE.md).
6. Si el repo expone capacidades a agentes: declarar manifest en `agents/<acp>/manifest.json`, registrar en [REGISTRY](../agents/REGISTRY.md), apuntar a tier objetivo.
7. Configurar Sentry: crear proyectos en la org única siguiendo `octc-{producto}-{surface}` y subir source maps en CI ([SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md)).
8. Configurar CI de verificación: copiar y adaptar [`templates/governance/ci/octc-consumer-verify.yml`](../../templates/governance/ci/octc-consumer-verify.yml) (instalar → `pnpm dlx audit-signatures || npm audit signatures` → lint/build; opcional `octc-agents verify`). Detalle en [README de la plantilla](../../templates/governance/ci/README.md).
9. PR final cierra el issue del paso 1 con checklist completo.

## Indicadores de adopción

- Tiempo medio de bootstrap < 1 día.
- 100% de repos nuevos con SCORECARD verde en su primera revisión.

## Plantilla de issue

Ver [templates/governance/ISSUE_TEMPLATE/repo_bootstrap.yml](../../templates/governance/ISSUE_TEMPLATE/repo_bootstrap.yml) (creada en bootstrap).
