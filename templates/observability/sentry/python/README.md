# Sentry — Python template

Inicialización para servicios FastAPI, workers y pipelines ML.

## Archivos

- `sentry_init.py` — `init_octc_sentry()` con `before_send` que aplica scrubbing PII.

## Uso

```python
from sentry_init import init_octc_sentry

init_octc_sentry()
```

## Variables de entorno

`SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_PROFILES_SAMPLE_RATE`.

## AI Monitoring

Si el servicio orquesta agentes, envolver llamadas LLM en `sentry_sdk.start_span(op="agent.llm.call", ...)` y reportar atributos según [docs/observability/AGENT_TELEMETRY.md](../../../../docs/observability/AGENT_TELEMETRY.md).
