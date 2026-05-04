# Carril `*-workspace` OCTC

Repos con sufijo **`*-workspace`** guardan **identidad, memoria, notas, canales de trabajo y procedimientos de restore/bootstrap**. No son monorepos de producto ni portan el contrato de superficies OCTC.

## Familia de repos (resumen)

| Carril | Contrato / automatización principal |
|--------|-------------------------------------|
| **`*-app`** | `.octc/monorepo.yaml`, `octc verify monorepo`, `octc add surface`, `octc sync surface`, portfolio dispatch desde el monorepo. Ver [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md). |
| **`*-agents`** | Manifest ACP (`agents/<id>/manifest.json`), `octc sync agents` como baseline habitual, validación schema, dispatch ACP → registry interno. Ver [ADR-0002 — ACP](../adr/ADR-0002-acp-pattern.md). |
| **`*-workspace`** | Sin `/.octc/monorepo.yaml`. Punteros a la verdad canónica en `*-agents`; **no** sustituir normativa agéntica con copias locales largas sin PR en `*-agents`. |

Articulación con el monorepo legible por máquina: [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md).

## Uso de `@1c2c/cli` (`octc`) en `*-workspace`

- **`octc verify monorepo`**, **`octc add surface`**, **`octc sync surface`**, y **`octc portfolio suggest`** están pensados para repos **`*-app`** con `.octc/monorepo.yaml`. **No los uses** en un repo workspace; no añadas `monorepo.yaml` solo para “pasar” verify.
- **`octc sync agents`** y **`octc sync governance`** pueden ser **opcionales** si el producto decide adoptar `package.json`, `@1c2c/cli` y un pin de plantillas documentado en PORTFOLIO (mismo patrón que otros repos). Muchos workspaces operan solo con markdown y scripts **sin** npm; es una **excección válida** si PORTFOLIO lo dice explícitamente.
- **`octc agents init|verify|sync`** sin `verify monorepo`: mismo alcance que arriba — solo si hay adopción consciente de agent-templates.

## Plantilla y runbook (organización)

El **contrato** de límites vive en este repo mediante el workflow reusable [**`octc-workspace-verify-callable.yml`**](../../.github/workflows/octc-workspace-verify-callable.yml). El árbol de plantilla (`README`, markdown raíz, **wrapper** `octc-workspace-verify.yml` en `.github/workflows/`) y el runbook de alta siguen en el repo **privado** [`octc-platform-internal`](https://github.com/OneClickToControl/octc-platform-internal) (`templates/workspace-repo/`, `docs/runbooks/NEW_WORKSPACE_REPO.md`). Los miembros de OneClickToControl siguen el runbook interno para bootstrap.

### Consumir el callable (recomendado)

En el repo `*-workspace`, el workflow `octc-workspace-verify.yml` debe delegar en el callable con **el mismo commit SHA** en `uses:` y en `tooling_ref` (un solo pin; ver `scripts/print-workspace-verify-callable-pin.sh` en `octc-platform`):

```yaml
jobs:
  verify:
    permissions:
      contents: read
    uses: OneClickToControl/octc-platform/.github/workflows/octc-workspace-verify-callable.yml@<SHA_OCTC_PLATFORM>
    with:
      tooling_ref: <SHA_OCTC_PLATFORM>
```

Sustituye `<SHA_OCTC_PLATFORM>` por el commit de `octc-platform` que incorpora la versión de reglas y el script de guardrails que quieres fijar. Subir solo `@main` es válido en prototipo; en repos bajo control org se prefiere SHA para evitar drift sorpresa.

**Obtener el pin recomendado (CLI):** con [`gh`](https://cli.github.com/) autenticado, desde un clone de `octc-platform`:

```bash
./scripts/print-workspace-verify-callable-pin.sh
```

El script devuelve el último commit de la rama indicada (`main` por defecto) que **tocó** `octc-workspace-verify-callable.yml` — suele ser el pin más ajustado tras un cambio de reglas. El ejemplo incluye `with: tooling_ref:` igual al mismo SHA.

## `octc init workspace` (CLI pública)

[`@1c2c/cli`](https://github.com/OneClickToControl/octc-platform/tree/main/packages/cli) incluye **`octc init workspace <dir>`**: materializa la misma forma de árbol que la plantilla pública en `packages/cli/templates/workspace` (**paridad** con `octc-platform-internal` `templates/workspace-repo/` — un cambio debe reflejarse en ambos).

Solo escribe archivos en disco; **no** crea repos GitHub, rulesets ni filas PORTFOLIO. Usa `--pin <SHA>` para sustituir `__OCTC_WORKSPACE_VERIFY_PIN__` en el wrapper; `--template-dir` apunta a un clon internal para comprobar paridad.

## `octc init app` (scaffold carril *-app*, opcional)

**`octc init app <dir>`** materializa el contrato **`templates/product`** (paridad con `templates/product-repo` internal). Es un **scaffold público-seguro** (archivos listos para un futuro `*-app`); **no** sustituye el runbook org de alta de repo. Ver README del paquete CLI.

<a id="octc-workspace-root-markdown"></a>

## Markdown en la raíz: invariante del CI vs convención de plantilla

El callable **v2** exige que existan, en la **raíz del repo**, estos nombres exactos:

`README.md`, `AGENTS.md`, `CLAUDE.md`, `IDENTITY.md`, `MEMORY.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `HEARTBEAT.md`

- **Invariante OCTC (hoy):** la **presencia** de esos archivos y nombres (salvo exclusiones **opt-in** declaradas en `.octc/workspace-guardrails.yaml`, v2 — subset acotado en código). El verify **no** dicta longitud ni estructura interna del markdown.
- **Convención de plantilla** (`octc-platform-internal` / `templates/workspace-repo/` y espejo en CLI): el **contenido inicial** de cada archivo es **ejemplo** para bootstrap; cada familia de producto puede adaptar el texto dentro de cada archivo siempre que no rompa otras reglas v2 (p. ej. no convertir el repo en carril `*-app`).
- Las omisiones de nombres de la lista **solo** son válidas vía `.octc/workspace-guardrails.yaml` (`exceptions.skip_required_root_markdown.files`) dentro del **allowlist** permitido por plataforma — no por bypass local no parseado.

## Relación con adopción de plantillas

[ADOPTION.md](../agents/ADOPTION.md) describe la adopción estándar de `@1c2c/agent-templates` en repos que **sí** fijan pin y CI `octc-agents verify`. Los `*-workspace` **no** están obligados a ese flujo; si mezclan las dos cosas, documenta en PORTFOLIO si hay pin o excepción.

## `octc-workspace-verify`: alcance **v2** (implementación: callable en `octc-platform`)

El job **OCTC workspace verify** evoluciona en fases; la implementación canónica está en [`.github/workflows/octc-workspace-verify-callable.yml`](../../.github/workflows/octc-workspace-verify-callable.yml).

**v1 (base)**

- Si existe `/.octc/monorepo.yaml` → fallo CI.
- Prohibir patrones de *-app* en YAML bajo `.github/` (`octc-portfolio-dispatch-callable`, `octc:verify:monorepo`, `octc verify monorepo`), excluyendo el archivo local **`octc-workspace-verify.yml`** para no autoflagar el wrapper de verify.

**v2 (fase actual)**

- Escaneo recursivo de **todos** los `*.yml` y `*.yaml` bajo `.github/` con la misma exclusión **`octc-workspace-verify.yml`**.
- Raíz: prohibir `pnpm-workspace.yaml` y `turbo.json` (señal fuerte de monorepo *-app*).
- Prohibir workflows con nombre fijo típico de producto: `.github/workflows/octc-agents.yml`, `octc-portfolio-dispatch.yml`.
- Prohibir `.octc/agents/manifest.schema.json` en un workspace “puro” (copia típica desde *-agents* / *-app*).
- Prohibir árbol `agents/**/manifest.json` (manifests ACP solo en *-agents*).
- Si existe `package.json` en raíz, no debe contener referencias literales a `octc:verify:monorepo` ni `octc verify monorepo` (workspaces que adopten solo `octc sync agents` siguen siendo posibles sin esas cadenas).

**Qué sigue fuera del alcance de v2**

- No inspecciona lockfiles, dependencias transitivas ni `package.json` sin esas cadenas pero con scripts de *-app* genéricos.
- No valida contenido de `notes/` ni copia humana de snippets en markdown.

## `.octc/workspace-guardrails.yaml` (schema v1, aplicado en CI)

Archivo **opcional** en el repo workspace. Si **no** existe, rigen los defaults estrictos del callable (lista completa de markdown raíz, sin checks opcionales).

Si existe, debe declarar `schema_version: 1` y el verificador (Ruby en `scripts/workspace-guardrails-verify.rb`) aplica **solo** lo soportado en código:

| Clave | Efecto |
|-------|--------|
| `meta.owner` / `meta.reason` | Obligatorios si hay excepciones con efecto o `optional_checks` no vacío. |
| `exceptions.skip_required_root_markdown.files` | Subconjunto permitido (p. ej. `HEARTBEAT.md`, `USER.md`, `TOOLS.md`); nunca relajar carril *-app*. |
| `optional_checks.require_package_json_scripts` | Si hay `package.json`, exige claves en `scripts`. |
| `optional_checks.expect_agent_templates_range` | Si hay `package.json`, comprueba `devDependencies['@1c2c/agent-templates']` vs rango `^` / `~` / exacto (subset npm). |

**No** hay “disable all”, comodines globales ni excepciones de monorepo/app en este archivo. Claves desconocidas → fallo CI.

## Evolución (histórico fases 3–4)

**Fase 3 — Contrato explícito y reuso**

- Workflow reusable con `tooling_ref` + segunda copia de `octc-platform` para scripts versionados.
- **Implementado:** `.octc/workspace-guardrails.yaml` v1 parseado en CI; `optional_checks` explícitos (sin motor de políticas genérico).

**Fase 4 — Materialización**

- **Implementado en internal:** [`materialize-workspace-from-template.sh`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/scripts/materialize-workspace-from-template.sh).
- **Implementado en CLI:** `octc init workspace` (no registra PORTFOLIO ni crea repo GitHub).


**Excepciones y bordes del carril (hoy)**

- Cualquier relajación **no** cubierta por el shape v1 del guardrails **debe** ir por **PR en `octc-platform`** contra el callable y el script Ruby, **o** por decisión explícita documentada (ADR + PORTFOLIO) — no basta un YAML local con claves inventadas (el verificador rechaza claves desconocidas).

## Enlaces

- Monorepo solo *-app*: [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md)  
- Sincronización runtime ACP (vision): [RUNTIME_SYNC](../agents/RUNTIME_SYNC.md)
