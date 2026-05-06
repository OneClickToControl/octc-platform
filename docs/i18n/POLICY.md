# i18n policy

Language rules for **documentation and templates** across OneClickToControl. The **full matrix** (including private `octc-*` meta-repos) lives in **`octc-platform-internal`**: [OCTC_DOCUMENTATION_GOVERNANCE.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/OCTC_DOCUMENTATION_GOVERNANCE.md). This file focuses on **this repository** (`octc-platform`, **public**).

## Principles (this repo)

- **One language per document** — do not mix Spanish and English in the same section without labeled blocks (`**English**` / **Español**).
- **Public audience:** README, ADRs, RFCs, onboarding, and governance docs in **`octc-platform` target English** so the open-source surface is consistent. **Legacy Spanish** pages remain until migrated — see [DOCUMENTATION_STANDARDS.md](../governance/DOCUMENTATION_STANDARDS.md).
- **Technical precision:** APIs, error messages, canonical terms (ACP, tier, allowlist), and identifiers stay **English** everywhere.
- **Agent templates** (`CLAUDE.md`, etc.): body may be **English** for tool compatibility; platform policy text can follow the same language as the surrounding repo that consumes the template. Prefer **English** for templates shipped from this **public** repo unless a product explicitly localizes.

## Area rules (`octc-platform` only)

| Area | Language |
|------|----------|
| Root `README.md`, `CONTRIBUTING.md`, `docs/governance/**`, new onboarding | **English** (target) |
| `docs/adr/**`, `docs/comms/RFC*` | **English** for new work; existing Spanish ADRs stay until translated |
| `docs/onboarding/PLATFORM_TOUR.md` etc. | **Spanish** until migrated — call out at top when non-English |
| `schemas/**`, code, workflow YAML | **English** |
| Private companion docs | Not in this repo — see internal governance |

## Glossary

Short glossary: [`GLOSSARY.md`](GLOSSARY.md) when ambiguous terms appear. Canonical product terms stay **English**.

## Verification

`verify.yml` does **not** enforce language. **Link** integrity is checked via Lychee (`docs-links`). Quarterly review: align new docs with this policy.
