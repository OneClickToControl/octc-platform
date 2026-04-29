---
"@1c2c/tsconfig": patch
"@1c2c/eslint-config": patch
---

Smoke test for OIDC Trusted Publisher pipeline.

This release does not change any package contents. It exists to validate
that `release.yml` can publish `@1c2c/*` packages to npm via the OIDC
Trusted Publisher binding configured in the npm UI, without any
`NPM_TOKEN` in GitHub Actions secrets. Subsequent releases will only
ship real changes.
