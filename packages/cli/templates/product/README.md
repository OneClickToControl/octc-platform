# Plantilla mínima — repo producto OCTC

Copia estos archivos a la **raíz** de un repositorio `***-app`** nuevo (o úsalo como referencia al crear un **template repository** en GitHub).

**Alcance:** `.octc/monorepo.yaml`, `octc verify monorepo` y `octc add|sync surface` aplican al monorepo de **aplicación**; no mezcles aquí gobierno de `***-agents`** / `***-workspace**`.

Pasos completos: [NEW_PRODUCT_REPO.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_PRODUCT_REPO.md) (**repo interno**).

## Incluye

- `.octc/monorepo.yaml` — ejemplo mínimo (ajusta `active_surfaces`, `paths`, `portfolio`).
- `.github/workflows/octc-portfolio-dispatch.yml` — llama al workflow **reutilizable** en `octc-platform` (`octc-portfolio-dispatch-callable.yml`) con `**secrets: inherit`**; configurar `**OCTC_PORTFOLIO_DISPATCH_TOKEN**` a nivel **org** (recomendado) o del repo.

Runbook: [PORTFOLIO_DISPATCH_SETUP.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/PORTFOLIO_DISPATCH_SETUP.md) (deploy del callable debe estar en `main` de `octc-platform` antes de que los dispatch en producto pasen).