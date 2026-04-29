# Data classification

Niveles canónicos de sensibilidad de datos para octc-platform. Todo flujo (integración, ACP, producto) declara el peor caso que maneja.

## Niveles

- **none**: datos públicos o sintéticos. Sin restricción.
- **low**: datos internos no personales (telemetría operacional, logs sin PII, métricas de plataforma).
- **high**: PII, salud, finanzas, autenticación, secretos, contenido privado de usuarios.

## Reglas por nivel

| Regla | none | low | high |
|-------|------|-----|------|
| Logs en Sentry | OK | OK con scrubbing | Solo con scrubbing y `beforeSend` riguroso |
| Replay Sentry | OK | Sampling reducido | Off o sampling 0% en flujos sensibles |
| Profiling | OK | OK | Selectivo |
| Retención Sentry (eventos) | 90 días | 90 días | 30 días o menor según producto |
| RAG/KB sin filtros | OK | OK | Prohibido sin filtros por tenant/rol |
| Tools que salen al exterior | OK | OK con review | Doble aprobación + auditoría |
| Eval datasets con datos reales | OK | Anonimizar | Sintetizar o anonimizar siempre |

## DPIA

Cualquier flujo `high` requiere apuntar a un DPIA en `docs/compliance/DPIA/<flow-id>.md` (a crear cuando aparezca el primer flujo).

## Mapeo a Sentry

Ver [OBSERVABILITY.md](../observability/OBSERVABILITY.md#retencion-por-sensibilidad).
