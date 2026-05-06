# ADR-0001: Polyrepo + `octc-platform` as SSOT

- **Status**: accepted
- **Date**: 2026-04-29
- **Tags**: platform, repo, governance

## Context

OneClickToControl LLC operates multiple private products and supporting services (agents, runtimes). Question: single monorepo or polyrepo with a shared platform repo?

Constraints:
- Small teams, high DX expectations.
- Products with heterogeneous stacks (Next.js, Flutter, Python ML).
- Need for common rules and templates for AI agents.
- Consistent security/observability.

## Decision

We adopt **polyrepo** with a dedicated `octc-platform` repo as **Single Source of Truth** for:

- Shared packages published as `@1c2c/*`.
- Agent templates (`CLAUDE.md`, `.cursor/rules`, `AGENTS.md`).
- Schemas, policies, governance, observability, FinOps, supply chain.
- Cross-cutting documentation and agent capability (ACP) registry.

Each product lives in its own repo and consumes the platform by **version** (`@1c2c/*` and templates).

## Consequences

### Positive
- Isolation per product: reduced blast radius.
- Independent releases and granular rollback.
- Simpler per-repo onboarding.
- Heterogeneous stacks without tooling contagion.

### Negative
- Coordinating versions across repos requires discipline.
- Cross-cutting changes need PRs in multiple repos.

### Neutral
- Need a live PORTFOLIO and SCORECARD to track adoption.

## Alternatives considered

- **Monorepo (Turborepo/Nx)**: rejected for current team size and cost of unified tooling across disparate stacks.
- **Single `1click2control` repo with submodules**: rejected for operational friction.

## Notes and references

- Foundational plan ([PLATFORM_PLAN](../PLATFORM_PLAN.md)).
- [PORTFOLIO](../PORTFOLIO.md).
