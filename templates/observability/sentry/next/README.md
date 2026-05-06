# Sentry — Next.js template

Initialization template for Sentry in portfolio Next.js apps.

## Files

- `sentry.client.config.ts` — client config with PII scrubbing and baseline sampling.
- `sentry.server.config.ts` — Node server config.
- `sentry.edge.config.ts` — Edge runtime config.
- `upload-sourcemaps.sh` — upload source maps in CI with OIDC.

## Environment variables

| Var | When |
|-----|--------|
| `NEXT_PUBLIC_SENTRY_DSN` | Client |
| `SENTRY_DSN` | Server/Edge/CI |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` / `SENTRY_ENVIRONMENT` | `production`, `staging`, `preview`, `development` |
| `NEXT_PUBLIC_SENTRY_RELEASE` / `SENTRY_RELEASE` | **Same string** as the `release` used when uploading source maps in CI: `{SENTRY_PROJECT}@` + Git SHA of the deploy. On Vercel: literal `{SENTRY_PROJECT}@$VERCEL_GIT_COMMIT_SHA` (see [OBSERVABILITY.md](../../../../docs/observability/OBSERVABILITY.md#releases-and-source-maps)). |
| `SENTRY_ORG`, `SENTRY_PROJECT` | CI only for source maps |

## Usage

1. Copy files to the Next.js project root.
2. Create projects in Sentry following `octc-{product}-{surface}`.
3. Add `upload-sourcemaps.sh` to the release pipeline, or use [`getsentry/action-release`](https://github.com/getsentry/action-release) after the build (`set_commits` + source maps under `.next`, **`release` identical** to `NEXT_PUBLIC_SENTRY_RELEASE` / `SENTRY_RELEASE` in the deploy; see OBSERVABILITY § Releases and source maps).
4. Adjust sampling only with justification; never set to 0 in production.

## Verification

- `verify.yml` checks for these files when the repo declares `sentry_project`.
