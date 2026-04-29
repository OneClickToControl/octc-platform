// octc-platform — Next.js client init template
// No editar el bloque marcado <octc:base>; extender en sentry.user.config.ts.
// Política: docs/observability/OBSERVABILITY.md

import * as Sentry from "@sentry/nextjs";

const SENSITIVE_KEYS = [
  "email",
  "phone",
  "name",
  "address",
  "id_document",
  "ssn",
  "credit_card",
  "auth",
  "authorization",
  "cookie",
  "session",
  "password",
];

function scrub(value: unknown): unknown {
  if (typeof value !== "object" || value === null) return value;
  const out: Record<string, unknown> = Array.isArray(value) ? [] : {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const lower = k.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lower.includes(s))) {
      out[k] = "[redacted]";
    } else {
      out[k] = scrub(v);
    }
  }
  return out;
}

// <octc:base v0.1.0>
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "development",
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  tracesSampleRate: 0.2,
  profilesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: false,
  beforeSend(event) {
    if (event.request) event.request = scrub(event.request) as typeof event.request;
    if (event.extra) event.extra = scrub(event.extra) as typeof event.extra;
    if (event.contexts) event.contexts = scrub(event.contexts) as typeof event.contexts;
    return event;
  },
  beforeSendTransaction(event) {
    if (event.contexts) event.contexts = scrub(event.contexts) as typeof event.contexts;
    return event;
  },
});
// </octc:base>

// <octc:user>
// Extensiones específicas del producto:
// - Replay de sesiones para ciertas rutas
// - Integraciones extra
// </octc:user>
