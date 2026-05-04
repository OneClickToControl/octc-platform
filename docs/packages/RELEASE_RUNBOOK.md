# Runbook — publicación `@1c2c/*` (Changesets + `release.yml`)

Este documento describe el **camino operativo real** del repo. **No** afirma “release totalmente automático” mientras exista un candado de política (revisiones obligatorias, CODEOWNERS, rulesets) que el código no pueda derogar.

## Informe de cuello de botella (resumen)

### A. Ya automatizado (sin intervención en ese paso)

- Push a `main` → `release.yml` instala, testea, buildea, ejecuta `changesets/action`.
- Con `.changeset/*.md` pendientes en `main`: la acción versiona en `changeset-release/main` y mantiene un PR hacia `main` con título fijo **`chore: release packages`**.
- Sin changesets pendientes y con versiones locales por publicar: `changeset publish` vía **OIDC** + provenance.

### B. Qué sigue bloqueando baja fricción

- El PR mecánico debe **fusionarse** en `main`; toca `packages/**` (CODEOWNERS).
- Reglas de la org pueden exigir **aprobación** antes de merge; `GITHUB_TOKEN` **no** sustituye esa aprobación.
- **`--admin` / merge administrativo** no es modo operativo previsto: es **excepción** (emergencia o política explícita de la org).

### C. En control del repo (implementado o documentado aquí)

- PR mecánico acotado: `changeset-release/main` → `main`, título **`chore: release packages`**, autor **`github-actions[bot]`**, no fork ([`release-pr-automerge.yml`](../../.github/workflows/release-pr-automerge.yml)).
- Auto-merge (modo por defecto) o merge tras checks con **identidad dedicada** (modo opcional, variable + secret).
- Este runbook y comparación de gobernanza (App vs ruleset).

### D. Solo política / fuera del YAML

- Quién puede **fusionar** sin revisión o con bypass.
- **Rulesets** y “required reviewers”.
- Creación e instalación de **GitHub App** o usuario bot, rotación de secretos, auditoría org.

## Comparación de gobernanza (recomendación explícita)

| | **1) GitHub App / identidad dedicada (preferido)** | **2) Excepción estrecha de ruleset (segunda opción)** |
|---|-----------------------------------------------------|------------------------------------------------------|
| **Riesgo** | Medio: depende del secreto y de que solo este workflow invoque merge bajo el predicado estricto. | Alto si la excepción afecta más PRs de las previstas. |
| **Auditoría** | Buena: instalación de App o cuenta bot, logs del workflow, actor estable. | Depende de cómo quede documentada la regla en GitHub. |
| **Fricción** | Media (aprovisionar App/PAT, variable, policy de bypass para **ese** actor). | Suele ser baja una vez aprobada la excepción; revisar alcance. |
| **Blast radius** | Acotado mientras el token no se filtre y el job mantenga el `if` estricto; un compromise del token sigue siendo grave. | Puede ser amplio si la regla no es quirúrgica. |
| **Recomendación** | **Por defecto en este runbook**: actor dedicado alineado con el workflow acotado. | Solo si App/PAT no es viable; documentar riesgo y dueño de la regla. |

**Importante:** En branch protection clásica, “actores que pueden omitir revisiones obligatorias” suele aplicarse al `@octocat` / App para **cualquier** PR que ese actor fusione. El estrechamiento real viene de **(a)** no reutilizar ese token fuera de este workflow y **(b)** que este workflow **solo** llame a `merge` cuando se cumpla la forma mecánica (rama, título, autor). No sustituye revisión humana en **PRs normales** que tocan `packages/**`.

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

[Ese workflow](../../.github/workflows/release-pr-automerge.yml) aplica **únicamente** si el PR cumple **todos** estos criterios (ningún otro PR, aunque toque `packages/**`, debe coincidir):

| Campo | Valor exigido |
|--------|----------------|
| Base | `main` |
| Head | `changeset-release/main` |
| Título | `chore: release packages` (exactamente; debe coincidir con `title` en `release.yml` / `changesets/action`) |
| Autor del PR | `github-actions[bot]` |
| Origen | Mismo repo (no fork) |

**Modo por defecto** (`OCTC_RELEASE_MERGE_ENABLED` distinto de `true`): activa **squash auto-merge** con `GITHUB_TOKEN`. Sigue haciendo falta que la **política** considere el PR mergeable (revisiones + checks).

**Modo identidad dedicada** (`OCTC_RELEASE_MERGE_ENABLED=true` + secret `OCTC_RELEASE_MERGE_TOKEN`): tras `gh pr checks --watch`, fusiona con squash usando ese token. Requiere que la **org** otorgue a esa identidad el derecho efectivo de fusionar ese PR (p. ej. inclusión en bypass de revisiones obligatorias para ese actor, u otra política explícita). Sin eso, el paso `merge` fallará: el repo documenta el camino; **no inventa permisos**.

### 3. Trusted Publisher en npm

Cada paquete `@1c2c/*` debe tener configurado el Trusted Publisher apuntando a `release.yml` (véase [SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md)). Si falta, el `npm publish` desde CI fallará aunque el PR de versión esté fusionado.

## Identidad dedicada (preferido para quitar fricción sin `--admin`)

**Objetivo:** que el PR mecánico pueda fusionarse **sin** merge administrativo humano habitual, manteniendo revisión completa en PRs normales.

**Pasos típicos (los ejecuta quien administra la org / el repo; no están automatizables solo con commits):**

1. Crear una **GitHub App** mínima (o usuario bot dedicado) instalada solo en `OneClickToControl/octc-platform`, con permisos `Contents` y `Pull requests` (lectura/escritura según necesidad de merge).
2. Generar credencial: **installation token** (App) o **fine-grained PAT** (bot) con alcance mínimo al repo.
3. Añadir en GitHub Actions del repo el secret **`OCTC_RELEASE_MERGE_TOKEN`** y la variable del repo **`OCTC_RELEASE_MERGE_ENABLED`** = `true`.
4. En **branch protection / ruleset**, permitir que **esa identidad** pueda fusionar cumpliendo la política que la org acepte (habitualmente: figurar como actor con permiso de omitir revisiones obligatorias *para merges que esa identidad ejecuta* — el **workflow** solo invoca merge en el predicado estricto de arriba).

**Prohibido en el diseño pretendido:** ensanchar bypass para PRs genéricos o relajar CODEOWNERS/review para contribuciones humanas normales.

**Si no configuráis identidad dedicada:** dejad la variable sin activar; seguid usando auto-merge + aprobación según reglas.

## Checklist mínima para quien mantiene releases

1. Tras mergear trabajo con changesets: esperar el PR **«chore: release packages»**.
2. Revisar diffs de versiones/changelogs (deberían ser solo el bump esperado).
3. Asegurar CI verde en ese PR.
4. Si **no** usáis `OCTC_RELEASE_MERGE_ENABLED`: aprobar según CODEOWNERS / política; el auto-merge cerrará cuando las reglas lo permitan.
5. Si usáis identidad dedicada: verificar que el job `merge-mechanical-pr-with-release-identity` complete sin error.
6. Verificar el siguiente `release.yml` en `main` (`changeset publish` y versión en npm).

## Dependencia de política que el repo no elimina

Hasta que exista identidad con permiso efectivo de merge **o** una excepción de ruleset explicitada y acotada:

- **Qué regla bloquea:** revisiones obligatorias / CODEOWNERS / rulesets en `main` aplicados al PR mecánico como a cualquier otro.
- **Quién puede cambiarlo:** administradores de org/repo con mandato de gobernanza.
- **Mientras tanto:** aprobación humana (o configuración correcta del actor dedicado + variable).
- **`--admin`:** solo **emergencia** o procedimiento explícito fuera de banda; no es el modo objetivo.
- **¿Puede un bot/App resolverlo?** Sí **si** la org le concede el derecho de fusionar esos PRs y el workflow usa el token solo bajo el predicado estricto.

## Excepción de ruleset (segunda opción, más arriesgada)

Si la org prefiere una **regla** que trate distinto el camino mecánico en lugar de un actor dedicado:

- Debe ser **tan estrecha como permita GitHub** (hoy GitHub no filtra por “título de PR” en muchos controles; el riesgo de alcance amplio es mayor que con un actor + workflow acotado).
- Documentar **dueño**, **revision trimestral** y **alternativa preferida** (App + token).

## Desalineaciones conocidas con otros documentos

Algunos documentos históricos listan SBOM (`syft`), integración Sentry `releases`, o tags firmados como parte del release de paquetes. **El workflow actual `release.yml` no ejecuta esos pasos.** Hasta que se implementen en CI, este runbook y la sección *Releases* de [POLICY.md](POLICY.md) prevalecen para el comportamiento real.
