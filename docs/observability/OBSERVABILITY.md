# Observability — Sentry policy

Política transversal de observabilidad para OneClickToControl LLC. Sentry es la org única para errores, performance, AI Monitoring, profiling y replay. Sentry no es opcional: cualquier ACP en tier L3+ y cualquier producto en producción la usan.

## Topología

- **Una org Sentry**: `oneclicktocontrol`.
- **Un proyecto por (producto, surface)**, p. ej.:
  - `octc-health-web`, `octc-health-mobile`, `octc-health-ml`, `octc-health-acp`.
  - `octc-store-web`, `octc-store-acp` (cuando exista).
  - `octc-strategy-ml`, `octc-strategy-api`.
  - `octc-platform-meta` para errores de scripts y CI de la plataforma.
- **Equipos** alineados a productos para routing de alertas.

### Convenciones de naming

- Slug: kebab-case `octc-{producto}-{surface}`.
- DSNs guardados en gestor de secretos del repo (no en código).
- Releases con formato `<package-or-app>@<semver>` (alineado con tags).

## Environments

- `production`, `staging`, `preview`, `development`.
- `preview` para deployments efímeros (Vercel previews, Cloudflare previews).
- `development` solo cuando el dev opta por enviar (no por defecto).

## Sampling

| Surface | Errors | Traces | Profiles | Replay |
|---------|--------|--------|----------|--------|
| web (next) | 1.0 | 0.2 | 0.1 | 0.1 user / 1.0 error |
| mobile (flutter) | 1.0 | 0.1 | 0.05 | n/a |
| api/ml (python) | 1.0 | 0.2 | 0.05 | n/a |
| acp/agentes | 1.0 | 0.5 | 0.0 | n/a |

Los repos pueden ajustar a la baja por presupuesto pero **nunca a 0** en producción.

## `beforeSend` y PII scrubbing

- Cada SDK debe configurar `beforeSend`/`beforeSendTransaction` que:
  - Redacta campos `email`, `phone`, `name`, `address`, `id_document`, `ssn`, `credit_card`, `auth*`, `cookie`, `session`.
  - Convierte URLs con tokens en query a placeholders.
  - Para repos `sensitivity:high`, lista de campos por defecto se amplía y se valida en CI.

## Releases y source maps

- Cada release dispara `sentry-cli releases new` + `set-commits` + `finalize`.
- Source maps subidos vía OIDC (sin tokens long-lived). Ver [SUPPLY_CHAIN.md](../security/SUPPLY_CHAIN.md#source-maps).
- Release health activo en producción y staging.

## Alertas mínimas por proyecto

- Error rate spike (P50 vs baseline 24h).
- New issue con `level:error` o superior.
- Performance regression P95 +25% en endpoints críticos.
- Crash-free sessions < 99.5% (web/mobile).

## AI Monitoring y agentes

Detalle en [AGENT_TELEMETRY.md](AGENT_TELEMETRY.md).

## Retención por sensibilidad

| sensitivity | eventos | replay | profiles |
|-------------|---------|--------|----------|
| none | 90d | 30d | 30d |
| low | 90d | 30d | 30d |
| high | 30d | 7d o off | 7d o off |

Los productos `high` configuran retención mínima para cumplir con [DATA_CLASSIFICATION.md](../compliance/DATA_CLASSIFICATION.md). La cuenta de Sentry se configura por proyecto.

## Plantillas de inicialización

- Web (Next.js): [templates/observability/sentry/next/](../../templates/observability/sentry/next/).
- Mobile (Flutter): [templates/observability/sentry/flutter/](../../templates/observability/sentry/flutter/).
- Python (services/ML): [templates/observability/sentry/python/](../../templates/observability/sentry/python/).

## Verificación

`verify.yml` chequea que:
- Cada repo registrado en PORTFOLIO con tier L3+ tiene `sentry_project` declarado.
- Las plantillas SDK existen en cada surface usado.
