# Bootstrap — superficie `landing`

Generado por `octc add surface landing` / `octc sync surface landing`. Completar según [REFERENCE_PRODUCT_MONOREPO](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/REFERENCE_PRODUCT_MONOREPO.md) y `docs/architecture.md`.

**Alcance:** esta matriz y comandos `octc add|sync surface` aplican a repos de aplicación **`*-app`** (monorepo producto). Repos **`*-agents`** / **`*-workspace`** tienen gobierno aparte; no mezclar rutas ni jobs de esos repos en el `.octc/monorepo.yaml` del `*-app` sin plan explícito.

- Actualizar **`active_surfaces`**, **`.octc/monorepo.yaml`** y **PORTFOLIO** (`repo_surfaces`) en la misma ventana estructural cuando corresponda.
- Convención de rutas: `apps/landing/**` y/o `apps/web/**` (ver globs por defecto del CLI).
- Añadir jobs CI `paths:` y observabilidad **octc-{producto}-landing** cuando toque.
