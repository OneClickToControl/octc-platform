# Sentry projects — inventario canónico

Inventario vivo de proyectos creados en la org única **`oneclicktocontrol`** siguiendo la política de [OBSERVABILITY](OBSERVABILITY.md#topología). Todos creados de forma idempotente por [`scripts/setup-sentry-projects.sh`](../../scripts/setup-sentry-projects.sh).

## Org

- Slug: `oneclicktocontrol`
- URL: https://oneclicktocontrol.sentry.io/
- Organization id (ingest): `oREDACTED-org`

## Teams

| team | propósito |
|------|-----------|
| `platform` | repo `octc-platform`, scripts CI, errores de meta. |
| `health` | producto `product` (web, mobile, ml, acp). |
| `store` | producto `product-b` (region-x). |
| `strategy` | producto `product-c` (ML + API). |

## Proyectos

| proyecto | team | platform | DSN público |
|----------|------|----------|-------------|
| `octc-platform-meta` | `platform` | `node` | `https://REDACTED-DSN-HASH@oREDACTED-org.ingest.us.sentry.io/REDACTED-PROJECT-ID` |
| `octc-health-web` | `health` | `javascript-nextjs` | `https://REDACTED-DSN-HASH@oREDACTED-org.ingest.us.sentry.io/REDACTED-PROJECT-ID` |
| `octc-health-mobile` | `health` | `flutter` | `https://REDACTED-DSN-HASH@oREDACTED-org.ingest.us.sentry.io/REDACTED-PROJECT-ID` |
| `octc-health-ml` | `health` | `python` | `https://REDACTED-DSN-HASH@oREDACTED-org.ingest.us.sentry.io/REDACTED-PROJECT-ID` |
| `octc-health-acp` | `health` | `node` | `https://REDACTED-DSN-HASH@oREDACTED-org.ingest.us.sentry.io/REDACTED-PROJECT-ID` |
| `octc-store-web` | `store` | `javascript-nextjs` | `https://REDACTED-DSN-HASH@oREDACTED-org.ingest.us.sentry.io/REDACTED-PROJECT-ID` |
| `octc-strategy-ml` | `strategy` | `python` | `https://REDACTED-DSN-HASH@oREDACTED-org.ingest.us.sentry.io/REDACTED-PROJECT-ID` |
| `octc-strategy-api` | `strategy` | `python` | `https://REDACTED-DSN-HASH@oREDACTED-org.ingest.us.sentry.io/REDACTED-PROJECT-ID` |

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
