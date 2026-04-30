# Public repo policy — `octc-platform`

> **Hard rule:** `octc-platform` es un repo **público**. Todo lo que se commitea aquí queda visible en internet, archivos y commits incluidos. La separación con [`octc-platform-internal`](https://github.com/OneClickToControl/octc-platform-internal) es intencional y se enforza por CI.

## Qué SÍ va en este repo

- Paquetes compartibles `@1c2c/*` (`packages/*`).
- Schemas (`schemas/*`).
- Plantillas neutras (`templates/agents/`, `templates/observability/sentry/`, `templates/governance/`, `templates/governance/privacy-guard/` para adoptar el stack anti-fugas al publicar un repo).
- Políticas, ADRs, RFCs, runbooks **genéricos** (no atados a clientes ni proyectos puntuales).
- Workflows CI, configuración de releases, lockfiles.
- Onboarding, contributing, code of conduct.

## Qué NO va en este repo (cero excepciones)

| Categoría | Ejemplos | Dónde va |
|---|---|---|
| **Inventarios de productos / clientes** | `PORTFOLIO.md`, listados de repos privados, mapas de clientes, "MVP X", "donante maduro" | `octc-platform-internal/docs/PORTFOLIO.md` |
| **Identificadores Sentry de la org** | `o45109...`, DSNs concretos, nombres de organización Sentry, ingest URLs, project IDs | `octc-platform-internal/docs/observability/SENTRY_PROJECTS.md` |
| **Hallazgos de auditoría / postmortems** | `AUDIT-*.md` con hallazgos abiertos, RCAs concretos | `octc-platform-internal/docs/audit/*` |
| **Identidades máquina / humanas** | tokens, API keys, cookies, sessionIds, npm tokens, GitHub PATs, OAuth secrets, `.env*`, `*.pem`, `*.key` | GitHub Secrets / Vault |
| **Contratos comerciales y financieros** | pricing real, ARR, contratos, GTM, leads | `octc-platform-internal` o repo de negocio |
| **PII** | emails personales (más allá de `ops@oneclicktocontrol.com` en commits), teléfonos, direcciones | nunca al repo (ni público ni privado) |
| **Datos productivos** | dumps, logs reales, snapshots de BD, eventos Sentry crudos | almacenamiento productivo correspondiente |
| **Nombres de productos no anunciados** | features bajo NDA, nombres internos de proyectos en sigilo | `octc-platform-internal` hasta announcement |
| **Nombres geográficos / de cliente sensibles** | mercados específicos no anunciados, nombres de clientes | `octc-platform-internal` |

## Referencias a repos privados (regla específica)

- **No enumerar slugs ni nombres de repositorios privados de la organización** en documentación de este repo (README, ADRs, ejemplos de adopción, tablas de ejemplo).
- Los **patrones técnicos** que detectan esos identificadores viven **solo** en la cadena de privacy guard: `.gitleaks.toml`, `scripts/precommit-privacy-check.sh` y la plantilla equivalente bajo `templates/governance/privacy-guard/`. Esos archivos deben **mantenerse alineados** entre sí.
- Cada vez que exista un **nuevo repositorio privado** cuyo nombre no deba aparecer en público, actualiza esos tres artefactos **antes** de mencionar el proyecto en cualquier otro sitio.
- Usa referencias genéricas en prosa (`<product-repo-privado>`, `<acp-id>`, etc.) cuando necesites ilustrar sin nombrar.
- La historia git ya publicada no se reescribe por defecto; las **nuevas** referencias indebidas deben ser bloqueadas por CI.

> El handle `1click2control` es público (GitHub del owner) y puede aparecer en `CODEOWNERS`, runbooks y onboarding.

## Stack de defensa (en este orden, todas obligatorias)

1. **Esta policy** + entrenamiento de quien commitea.
2. **Pre-commit hook local**: `scripts/precommit-privacy-check.sh` (regex de denylist). Instalable con `pnpm run install-hooks`.
3. **CI workflow `privacy-guard.yml`** (status check **bloqueante** del branch protection):
   - `gitleaks` con reglas custom en `.gitleaks.toml`.
   - `denylist-regex` vía `precommit-privacy-check.sh --staged-mode=tree`.
   - `denylist-paths`: bloquea `**/*.private.*`, `**/INTERNAL_*`, `**/SECRETS*`, `*.env*` (excepto `.env.example`).
4. **CODEOWNERS**: cualquier cambio en `.gitleaks.toml`, `.github/workflows/privacy-guard.yml`, `docs/security/PUBLIC_REPO_POLICY.md` requiere aprobación de `@1click2control`.
5. **Branch protection** en `main`: PRs obligatorios, `privacy-guard` debe pasar, no force-push, no eliminar branch.
6. **PR template**: checklist explícito anti-fuga marcado obligatorio.

## Si un secreto se filtra (incidente)

1. **No lo borres con un commit nuevo**. Está en la historia pública.
2. Rotar inmediatamente el secreto / DSN / token / credencial.
3. Solicitar a GitHub purge de cache (`gh api -X POST /repos/{owner}/{repo}/cache-purge` no existe; abrir support request si crítico).
4. Re-escribir historia con `git filter-repo --invert-paths --path <archivo>` y force-push (requiere coordinación porque rompe SHAs públicos). **IMPORTANTE**: si usas `--replace-text`, excluye los archivos del privacy guard (`.gitleaks.toml`, `scripts/precommit-privacy-check.sh`, plantillas bajo `templates/governance/privacy-guard/`) o quedarán mutilados; usa `--path-glob` con exclusiones o restaura los archivos manualmente después.
5. Asumir compromiso: el secreto ya pudo ser indexado (Wayback, scrapers, etc.). La rotación es no-negociable.
6. Documentar incidente en `octc-platform-internal/docs/audit/INCIDENT-YYYY-MM-DD.md`.

## Cadencia

- **Trimestral**: `1click2control` revisa esta policy y la **lista técnica** en `.gitleaks.toml` / `precommit-privacy-check.sh` frente a nuevos repos privados o renombres.
- **Cada nuevo repo privado relevante**: actualizar los tres artefactos técnicos antes de documentarlo en otros repos públicos.
