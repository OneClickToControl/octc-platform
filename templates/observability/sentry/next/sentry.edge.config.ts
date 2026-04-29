import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? "development",
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
});
