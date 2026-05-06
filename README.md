# octc-platform

**Language:** This **public** repository’s **README, ADRs, and governance** are maintained in **English**. **Private** org repos (`octc-platform-internal`, `octc-platform-workspace`, `octc-platform-agents`) use **Spanish** for narrative runbooks unless an exception is documented in [internal governance](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/OCTC_DOCUMENTATION_GOVERNANCE.md). See also [Documentation standards](docs/governance/DOCUMENTATION_STANDARDS.md) and [i18n policy](docs/i18n/POLICY.md).

---

**Foundational repository for OneClickToControl LLC.** Single Source of Truth (SSOT) for:

- Shared packages published as `@1c2c/*`.
- Agent templates (`CLAUDE.md`, `.cursor/rules/*.mdc`, `AGENTS.md`).
- Extensible **Agent Capability Provider (ACP)** registry with manifests and L0–L4 tiers.
- Cross-cutting standards: observability (single Sentry org), supply chain (OIDC + provenance + SBOM), LLM FinOps, identity/access (SSO/2FA), platform DR/BCP.
- Cross-cutting docs (PORTFOLIO companion in private repo, ADRs, RFCs, golden path, scorecard).

`octc-platform` does **not** contain product application code — only policies, shared packages, and templates. Products live in their own (mostly private) repos and consume the platform by version.

## Layout

```
packages/        # publishable @1c2c/* packages
schemas/         # JSON Schemas (ACP manifest, etc.)
templates/       # agents, observability, governance templates
docs/            # cross-cutting documentation
.github/         # CI: verify (structure + tests), privacy-guard, release + reusable ACP/portfolio workflows
```

## Workspace packages

| Package | Description |
|---------|-------------|
| [`@1c2c/tsconfig`](packages/tsconfig) | Strict TypeScript bases (`base.json`, `library.json`, `nextjs.json`). |
| [`@1c2c/eslint-config`](packages/eslint-config) | Shared flat ESLint configs (`base`, `next`, `library`). |
| [`@1c2c/agent-templates`](packages/agent-templates) | Canonical agent templates (CLAUDE, AGENTS, Cursor rules) + ACP manifest schema, with `octc-agents` CLI. |
| [`@1c2c/cli`](packages/cli) | Unified **`octc`** CLI (≥ **0.3**): delegates agent ops to **`octc-agents`** (`octc sync agents`, `octc agents …`); plus `octc verify monorepo`, **`octc add surface`** / **`octc sync surface`**, **`octc sync governance`**, **`octc portfolio suggest`** on **`*-app`** repos (see [ADR-0003](docs/adr/ADR-0003-monorepo-cli-machine-ssot.md), [WORKSPACE_LANE](docs/adoption/WORKSPACE_LANE.md)). |

## Getting started

- New to the platform: read [docs/onboarding/PLATFORM_TOUR.md](docs/onboarding/PLATFORM_TOUR.md) (~30 min).
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/PORTFOLIO.md](docs/PORTFOLIO.md) (links private inventory where needed).
- Registering a new ACP: [schemas/octc-agent-provider.manifest.v1.json](schemas/octc-agent-provider.manifest.v1.json) and [docs/agents/REGISTRY.md](docs/agents/REGISTRY.md).
- Master plan: [docs/PLATFORM_PLAN.md](docs/PLATFORM_PLAN.md).

## Local dev

The monorepo requires **Node ≥ 20** and **pnpm @9.12.3** (see `engines` / `packageManager` in [`package.json`](package.json)).

## Status

- Publishable **`@1c2c/*`** packages (`tsconfig`, `eslint-config`, `agent-templates`, `cli`) ship from [`release.yml`](.github/workflows/release.yml).
- Live org repo inventory (private companion): [docs/PORTFOLIO.md](docs/PORTFOLIO.md) points to **`octc-platform-internal`**.
- ADRs: [docs/adr/INDEX.md](docs/adr/INDEX.md); audits: [docs/audit/HISTORY.md](docs/audit/HISTORY.md).

## Security & split with private companion

Anything that must not be public (Sentry DSN inventory, internal registry payloads, etc.) lives in **`octc-platform-internal`**. Enforcement: [docs/security/PUBLIC_REPO_POLICY.md](docs/security/PUBLIC_REPO_POLICY.md) and **privacy-guard** CI.

## License

MIT — see [LICENSE](LICENSE).
