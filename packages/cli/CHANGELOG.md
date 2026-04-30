# @1c2c/cli

## 0.3.0

### Minor Changes

- d1d317c: - **`octc add surface <surface>`** — plantilla **`data`**: `supabase/README.md` + `docs/db/README.md`; otras superficies: `docs/ops/octc-surface-<surface>-bootstrap.md`. Flags: `--cwd`, `--dry-run`, `--force`.
  - **`octc sync governance`** — copia `templates/governance/doc-contract` y/o `ci` desde el paquete al repo destino. Flags: `--only all|doc-contract|ci`, `--cwd`, `--dry-run`.
  - **`octc portfolio suggest`** — lee `.octc/monorepo.yaml` y emite fragmentos para PORTFOLIO interno. Flags: `--cwd`, `--repo`, `--cli-pin`; env `OCTC_PORTFOLIO_*`. Documentación: PORTFOLIO_BRIDGE.

## 0.2.0

### Minor Changes

- **`octc verify monorepo`** (`--cwd`): valida `.octc/monorepo.yaml` (ADR-0003 v0): `schema_version`, `active_surfaces`, globs (`paths` o convenciones), directorio `supabase/` si `data`, y opcionalmente `portfolio.repo_surfaces_csv`.
- Dependencias: `yaml`, `fast-glob`. Plantilla publicada: `templates/monorepo/monorepo.yaml.example`.

## 0.1.1

### Patch Changes

- First CI release with npm **provenance** via GitHub OIDC (Trusted Publisher). README: manual publish script and isolated token auth.

## 0.1.0

- Initial publish: `octc sync agents` and `octc agents <init|verify|sync>` delegating to `@1c2c/agent-templates` (`octc-agents`).
