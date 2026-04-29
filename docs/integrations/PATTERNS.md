# Integrations PATTERNS

Patrones canónicos para integrar APIs/MCPs/webhooks de terceros. Cualquier integración del [CATALOG](CATALOG.md) debe seguir uno de estos patrones o documentar excepción.

## Patrón A — API REST con retry y backoff

- Cliente versionado en `@1c2c/integrations-<provider>`.
- Reintentos con jitter (`min 200ms`, `max 5s`, hasta 5).
- Códigos 429/5xx reintentan; 4xx no.
- Métricas de latencia y error rate enviadas a Sentry/proyecto del consumidor.

## Patrón B — Webhook firmado

- Firma HMAC verificada antes de procesar.
- Idempotencia por `event_id`; duplicados descartados con log.
- Procesamiento async vía cola (Inngest, Workers, Cloudflare Queues, etc.).

## Patrón C — Cron / scheduler

- Definido en infra-as-code (Vercel Cron, Cloudflare Workers Cron, etc.).
- Heartbeat al orquestador o a Sentry Crons.
- Failures abren issue automática y alertan al owner.

## Patrón D — MCP

- Solo MCPs auditados; cualquier MCP nuevo entra al CATALOG primero.
- Allowlist explícito en el ACP que lo consume.
- PII scrubbing en logs hacia Sentry.

## Patrón E — SDK con OAuth

- Tokens en `secret_ref` (no en código).
- Refresh handling centralizado.
- Auditoría de scopes mínimos.
