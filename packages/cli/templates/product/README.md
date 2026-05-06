# Minimal template — OCTC product repository

Copy these files to the **root** of a new `***-app`** repository (or use as reference when creating a **template repository** on GitHub).

**Scope:** `.octc/monorepo.yaml`, `octc verify monorepo`, and `octc add|sync surface` apply to the product **application** monorepo; do not mix `***-agents`** / `***-workspace`** governance here.

Full procedure: [NEW_PRODUCT_REPO.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_PRODUCT_REPO.md) (**private org repo**).

## Included

- `.octc/monorepo.yaml` — minimal example (adjust `active_surfaces`, `paths`, `portfolio`).
- `.github/workflows/octc-portfolio-dispatch.yml` — calls the **reusable** workflow in `octc-platform` (`octc-portfolio-dispatch-callable.yml`) with `**secrets: inherit**`; configure `**OCTC_PORTFOLIO_DISPATCH_TOKEN**` at **org** level (recommended) or repo level.

Runbook: [PORTFOLIO_DISPATCH_SETUP.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/PORTFOLIO_DISPATCH_SETUP.md) (the callable must be deployed on `octc-platform` `main` before product dispatches succeed).
