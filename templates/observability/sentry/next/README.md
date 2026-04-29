# Sentry — Next.js template

Plantilla de inicialización de Sentry para apps Next.js del portfolio.

## Archivos

- `sentry.client.config.ts` — configuración cliente con scrubbing PII y sampling base.
- `sentry.server.config.ts` — configuración Node server.
- `sentry.edge.config.ts` — configuración Edge runtime.
- `upload-sourcemaps.sh` — subida de source maps en CI con OIDC.

## Variables de entorno

| Var | Cuándo |
|-----|--------|
| `NEXT_PUBLIC_SENTRY_DSN` | Cliente |
| `SENTRY_DSN` | Server/Edge/CI |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` / `SENTRY_ENVIRONMENT` | `production`, `staging`, `preview`, `development` |
| `NEXT_PUBLIC_SENTRY_RELEASE` / `SENTRY_RELEASE` | `<app>@<semver>` |
| `SENTRY_ORG`, `SENTRY_PROJECT` | Solo en CI para sourcemaps |

## Uso

1. Copiar archivos a la raíz del proyecto Next.js.
2. Crear los proyectos en Sentry siguiendo `octc-{producto}-{surface}`.
3. Añadir `upload-sourcemaps.sh` al pipeline de release, o usar [`getsentry/action-release`](https://github.com/getsentry/action-release) después del build (`set_commits` + sourcemaps bajo `.next`, `release` alineado a `NEXT_PUBLIC_SENTRY_RELEASE` en el deploy; build Next con `SENTRY_UPLOAD_BUILD=true` si se habilitan mapas del cliente solo en CI).
4. Ajustar sampling solo si hay justificación; nunca a 0 en producción.

## Verificación

- `verify.yml` chequea presencia de los archivos cuando el repo declare `sentry_project`.
