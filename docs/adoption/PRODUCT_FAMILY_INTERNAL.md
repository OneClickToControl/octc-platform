# Bootstrap de familias de producto (capa internal)

OCTC separa **tres carriles** por familia (`*-app`, `*-agents`, `*-workspace`). La orquestación **específica de organización** (plantillas encadenadas, checklist de pasos que no son automáticos en GitHub) vive en el repositorio **internal** de la org, no en el CLI público.

## Dónde está el flujo

En el repo internal de plataforma (mismo lugar que `templates/` y `materialize-*`):

- Script: `scripts/bootstrap-product-family.sh`
- Runbook: `docs/runbooks/NEW_PRODUCT_FAMILY.md`
- Manifest de ejemplo: `config/examples/product-family.store.yaml`

Los enlaces exactos y el nombre del repo internal no se duplican aquí (repo público); usad el catálogo interno de runbooks.

## Qué sigue en esta capa pública (`octc-platform`)

- CLI **`octc init app`**, **`octc init workspace`**, **`octc add|sync surface`**, **`octc verify monorepo`**: contratos reutilizables y plantillas en `@1c2c/cli` (ver [ADR-0003](../../adr/ADR-0003-monorepo-cli-machine-ssot.md), [WORKSPACE_LANE](./WORKSPACE_LANE.md)).
- Workflows reusables (portfolio dispatch, ACP dispatch, workspace verify callable) y scripts de pin bajo `scripts/print-*-callable-pin.sh`.

**Meta-fábrica multi-producto:** etapas de ciclo de vida, carriles y superficies se describen en el plano declarativo **Paperclip** (`factory/initiatives/`); la orquestación de bootstrap y plantillas de repos **org-agents/org-workspace** viven en la capa **internal** — ver visión pública [ORG_PRODUCT_FACTORY](./ORG_PRODUCT_FACTORY.md).

**No** centralizar en el CLI la creación de familias enteras más checklist org: desacopla consumidores externos y mantiene el acoplamiento org en la capa internal.

## Próximo rollout típico

Para completar una familia donde ya exista un carril *-app* pero falten *-agents* / *-workspace*: en el repo internal, ejecutar el bootstrap con `--lanes agents,workspace` (o solo los carriles faltantes) y completar la checklist impresa (rulesets, fila de cartera, allowlist ACP, secretos). Superficies complejas en *-app* siguen usando `octc add surface` por superficie tras el stub inicial.
