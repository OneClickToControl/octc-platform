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

En el repo `*-workspace`, el workflow `octc-workspace-verify.yml` debe delegar en el callable con **pin por commit SHA** del repo público (misma disciplina que los callables ACP / portfolio dispatch):

```yaml
jobs:
  verify:
    permissions:
      contents: read
    uses: OneClickToControl/octc-platform/.github/workflows/octc-workspace-verify-callable.yml@<SHA_OCTC_PLATFORM>
```

Sustituye `<SHA_OCTC_PLATFORM>` por el commit de `octc-platform` que incorpora la versión de reglas que quieres fijar. Subir solo `@main` es válido en prototipo; en repos bajo control org se prefiere SHA para evitar drift sorpresa.

**Obtener el pin recomendado (CLI):** con [`gh`](https://cli.github.com/) autenticado, desde un clone de `octc-platform`:

```bash
./scripts/print-workspace-verify-callable-pin.sh
```

El script devuelve el último commit de la rama indicada (`main` por defecto) que **tocó** `octc-workspace-verify-callable.yml` — suele ser el pin más ajustado tras un cambio de reglas.

<a id="octc-workspace-root-markdown"></a>

## Markdown en la raíz: invariante del CI vs convención de plantilla

El callable **v2** exige que existan, en la **raíz del repo**, estos nombres exactos:

`README.md`, `AGENTS.md`, `CLAUDE.md`, `IDENTITY.md`, `MEMORY.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `HEARTBEAT.md`

- **Invariante OCTC (hoy):** la **presencia** de esos archivos y nombres; el verify **no** dicta longitud ni estructura interna. Cambiar la lista (añadir/quitar nombres) es un cambio de **plataforma**: PR en este repo al callable + migración coordinada de los `*-workspace` afectados.
- **Convención de plantilla** (`octc-platform-internal` / `templates/workspace-repo/`): el **contenido inicial** de cada archivo es **ejemplo** para bootstrap; cada familia de producto puede adaptar el texto dentro de cada archivo siempre que no rompa otras reglas v2 (p. ej. no convertir el repo en carril `*-app`).
- Si un producto necesita **omitir** alguno de esos nombres o sustituirlos por otros, no basta con decisión local: hay que proponer evolución del estándar (p. ej. opt-in [fase 3](#evolución-propuesta-fases-3-y-4) con `.octc/workspace-guardrails.yaml`) para no fracturar el carril `*-workspace` sin criterio común.

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

## Evolución propuesta (fases 3 y 4)

**Fase 3 — Contrato explícito y reuso**

- **Hecho:** workflow reusable [`octc-workspace-verify-callable.yml`](../../.github/workflows/octc-workspace-verify-callable.yml) (`workflow_call`) para que los `*-workspace` invoquen `@OneClickToControl/octc-platform/.github/workflows/octc-workspace-verify-callable.yml@<pin>` (SHA recomendado) y una sola fuente de verdad de reglas.
- **Pendiente:** introducir **opt-in** `.octc/workspace-guardrails.yaml` (o bloque en PORTFOLIO) con excepciones versionadas (p. ej. “allow root package.json with only X scripts”) en lugar de bifurcar la plantilla por producto.
- **Pendiente:** comprobaciones **opcionales** vía flags: presencia de `octc sync agents` sin monorepo, alineación con pin de `@1c2c/agent-templates` cuando PORTFOLIO exija pin.

**Fase 4 — Plataforma y escala**

- **Generador** (`octc init workspace` o script internal) que materialice `*-workspace` desde plantilla + registre fila PORTFOLIO.
- **Post-check** en PR (comentario o etiqueta) cuando el verify detectaría violación en diff (preview).
- Integración con **estructura strategy-***: mismo carril verify, checklist de adopción en runbook único multi-producto.
- Telemetría opcional (sin PII): contador de fallos por regla para priorizar nuevos patrones.

## Enlaces

- Monorepo solo *-app*: [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md)  
- Sincronización runtime ACP (vision): [RUNTIME_SYNC](../agents/RUNTIME_SYNC.md)
