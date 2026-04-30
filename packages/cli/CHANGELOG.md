# @1c2c/cli

## 0.2.0

### Minor Changes

- **`octc verify monorepo`** (`--cwd`): valida `.octc/monorepo.yaml` (ADR-0003 v0): `schema_version`, `active_surfaces`, globs (`paths` o convenciones), directorio `supabase/` si `data`, y opcionalmente `portfolio.repo_surfaces_csv`.
- Dependencias: `yaml`, `fast-glob`. Plantilla publicada: `templates/monorepo/monorepo.yaml.example`.

## 0.1.1

### Patch Changes

- First CI release with npm **provenance** via GitHub OIDC (Trusted Publisher). README: manual publish script and isolated token auth.

## 0.1.0

- Initial publish: `octc sync agents` and `octc agents <init|verify|sync>` delegating to `@1c2c/agent-templates` (`octc-agents`).
