<!-- octc:base v0.1.0 -->
# AGENTS.md — octc-platform base

Template describing active agents in this repo (human and AI). Lives at the repo root and syncs from `@1c2c/agent-templates`.

## How to use

- Each agent is listed with `id`, `type`, `runtime`, `responsibilities`, `limits`.
- `type`: `human` · `ai-coding` · `ai-client` · `ai-ops` · `ai-eval`.
- `runtime`: `cursor` · `claude-code` · `claude-desktop` · `openclaw` · `paperclip` · `ci`.
- `limits` must match `tools_allowlist_ref` when applicable.

## Registered agents (fill per repo)

| id | type | runtime | responsibilities | limits |
|----|------|---------|------------------|--------|
|    |      |         |                  |        |

## Common rules

- No agent may add new dependencies without opening an RFC ([docs/comms/RFC_TEMPLATE.md](../../docs/comms/RFC_TEMPLATE.md)).
- Destructive operations (rebases, drops, force-push) require explicit human approval recorded on the PR.
- Agent outputs that touch code must be reviewed by CODEOWNERS before merge.

<!-- octc:end-base -->

<!-- octc:user -->
<!-- octc:end-user -->
