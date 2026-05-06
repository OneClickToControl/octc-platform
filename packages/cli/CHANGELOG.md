# @1c2c/cli

## 0.4.0

### Minor Changes

- 8680425: - **`octc init workspace`**: materializes **` *-workspace`** template (parity with internal companion); flags `--force`, `--pin <SHA>`, `--template-dir`.
  - **`octc init app`**: public-safe **` *-app`** scaffold (`templates/product`); flags `--force`, `--pin`, `--template-dir`.
  - Published templates under `packages/cli/templates/workspace` and `templates/product`.

## 0.3.0

### Minor Changes

- **`octc sync surface <surface>|--all`**: reapplies versioned templates from the package (`templates/surfaces/<surface>/`, `.octc-manifest.txt` when present). Flags: `--cwd`, `--dry-run`, `--force`.
- **`octc add surface`**: all canonical surfaces use packaged templates (`landing`, `web`, `mobile`, `ml`, `api`, `chat`, `data`).
- **`octc verify monorepo`**: if a non-empty `packages/` exists and there are consumer surfaces (≠ `data` alone), each must include a glob covering `packages/**` in `paths.<surface>` (or equivalent).
- Explicit limit in templates/docs: surface matrix `octc add|sync surface` applies to **` *-app`** repos; **` *-agents`** / **` *-workspace`** are out of this contract until a dedicated plan exists.

### Migration

- Monorepos with `packages/` and `active_surfaces` without `data` only: add e.g. `packages/**` to each consuming `paths.<surface>`.
- Updated example: `templates/monorepo/monorepo.yaml.example`.

## 0.2.0

### Minor Changes

- **`octc verify monorepo`** (`--cwd`): validates `.octc/monorepo.yaml` (ADR-0003 v0): `schema_version`, `active_surfaces`, globs (`paths` or conventions), `supabase/` directory if `data`, and optionally `portfolio.repo_surfaces_csv`.
- Dependencies: `yaml`, `fast-glob`. Published template: `templates/monorepo/monorepo.yaml.example`.

## 0.1.1

### Patch Changes

- First CI release with npm **provenance** via GitHub OIDC (Trusted Publisher). README: manual publish script and isolated token auth.

## 0.1.0

- Initial publish: `octc sync agents` and `octc agents <init|verify|sync>` delegating to `@1c2c/agent-templates` (`octc-agents`).
