# Contributing

Thank you for contributing to `octc-platform`. This repository is the platform SSOT; changes affect every product. Follow these rules.

## Before you start

1. Read [PLATFORM_TOUR](docs/onboarding/PLATFORM_TOUR.md) (30 minutes).
2. Confirm SSO + 2FA access per [IDENTITY_ACCESS](docs/governance/IDENTITY_ACCESS.md).
3. Decide whether your change is **normative** (templates, schemas, policies) or **infra** (workflows, scripts).

## Types of change

- **Trivial** (typo, minor copy edit): Open a PR directly. Approved by CODEOWNERS.
- **Substantive** (new section, new rule, minor template change): PR with a detailed description and a reference to `docs/comms/RELEASE_NOTES_TEMPLATE.md`.
- **Structural** (new package, breaking change, new policy): **RFC first** ([template](docs/comms/RFC_TEMPLATE.md)) → **ADR** ([template](docs/adr/_TEMPLATE.md)) → final PR.

## Branch and commit

- Branch name: `feat/...`, `fix/...`, `chore/...`, `docs/...`.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- Scope tag when helpful: `feat(observability): ...`, `chore(packages): ...`.

## Pull requests

- Use the template at [templates/governance/PULL_REQUEST_TEMPLATE.md](templates/governance/PULL_REQUEST_TEMPLATE.md). It applies automatically once copied to `.github/PULL_REQUEST_TEMPLATE.md` (maintenance step).
- Check every applicable checkbox in the template.
- Link RFCs/ADRs when relevant.
- Wait for green CI (especially `verify.yml` + `privacy-guard.yml`; review `.github/workflows/` if you add workflows).

## Review

- One approval + CODEOWNERS when paths listed in `CODEOWNERS` are touched.
- Changes under `templates/agents/`, `schemas/`, `packages/`, `docs/security/`, `docs/observability/`, `docs/finops/`: double review.

## Style

- Language and repo matrix: [DOCUMENTATION_STANDARDS.md](docs/governance/DOCUMENTATION_STANDARDS.md) and [docs/i18n/POLICY.md](docs/i18n/POLICY.md) (this **public** repo targets **English** for narrative docs).
- Markdown: sentence case headings. Tables use clear headers.
- Diagrams: Mermaid. Keep labels short and ASCII where possible.

## Releases

- Changes in `packages/` follow [POLICY](docs/packages/POLICY.md) and the **actual** CI/npm path in [RELEASE_RUNBOOK](docs/packages/RELEASE_RUNBOOK.md) (Changesets version PR, `main` policy, OIDC).
- Docs-only changes do not need a release tag but may appear in monthly release notes.

## Anti-patterns

- Editing `<!-- octc:base -->` template blocks without an RFC.
- Using `[skip ci]` on `main` to bypass `verify.yml`.
- Introducing new dependencies without an RFC.
- Committing secrets: rotate immediately and open an incident if it happens.

## Questions

Ask in `#platform`. If you are blocked, escalate to `#ops`.
