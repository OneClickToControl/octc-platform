# Plantilla: CI para consumidores OCTC (Node / pnpm)

Referencia para `.github/workflows/verify.yml` (o `ci.yml`) en repos que consumen `@1c2c/*` y deben validar **firmas npm** tras el install, alineado a [SUPPLY_CHAIN.md](../../../docs/security/SUPPLY_CHAIN.md) y al pinning de actions en [SUPPLY_CHAIN.md § GitHub Actions](../../../docs/security/SUPPLY_CHAIN.md#github-actions).

## Contenido

| Archivo en esta carpeta | Destino en el repo adoptante |
|-------------------------|-------------------------------|
| `octc-consumer-verify.yml` | `.github/workflows/verify.yml` (o fusionar jobs en tu workflow existente) |

## Qué hace el workflow de referencia

1. Checkout con action **pinneada por SHA** (no tags móviles en producción).
2. **pnpm** + **Node** (cache opcional; ajusta `node-version-file` o versión fija).
3. `pnpm install --frozen-lockfile` (cambia por `npm ci` si el repo es npm-only).
4. **`pnpm dlx audit-signatures \|\| npm audit signatures`** después del install — corta el build si falla la verificación de firmas/provenance.
5. `lint` → `test --if-present` → `build` — sustituye por `turbo run …` o equivalente según el monorepo.
6. Bloque **comentado** para `pnpm exec octc-agents verify` cuando exista adopción de `@1c2c/agent-templates` (ver [ADOPTION.md](../../../docs/agents/ADOPTION.md)).
7. Bloque **comentado** para `pnpm exec octc verify monorepo` si el repo define `.octc/monorepo.yaml` ([ADR-0003](../../../docs/adr/ADR-0003-monorepo-cli-machine-ssot.md), plantilla en [`templates/monorepo/`](../../monorepo/README.md)).

## Pasos de adopción

1. Copia `octc-consumer-verify.yml` y revisa **nombres de ramas** (`main` vs `master`).
2. Alinea **versiones pinneadas** de `actions/*` con las que apruebe tu org (o deja que Dependabot las suba como PRs).
3. Sustituye los scripts `pnpm run lint|build` por los comandos reales del repo (`turbo`, `nx`, etc.).
4. Si no usas pnpm, elimina `pnpm/action-setup` y usa solo `setup-node` + `npm ci` + `npm audit signatures`.
5. Activa el workflow como **required** en branch protection para `main` (o `trunk`).

## Pinning de actions

Las referencias `uses:` deben ir por **SHA de commit** con comentario de tag (p. ej. `actions/checkout@11bd7… # v4.2.2`), no solo `@v4`; alinea con [SUPPLY_CHAIN](https://github.com/OneClickToControl/octc-platform/blob/main/docs/security/SUPPLY_CHAIN.md) y P2-6.

## Actualización

La versión canónica evoluciona en **OneClickToControl/octc-platform**. Tras mejoras aquí, diff contra tu copia y vuelve a pinneear SHAs si cambian los jobs.
