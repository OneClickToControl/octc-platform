# ADR-0002: Agent Capability Provider (ACP) pattern

- **Status**: accepted
- **Date**: 2026-04-29
- **Tags**: agents, governance, platform

## Context

OneClickToControl LLC has multiple AI agents (coding, ops, client, eval) running on different runtimes (Cursor, Claude Code/Desktop, OpenClaw, Codex, possible Paperclip). We need:

- Single catalog of capabilities (skills, MCP, tools).
- Single security and agent telemetry policy.
- No SSOT scattered across every runtime.

## Decision

We adopt the **Agent Capability Provider (ACP)** pattern:

- Each repo that provides skills/MCP/tools to agents is an **ACP**.
- Each ACP publishes `agents/<acp-id>/manifest.json` validated by `schemas/octc-agent-provider.manifest.v1.json`.
- ACPs are registered in `docs/agents/REGISTRY.md`.
- Tiers L0–L4 ([CONFORMANCE](../agents/CONFORMANCE.md)) classify maturity.
- Templates, observability, FinOps, and allowlists are normative in `octc-platform`.

## Consequences

### Positive
- Reusable capabilities without duplicating code.
- Single auditable policy (CONFORMANCE).
- Natural multi-runtime support with planned `octc-sync`.

### Negative
- Governance load (each ACP must maintain manifest, allowlist, telemetry).
- Adoption curve for small repos (mitigated with tier L0).

## Alternatives considered

- **No abstraction** (each repo declares skills ad hoc): rejected — not auditable.
- **Platform as single centralized ACP**: rejected — does not scale with product heterogeneity.

## Notes and references

- [REGISTRY](../agents/REGISTRY.md).
- [CONFORMANCE](../agents/CONFORMANCE.md).
- [Schema](../../schemas/octc-agent-provider.manifest.v1.json).
