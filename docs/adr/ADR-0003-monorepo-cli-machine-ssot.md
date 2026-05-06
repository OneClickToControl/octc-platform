# ADR-0003: Machine-readable monorepo SSOT and CLI (`verify` / `add surface`)

- **Status**: accepted
- **Date**: 2026-05-01
- **Tags**: platform, cli, monorepo, governance

## Context

The human-readable product monorepo pattern lives in [`docs/adoption/REFERENCE_PRODUCT_MONOREPO.md`](../adoption/REFERENCE_PRODUCT_MONOREPO.md): `active_surfaces`, traceability, checklist, and internal PORTFOLIO. That **does not** yet allow:

- CI checks that the **filesystem** and **workflows** reflect declared surfaces without manual review.
- **Materializing** minimal stubs when declaring a new surface (e.g. `data` → `supabase/` stub, `docs/db`).
- A **controlled bridge** to `octc-platform-internal` (e.g. suggesting `repo_surfaces` updates) without promising sync “without org credentials”.

Adoption plan phases 1–2 closed the **narrative contract**; this ADR sets direction for **Phase 4** in `@1c2c/cli` and the associated machine-readable format.

## Decision

1. **Optional but recommended SSOT file** in adopting repos: **`.octc/monorepo.yaml`** (YAML 1.2, UTF-8) at the repo root, versioned in git. Initial semantics (v0):
   - `schema_version: 0` — integer; bump on incompatible schema changes documented in the CLI package CHANGELOG.
   - `active_surfaces` — ordered list of strings in the canonical vocabulary (`landing`, `web`, `mobile`, `ml`, `api`, `chat`, `data`).
   - `paths` — optional map **surface → list of globs or prefixed paths** relative to repo root (e.g. `web: ["apps/web/**"]`, `data: ["supabase/**"]`). Globs guide `verify`; exact interpretation is the command implementation.
   - `portfolio` — optional: non-sensitive keys aligned with PORTFOLIO (e.g. duplicate `repo_surfaces_csv` only if you want cross-linting; **do not** paste cloud URLs or secrets).

2. **Until `verify` is mandatory**, the table in `docs/architecture.md` remains required for humans; when a repo enables `.octc/monorepo.yaml`, it **must** match order and membership of `active_surfaces` in prose (same rule as PORTFOLIO `repo_surfaces`).

3. **`@1c2c/cli` commands (as published):**
   - `octc verify monorepo` — read `.octc/monorepo.yaml`; validate paths and documented rules (consistency lint); additional rules on `packages/**` when shared workspaces exist (≥ 0.3.0).
   - `octc add surface <surface>` — materialize stubs from `templates/surfaces/<surface>/` in the package (all canonical surfaces; ≥ 0.3.0).
   - `octc sync surface <surface>|--all` — reapply the same templates (≥ 0.3.0); flags `--dry-run`, `--force`, `--cwd`.
   - `octc sync governance` — copy `doc-contract` and/or consumer CI template from packaged artifacts in the CLI package.
   - `octc portfolio suggest` — print snippets to update internal PORTFOLIO **without** a token (paste into a manual PR); see [`PORTFOLIO_BRIDGE.md`](../adoption/PORTFOLIO_BRIDGE.md).
   - **Scope:** surface commands + monorepo `verify` for the canonical vocabulary target **`*-app`** repos. **`*-agents`** / **`*-workspace`** repos may use other CLI pieces (e.g. `sync agents`) without `.octc/monorepo.yaml` replacing their governance.
   - **Automatic writes** to `octc-platform-internal` (open PR without a human) still **require** org auth (PAT/App); not part of the public npm package as an “install-only” flow.

4. **Security and public policy:** `.octc/monorepo.yaml` in **public** repos must comply with [`PUBLIC_REPO_POLICY.md`](../security/PUBLIC_REPO_POLICY.md). Inventories with customer names or PII belong only in private repos or omitted fields.

5. **Status of this ADR:** **accepted** (in force); update [`INDEX.md`](INDEX.md) if status changes.

## Consequences

- Positive: clear path to automate drift (P2-11 internal), reduce human error on new surfaces, align CLI with published docs.
- Negative: schema maintenance + `schema_version` migrations; risk of duplicated SSOT if teams do not sync YAML and `architecture.md` until `verify` is mandatory in CI.
- Neutral: repos may delay adopting the file; the manual checklist stays valid.

## Alternatives considered

- **Front matter only in `docs/architecture.md`** — rejected as sole channel: worse for tools that do not parse MD; dedicated YAML is more stable for the CLI.
- **JSON instead of YAML** — possible in v1; YAML chosen for human review readability; parser must limit types (no arbitrary tags).
- **`verify` inferred from filesystem without declaration** — rejected: invites false positives and implicit per-repo conventions.

## Notes and references

- [REFERENCE_PRODUCT_MONOREPO.md](../adoption/REFERENCE_PRODUCT_MONOREPO.md) — vocabulary and CI matrix.
- [MONOREPO_CONFORMANCE_CHECKLIST.md](../adoption/MONOREPO_CONFORMANCE_CHECKLIST.md).
- Local Cursor plan (OCTC reference monorepo pattern) — Phase 4; internal runbook [REFERENCE_MONOREPO_SYNC](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/REFERENCE_MONOREPO_SYNC.md) (private repo; link for org members only).
- Published implementation milestone: **`@1c2c/cli@0.3.0`** — `add surface` and **`sync surface`** for all canonical surfaces, `verify` with `packages/**` rules, `sync governance`, `portfolio suggest` (see package CHANGELOG). PR automation → internal: [PORTFOLIO_BRIDGE](../adoption/PORTFOLIO_BRIDGE.md) and runbook [PORTFOLIO_DISPATCH_SETUP](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/PORTFOLIO_DISPATCH_SETUP.md) (private).
