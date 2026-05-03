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

## `octc-workspace-verify` (plantilla interna): alcance v1

En `octc-platform-internal`, el workflow **OCTC workspace verify** comprueba:

- que existe `/.octc/monorepo.yaml` → fallo;
- que no hay `octc-portfolio-dispatch.yml` ni, en otros YAML bajo `.github/workflows/`, llamadas a `octc-portfolio-dispatch-callable`, ni `octc:verify:monorepo` / `octc verify monorepo` (el job ignora el propio `octc-workspace-verify.yml` al escanear);
- que existen los markdown raíz exigidos por la plantilla.

**No** detecta por sí solo: dependencias npm que arrastren el contrato app, u otros nombres de workflow copiados desde `*-app`. Ampliar patrones cuando aparezca un caso real.

## Enlaces

- Monorepo solo *-app*: [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md)  
- Sincronización runtime ACP (vision): [RUNTIME_SYNC](../agents/RUNTIME_SYNC.md)
