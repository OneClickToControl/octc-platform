# Integrations CATALOG

Inventory of APIs, MCPs, and third-party integrations consumed by the platform or its products. Any new consumption must be added here before merge.

## Schema

| id | name | type | vendor | sensitivity | usage tier | secret_ref | docs_ref | owners | notes |
|----|--------|------|-----------|--------------|-------------|------------|----------|--------|-------|
|    |        |      |           |              |             |            |          |        |       |

- `type`: `api` · `mcp` · `webhook` · `sdk` · `cron`.
- `vendor`: canonical name (Zoho, Sentry, Supabase, Cloudflare, Vercel, Resend, OpenAI, Anthropic, etc.).
- `sensitivity`: `none` · `low` · `high` (worst-case data handled).
- `usage tier`: `core` · `support` · `experimental`.
- `secret_ref`: where the secret lives (Vault, GitHub Secrets, Doppler, etc.).

## Consumption patterns

Recurring patterns (pagination, retries, idempotency, signed webhooks) are documented in [PATTERNS.md](PATTERNS.md).

## Cadence

Quarterly review with cleanup of unpromoted experimental integrations.
