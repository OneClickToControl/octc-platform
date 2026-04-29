# @1c2c/tsconfig

## 0.1.2

### Patch Changes

- 172de76: Smoke test for OIDC Trusted Publisher pipeline.

  This release does not change any package contents. It exists to validate
  that `release.yml` can publish `@1c2c/*` packages to npm via the OIDC
  Trusted Publisher binding configured in the npm UI, without any
  `NPM_TOKEN` in GitHub Actions secrets. Subsequent releases will only
  ship real changes.

## 0.1.1

### Patch Changes

- Initial public release of `@1c2c/tsconfig`. `base`, `library` and `nextjs` configurations targeting modern Node, library and Next.js stacks. Published with SLSA v1 provenance via GitHub Actions OIDC.
