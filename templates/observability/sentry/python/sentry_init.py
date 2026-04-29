"""octc-platform — Sentry init template for Python services.

Política: docs/observability/OBSERVABILITY.md
"""
from __future__ import annotations

import os
from typing import Any

import sentry_sdk


_SENSITIVE_KEYS = (
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
)


def _scrub(value: Any) -> Any:
    if isinstance(value, dict):
        return {
            k: ("[redacted]" if any(s in k.lower() for s in _SENSITIVE_KEYS) else _scrub(v))
            for k, v in value.items()
        }
    if isinstance(value, list):
        return [_scrub(v) for v in value]
    return value


def _before_send(event: dict[str, Any], _hint: Any) -> dict[str, Any]:
    if "request" in event:
        event["request"] = _scrub(event["request"])
    if "extra" in event:
        event["extra"] = _scrub(event["extra"])
    if "contexts" in event:
        event["contexts"] = _scrub(event["contexts"])
    return event


def init_octc_sentry() -> None:
    sentry_sdk.init(
        dsn=os.environ.get("SENTRY_DSN"),
        environment=os.environ.get("SENTRY_ENVIRONMENT", "development"),
        release=os.environ.get("SENTRY_RELEASE"),
        traces_sample_rate=float(os.environ.get("SENTRY_TRACES_SAMPLE_RATE", "0.2")),
        profiles_sample_rate=float(os.environ.get("SENTRY_PROFILES_SAMPLE_RATE", "0.05")),
        send_default_pii=False,
        before_send=_before_send,
    )
