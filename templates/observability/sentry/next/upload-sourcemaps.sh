#!/usr/bin/env bash
# octc-platform — subida de source maps con sentry-cli usando OIDC.
# Requiere variables: SENTRY_ORG, SENTRY_PROJECT, SENTRY_RELEASE
# y autenticación OIDC configurada por el job CI (sin tokens long-lived).
set -euo pipefail

: "${SENTRY_ORG:?SENTRY_ORG no definido}"
: "${SENTRY_PROJECT:?SENTRY_PROJECT no definido}"
: "${SENTRY_RELEASE:?SENTRY_RELEASE no definido}"

sentry-cli releases new "$SENTRY_RELEASE"
sentry-cli releases set-commits "$SENTRY_RELEASE" --auto
sentry-cli sourcemaps inject --release "$SENTRY_RELEASE" .next
sentry-cli sourcemaps upload --release "$SENTRY_RELEASE" .next
sentry-cli releases finalize "$SENTRY_RELEASE"
