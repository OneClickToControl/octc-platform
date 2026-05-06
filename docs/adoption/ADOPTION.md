# Adoption

How adoption of octc-platform is measured and promoted across org repos.

## Signals

- `agent_templates_pin` updated (≤ 1 minor behind).
- `at1c2c_pin` updated (≤ 1 minor behind).
- ACPs registered with tier ≥ L1.
- Sentry projects healthy with events in the last 24h.
- CODEOWNERS populated with real humans.

## Program

- Each quarter the platform publishes **release notes** ([template](../comms/RELEASE_NOTES_TEMPLATE.md)) with notable changes and pending migrations.
- Repos with red KPIs get dedicated **office hours** and pair sessions.
- Repos green for four consecutive quarters appear as “gold standard” on the SCORECARD.

## Metrics

Reported in [PLATFORM_SCORECARD.md](../metrics/PLATFORM_SCORECARD.md).

## Product monorepos

Repos with multiple surfaces (web, mobile, Supabase data, ML, etc.) must follow [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md), declare `active_surfaces` in `docs/architecture.md`, and use [MONOREPO_CONFORMANCE_CHECKLIST.md](MONOREPO_CONFORMANCE_CHECKLIST.md) for structural changes. Machine-readable manifest and CLI: [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md); parity with internal **PORTFOLIO** (no token): [PORTFOLIO_BRIDGE.md](PORTFOLIO_BRIDGE.md). Bootstrap path: [GOLDEN_PATH.md](GOLDEN_PATH.md).
