# Agent threat model

Threat model for AI agents within octc-platform. Applies to all `sensitivity:high` ACPs and serves as reference for others.

## Vectors

| Vector | Description | Primary mitigation |
|--------|-------------|---------------------|
| Tool injection | Input tries to force tools outside the allowlist. | Versioned `tools_allowlist_ref` validated at runtime. |
| MCP injection | Malicious or compromised MCP injects instructions. | MCPs only from audited sources in CATALOG; quarterly review. |
| Context leakage | Sensitive info retrieved in RAG/KB leaks to users without permission. | Tenant/role filtering before RAG. PII scrubbing. |
| PII in traces | Personal data reaches Sentry/observability. | `beforeSend` redaction, per-project configuration. |
| Prompt injection | External inputs (web, files) change the agent’s goal. | CLAUDE.md template forbids following untrusted instructions without confirmation. |
| Model poisoning | Fine-tune or RAG compromises answers. | Only approved models (declared in manifest) and signed RAG. |
| Cost exhaustion | Infinite loops or expensive prompts exhaust budget. | Per-agent budget, FinOps alerts. |
| Data exfiltration via tool | Internet-facing tool exfiltrates sensitive data. | Tools that reach the exterior require double approval at `sensitivity:high`. |

## Controls

- L0–L1: documentation and declaration.
- L2: allowlist + guardrails + scrubbing.
- L3: telemetry with alerts.
- L4: adversarial evals in CI blocking release.

See [CONFORMANCE.md](../agents/CONFORMANCE.md) for tier details.

## Review

- Quarterly, recorded in [docs/audit/HISTORY.md](../audit/HISTORY.md).
- After each class A or B incident (see [DR_BCP.md](../ops/DR_BCP.md)).
