# Runbook — publicación `@1c2c/*` (Changesets + `release.yml`)

Este documento describe el **camino operativo real** del repo. **No** afirma “release totalmente automático” mientras exista un candado de política (revisiones obligatorias, CODEOWNERS, rulesets) que el código no pueda derogar.

## Informe de cuello de botella (resumen)

### A. Ya automatizado (sin intervención en ese paso)

- Push a `main` → `release.yml` instala, testea, buildea, ejecuta `changesets/action`.
- Con `.changeset/*.md` pendientes en `main`: la acción versiona en `changeset-release/main` y mantiene un PR hacia `main` con título fijo **`chore: release packages`**.
- Sin changesets pendientes y con versiones locales por publicar: `changeset publish` vía **OIDC** + provenance.

### B. Qué sigue bloqueando baja fricción

- El PR mecánico debe **fusionarse** en `main`; toca `packages/**` (CODEOWNERS).
- Reglas de la org pueden exigir **aprobación** antes de merge; `GITHUB_TOKEN` **no** sustituye esa aprobación para el modo dedicado que fusiona con otra identidad.
- **`--admin` / merge administrativo** **no** forma parte del diseño previsto: solo **incidente** o política explícita fuera de este runbook. El camino previsto es **GitHub App** (preferido) o PAT dedicado acotado (residual).

### C. En control del repo (implementado o documentado aquí)

- PR mecánico acotado: `changeset-release/main` → `main`, título **`chore: release packages`**, autor **`github-actions[bot]`**, no fork ([`release-pr-automerge.yml`](../../.github/workflows/release-pr-automerge.yml)).
- Auto-merge por defecto con `GITHUB_TOKEN`, o modo dedicado con **token de instalación de GitHub App** generado en cada run (preferido), o PAT estático (segunda opción).

### D. Solo política / fuera del YAML

- Inscripción del **bot de la App** (p. ej. `tu-app-slug[bot]`) en la capacidad efectiva de fusionar en `main` (p. ej. “omitir revisiones obligatorias” para ese actor, en la forma que permita GitHub).
- Reglas que bloqueen merges hasta cumplir comprobaciones (el workflow espera checks con `gh pr checks --watch`).

## Comparación de gobernanza (recomendación explícita)

| | **1) GitHub App + installation token en CI (preferido)** | **2) Excepción amplia de ruleset (no recomendado como primera opción)** |
|---|----------------------------------------------------------|------------------------------------------------------------------------|
| **Riesgo** | Medio: clave privada de App en secret; token corto (~1 h) por ejecución. | Alto si la regla no es quirúrgica (GitHub raramente filtra por forma exacta de PR). |
| **Auditoría** | Fuerte: App instalada, actor `slug[bot]`, logs del workflow. | Depende del diseño de la regla; a menudo peor trazabilidad. |
| **Fricción** | Media (crear App, instalar, secrets/variables, alinear política). | Baja tras acordar la regla; coste de mantenimiento/riesgo mayor. |
| **Blast radius** | Limitado si la App solo se instala en este repo y permisos mínimos; robo de clave privada sigue siendo grave. | Suele ser mayor si la excepción afecta más PRs de los previstos. |
| **Recomendación** | **Defecto OCTC.** | Solo si la App es inviable; documentar dueño y revisión. |

**Límites de GitHub:** En branch protection clásica, un actor en la lista de bypass suele poder fusionar **cualquier** PR que fusiona **con credenciales de ese actor**. El acercamiento operativo es: **solo** este workflow invoca `gh pr merge` con el token de la App **bajo** el predicado estricto (rama/título/autor); no relajar revisiones para contribuciones humanas normales.

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

## Modelo canónico — variables y secretos (release merge mecánico)

**No usar** el identificador numérico legacy “App ID” como variable de este flujo: el workflow **`actions/create-github-app-token` v3** consume el **Client ID**. Un solo nombre estándar:

| Tipo | Nombre | Valor |
|------|--------|--------|
| Variable | `OCTC_RELEASE_MERGE_ENABLED` | `true` para activar el job que fusiona con identidad dedicada; cualquier otro valor o ausencia → solo auto-merge con `GITHUB_TOKEN`. |
| Variable | `OCTC_RELEASE_MERGE_APP_CLIENT_ID` | **Client ID** de la GitHub App (pantalla de la App en GitHub). |
| Secret | `OCTC_RELEASE_MERGE_APP_PRIVATE_KEY` | Clave privada PEM de la App. |
| Variable | `OCTC_RELEASE_MERGE_CREDENTIAL_MODE` | **Solo** si necesitáis modo transitorio: `pat`. Si está ausente o es distinto de `pat`, el camino es **GitHub App**. |
| Secret | `OCTC_RELEASE_MERGE_TOKEN` | PAT **solo** cuando `OCTC_RELEASE_MERGE_CREDENTIAL_MODE=pat` (segunda opción IAM; rotar y acotar). |

## Workflow `release-pr-automerge.yml` — forma mecánica exacta

El workflow aplica **únicamente** si el PR cumple **todos** estos campos:

| Campo | Valor exigido |
|--------|----------------|
| Base | `main` |
| Head | `changeset-release/main` |
| Título | `chore: release packages` (exactamente; alineado con `title` en `release.yml` / `changesets/action`) |
| Autor del PR | `github-actions[bot]` |
| Origen | Mismo repo (no fork) |

**Ningún otro PR** califica, aunque toque `packages/**`.

### Modo 1 — Auto-merge por defecto

Si **`OCTC_RELEASE_MERGE_ENABLED`** no es `true`: se ejecuta **solo** el job `enable-auto-merge`, que llama `gh pr merge --auto --squash` con `GITHUB_TOKEN`. Sigue haciendo falta que **política de rama** (revisiones + checks) permita el merge cuando GitHub lo evalúe.

### Modo 2 — Identidad dedicada (fusiona tras checks verdes)

Si **`OCTC_RELEASE_MERGE_ENABLED=true`**:

| Camino | `OCTC_RELEASE_MERGE_CREDENTIAL_MODE` | Credenciales |
|--------|--------------------------------------|--------------|
| **Preferido: GitHub App** (defecto si no es `pat`) | ausente o ≠ `pat` | Variable **`OCTC_RELEASE_MERGE_APP_CLIENT_ID`**, secret **`OCTC_RELEASE_MERGE_APP_PRIVATE_KEY`**. Job **`merge-mechanical-pr-github-app`**. |
| **Transitorio: PAT** | `pat` (exacto) | Secret **`OCTC_RELEASE_MERGE_TOKEN`**. Job **`merge-mechanical-pr-pat-fallback`**. |

En el camino **App**, el workflow usa [`actions/create-github-app-token`](https://github.com/actions/create-github-app-token) para obtener un **installation access token** en tiempo de ejecución (vida corta, revocado al final del job salvo configuración contraria de la acción). Ese token alimenta `gh pr checks --watch` y `gh pr merge --squash`.

El camino **PAT** existe solo si la org **no** puede desplegar una App; es **segunda opción** (token de larga duración, más superficie de rotación y filtración).

## GitHub App (camino preferido) — aprovisionamiento

1. **Crear una GitHub App** en la org (o cuenta) con permisos de repositorio acotados a lo necesario para mergear PRs:
   - **Contents:** Read and write  
   - **Pull requests:** Read and write  
   Instalación **solo** en `OneClickToControl/octc-platform` (o lista mínima de repos si la org impide repo-único; documentar excepción).
2. Anotar el **Client ID** de la App (UI moderna de GitHub; no confundir con el identificador numérico legacy salvo que uséis compatibilidad explícita de la acción).
3. Generar **Private key** para la App; guardarla como secret **`OCTC_RELEASE_MERGE_APP_PRIVATE_KEY`** en el repo.
4. Variable de repo **`OCTC_RELEASE_MERGE_APP_CLIENT_ID`** = **Client ID** (no el número “App ID” legacy salvo documentación de compatibilidad ajena a este workflow).
5. Variable **`OCTC_RELEASE_MERGE_ENABLED`** = `true`.
6. No fijar **`OCTC_RELEASE_MERGE_CREDENTIAL_MODE`** (el defecto es GitHub App). Fijar `pat` solo como transición.

### Alineación de política en GitHub (fuera del repo; obligatoria para fusionar sin `--admin`)

Quien administre la org/repo debe conceder al **actor de la App** (`<app-slug>[bot]`, visible tras instalar la App) la capacidad **efectiva** de fusionar el PR mecánico. Lo habitual es incluir ese actor en **“Permitir que actores específicos omitan las revisiones obligatorias de solicitud de extracción”** (o equivalente en **rulesets**) en la regla que aplica a `main`.

**El repositorio no puede aplicar esa política por sí mismo.** Sin ella, `gh pr merge` fallará por falta de permisos o revisiones pendientes.

**`--admin`:** no es el modo de operación OCTC; no debe usarse como sustituto rutinario de la alineación anterior.

### Por qué esto es preferible a una excepción genérica de ruleset

- El **predicado del PR** (rama/título/autor) lo fuerza el **workflow**, auditable en Git.
- El **token** es **corto** y **revocable** revocando la App o rotando la clave.
- Una **regla** demasiado amplia suele ser **menos precisa** que “este actor + este workflow + esta forma de PR”.

## Dependencia de política (texto contractual)

Hasta que el actor de la App (o el PAT residual) tenga permiso efectivo de merge en `main` bajo las rules de la org:

- **Qué bloquea:** revisiones obligatorias / CODEOWNERS / comprobaciones no satisfechas / actor sin bypass donde haga falta.
- **Quién lo cambia:** administración de la org o del repo con autoridad de gobernanza.
- **Mientras tanto:** `OCTC_RELEASE_MERGE_ENABLED` desactivado + auto-merge con `GITHUB_TOKEN` + **aprobación humana** según reglas, o merge manual sin depender de identidad dedicada.
- **Tras la alineación:** el job `merge-mechanical-pr-github-app` puede completar el merge **sin** `--admin` cuando los checks pasen.

## PAT residual (segunda opción)

Solo si **`OCTC_RELEASE_MERGE_CREDENTIAL_MODE=pat`**:

- Secret **`OCTC_RELEASE_MERGE_TOKEN`**: PAT fine-grained o clásica con alcance **mínimo** a este repo; rotación acordada.
- Misma necesidad de **política** para que ese usuario/bot pueda fusionar.
- Riesgo residual: exfiltración del PAT permite merges fuera de este workflow si el actor tiene permisos amplios.

## Checklist quien mantiene releases

1. Tras mergear trabajo con changesets: esperar el PR **«chore: release packages»**.
2. Revisar diffs (versiones/changelogs / eliminación de `.changeset`).
3. CI verde en ese PR.
4. Si modo por defecto (sin `OCTC_RELEASE_MERGE_ENABLED`): aprobar según reglas; auto-merge cerrará cuando GitHub lo permita.
5. Si modo App/PAT dedicado: confirmar que **`merge-mechanical-pr-github-app`** o **`merge-mechanical-pr-pat-fallback`** termina en éxito.
6. Verificar el siguiente `release.yml` en `main` (`changeset publish` y versión en npm).

## Desalineaciones conocidas con otros documentos

Algunos documentos históricos listan SBOM (`syft`), integración Sentry `releases`, o tags firmados como parte del release de paquetes. **El workflow actual `release.yml` no ejecuta esos pasos.** Hasta que se implementen en CI, este runbook y la sección *Releases* de [POLICY.md](POLICY.md) prevalecen para el comportamiento real.
