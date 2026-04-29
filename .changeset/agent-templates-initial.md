---
"@1c2c/agent-templates": minor
---

Initial release: canonical agent templates (CLAUDE.md, AGENTS.md, Cursor rules)
plus the ACP manifest schema, packaged with a CLI (`octc-agents init / verify
/ sync`) and a programmatic API. The package mirrors the SSOT files in
`templates/agents/` and `schemas/` of `octc-platform` and stays drift-free
via a CI guard.
