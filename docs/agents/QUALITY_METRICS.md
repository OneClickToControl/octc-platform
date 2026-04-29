# Agent quality metrics

KPIs de calidad agéntica para todos los ACPs registrados. Reportadas vía Sentry AI Monitoring (atributos en spans) y agregadas en el [SCORECARD](../metrics/PLATFORM_SCORECARD.md).

## Métricas mínimas

### Producción

- **task_success_rate** = % tareas completadas con `agent.run` cerrado en estado `ok`.
- **avg_steps_per_task** = pasos medios hasta resolver una tarea (proxies de eficiencia).
- **avg_tokens_per_task** = tokens IN+OUT promedio por tarea (cruza con FinOps).
- **avg_cost_usd_per_task** = coste medio por tarea.
- **median_latency_ms_per_task** = latencia mediana end-to-end.
- **tool_compliance_rate** = % llamadas a tools dentro del allowlist.

### Evaluación (tier L4)

- **eval_pass_rate** = % casos del golden set superados.
- **adversarial_block_rate** = % casos adversariales correctamente rechazados.
- **regression_set_pass_rate** = % casos del set de regresión superados.
- **eval_runtime_minutes** = duración de ejecución de la suite completa.

### Calidad humana percibida

- **human_review_acceptance_rate** = % outputs revisados por humanos aceptados sin cambios mayores.
- **escalation_rate** = % tareas que escalaron a humano.
- **complaint_rate** = % tareas con feedback negativo explícito.

## Umbrales por tier

| métrica | L2 | L3 | L4 |
|---------|----|----|----|
| task_success_rate | n/a | ≥ 85% | ≥ 92% |
| tool_compliance_rate | ≥ 99% | 100% | 100% |
| eval_pass_rate | n/a | n/a | ≥ 90% |
| adversarial_block_rate | n/a | n/a | ≥ 95% |

## Reportes

- **Diario**: panel Sentry por proyecto/ACP.
- **Semanal**: top 5 ACPs por degradación.
- **Trimestral**: agregado en SCORECARD + revisión humana del golden set.

## Acciones automáticas

- `eval_pass_rate` < umbral → bloqueo de release del ACP.
- `tool_compliance_rate` < umbral → alerta crítica + revisión inmediata.
- `cost_usd_per_task` > 2× baseline 7d → alerta a `#ops-finops`.

## Plantilla de reporte por ACP

```yaml
acp_id: <id>
period: <YYYY-Www>
metrics:
  task_success_rate: 0.0
  avg_steps_per_task: 0
  avg_tokens_per_task: 0
  avg_cost_usd_per_task: 0
  median_latency_ms_per_task: 0
  tool_compliance_rate: 0.0
  eval_pass_rate: 0.0          # solo si tier L4
  adversarial_block_rate: 0.0  # solo si tier L4
notes: ""
```
