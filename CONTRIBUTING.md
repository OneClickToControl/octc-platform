# Contributing

Gracias por contribuir a `octc-platform`. Este repo es la SSOT de la plataforma; los cambios afectan a todos los productos. Sigue estas reglas.

## Antes de empezar

1. Lee [PLATFORM_TOUR](docs/onboarding/PLATFORM_TOUR.md) (30 min).
2. Verifica acceso SSO + 2FA según [IDENTITY_ACCESS](docs/governance/IDENTITY_ACCESS.md).
3. Identifica si tu cambio es **normativo** (plantillas, schemas, políticas) o **infra** (workflows, scripts).

## Tipos de cambio

- **Trivial** (typo, redacción menor): PR directo. Aprobado por CODEOWNERS.
- **Sustantivo** (nueva sección, nueva regla, cambio de plantilla minor): PR con descripción detallada y referencia a `docs/comms/RELEASE_NOTES_TEMPLATE.md`.
- **Estructural** (nuevo paquete, cambio breaking, política nueva): **RFC primero** ([template](docs/comms/RFC_TEMPLATE.md)) → **ADR** ([template](docs/adr/_TEMPLATE.md)) → PR final.

## Branch + commit

- Branch: `feat/...`, `fix/...`, `chore/...`, `docs/...`.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- Tag de área cuando aplique: `feat(observability): ...`, `chore(packages): ...`.

## PR

- Usa la plantilla en [templates/governance/PULL_REQUEST_TEMPLATE.md](templates/governance/PULL_REQUEST_TEMPLATE.md). Se aplica automáticamente cuando se copia a `.github/PULL_REQUEST_TEMPLATE.md` (paso de mantenimiento).
- Marca todos los checkboxes aplicables.
- Vincula RFC/ADR si los hay.
- Espera CI verde (`verify.yml`).

## Revisión

- 1 aprobación + CODEOWNERS si toca rutas listadas en `CODEOWNERS`.
- Cambios en `templates/agents/`, `schemas/`, `packages/`, `docs/security/`, `docs/observability/`, `docs/finops/`: doble revisión.

## Estilo

- Idioma: ver [i18n POLICY](docs/i18n/POLICY.md). Por defecto español.
- Markdown: títulos en mayúscula inicial estilo oración (Sentence case). Tablas con headers explicativos.
- Diagramas: Mermaid. Mantener etiquetas cortas y sin caracteres especiales.

## Releases

- Cambios en `packages/` siguen [POLICY](docs/packages/POLICY.md).
- Cambios solo en `docs/` no requieren tag de release pero pueden mencionarse en release notes mensuales.

## Antipatrones

- Editar bloques `<!-- octc:base -->` en plantillas sin RFC.
- Saltarse `verify.yml` con `[skip ci]` en main.
- Introducir dependencias nuevas sin RFC.
- Commits con secretos: si ocurre, rotar inmediatamente y abrir incidente.

## Dudas

Pregunta en `#platform`. Si bloquea tu trabajo, escala al canal `#ops`.
