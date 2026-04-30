# Paridad con PORTFOLIO interno (sin prometer sync “solo npm”)

Inventario vivo (`repo_surfaces`, `octc_cli_pin`, …) vive en el repo privado **octc-platform-internal** (`docs/PORTFOLIO.md`). Este documento describe **qué puede hacer la herramienta pública** y **qué exige credenciales org**.

## Lo que `@1c2c/cli` hace sin token

| Comando | Resultado |
|---------|-----------|
| `octc verify monorepo` | Falla CI si `.octc/monorepo.yaml` no cuadra con el filesystem (ver [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md)). |
| `octc portfolio suggest` | Imprime fragmentos (YAML `portfolio.repo_surfaces_csv`, plantilla de fila tabla) para **pegar** en un PR manual a internal. |

Variables opcionales: `OCTC_PORTFOLIO_REPO`, `OCTC_PORTFOLIO_CLI_PIN`.

## Lo que requiere autenticación GitHub

- Abrir o actualizar PRs contra `octc-platform-internal` de forma automática.
- Leer metadatos org que no están en el clone público.

Patrones alineados a [ADR-0003 § bridge](../adr/ADR-0003-monorepo-cli-machine-ssot.md):

1. **Workflow en el repo internal** que se dispara con `repository_dispatch` / `workflow_dispatch` y recibe un artefacto exportado (p. ej. JSON del manifiesto) generado en CI del repo producto.
2. **PAT o GitHub App** con alcance `contents` + `pull_requests` sobre el repo private, usado solo en runners/org permitidas — no en paquetes publicados sin contexto seguro.
3. **Proceso manual** usando `octc portfolio suggest` + PR humano (válido para muchas orgs).

## Runbook

Cadencia y diff PORTFOLIO ↔ `docs/architecture.md` / `.octc/monorepo.yaml`: ver companion [REFERENCE_MONOREPO_SYNC](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/REFERENCE_MONOREPO_SYNC.md) (miembros org).

## Referencias

- [REFERENCE_PRODUCT_MONOREPO](REFERENCE_PRODUCT_MONOREPO.md)
- [MONOREPO_CONFORMANCE_CHECKLIST](MONOREPO_CONFORMANCE_CHECKLIST.md)
