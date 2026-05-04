# @1c2c/cli

## 0.4.0

### Minor Changes

- 8680425: - **`octc init workspace`**: materializa plantilla `*-workspace` (paridad con companion internal); flags `--force`, `--pin <SHA>`, `--template-dir`.
  - **`octc init app`**: scaffold público-seguro `*-app` (plantilla product-repo); flags `--force`, `--pin`, `--template-dir`.
  - Plantillas publicadas bajo `packages/cli/templates/workspace` y `templates/product`.

## 0.3.0

### Minor Changes

- **`octc sync surface <surface>|--all`**: reaplica plantillas versionadas del paquete (`templates/surfaces/<surface>/`, manifiesto `.octc-manifest.txt` cuando existe). Flags: `--cwd`, `--dry-run`, `--force`.
- **`octc add surface`**: todas las superficies canónicas usan plantilla empaquetada (`landing`, `web`, `mobile`, `ml`, `api`, `chat`, `data`).
- **`octc verify monorepo`**: si existe `packages/` no vacío y hay superficies consumidoras (`≠ data`), cada una debe incluir un glob que cubra `packages/**` en `paths.<surface>` (o equivalente).
- Límite explícito en plantillas/docs: matriz de superficies `octc add|sync surface` aplica a repos **`*-app`**; repos **`*-agents`** / **`*-workspace`** quedan fuera de este contrato hasta plan dedicado.

### Migración

- Monorepos con `packages/` y `active_surfaces` sin `data` solos: añadir p. ej. `packages/**` a cada `paths.<superficie>` consumidora.
- Ejemplo actualizado: `templates/monorepo/monorepo.yaml.example`.

## 0.2.0

### Minor Changes

- **`octc verify monorepo`** (`--cwd`): valida `.octc/monorepo.yaml` (ADR-0003 v0): `schema_version`, `active_surfaces`, globs (`paths` o convenciones), directorio `supabase/` si `data`, y opcionalmente `portfolio.repo_surfaces_csv`.
- Dependencias: `yaml`, `fast-glob`. Plantilla publicada: `templates/monorepo/monorepo.yaml.example`.

## 0.1.1

### Patch Changes

- First CI release with npm **provenance** via GitHub OIDC (Trusted Publisher). README: manual publish script and isolated token auth.

## 0.1.0

- Initial publish: `octc sync agents` and `octc agents <init|verify|sync>` delegating to `@1c2c/agent-templates` (`octc-agents`).
