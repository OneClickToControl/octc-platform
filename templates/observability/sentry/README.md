# Sentry templates

Sentry initialization templates for stacks supported by OneClickToControl LLC. All implement [docs/observability/OBSERVABILITY.md](../../../docs/observability/OBSERVABILITY.md).

| Stack | Folder | When to use |
|-------|---------|-------------|
| Next.js (web) | [`next/`](next/) | Portfolio React/Next web apps. |
| Flutter (mobile) | [`flutter/`](flutter/) | Cross-platform mobile apps. |
| Python (services/ML) | [`python/`](python/) | FastAPI APIs, workers, ML pipelines. |

Each template includes:

- Minimal SDK init with `dsn`, `environment`, `release`, sampling.
- `beforeSend` with default PII scrubbing.
- Hook for AI Monitoring spans (where applicable).
- CI snippet for source map upload via OIDC + `sentry-cli`.

SDK versions are pinned in `@1c2c/sentry-config` (package planned in Phase 1).
