# Agent orchestration

Multi-agent orchestration policy for octc-platform.

## Principles

- **Normative platform, optional runtime.** Template and policy SSOT is `octc-platform`. An orchestrator (Paperclip, Inngest, Temporal, Cloudflare Workflows, …) is an **execution runtime**, never SSOT.
- **Mandatory traceability.** Any orchestrator must emit spans/breadcrumbs to the right Sentry project (see [AGENT_TELEMETRY.md](../observability/AGENT_TELEMETRY.md)) and respect the ACP `tools_allowlist_ref`.
- **Per-agent budget.** Every agent run under an orchestrator declares an LLM budget (see [LLM_COSTS.md](../finops/LLM_COSTS.md)).

## Paperclip (declarative + evaluation)

- **Declarative repo [`octc-paperclip`](https://github.com/OneClickToControl/octc-paperclip):** organization entities, policies, ED/OP templates, CI validation (**no mandatory runtime** in its current state).
- **Product profile (health):** the health-domain ACP maintains the *Paperclip* runtime profile in its agent docs (`docs/runtime-profiles/` in that repo; slug in internal **PORTFOLIO** inventory).
- **Milestone decision** (binary, CLI, YAML-only): org backlog **P3-7** / internal RFC; until then this section documents **limits** (Paperclip is not SSOT for Cursor/CLAUDE templates).

## Rules for any orchestrator

1. Agent identity bound to the ACP (manifest id).
2. Heartbeats and results posted to Slack `#ops-agents`.
3. Errors and costs reported to the ACP/product Sentry project.
4. No orchestrator runs tools outside the ACP allowlist.
