# Release train to product repos (Phase 4)

Design steps and backlog live in the private companion:

- [docs/backlog/OCTC_RELEASE_TRAIN.md](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/backlog/OCTC_RELEASE_TRAIN.md) (`octc-platform-internal`)

This public repo publishes `@1c2c/*` packages via [`.github/workflows/release.yml`](../../.github/workflows/release.yml) (Changesets + npm); the operational path (version PR, reviews, OIDC) is in [`docs/packages/RELEASE_RUNBOOK.md`](../packages/RELEASE_RUNBOOK.md). After each publish, products today bump versions with **Dependabot** and a manual checklist ([merge train](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/OCTC_MERGE_TRAIN_CHECKLIST.md)).

Automation that opens PRs across many repos will need a PAT or a GitHub App; see *implementation options* in the backlog linked above.
