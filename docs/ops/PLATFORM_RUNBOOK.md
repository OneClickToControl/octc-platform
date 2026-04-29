# Platform runbook

Procedimientos paso a paso para operaciones críticas de `octc-platform`.

## On-call

- Owner principal: @1click2control.
- Escalado: pendiente al crecer el equipo.
- Canal: `#ops-incidents`.

## Procedimientos

### Repo borrado o comprometido

1. Verificar mirror más reciente.
2. Re-crear repo desde mirror.
3. Restaurar branch protection y CODEOWNERS.
4. Forzar rotación de tokens y revisar webhooks.
5. Post-mortem en `docs/audit/HISTORY.md`.

### Secret leak

1. Rotar inmediatamente el secreto en gestor.
2. Revocar tokens vivos en proveedor (npm, Sentry, Vercel, etc.).
3. Revisar logs de acceso 30 días previos.
4. Notificar `#security`.
5. Post-mortem.

### Paquete `@1c2c/*` malicioso publicado

1. `npm deprecate @1c2c/<pkg>@<version> "<motivo>"`.
2. Si crítico: `npm unpublish` (dentro de las 72h permitidas).
3. Publicar parche con bump de versión.
4. Aviso en `#release` + `#security`.
5. Auditoría de cómo se publicó (OIDC, identidades).

### Sentry org comprometida

1. Pausar ingestión de eventos sensibles (cambiar DSNs en producción).
2. Auditar miembros y rotar tokens.
3. Restaurar configuración desde backup.
4. Reanudar ingestión por proyecto verificado.

### Alertas FinOps LLM > umbral

1. Identificar agente y producto.
2. Pausar ejecución (orquestador o feature flag).
3. Auditar prompts y bucles.
4. Ajustar presupuesto o modelo.

### Caída de CI `verify.yml`

1. Replicar localmente.
2. Si es flaky en una action, considerar pin alternativo o cache invalidation.
3. Si es regression real, abrir issue y bloquear merges.

## Checklists periódicos

- **Semanal**: revisar dependabot, alertas Sentry, KPIs FinOps.
- **Mensual**: verificar backup mirror, exportar configuración Sentry, snapshot PORTFOLIO.
- **Trimestral**: drill DR, auditoría visible, revisión `tools_allowlist_ref` L4.
