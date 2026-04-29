# Sentry projects — inventario canónico

Inventario vivo de proyectos creados en la org única **`oneclicktocontrol`** siguiendo la política de [OBSERVABILITY](OBSERVABILITY.md#topología). Todos creados de forma idempotente por [`scripts/setup-sentry-projects.sh`](../../scripts/setup-sentry-projects.sh).

## Org

- Slug: `oneclicktocontrol`
- URL: https://oneclicktocontrol.sentry.io/
- Organization id (ingest): `o4510948769923072`

## Teams

| team | propósito |
|------|-----------|
| `platform` | repo `octc-platform`, scripts CI, errores de meta. |
| `health` | producto `health-app` (web, mobile, ml, acp). |
| `store` | producto `store-app` (ColombiaEnPR). |
| `strategy` | producto `strategy-app` (ML + API). |

## Proyectos

| proyecto | team | platform | DSN público |
|----------|------|----------|-------------|
| `octc-platform-meta` | `platform` | `node` | `https://c6205358b74127129fa8ea8190329945@o4510948769923072.ingest.us.sentry.io/4511303900397568` |
| `octc-health-web` | `health` | `javascript-nextjs` | `https://131f0c974882ec5a1eeb432698a36228@o4510948769923072.ingest.us.sentry.io/4511303900463104` |
| `octc-health-mobile` | `health` | `flutter` | `https://a75eb992a53dc47cb2a32939b1aa8985@o4510948769923072.ingest.us.sentry.io/4511303900528640` |
| `octc-health-ml` | `health` | `python` | `https://f67f8d216feb1a18ef310991d939a31b@o4510948769923072.ingest.us.sentry.io/4511303900594176` |
| `octc-health-acp` | `health` | `node` | `https://439ae2e50872edb5a6084bca91c0fc1d@o4510948769923072.ingest.us.sentry.io/4511303900659713` |
| `octc-store-web` | `store` | `javascript-nextjs` | `https://29bb121c78fa00985fa156adfcd89740@o4510948769923072.ingest.us.sentry.io/4511303900790784` |
| `octc-strategy-ml` | `strategy` | `python` | `https://2cf52070b3586cca50e71da4beece0c4@o4510948769923072.ingest.us.sentry.io/4511303900856321` |
| `octc-strategy-api` | `strategy` | `python` | `https://ca89251409c6ae45cfa8e8f6c1eb2a68@o4510948769923072.ingest.us.sentry.io/4511303900987392` |

## Notas sobre los DSNs

Los DSNs públicos **no son secretos** (son identificadores de ingest, similares a `NEXT_PUBLIC_*`). Igualmente, el patrón canónico es leerlos siempre como variable de entorno por consumidor (`SENTRY_DSN` o `NEXT_PUBLIC_SENTRY_DSN`):

- En **GitHub Secrets** o **Vercel/Cloudflare env**: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`.
- En CI para `sentry-cli sourcemaps upload`: usar OIDC trust (sin tokens), ver [SUPPLY_CHAIN](../security/SUPPLY_CHAIN.md#source-maps).

## Configuración mínima por proyecto

A configurar manualmente en la UI de Sentry o via API:

- **Alertas mínimas** (ver [OBSERVABILITY](OBSERVABILITY.md#alertas-mínimas-por-proyecto)):
  - Spike de error rate vs baseline 24h.
  - Nuevo issue con `level:error` o superior.
  - Performance regression P95 +25% en endpoints críticos.
  - Crash-free sessions < 99.5% (web/mobile).
- **Retención** según [DATA_CLASSIFICATION](../compliance/DATA_CLASSIFICATION.md):
  - `octc-health-*`: `sensitivity:high` → eventos 30d, replay 7d o off, profiles 7d o off.
  - resto: defaults.
- **AI Monitoring**: activar para `octc-health-acp`, `octc-store-web` (cuando integre agentes), `octc-strategy-*`.

## Trusted Publisher / OIDC

- Cuando se haga el primer release de paquetes `@1c2c/*` con sentry-cli releases, configurar GitHub OIDC en https://oneclicktocontrol.sentry.io/settings/auth-tokens/ y https://oneclicktocontrol.sentry.io/settings/auth/github/ para evitar tokens long-lived.

## Cadencia

- Cada nuevo producto/surface registrado en [PORTFOLIO](../PORTFOLIO.md) abre PR para añadir su proyecto aquí y ejecutar el script con la entrada nueva en `SPEC`.
- Revisión trimestral: validar que cada proyecto recibe eventos las últimas 24h (KPI `sentry_uptime` en [SCORECARD](../metrics/PLATFORM_SCORECARD.md)).
