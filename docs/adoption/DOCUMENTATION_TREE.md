# Documentation tree

Estructura mínima de `docs/` que cualquier repo de OneClickToControl LLC debe tener para ser “plataforma-conforme”.

```
docs/
  product/
    PRD.md
    ROADMAP.md
  brand/
    BRAND.md
    VOICE.md
  market/
    MARKET.md
    COMPETITORS.md
  research/
    RESEARCH.md
  strategy/
    STRATEGY.md
    OKRS.md
  design/
    DESIGN_TOKENS.md
    PARITY_WEB_MOBILE.md
  agents/
    REGISTRY.md (si el repo es ACP)
  ops/
    RUNBOOK.md
  security/
    THREAT_MODEL.md (si sensitivity:high)
```

## Extensiones recomendadas (monorepos multi-superficie)

Repos que combinan `web`, `mobile`, `data`, `ml`, etc. suelen añadir, además del mínimo:

```
docs/
  audits/
  features/
  db/
  architecture/
    (mapas vivos: sync, módulos, límites)
  plans/
  ops/
  memory/          # o decisions/ + ADR; mantener un índice enlazado desde architecture
  getting-started.md
ops/
  (runbooks operador: rollback, on-call, flags — complemento de docs/ops)
scripts/
  README.md
  db/
  supabase/        # verificación local ↔ cloud si aplica
  governance/
  i18n/
  security/
  github/          # u otro issue tracker: sync de proyecto/backlog si la org lo usa
  ci/
packages/
  (contratos TS, SDK internos — cada uno con README)
assets/
  brand/           # logos y tokens exportables a clientes
```

La correspondencia **superficie ↔ carpetas** vive en `docs/architecture.md` (tabla SSOT). El patrón completo: [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md) y [MONOREPO_CONFORMANCE_CHECKLIST.md](MONOREPO_CONFORMANCE_CHECKLIST.md). Repos **ACP / agent-heavy** pueden adoptar la plantilla opcional [doc-contract](../../templates/governance/doc-contract/README.md) (también `pnpm exec octc sync governance --only doc-contract` con `@1c2c/cli` ≥ 0.3.0).

## Reglas

- Cualquier repo nuevo se inicia con esta estructura (ver [GOLDEN_PATH.md](GOLDEN_PATH.md)).
- Ausencia de un archivo se documenta en `docs/README.md` como “no aplica” con justificación.
- Los repos de plataforma viven en `octc-platform/docs/` y pueden tener subset distinto.
- Cambio de prioridad en roadmap que afecte entregables → actualizar `docs/features/` u operación en el mismo ciclo (o deuda explícita en auditoría).
