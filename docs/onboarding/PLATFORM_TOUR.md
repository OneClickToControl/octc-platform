# Platform tour (30 minutes)

Human-readable tour of `octc-platform` for new contributors. Read it end-to-end before your first PR.

## 1. What octc-platform is (5 minutes)

- SSOT repository for OneClickToControl LLC.
- **Lives here:** `@1c2c/*` packages, agent templates, schemas, policies, ACP registry metadata.
- **Does not live here:** product roadmaps, product application code, user data.

Minimum reading:

- [README](../../README.md)
- [PORTFOLIO](../PORTFOLIO.md)
- [ADR-0001](../adr/ADR-0001-polyrepo-platform.md)

## 2. Mental model (5 minutes)

Three layers:

1. **Policy** (this repo): templates, schemas, governance docs.
2. **Capabilities** (ACPs in `*-agents` repos or `agents/<acp>/` in a product repo): skills, MCP, guardrails.
3. **Execution** (Cursor, Claude Code, OpenClaw, Paperclip, CI): heartbeats and outcomes.

Minimum reading:

- [ADR-0002](../adr/ADR-0002-acp-pattern.md)
- [agents/REGISTRY](../agents/REGISTRY.md)
- [agents/CONFORMANCE](../agents/CONFORMANCE.md)

## 3. How change happens (5 minutes)

- Small changes: direct PR with CODEOWNERS review.
- Structural changes: RFC ([template](../comms/RFC_TEMPLATE.md)) → discussion → ADR ([template](../adr/_TEMPLATE.md)) → PR.
- Template or schema edits: require double review.

## 4. Observability (5 minutes)

- Single Sentry org; one project per (product, surface).
- AI monitoring for agents.
- Source maps via OIDC.
- Read: [OBSERVABILITY](../observability/OBSERVABILITY.md), [AGENT_TELEMETRY](../observability/AGENT_TELEMETRY.md).

## 5. Security and supply chain (5 minutes)

- OIDC for publish and deploy.
- Consumer-side provenance is mandatory.
- SSO + 2FA enforced.
- Read: [SUPPLY_CHAIN](../security/SUPPLY_CHAIN.md), [IDENTITY_ACCESS](../governance/IDENTITY_ACCESS.md).

## 6. LLM FinOps (3 minutes)

- Each agent declares budget and approved model.
- Metrics per agent / product.
- Read: [LLM_COSTS](../finops/LLM_COSTS.md).

## 7. Operations and incidents (2 minutes)

- DR/BCP with semi-annual drills.
- Runbooks with procedures.
- Channels: `#ops`, `#ops-incidents`, `#ops-agents`, `#ops-finops`.
- Read: [DR_BCP](../ops/DR_BCP.md), [PLATFORM_RUNBOOK](../ops/PLATFORM_RUNBOOK.md), [CHANNELS](../comms/CHANNELS.md).

## 8. Product monorepos (when applicable)

- Surfaces (`landing`, `web`, `data`, `mobile`, `ml`, `api`, `chat`) are declared in `docs/architecture.md` and mirrored in PORTFOLIO (`repo_surfaces`).
- Reference patterns: [REFERENCE_PRODUCT_MONOREPO](../adoption/REFERENCE_PRODUCT_MONOREPO.md), [REPO_ARCHETYPES](../adoption/REPO_ARCHETYPES.md), [checklist](../adoption/MONOREPO_CONFORMANCE_CHECKLIST.md).
- Adoption order: [GOLDEN_PATH](../adoption/GOLDEN_PATH.md).

## Your first contribution

Follow [CONTRIBUTING](../../CONTRIBUTING.md) and open an issue tagged `good-first-issue` or ask an owner for a scoped task.

## Resources

- [Foundational plan](../PLATFORM_PLAN.md)
- [Current scorecard](../metrics/PLATFORM_SCORECARD.md)
- [Public audit history](../audit/HISTORY.md)
