# Sentry — Python template

Initialization for FastAPI services, workers, and ML pipelines.

## Files

- `sentry_init.py` — `init_octc_sentry()` with `before_send` applying PII scrubbing.

## Usage

```python
from sentry_init import init_octc_sentry

init_octc_sentry()
```

## Environment variables

`SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_PROFILES_SAMPLE_RATE`.

## AI Monitoring

If the service orchestrates agents, wrap LLM calls in `sentry_sdk.start_span(op="agent.llm.call", ...)` and report attributes per [docs/observability/AGENT_TELEMETRY.md](../../../../docs/observability/AGENT_TELEMETRY.md).
