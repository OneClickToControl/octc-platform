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

[`scripts/setup-sentry-projects.sh`](../../scripts/setup-sentry-projects.sh) is published in this public repo because it is a generic, idempotent orchestrator that takes its specification from a local `.env` file (which is git-ignored). It does not embed any organization-specific identifier.
