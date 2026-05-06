# Supply chain

Software trust chain for OneClickToControl LLC. Covers `@1c2c/*` packages, consuming products, source maps, and dependencies.

## Identity and secrets

- **OIDC in GitHub Actions** for npm publishing and for uploading source maps to Sentry. No long-lived token persisted.
- Secrets in a central manager (GitHub Encrypted Secrets / Doppler / Vault per repo). Minimum quarterly rotation.
- SSO + 2FA enforced (see [IDENTITY_ACCESS.md](../governance/IDENTITY_ACCESS.md)).
- **Exact rotation procedure** per system in the private runbook [`octc-platform-internal/docs/runbooks/CRED_ROTATION.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/CRED_ROTATION.md) (access-restricted).

## Publishing `@1c2c/*` packages

- **npm OIDC Trusted Publishers** enabled per package: GitHub Actions exchanges an ephemeral OIDC token for an npm publish token. **No persisted `NPM_TOKEN`** in GitHub Secrets or on the runner `.npmrc`.
- Workflow `.github/workflows/release.yml` declares `permissions: id-token: write` and uses Node 24 + `npm install -g npm@latest` to ensure npm CLI ≥ 11.5.1 (OIDC minimum).
- Every `npm publish` from `release.yml` runs with `--provenance` (via `NPM_CONFIG_PROVENANCE=true`), producing a Sigstore-signed SLSA v1 attestation.
- Consumers verify provenance with `npm audit signatures` or `pnpm audit signatures`.
- **Scope note:** supply-chain policy may mention signed tags and SBOM (`syft`) on GitHub Releases; **the current `release.yml` does not run SBOM generation or `sentry-cli` for `@1c2c/*` packages**. Tags created by Changesets/npm after `changeset publish` follow the published flow; any hardening must be reflected explicitly in the workflow and in [RELEASE_RUNBOOK.md](../packages/RELEASE_RUNBOOK.md).

### Trusted Publisher configuration (one per package)

At [https://www.npmjs.com/package/@1c2c/<pkg>/access](https://www.npmjs.com/package/) → "Publishing access" → "Add trusted publisher":

| Field | Value |
|---|---|
| Publisher | GitHub Actions |
| Organization or user | `OneClickToControl` |
| Repository | `octc-platform` |
| Workflow filename | `release.yml` |
| Environment name | (empty) |

> **Before the first `npm publish` of a new package under `@1c2c/*`:** add the Trusted Publisher **for that specific package** in the npm UI. Existing packages (`@1c2c/tsconfig`, `@1c2c/eslint-config`, …) do not inherit config; if missing, the registry returns `E404 Not Found` on `PUT` (effectively OIDC *permission denied*). After registering the publisher, re-run `release.yml` (e.g. **Run workflow** in Actions or an empty commit to `main`).

> If you later move the job to a protected environment (recommended for major releases), add the environment name in the UI field and enforce it in `release.yml` with `environment: <name>`.

### Why OIDC instead of PAT/granular tokens

- No persisted secret → nothing to leak or rotate manually.
- OIDC attestation ties publish to **commit SHA + workflow + repo + actor** on the runner, making out-of-workflow publish impossible.
- npm rejects publishes without a matching OIDC token → fail-closed by default.

## Provenance consumer-side

Any product consuming `@1c2c/*` runs in CI:

```bash
pnpm install --frozen-lockfile
pnpm dlx audit-signatures || npm audit signatures
```

If verification fails, the build stops. This is validated automatically from `verify.yml` when the repo is registered in PORTFOLIO with tier ≥ L1.

**Reusable template** for consumers: [`templates/governance/ci/`](../../templates/governance/ci/README.md) (reference workflow with pinned actions and a signature step).

## Source maps {#source-maps}

- On each release (web/python/mobile):
  ```bash
  sentry-cli releases new "$SENTRY_RELEASE"
  sentry-cli releases set-commits "$SENTRY_RELEASE" --auto
  sentry-cli sourcemaps inject --release "$SENTRY_RELEASE" <build-dir>
  sentry-cli sourcemaps upload --release "$SENTRY_RELEASE" <build-dir>
  sentry-cli releases finalize "$SENTRY_RELEASE"
  ```
- The **`release`** value must be **identical** in CI (map upload) and at runtime (`NEXT_PUBLIC_SENTRY_RELEASE` / `SENTRY_RELEASE`). For web apps in Git: `{SENTRY_PROJECT}@{COMMIT_SHA}` — [OBSERVABILITY.md](../observability/OBSERVABILITY.md#releases-and-source-maps).
- GitHub Actions often uses [`getsentry/action-release`](https://github.com/getsentry/action-release) with an **Organization Auth Token** in secrets until the org completes the OIDC trust documented for Sentry; the `finalize` input (default `true`) matches `sentry-cli releases finalize`.
- Authentication via org token or OIDC when configured (no DSN in the repo for artifact upload).
- For Flutter use `sentry-cli upload-dif` instead of sourcemaps.

## Dependencies

- **Dependabot** or **Renovate** enabled on every repo (weekly PRs for minors/patches).
- Major upgrades require an RFC.
- Lockfile committed on `main` (no exceptions).
- `pnpm` with `overrides` and minimum `auditLevel=high` in `verify.yml`.

## GitHub Actions

- **Pinning**: use `actions/checkout@<sha>` with full SHA (40 chars) and comment `# vX.Y.Z` for readability. Dependabot bumps automatically.
- **Node runtime**: all actions should support Node 24 (GitHub deprecates Node 20 in Sep 2026; Node 22 LTS acceptable for non-critical jobs).
- **Permissions**: `permissions: contents: read` by default; sub-jobs and workflows that write (release, PR creation) declare additional scopes explicitly.
- **OIDC**: for npm and Sentry.
- **Secret scanning** enabled on all repos.

## Audit

- Quarterly review of `tools_allowlist_ref` per L4 ACP.
- Semi-annual review of CATALOG and critical dependencies.
- Findings recorded in [docs/audit/HISTORY.md](../audit/HISTORY.md).

## Build reproducibility

- Production builds with immutable commit SHA.
- Docker images (where applicable) with pinned digests.

## Incident response

- Compromised dependency detected: [DR_BCP.md](../ops/DR_BCP.md) class A.
- Reported vulnerabilities: see `SECURITY.md` (planned per repo).
