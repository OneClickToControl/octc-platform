# i18n policy

Language rules for **documentation and templates** across OneClickToControl. The **full matrix** (including private `octc-*` meta-repos) lives in **`octc-platform-internal`**: [OCTC_DOCUMENTATION_GOVERNANCE.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/OCTC_DOCUMENTATION_GOVERNANCE.md). This file focuses on **this repository** (`octc-platform`, **public**).

## Principles (this repo)

- **One language per document** — do not mix Spanish and English in the same section without labeled blocks (`**English**` / **Español**).
- **Public audience:** README, ADRs, RFCs, onboarding, governance, adoption docs, and product-facing templates in `octc-platform` are **English** for the open-source surface.
- **Technical precision:** APIs, error messages, canonical terms (ACP, tier, allowlist), and identifiers stay **English** everywhere.
- **Agent templates** (`CLAUDE.md`, etc.): prefer **English** in bodies shipped from this **public** repo for tool compatibility unless a product explicitly localizes downstream.

## Area rules (`octc-platform` only)

| Area | Language |
|------|----------|
| Root `README.md`, `CONTRIBUTING.md`, `docs/**` narrative (governance, onboarding, adoption, ops, security, observability, finops, agents docs) | **English** |
| `docs/adr/**`, `docs/comms/RFC*` | **English** |
| `schemas/**`, code, workflow YAML | **English** |
| Private companion docs | Not in this repo — see internal governance |

## Glossary

Short glossary: [`GLOSSARY.md`](GLOSSARY.md) when ambiguous terms appear. Canonical product terms stay **English**.

## Verification

`verify.yml` does **not** enforce language. **Links** are checked via Lychee (`docs-links`). Reviews should flag mixed-language sections that slip in without labeled blocks.
