# Sentry projects — internal inventory

> **Internal — moved to private companion repo.**

Canonical Sentry organization slug, ingest org id, project DSNs and team mapping live in:

- [`OneClickToControl/octc-platform-internal/docs/observability/SENTRY_PROJECTS.md`](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/observability/SENTRY_PROJECTS.md) (**access-restricted**)

## Why this isn't public

DSNs are technically not secrets (Sentry treats them as public ingest identifiers), but exposing the org id and the full list of project ingest URLs broadens the surface for ingestion-cost abuse and discloses our internal product topology. We keep them in the private companion repo.

## What public templates do

- [`templates/observability/sentry/`](../../templates/observability/sentry/) — initialization templates for Next.js, Flutter and Python that **read DSNs from environment variables** (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`). No DSN is hard-coded here.
- [OBSERVABILITY.md](OBSERVABILITY.md) — public policy: project naming convention `octc-{product}-{surface}`, sampling, environments, retention by sensitivity, alerts and AI Monitoring posture.
- [AGENT_TELEMETRY.md](AGENT_TELEMETRY.md) — span and breadcrumb conventions for AI agents, framework-agnostic.

## Bootstrap script

[`scripts/setup-sentry-projects.sh`](../../scripts/setup-sentry-projects.sh) and [`scripts/setup-sentry-alerts.sh`](../../scripts/setup-sentry-alerts.sh) are idempotent orchestrators; the `team|project|platform` list lives in **`scripts/sentry-org-projects.spec`** (gitignored). Copy from [`scripts/sentry-org-projects.spec.example`](../../scripts/sentry-org-projects.spec.example) and complete rows per the internal runbook — **do not** commit product slugs in the public repo (see [PUBLIC_REPO_POLICY.md](../security/PUBLIC_REPO_POLICY.md)).
