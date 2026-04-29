# Release notes template

Plantilla para release notes mensuales/cuatrimestrales de la plataforma. Crear copia en `docs/comms/releases/<YYYY>-<MM>.md` o `docs/comms/releases/<YYYY>-Q<n>.md` y publicar en `#release`.

---

# octc-platform — release notes <período>

## Highlights

- 1–3 bullets con lo más importante del período.

## Cambios por área

### Plataforma normativa
- ADRs nuevos y aceptados.
- Cambios en políticas (security, observability, FinOps, governance).

### Paquetes `@1c2c/*`
- Releases destacados (major/minor) con changelog.
- Plan de migración si hubo majors.

### Plantillas de agentes
- Versión vigente de `@1c2c/agent-templates`.
- Repos pendientes de adoptar (lista corta).

### Observabilidad
- Cambios en proyectos Sentry, sampling, retención.
- Incidentes destacados vinculados a alertas.

### FinOps LLM
- Coste org y por producto vs presupuesto.
- Top 3 ahorros y top 3 incrementos.

### Governance
- ADRs aceptados/deprecated.
- Cambios en CODEOWNERS o branch protection.

## Próximos pasos

- Plan para el siguiente período (3–5 bullets).

## Métricas clave

| KPI | valor | tendencia |
|-----|-------|-----------|
| eval_pass_rate (avg L4) |  |  |
| codeowners_coverage (%) |  |  |
| sentry_uptime |  |  |
| llm_budget_utilization (%) |  |  |

## Anexos

- Enlaces a auditoría visible del trimestre.
- Enlaces a ADRs nuevos.
