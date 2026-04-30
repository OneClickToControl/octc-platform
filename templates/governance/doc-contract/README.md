# Plantilla — contrato de documentación (repos ACP / agent-heavy)

Patrón **opcional** para repos que versionan muchos artefactos normativos (skills, manifiestos, allowlists) y quieren **trazabilidad** tipo “cambio ↔ revisión” sin mezclar contenido de clientes en `octc-platform` público.

## Cuándo usarla

- El repo es un **ACP** o consume fuerte el modelo “manifest + schema + docs normativas”.
- Queréis registrar **qué** cambió en documentación normativa (p. ej. nueva skill, bump de tier) con un artefacto pequeño revisable en PR.

## Qué copiar al repo

1. Desde el consumidor, tras `@1c2c/cli` ≥ 0.3.0:
   ```bash
   pnpm exec octc sync governance --only doc-contract
   ```
   (o copiar manualmente esta carpeta a `templates/governance/doc-contract/` del repo destino).

2. Añadir en CI (opcional) un paso que falle si falta `schema_version` en los changesets recientes o que valide el manifiesto ACP contra `.octc/agents/manifest.schema.json` (patrón ya usado en repos org).

## Archivos de referencia

| Archivo | Uso |
|---------|-----|
| `changeset.example.yaml` | Formato sugerido para describir un cambio de contrato doc (sin datos sensibles). Copiar a `changesets/` o `docs/changes/` con otro nombre. |

## Límites

- No sustituye **ADRs** ni **PUBLIC_REPO_POLICY**: cualquier dato sensible sigue fuera del público.
- La validación estricta (JSON Schema, grep de secretos) sigue siendo responsabilidad del workflow del repo.

## Enlaces

- [REFERENCE_PRODUCT_MONOREPO](../../../docs/adoption/REFERENCE_PRODUCT_MONOREPO.md) — superficies en monorepos producto.
- [REGISTRY](../../../docs/agents/REGISTRY.md) — registro de ACPs.
- Golden path — paso ACP / doc-contract: [GOLDEN_PATH](../../../docs/adoption/GOLDEN_PATH.md).
