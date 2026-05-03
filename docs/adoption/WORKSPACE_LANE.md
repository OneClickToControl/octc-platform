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

El árbol de referencia, el workflow **`octc-workspace-verify`** (prohíbe monorepo de app y patrones CI de portfolio/verify monorepo) y el runbook de alta viven en el repo **privado** **`octc-platform-internal`** (`templates/workspace-repo/`, `docs/runbooks/NEW_WORKSPACE_REPO.md`). Este documento público describe el **contrato**; los miembros de OneClickToControl siguen el runbook interno para bootstrap.

## Relación con adopción de plantillas

[ADOPTION.md](../agents/ADOPTION.md) describe la adopción estándar de `@1c2c/agent-templates` en repos que **sí** fijan pin y CI `octc-agents verify`. Los `*-workspace` **no** están obligados a ese flujo; si mezclan las dos cosas, documenta en PORTFOLIO si hay pin o excepción.

## `octc-workspace-verify`: alcance **v2** (plantilla `octc-platform-internal`)

El workflow **OCTC workspace verify** evoluciona en fases; la plantilla internal incorpora:

**v1 (base)**

- Si existe `/.octc/monorepo.yaml` → fallo CI.
- Prohibir patrones de *-app* en YAML bajo `.github/` (`octc-portfolio-dispatch-callable`, `octc:verify:monorepo`, `octc verify monorepo`), excluyendo **`octc-workspace-verify.yml`** para no autoflagar el job de verify.

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

- Publicar en `octc-platform` un workflow **reusable** (`workflow_call`) que encapsule los pasos de verify, para que los `*-workspace` lo invoquen con `@OneClickToControl/octc-platform/...@pin` y una sola fuente de verdad de reglas (menos drift que copiar YAML).
- Introducir **opt-in** `.octc/workspace-guardrails.yaml` (o bloque en PORTFOLIO) con excepciones versionadas (p. ej. “allow root package.json with only X scripts”) en lugar de bifurcar la plantilla por producto.
- Añadir comprobaciones **opcionales** vía flags: presencia de `octc sync agents` sin monorepo, alineación con pin de `@1c2c/agent-templates` cuando PORTFOLIO exija pin.

**Fase 4 — Plataforma y escala**

- **Generador** (`octc init workspace` o script internal) que materialice `*-workspace` desde plantilla + registre fila PORTFOLIO.
- **Post-check** en PR (comentario o etiqueta) cuando el verify detectaría violación en diff (preview).
- Integración con **estructura strategy-***: mismo carril verify, checklist de adopción en runbook único multi-producto.
- Telemetría opcional (sin PII): contador de fallos por regla para priorizar nuevos patrones.

## Enlaces

- Monorepo solo *-app*: [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md)  
- Sincronización runtime ACP (vision): [RUNTIME_SYNC](../agents/RUNTIME_SYNC.md)
