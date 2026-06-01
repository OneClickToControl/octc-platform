# Glossary (i18n)

Canonical **English** terms used across OCTC docs and tooling. Expand when a term is ambiguous in Spanish copy.

| Term | Meaning |
|------|---------|
| **ACP** | Agent Capability Provider — registered agent surface with manifest and conformance tier. |
| **Tier (L0–L4)** | Conformance level for an ACP (see conformance docs). |
| **Allowlist** | Explicit list of permitted repos or actions (e.g. ACP dispatch). |
| **SSOT** | Single Source of Truth. |

## Factory terms (OCTC org — private)

Canonical Spanish runbook: [`octc-platform-internal` → `OCTC_FACTORY_GLOSSARY.v1.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/OCTC_FACTORY_GLOSSARY.v1.md) (private repo; link for org members).

| Term | Meaning |
|------|---------|
| **PCL** | Program Conversational Layer — declarative NL routing for consultive programs (`factory.program_owner_turn`). |
| **ICL** | Initiative Conversational Layer — extends CPL for factory initiatives (`factory.owner_turn`). |
| **CPL** | Conversational Product Layer — fabric-wide owner-turn spec for product initiatives. |
| **OCDS** | CommsDocument pipeline: JSON schema → React Email `render.mjs` → unified Outlook HTML. |
| **CommsDocument** | Versioned JSON blocks (`hero`, `lo_esencial`, `body_sections`, …) rendered to email HTML. |
| **html_unified** | Delivery mode where Outlook body bytes equal attachment bytes. |
| **session_context** | JSON payload from preview turn; required for reliable apply routing. |
| **closure ritual** | Post-merge: align `main` on dev/factory/Pi, run `verify-factory-alignment`, document SHAs. |
| **capability_id** | Declarative handler key in `capabilities.v1.yaml` (router SSOT). |
