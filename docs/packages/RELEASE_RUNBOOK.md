# Runbook — publicación `@1c2c/*` (Changesets + `release.yml`)

Este documento describe el **camino operativo real** del repo. No asume “release totalmente automático” si la organización exige revisión humana en `main`.

## Cadena actual (dos fases)

### Fase A — Entran cambios con changeset

1. Trabajo en una rama normal; añades un archivo bajo `.changeset/` (`pnpm exec changeset` o equivalente).
2. Abres PR → `main`, pasas CI (p. ej. `verify.yml`, `privacy-guard` si aplica).
3. Merge a `main` (según política de la org: aprobaciones, CODEOWNERS, etc.).

### Fase B — Workflow `release.yml` en `main`

Cada push a `main` ejecuta [`.github/workflows/release.yml`](../../.github/workflows/release.yml).

| Estado de `.changeset/` en `main` | Qué hace el job `changesets` |
|----------------------------------|------------------------------|
| **Hay** archivos `.changeset/*.md` sin versionar | Ejecuta `changeset version`, hace commit en la rama **`changeset-release/main`** y abre/actualiza un PR titulado **«chore: release packages»** hacia `main` (actor habitual: `github-actions[bot]`). **No publica npm todavía.** |
| **No hay** changesets pendientes; hay paquetes con versión local mayor que en el registry | Ejecuta `changeset publish` con **OIDC → npm** y provenance (`NPM_CONFIG_PROVENANCE`). Crea tags de paquete en Git. |

Por tanto, **npm solo se actualiza después de que el PR de versión exista en `main`**. Ese PR es mecánico (bump + changelogs + borrado de changesets).

## Dónde se atasca el flujo (cuellos de botella honestos)

### 1. Merge del PR «chore: release packages»

Ese PR toca rutas bajo `/packages/**`. En este repo, [CODEOWNERS](../../CODEOWNERS) asigna esas rutas a `@1click2control`. Si la **branch protection** y/o **rulesets** de la organización exigen:

- revisión aprobada,
- comprobaciones obligatorias,
- o bloqueo explícito hasta que se cumplan reglas,

entonces **alguien con permisos válidos debe aprobar y/o satisfacer esas reglas** antes de que el PR se pueda fusionar. El bot **no puede** autoaprobar CODEOWNERS.

**Bypass con `--admin`/`gh pr merge --admin`:** es un privilegio de administrador de repositorio (u org). Trátalo como **excepción de emergencia o política explícita de la org**, no como parte del diseño del workflow. El código del repo no puede “arreglar” la existencia de ese bypass.

### 2. Workflow `release-pr-automerge.yml`

[Ese workflow](../../.github/workflows/release-pr-automerge.yml) solo activa **auto-merge en modo squash** para el PR `changeset-release/main` → `main`. Eso reduce fricción **después** de que las reglas de GitHub consideren el PR mergeable (revisiones + checks). **No sustituye** revisiones obligatorias.

### 3. Trusted Publisher en npm

Cada paquete `@1c2c/*` debe tener configurado el Trusted Publisher apuntando a `release.yml` (véase [SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md)). Si falta, el `npm publish` desde CI fallará aunque el PR de versión esté fusionado.

## Checklist mínima para quien mantiene releases

1. Tras mergear trabajo con changesets: esperar el PR **«chore: release packages»**.
2. Revisar diffs de versiones/changelogs (deberían ser solo el bump esperado).
3. Asegurar CI verde en ese PR.
4. Aprobar según CODEOWNERS / política de la org (si aplica).
5. Con auto-merge activo, el merge ocurre solo al cumplirse las reglas; si no, fusionar manualmente (squash si es la convención de la org).
6. Verificar que un nuevo run de `release.yml` en `main` publica (logs: `changeset publish`; comprobar versión en npm).

## Qué cambiar en la org si se quisiera “sin aprobación humana”

Eso **no** se implementa solo con YAML en este repo: hace falta decisión de gobernanza, por ejemplo:

- regla/ruleset que permita merge de PRs de release mecánicos sin revisión (alto riesgo), o
- una identidad bot/GitHub App con permisos y excepciones explícitas, documentadas y auditadas.

Mientras eso no exista, el camino aprobado es: **revisión (humana o bot autorizado por política) → merge PR de versión → publicación en CI**.

## Desalineaciones conocidas con otros documentos

Algunos documentos históricos listan SBOM (`syft`), integración Sentry `releases`, o tags firmados como parte del release de paquetes. **El workflow actual `release.yml` no ejecuta esos pasos.** Hasta que se implementen en CI, este runbook y la sección *Releases* de [POLICY.md](POLICY.md) prevalecen para el comportamiento real.
