# octc-platform

**Repositorio fundacional de OneClickToControl LLC.** Single Source of Truth (SSOT) para:

- Paquetes internos publicados como `@1c2c/*`.
- Plantillas de agentes (`CLAUDE.md`, `.cursor/rules/*.mdc`, `AGENTS.md`).
- Registro extensible de **Agent Capability Providers (ACP)** con manifiesto y tiers L0–L4.
- Estándares de observabilidad (Sentry org única), supply chain (OIDC + provenance + SBOM), FinOps LLM, identidad y acceso (SSO/2FA), DR/BCP de plataforma.
- Documentación transversal (PORTFOLIO, ADRs, RFCs, golden path, scorecard).

`octc-platform` **no** contiene código de producto: solo normas, paquetes compartidos y plantillas. Los productos viven en sus propios repos (privados) y consumen la plataforma por versión.

## Estructura

```
packages/        # @1c2c/* paquetes publicables
schemas/         # JSON Schemas (manifest ACP, etc.)
templates/       # plantillas: agents, observability, governance
docs/            # documentación transversal
.github/         # CI: verify (estructura + tests), privacy-guard, release + workflows reutilizables ACP/portfolio (`octc-acp-dispatch-callable.yml`, `octc-portfolio-dispatch-callable.yml`)
```

## Workspace packages

| paquete | descripción |
|---------|-------------|
| [`@1c2c/tsconfig`](packages/tsconfig) | base TypeScript estricta (`base.json`, `library.json`, `nextjs.json`). |
| [`@1c2c/eslint-config`](packages/eslint-config) | flat configs ESLint compartidas (`base`, `next`, `library`). |
| [`@1c2c/agent-templates`](packages/agent-templates) | plantillas canónicas de agentes (CLAUDE, AGENTS, Cursor rules) + ACP manifest schema, con CLI `octc-agents`. |
| [`@1c2c/cli`](packages/cli) | CLI unificada **`octc`** (≥ **0.3**): delega agentes en **`octc-agents`** (`octc sync agents`, `octc agents …`); más `octc verify monorepo`, comandos **`octc add surface`** / **`octc sync surface`**, **`octc sync governance`**, **`octc portfolio suggest`** en repos **`*-app`** (ver [ADR-0003](docs/adr/ADR-0003-monorepo-cli-machine-ssot.md), [WORKSPACE_LANE](docs/adoption/WORKSPACE_LANE.md)). |

## Dónde empezar

- Nuevo en la plataforma: lee [docs/onboarding/PLATFORM_TOUR.md](docs/onboarding/PLATFORM_TOUR.md) (30 min).
- Vas a contribuir: lee [CONTRIBUTING.md](CONTRIBUTING.md) y la lista [docs/PORTFOLIO.md](docs/PORTFOLIO.md).
- Vas a registrar un ACP nuevo: usa [schemas/octc-agent-provider.manifest.v1.json](schemas/octc-agent-provider.manifest.v1.json) y [docs/agents/REGISTRY.md](docs/agents/REGISTRY.md).
- Plan maestro: [docs/PLATFORM_PLAN.md](docs/PLATFORM_PLAN.md) (espejo del documento fundacional vigente).

## Contribución local

El monorepo exige **Node ≥ 20** y **pnpm @9.12.3** (ver `engines` / `packageManager` en [`package.json`](package.json)).

## Estado

- Paquetes publicables **`@1c2c/*`** (`tsconfig`, `eslint-config`, `agent-templates`, `cli`) publicados desde [`release.yml`](.github/workflows/release.yml).
- Inventario vivo de repos (privado): [docs/PORTFOLIO.md](docs/PORTFOLIO.md) enlaza el companion **`octc-platform-internal`**.
- ADRs vigentes en [docs/adr/INDEX.md](docs/adr/INDEX.md); auditorías en [docs/audit/HISTORY.md](docs/audit/HISTORY.md).

## Licencia

MIT — ver [LICENSE](LICENSE).
