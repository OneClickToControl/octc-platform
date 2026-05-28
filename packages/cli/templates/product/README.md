# Minimal template — OCTC product repository

Copy these files to the **root** of a new `***-app`** repository (or use as reference when creating a **template repository** on GitHub).

**Scope:** `.octc/monorepo.yaml`, `octc verify monorepo`, and `octc add|sync surface` apply to the product **application** monorepo; do not mix `***-agents`** / `***-workspace`** governance here.

Full procedure: [NEW_PRODUCT_REPO.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_PRODUCT_REPO.md) (**private org repo**).

## Included

- `package.json` — **contrato mínimo `@1c2c/cli`** (shell npm; obligatorio en fábrica y productos nuevos).
- `.octc/monorepo.yaml` — minimal example (adjust `active_surfaces`, `paths`, `portfolio`).
- `.github/workflows/octc-platform-verify.yml` — firmas npm + `octc verify monorepo`.
- `.github/workflows/octc-portfolio-dispatch.yml` — calls the **reusable** workflow in `octc-platform` (`octc-portfolio-dispatch-callable.yml`) with **`secrets: inherit`**; configure **`OCTC_PORTFOLIO_DISPATCH_TOKEN`** at **org** level (recommended) or repo level.
- `.github/workflows/octc-factory-operation-notify.yml` — OAO thin → callable platform (**solo `*-app`**).

Runbook: [PORTFOLIO_DISPATCH_SETUP.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/PORTFOLIO_DISPATCH_SETUP.md) (the callable must be deployed on `octc-platform` `main` before product dispatches succeed).

**Fábrica:** `bootstrap-product-family.sh` / autopilot deben materializar vía `npx @1c2c/cli init app` (este template), no copiar YAML paralelo sin `package.json`.
