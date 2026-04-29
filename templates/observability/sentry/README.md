# Sentry templates

Plantillas de inicialización de Sentry para los stacks soportados por OneClickToControl LLC. Todas implementan la política de [docs/observability/OBSERVABILITY.md](../../../docs/observability/OBSERVABILITY.md).

| Stack | Carpeta | Cuándo usar |
|-------|---------|-------------|
| Next.js (web) | [`next/`](next/) | Apps web React/Next del portfolio. |
| Flutter (mobile) | [`flutter/`](flutter/) | Apps mobile multiplataforma. |
| Python (services/ML) | [`python/`](python/) | APIs FastAPI, workers, ML pipelines. |

Cada plantilla incluye:
- Inicialización mínima del SDK con `dsn`, `environment`, `release`, sampling.
- `beforeSend` con scrubbing PII por defecto.
- Hook para AI Monitoring spans (cuando aplique).
- Snippet de subida de source maps en CI vía OIDC + `sentry-cli`.

Versión de los SDKs fijada en `@1c2c/sentry-config` (paquete planeado en Fase 1).
