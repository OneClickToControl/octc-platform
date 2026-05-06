# Product monorepo conformance checklist

Use on PRs that **add or remove** surfaces, or in quarterly audits. Mark **N/A** with a link to justification in `docs/README.md` or an ADR.

## A. Per active surface

Repeat this block for every label in `active_surfaces`.

### `landing` / `web` / `mobile` / `ml` / `api` / `chat`

- [ ] Row in `docs/architecture.md`: directories, stack, deploy, critical variables (no secrets).
- [ ] Sentry project (or agreed observability) named `octc-<product>-<surface>`.
- [ ] CI jobs with documented path filters; build/test reproducible locally (`docs/getting-started.md` or equivalent).
- [ ] Runbook or ops section: deploy, rollback, **secrets** (reference auth/env policy).

### `data` (Supabase)

- [ ] `supabase/` under version control; RLS migrations reviewed.
- [ ] Edge Functions documented (entry in architecture or `supabase/functions/*/README.md`).
- [ ] Client types (e.g. TS) aligned with schema; regen job or command documented.
- [ ] Tests or procedures validating RLS (automated or explicit runbook).

### `docs/` (cross-cutting)

- [ ] Minimum tree per [DOCUMENTATION_TREE.md](DOCUMENTATION_TREE.md) or justified equivalent.
- [ ] Impactful decisions in ADR / memory / index linked from architecture.

## B. Composition change (surface add/remove)

- [ ] `active_surfaces` table and paths updated in the same structural PR (or agreed max window + logged debt).
- [ ] Internal PORTFOLIO: `repo_surfaces` updated (and `monorepo_archetype` if the org uses it).
- [ ] CI workflows: new `paths` or jobs; removal of orphan jobs.
- [ ] Turbo / workspaces: packages and pipelines coherent.
- [ ] Observability: projects created or deprecated per policy.

## C. Product layer and traceability

- [ ] Roadmap/backlog reflect scope change; issues or sync contract updated if the org requires it.
- [ ] `docs/features/` or equivalent map links new behaviour or marks deprecation.
- [ ] Audit or risk entry if the change affects compliance or sensitive data.

## D. Automation and governance (“machine of products” pattern)

Mark what applies; document N/A.

- [ ] **Documentation-only** workflow (MD links, style) if main CI skips `*.md`.
- [ ] **`octc verify monorepo`** in CI when `.octc/monorepo.yaml` exists ([ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md); `@1c2c/cli` ≥ 0.2.0).
- [ ] Indexed scripts (`scripts/README.md`) for db, supabase, governance, i18n, security.
- [ ] Shared packages (`packages/*`) with contract READMEs.
- [ ] `assets/` or explicit branding policy if multi-surface with shared identity.

## E. Public policy

- [ ] Examples and screenshots comply with [PUBLIC_REPO_POLICY.md](../security/PUBLIC_REPO_POLICY.md).

## Quick definition of “conformant”

`active_surfaces` ↔ filesystem ↔ CI paths ↔ Sentry ↔ PORTFOLIO, and product docs → features → ops chain without broken critical links.
