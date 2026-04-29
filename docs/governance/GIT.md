# Gobernanza Git

Reglas mínimas para todos los repos de OneClickToControl LLC.

## Branch protection

- `main` protegido: requiere PR, status checks verdes (`verify.yml`), 1 aprobación + CODEOWNERS si toca rutas listadas.
- Force-push deshabilitado en `main`.
- No commits directos a `main`.

## Convenciones

- Conventional Commits.
- Branch naming: `feat/...`, `fix/...`, `chore/...`, `docs/...`, `acp/<id>/...`.
- PRs deben usar la plantilla en [templates/governance/PULL_REQUEST_TEMPLATE.md](../../templates/governance/PULL_REQUEST_TEMPLATE.md).

## Releases

- Tags con SemVer en cada paquete `@1c2c/*` y en cada producto.
- Changelogs generados por Changesets para JS/TS, manual o `towncrier` para Python.
- Releases anotadas se reportan también a Sentry vía `sentry-cli releases new`.

## CODEOWNERS

- Cada repo declara CODEOWNERS apuntando a propietarios reales.
- Rutas críticas (manifests, schemas, plantillas, allowlists, workflows) requieren aprobación de plataforma.

## Repos archivados

- Los repos legacy se mueven a estado `archived` tras 90 días sin actividad y deprecación documentada en [DEPRECATION.md](DEPRECATION.md).
