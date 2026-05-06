# Data classification

Canonical data sensitivity levels for octc-platform. Every flow (integration, ACP, product) declares the worst case it handles.

## Levels

- **none**: public or synthetic data. No restriction.
- **low**: internal non-personal data (operational telemetry, logs without PII, platform metrics).
- **high**: PII, health, finance, authentication, secrets, private user content.

## Rules by level

| Rule | none | low | high |
|-------|------|-----|------|
| Sentry logs | OK | OK with scrubbing | Only with scrubbing and strict `beforeSend` |
| Sentry replay | OK | Reduced sampling | Off or 0% on sensitive flows |
| Profiling | OK | OK | Selective |
| Sentry retention (events) | 90 days | 90 days | 30 days or less per product |
| RAG/KB without filters | OK | OK | Forbidden without tenant/role filters |
| Tools that reach the internet | OK | OK with review | Double approval + audit |
| Eval datasets with real data | OK | Anonymize | Always synthesize or anonymize |

## DPIA

Any `high` flow must reference a DPIA at `docs/compliance/DPIA/<flow-id>.md` (create when the first flow appears).

## Sentry mapping

See [OBSERVABILITY.md](../observability/OBSERVABILITY.md#retention-by-sensitivity).
