# Observability — Sentry policy

Cross-cutting observability policy for OneClickToControl LLC. Sentry is the single org for errors, performance, AI Monitoring, profiling, and replay. Sentry is not optional: any ACP at tier L3+ and any product in production uses it.

## Topology

- **One Sentry org**: `oneclicktocontrol`.
- **One project per (product, surface)** using kebab-case slug `octc-{product}-{surface}`.
- **Canonical** team and project list (real names) in **restricted** documentation — see inventory linked from [SENTRY_PROJECTS.md](SENTRY_PROJECTS.md).
- Generic convention examples (not inventory): `octc-example-web`, `octc-example-mobile`, `octc-example-api`, `octc-platform-meta` (CI/scripts for this platform).
- **Teams** aligned to products for alert routing.

### Naming conventions

- Slug: kebab-case `octc-{product}-{surface}`.
- DSNs stored in the repo secrets manager (not in code).
- **`release` identifier in SDK and source map upload:** see [Releases and source maps](#releases-and-source-maps) (web deployed from Git ≠ npm package semver).

## Environments

- `production`, `staging`, `preview`, `development`.
- `preview` for ephemeral deploys (Vercel previews, Cloudflare previews).
- `development` only when the developer opts in (not by default).

## Sampling

| Surface | Errors | Traces | Profiles | Replay |
|---------|--------|--------|----------|--------|
| web (next) | 1.0 | 0.2 | 0.1 | 0.1 user / 1.0 error |
| mobile (flutter) | 1.0 | 0.1 | 0.05 | n/a |
| api/ml (python) | 1.0 | 0.2 | 0.05 | n/a |
| acp/agents | 1.0 | 0.5 | 0.0 | n/a |

Repos may tune down for budget but **never to 0** in production.

## `beforeSend` and PII scrubbing

- Every SDK must configure `beforeSend`/`beforeSendTransaction` to:
  - Redact `email`, `phone`, `name`, `address`, `id_document`, `ssn`, `credit_card`, `auth*`, `cookie`, `session`.
  - Replace URLs with tokens in query strings with placeholders.
  - For `sensitivity:high` repos, expand the default field list and validate in CI.

## Releases and source maps

- Each release runs `sentry-cli releases new` + `set-commits` + `finalize`.
- Source maps uploaded via org token in CI or OIDC when configured. See [SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md#source-maps).
- Release health enabled in production and staging.

### `release` identifier (web apps deployed from Git)

For **Next.js / web** where deploy is tied to a Git commit (Vercel, etc.):

| Rule | Detail |
|-------|---------|
| **Prefix** | Must be the **Sentry project slug** (`octc-{product}-{surface}`), same as `SENTRY_PROJECT` in CI. **Do not** use alternate repo names, mobile store versions, or other ids that do not match that project. |
| **Suffix** | **Full Git SHA** of the deployed commit (40 hex chars on GitHub). |
| **Formula** | `{SENTRY_PROJECT}@{COMMIT_SHA}` (full SHA of deployed commit). |
| **CI ↔ runtime parity** | The string passed by `getsentry/action-release` / `sentry-cli` in the job that uploads maps must be **identical** to `NEXT_PUBLIC_SENTRY_RELEASE` and `SENTRY_RELEASE` in the deploy environment. On platforms like Vercel this is often `{SENTRY_PROJECT}@$VERCEL_GIT_COMMIT_SHA` (literal env var with deploy SHA substitution). |

**`@1c2c/*` npm packages:** `release` may follow the package SemVer tag; the `{project}@{sha}` formula applies to **binaries/web** deployed from the repo, not the npm library tree versioning.

## Minimum alerts per project

- Error rate spike (P50 vs 24h baseline).
- New issue with `level:error` or higher.
- Performance regression P95 +25% on critical endpoints.
- Crash-free sessions < 99.5% (web/mobile).

## AI Monitoring and agents

Details in [AGENT_TELEMETRY.md](AGENT_TELEMETRY.md).

## Retention by sensitivity

| sensitivity | events | replay | profiles |
|-------------|---------|--------|----------|
| none | 90d | 30d | 30d |
| low | 90d | 30d | 30d |
| high | 30d | 7d or off | 7d or off |

`high` products configure minimum retention to comply with [DATA_CLASSIFICATION.md](../compliance/DATA_CLASSIFICATION.md). Sentry is configured per project.

## Initialization templates

- Web (Next.js): [templates/observability/sentry/next/](../../templates/observability/sentry/next/).
- Mobile (Flutter): [templates/observability/sentry/flutter/](../../templates/observability/sentry/flutter/).
- Python (services/ML): [templates/observability/sentry/python/](../../templates/observability/sentry/python/).

## Verification

`verify.yml` checks that:

- Every PORTFOLIO repo at tier L3+ declares `sentry_project`.
- SDK templates exist for each surface in use.
