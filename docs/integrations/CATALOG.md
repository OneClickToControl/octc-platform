# Integrations CATALOG

Inventario de APIs, MCPs e integraciones de terceros consumidas por la plataforma o por sus productos. Cualquier consumo nuevo debe entrar aquí antes de mergear.

## Esquema

| id | nombre | tipo | proveedor | sensibilidad | tier de uso | secret_ref | docs_ref | owners | notas |
|----|--------|------|-----------|--------------|-------------|------------|----------|--------|-------|
|    |        |      |           |              |             |            |          |        |       |

- `tipo`: `api` · `mcp` · `webhook` · `sdk` · `cron`.
- `proveedor`: nombre canónico (Zoho, Sentry, Supabase, Cloudflare, Vercel, Resend, OpenAI, Anthropic, etc.).
- `sensibilidad`: `none` · `low` · `high` (peor caso de datos manejados).
- `tier de uso`: `core` · `support` · `experimental`.
- `secret_ref`: dónde vive el secreto (Vault, GitHub Secrets, Doppler, etc.).

## Patrones de consumo

Los patrones recurrentes (paginación, retries, idempotencia, webhooks firmados) se documentan en [PATTERNS.md](PATTERNS.md).

## Cadencia

Revisión trimestral con limpieza de integraciones experimentales no promovidas.
