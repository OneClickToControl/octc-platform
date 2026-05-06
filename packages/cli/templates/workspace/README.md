# Plantilla — repositorio `*-workspace` (memoria / identidad / restore)

Copia este directorio a la **raíz** de `OneClickToControl/<producto>-workspace` (o úsalo como **GitHub Template**). Para volcar el árbol desde un clone de `octc-platform-internal`, usa `scripts/materialize-workspace-from-template.sh` (ver [NEW_WORKSPACE_REPO.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_WORKSPACE_REPO.md) §1).

## Qué vive aquí

- Identidad y preferencias estables del operador / equipo.
- Memoria de largo plazo y punteros a contexto (no código de producto).
- Notas, diario, canales de trabajo y procedimientos de **restore / bootstrap**.
- Scripts personales o de operación que no son política agéntica canónica.

## Qué **no** va aquí

- **Manifests ACP** (`agents/<id>/manifest.json`) → repo `*-agents`.
- **Perfiles runtime canónicos, allowlists MCP guardadas como norma**, guardrails de producto → `*-agents` o `octc-platform`.
- **Código de aplicación** → `*-app`.
- **No** añadas `.octc/monorepo.yaml` ni uses `octc add surface` / `octc sync surface` / `octc verify monorepo` (contrato y comandos de superficie exclusivos de `*-app`).
- **No** copies workflows de portfolio dispatch del monorepo (`octc-portfolio-dispatch.yml` o `octc-portfolio-dispatch-callable`) ni líneas `octc:verify:monorepo` / `octc verify monorepo` en CI — el job `octc-workspace-verify` las rechaza.

## Política `.octc/`

- **`/.octc/monorepo.yaml`:** **prohibido** en `*-workspace` (solo `*-app`).
- **Cualquier otro archivo bajo `.octc/`:** no forma parte de esta plantilla. Solo debe existir si un **ADR o runbook OCTC** lo introduce explícitamente para este carril; en caso contrario, mantén el repo **sin** árbol `.octc/`.

## Verificación CI (`octc-workspace-verify`)

- El archivo `.github/workflows/octc-workspace-verify.yml` es un **wrapper** que invoca el workflow reusable público [`octc-workspace-verify-callable.yml`](https://github.com/OneClickToControl/octc-platform/blob/main/.github/workflows/octc-workspace-verify-callable.yml) en `octc-platform` con **pin por commit SHA** (evita drift de reglas).
- Se ejecuta en **cada** `pull_request` y `push` a **`main`** (y manualmente vía `workflow_dispatch`).
- **v2:** además de prohibir `/.octc/monorepo.yaml`, rechaza `pnpm-workspace.yaml` y `turbo.json` en raíz, workflows fijos `octc-agents.yml` / `octc-portfolio-dispatch.yml`, `.octc/agents/manifest.schema.json`, cualquier `agents/**/manifest.json`, y `package.json` con cadenas de verify monorepo; escanea **todo** `.github/**/*.yml` (incl. actions) salvo este `octc-workspace-verify.yml`. Detalle y fases 3–4: [WORKSPACE_LANE](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/WORKSPACE_LANE.md).
- **Convención de plantilla:** el contenido inicial de esos markdown es **ejemplo**; ver [WORKSPACE_LANE — Markdown en la raíz](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/WORKSPACE_LANE.md#octc-workspace-root-markdown) (invariante CI vs texto libre dentro de cada archivo).
- **Límite honesto:** v2 no cubre todas las variantes posibles de *-app*; el doc público describe el roadmap.
- **Subir pin:** tras traer cambios nuevos del callable en `octc-platform`, edita el SHA en `octc-workspace-verify.yml` y abre PR en el `*-workspace` correspondiente.

## Runbook org

Para alta de un repo nuevo: en **octc-platform-internal**, [NEW_WORKSPACE_REPO.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_WORKSPACE_REPO.md).
