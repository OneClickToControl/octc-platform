# Product vs platform boundary — TEMPLATE

Template to document, per product, what belongs in `octc-platform` and what belongs in the product repo. Copy this file to `docs/boundaries/<product>.md` at product kickoff.

## Product

`<product name>` — repo `<org/repo>` — owner `<handle>`.

## In octc-platform

- [ ] Templates (`@1c2c/agent-templates`)
- [ ] Base Cursor rules
- [ ] Shared schemas and policies
- [ ] Base workflows (verify, release)
- [ ] Observability: Sentry naming convention
- [ ] Supply chain: provenance, SBOM, source maps

## In the product repo

- [ ] Roadmap and PRD
- [ ] Product design and branding
- [ ] Local ACP with manifest and skills
- [ ] Product-specific Sentry config (DSNs, environments)
- [ ] Product integrations and secrets
- [ ] Product tests and evals

## Exceptions

Document any exception to the platform vs product model, with rationale and a migration plan toward the canonical model.

## Relevant decisions

| date | decision | adr |
|-------|----------|-----|
|       |          |     |
