# PLATFORM_PLAN

> **Internal — moved to private companion repo.**

The full foundational plan with product names and operational specifics is maintained in:

- [`OneClickToControl/octc-platform-internal/docs/PLATFORM_PLAN.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/PLATFORM_PLAN.md) (**access-restricted**)

## Why this isn't public

The full plan references concrete product names, internal roadmap maturity, and operational specifics that belong in the private companion repo. See [docs/security/PUBLIC_REPO_POLICY.md](security/PUBLIC_REPO_POLICY.md).

## What this repo enforces from that plan

The 18 deliverables of the foundational plan are reflected as files in this repo:

- Architecture & polyrepo strategy → [docs/adr/ADR-0001-polyrepo-platform.md](adr/ADR-0001-polyrepo-platform.md), [docs/adr/ADR-0002-acp-pattern.md](adr/ADR-0002-acp-pattern.md)
- Three-plane agent model (normative / capabilities / execution) → [docs/agents/CONFORMANCE.md](agents/CONFORMANCE.md), [docs/agents/RUNTIME_SYNC.md](agents/RUNTIME_SYNC.md)
- ACP schema → [schemas/octc-agent-provider.manifest.v1.json](../schemas/octc-agent-provider.manifest.v1.json)
- Agent base templates → [templates/agents/CLAUDE.md](../templates/agents/CLAUDE.md)
- Observability policy & Sentry templates → [docs/observability/OBSERVABILITY.md](observability/OBSERVABILITY.md), [templates/observability/sentry/](../templates/observability/sentry/)
- Supply chain policy → [docs/security/SUPPLY_CHAIN.md](security/SUPPLY_CHAIN.md)
- FinOps LLM policy → [docs/finops/LLM_COSTS.md](finops/LLM_COSTS.md)
- Identity & Access policy → [docs/governance/IDENTITY_ACCESS.md](governance/IDENTITY_ACCESS.md)
- DR / BCP policy → [docs/ops/DR_BCP.md](ops/DR_BCP.md)
- Onboarding & Golden path → [docs/adoption/GOLDEN_PATH.md](adoption/GOLDEN_PATH.md), [docs/onboarding/](onboarding/)
- ADR & RFC process → [docs/adr/](adr/), [docs/comms/RFC_TEMPLATE.md](comms/RFC_TEMPLATE.md)
- CI/CD & releases (Changesets, OIDC, provenance) → [.github/workflows/](../.github/workflows/), [docs/packages/POLICY.md](packages/POLICY.md)
- Privacy guard for going public → [docs/security/PUBLIC_REPO_POLICY.md](security/PUBLIC_REPO_POLICY.md)

## How the plan is updated

Substantive changes flow through:

1. RFC: [docs/comms/RFC_TEMPLATE.md](comms/RFC_TEMPLATE.md).
2. ADR: [docs/adr/INDEX.md](adr/INDEX.md).
3. Sync to `octc-platform-internal/docs/PLATFORM_PLAN.md`.
4. Public summary updated here if any new artifact in the public surface is affected.

Quarterly review cadence; current quarter audit lives in [`octc-platform-internal/docs/audit/`](https://github.com/OneClickToControl/octc-platform-internal/tree/main/docs/audit).
