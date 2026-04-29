# Platform SCORECARD

KPIs vivos de la plataforma. Actualización **trimestral** alineada con la auditoría visible.

## Cadencia

- **Revisión trimestral** de plan + scorecard + auditoría visible (Apéndice C del plan fundacional).
- **Revisión mensual** de release notes y FinOps LLM (ver [comms/RELEASE_NOTES_TEMPLATE.md](../comms/RELEASE_NOTES_TEMPLATE.md)).
- **Snapshot** del SCORECARD se versiona en commit con tag `scorecard/<YYYY>-Q<n>`.

## KPIs

### Adopción

- **agent_templates_adoption_rate** = % repos en PORTFOLIO con `agent_templates_pin` ≤ 1 minor de retraso.
- **at1c2c_adoption_rate** = % repos con `at1c2c_pin` ≤ 1 minor.
- **acp_registered_count** = ACPs en REGISTRY con tier ≥ L1.

### Conformance agéntico

- **acps_at_or_above_l2** = % ACPs con tier_actual ≥ L2.
- **acps_at_l4** = nº ACPs con tier_actual = L4.
- **eval_pass_rate** = media trimestral del `eval_pass_rate` de ACPs L4.

### Observabilidad

- **sentry_uptime** = % proyectos Sentry recibiendo eventos las últimas 24h.
- **sourcemaps_coverage** = % releases recientes con sourcemaps subidos vía OIDC.
- **alerts_active** = nº alertas configuradas vs baseline mínimo (ver [OBSERVABILITY](../observability/OBSERVABILITY.md)).

### FinOps LLM

- **llm_budget_utilization** = % presupuesto org consumido en el período.
- **cost_overrun_rate** = % ejecuciones con coste sobre presupuesto por agente.
- **tokens_per_resolution** (avg) = baseline para optimizaciones.

### Governance

- **codeowners_coverage** = % rutas críticas cubiertas por CODEOWNERS reales.
- **adr_freshness** = días desde el último ADR aceptado.
- **review_lag_p50** = mediana horas entre PR open y primera review.

### DR / Resiliencia

- **last_drill_days** = días desde el último drill DR exitoso.
- **backup_freshness_hours** = edad del último backup mirror.
- **incidents_class_a_quarter** = incidentes clase A en el trimestre.

### Onboarding

- **time_to_first_pr_days** = mediana días entre alta y primer PR mergeado para nuevos contribuidores.
- **bootstrap_time_hours** = tiempo total para bootstrap de repo nuevo siguiendo el GOLDEN_PATH.

## Tablero del trimestre vigente (2026-Q2)

| KPI | valor | objetivo | tendencia |
|-----|-------|----------|-----------|
| agent_templates_adoption_rate | 0% | 60% Q2 | bootstrap |
| at1c2c_adoption_rate | 0% | 60% Q2 | bootstrap |
| acp_registered_count | 0 | ≥ 2 Q2 | bootstrap |
| acps_at_or_above_l2 | 0% | high → L2 Q2 | pendiente |
| sentry_uptime | n/a | ≥ 99% | 8/8 proyectos creados 2026-04-29; medición empieza con primeros eventos |
| codeowners_coverage | 100% (este repo) | 100% | OK |
| last_drill_days | n/a | ≤ 180 | drill pendiente |
| llm_budget_utilization | n/a | ≤ 90% | sin baseline aún |

## Owners

- Mantenedor del scorecard: @ferflechas.
- Cada KPI tiene un owner referenciado en su sección si difiere del general.

## Próxima revisión

- 2026-Q3 (julio 2026).
