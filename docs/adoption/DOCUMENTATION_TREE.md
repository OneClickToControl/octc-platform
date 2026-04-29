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

## Reglas

- Cualquier repo nuevo se inicia con esta estructura (ver [GOLDEN_PATH.md](GOLDEN_PATH.md)).
- Ausencia de un archivo se documenta en `docs/README.md` como “no aplica” con justificación.
- Los repos de plataforma viven en `octc-platform/docs/` y pueden tener subset distinto.
