# Bootstrap — superficie `web`

Generado por `octc add surface web` / `octc sync surface web`. Completar según [REFERENCE_PRODUCT_MONOREPO](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/REFERENCE_PRODUCT_MONOREPO.md) y `docs/architecture.md`.

**Alcance:** repos **`*-app`** únicamente; no mezclar entregables de **`*-agents`** / **`*-workspace`** en el monorepo del app.

- Actualizar **`active_surfaces`**, **`.octc/monorepo.yaml`** y **PORTFOLIO** cuando corresponda.
- Convención típica: `apps/web/**`. Si hay tipos compartidos, declarar `packages/**` en `paths.web` (y en otras superficies consumidoras).
- Observabilidad: **octc-{producto}-web**.
