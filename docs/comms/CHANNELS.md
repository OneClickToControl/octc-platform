# Channels

Official internal channels for OneClickToControl LLC. Operational communication goes through these channels; ad-hoc conversations elsewhere are not considered decisions.

## Slack (or declared substitute)

| channel | purpose | subscribers |
|-------|-----------|--------------|
| `#general` | Team announcements. | whole org |
| `#ops` | Daily ops, class C incidents. | product owners |
| `#ops-incidents` | Class A/B incidents (see [DR_BCP.md](../ops/DR_BCP.md)). | on-call |
| `#ops-agents` | AI agent heartbeats and alerts. | ACP owners |
| `#ops-finops` | LLM cost and FinOps alerts. | product owners + finance |
| `#release` | `@1c2c/*` and product releases. | whole org |
| `#platform` | Platform discussion, ADRs, RFCs. | platform maintainers |
| `#security` | Security and supply-chain alerts. | maintainers + on-call |

## GitHub

- Binding technical discussion: PRs and RFCs in `octc-platform/discussions`.
- Operational tickets: issues in the affected repo.

## Other tools

- **Linear/Jira/Trello**: product planning. Link from GitHub issues.
- **Notion/Wiki**: non-normative material only (notes, brainstorms). Normative content lives in repos.
- **Email**: third parties and formal external communication.

## Cadence

- Optional daily async standup in `#general`.
- Weekly review Friday: ticket closure and SCORECARD.
- Monthly: platform release notes in `#release`.
- Quarterly: plan review + visible audit.
