# DR / BCP — octc-platform

Disaster Recovery y Business Continuity Plan **para la plataforma**. Este documento cubre la pérdida total o parcial de los activos normativos y de infraestructura crítica controlada por `octc-platform`. Cada producto mantiene su propio DR para sus datos.

## Activos críticos

| activo | dueño | criticidad | repositorio | RTO | RPO |
|--------|-------|------------|-------------|-----|-----|
| Repos GitHub bajo la org | @1click2control | crítica | github.com/<org>/* | 4h | 24h |
| Configuración Sentry org | @1click2control | crítica | export JSON mensual | 24h | 30d |
| Secretos OIDC y vault | @1click2control | crítica | gestor de secretos | 4h | 24h |
| `@1c2c/*` publicados en npm | @1click2control | alta | npmjs.com | 24h | 0 (inmutable) |
| PORTFOLIO + REGISTRY + ADRs | @1click2control | alta | repo `octc-platform` | 1h | 0 (git) |
| Dominios DNS | @1click2control | alta | registrador externo | 12h | 24h |

## Niveles de incidente

- **Clase A**: pérdida de acceso o integridad a un activo crítico (repo borrado, org Sentry comprometida, paquete malicioso publicado).
- **Clase B**: pérdida parcial pero recuperable < 24h (CI caída, secretos rotados, alerta de seguridad activa).
- **Clase C**: degradación operativa (alertas FinOps, errores de release).

## Procedimientos

### Backup

- **Repos**: clonado mirror semanal a almacenamiento externo (S3/Cloudflare R2 cifrado).
- **Sentry**: export semanal de configuración por proyecto (alerts, members, retention) vía API.
- **PORTFOLIO/REGISTRY snapshots**: tag mensual `snapshots/<YYYY>-<MM>` en `octc-platform`.
- **Secretos**: backup cifrado mensual + rotación trimestral.
- **Package mirror**: snapshot semanal de `@1c2c/*` en almacenamiento de respaldo (vía `npm pack`).

### Restauración

1. Identificar clase y activos afectados.
2. Activar canal `#ops-incidents`.
3. Ejecutar runbook ([PLATFORM_RUNBOOK.md](PLATFORM_RUNBOOK.md)).
4. Comunicar timeline y RTO esperado.
5. Post-mortem en ≤ 7 días.

### Drills

- Drill **semestral** simulando clase A (repo borrado, secretos comprometidos).
- Resultado documentado en `docs/audit/HISTORY.md` con `last_drill_days`.

## Comunicación

- Clase A → `#ops-incidents` + email a stakeholders en ≤ 30 min.
- Clase B → `#ops-incidents` en ≤ 2h.
- Clase C → `#ops` con seguimiento normal.

## Indicadores

- `last_drill_days`: días desde el último drill exitoso.
- `backup_freshness_hours`: edad del backup más reciente para cada activo.
- `restore_test_pass_rate`: % de drills donde se cumplió el RTO.

Reportados en [PLATFORM_SCORECARD](../metrics/PLATFORM_SCORECARD.md).
