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
.github/         # workflows (verify, release)
```

## Workspace packages

| paquete | descripción |
|---------|-------------|
| [`@1c2c/tsconfig`](packages/tsconfig) | base TypeScript estricta (`base.json`, `library.json`, `nextjs.json`). |
| [`@1c2c/eslint-config`](packages/eslint-config) | flat configs ESLint compartidas (`base`, `next`, `library`). |
| [`@1c2c/agent-templates`](packages/agent-templates) | plantillas canónicas de agentes (CLAUDE, AGENTS, Cursor rules) + ACP manifest schema, con CLI `octc-agents`. |

## Dónde empezar

- Nuevo en la plataforma: lee [docs/onboarding/PLATFORM_TOUR.md](docs/onboarding/PLATFORM_TOUR.md) (30 min).
- Vas a contribuir: lee [CONTRIBUTING.md](CONTRIBUTING.md) y la lista [docs/PORTFOLIO.md](docs/PORTFOLIO.md).
- Vas a registrar un ACP nuevo: usa [schemas/octc-agent-provider.manifest.v1.json](schemas/octc-agent-provider.manifest.v1.json) y [docs/agents/REGISTRY.md](docs/agents/REGISTRY.md).
- Plan maestro: [docs/PLATFORM_PLAN.md](docs/PLATFORM_PLAN.md) (espejo del documento fundacional vigente).

## Estado

- Repo creado (Fase 0 bootstrap).
- ADRs vivos en [docs/adr/INDEX.md](docs/adr/INDEX.md).
- Auditorías visibles en [docs/audit/HISTORY.md](docs/audit/HISTORY.md).

## Licencia

MIT — ver [LICENSE](LICENSE).
