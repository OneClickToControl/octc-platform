# Integrations PATTERNS

Canonical patterns for integrating third-party APIs/MCPs/webhooks. Every integration in the [CATALOG](CATALOG.md) must follow one of these patterns or document an exception.

## Pattern A — REST API with retry and backoff

- Versioned client in `@1c2c/integrations-<provider>`.
- Retries with jitter (`min 200ms`, `max 5s`, up to 5).
- 429/5xx retry; 4xx do not.
- Latency and error rate metrics sent to Sentry / consumer project.

## Pattern B — Signed webhook

- HMAC signature verified before processing.
- Idempotency by `event_id`; duplicates dropped with log.
- Async processing via queue (Inngest, Workers, Cloudflare Queues, etc.).

## Pattern C — Cron / scheduler

- Defined in infra-as-code (Vercel Cron, Cloudflare Workers Cron, etc.).
- Heartbeat to orchestrator or Sentry Crons.
- Failures open automatic issue and alert owner.

## Pattern D — MCP

- Audited MCPs only; any new MCP enters CATALOG first.
- Explicit allowlist on the consuming ACP.
- PII scrubbing in logs to Sentry.

## Pattern E — SDK with OAuth

- Tokens in `secret_ref` (not in code).
- Centralized refresh handling.
- Audit minimum scopes.
