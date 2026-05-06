# Documentation standards — OCTC

This file summarizes how we keep docs **consistent**, **accurate**, and **hard to drift** across `octc-*` repositories.

## Language policy

| Repository | Primary narrative language |
|------------|----------------------------|
| **octc-platform** (public) | **English** for README, onboarding, and ADRs — *migration in progress* from older Spanish pages. |
| **octc-paperclip** | **Spanish** for owner-facing narrative; **English** for technical YAML, adapter contracts, agent templates (see Paperclip README). |
| **octc-platform-internal**, **octc-platform-workspace**, **octc-platform-agents** (private) | **Spanish** for README and runbooks unless a doc explicitly targets an English-only audience. |

Full matrix, README contract, tri-repo sync order, and automation details (Spanish):  
[OCTC_DOCUMENTATION_GOVERNANCE.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/OCTC_DOCUMENTATION_GOVERNANCE.md) in `octc-platform-internal`.

## README contract

Every root README must state: **what the repo is / is not**, **audience**, **key layout**, **how CI or local checks work**, **links to canonical docs**, and **required CI secrets** (names only).

## Automated checks (drift reduction)

- **octc-platform:** `verify` workflow includes **Lychee** `docs-links` on `docs/**/*.md`, root `*.md`, and `templates/**/*.md` (offline relative links).
- **Other `octc-*` repos:** each adds or extends a lightweight **docs hygiene** workflow where applicable (see internal governance doc for the list).
- **Operational truth:** workspace dashboard regeneration and Paperclip drift checks complement prose docs.

## Contributing

When you change behavior (workflows, scripts, CLI, schemas), update the **README** or linked **docs** in the **same PR** when possible.
