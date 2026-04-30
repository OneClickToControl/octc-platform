# Checklist de conformidad — monorepo de producto

Usar en PRs que **añaden o quitan** superficies, o en auditorías trimestrales. Marcar **N/A** con enlace a la justificación en `docs/README.md` o ADR.

## A. Por superficie activa

Repite el bloque por cada etiqueta en `active_surfaces`.

### `landing` / `web` / `mobile` / `ml` / `api` / `chat`

- [ ] Fila en `docs/architecture.md`: directorios, stack, despliegue, variables críticas (sin secretos).
- [ ] Proyecto Sentry (u observabilidad acordada) con nombre `octc-<producto>-<surface>`.
- [ ] Jobs CI con filtros de rutas documentados; build/test reproducibles localmente (`docs/getting-started.md` o equivalente).
- [ ] Runbook o sección ops: despliegue, rollback, **secretos** (referencia a política de auth/env).

### `data` (Supabase)

- [ ] `supabase/` bajo control de versión; migraciones RLS revisadas.
- [ ] Edge Functions documentadas (entrada en architecture o `supabase/functions/*/README.md`).
- [ ] Tipos cliente (p. ej. TS) alineados con esquema; job o comando de regeneración documentado.
- [ ] Pruebas o procedimientos que validen RLS (automáticos o runbook explícito).

### `docs/` (capa transversal)

- [ ] Árbol mínimo según [DOCUMENTATION_TREE.md](DOCUMENTATION_TREE.md) o equivalente justificado.
- [ ] Decisiones de impacto en ADR / memoria / índice enlazado desde architecture.

## B. Cambio de composición (alta/baja de superficie)

- [ ] Tabla `active_surfaces` y rutas actualizadas en el mismo PR estructural (o ventana máxima acordada + deuda registrada).
- [ ] PORTFOLIO interno: `repo_surfaces` actualizado (y `monorepo_archetype` si la org lo usa).
- [ ] Workflows CI: nuevos `paths` o jobs; eliminación de jobs huérfanos.
- [ ] Turbo / workspaces: paquetes y pipelines coherentes.
- [ ] Observabilidad: proyectos creados o deprecados según política.

## C. Capa producto y trazabilidad

- [ ] Roadmap/backlog reflejan el cambio de alcance; issues o contrato de sync actualizado si la org lo exige.
- [ ] `docs/features/` o mapa equivalente enlaza comportamiento nuevo o marcado como deprecado.
- [ ] Auditoría o entrada de riesgo si el cambio afecta compliance o datos sensibles.

## D. Automatización y gobernanza (patrón “máquina de productos”)

Marcar lo que aplica al repo; N/A documentado.

- [ ] Workflow **solo documentación** (enlaces MD, estilo) si el CI principal omite `*.md`.
- [ ] **`octc verify monorepo`** en CI cuando exista `.octc/monorepo.yaml` ([ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md); `@1c2c/cli` ≥ 0.2.0).
- [ ] Scripts indexados (`scripts/README.md`) para db, supabase, gobernanza, i18n, seguridad.
- [ ] Paquetes compartidos (`packages/*`) con README de contrato.
- [ ] `assets/` o política de marca explícita si hay multi-superficie con identidad compartida.

## E. Política pública

- [ ] Ejemplos y capturas cumplen [PUBLIC_REPO_POLICY.md](../security/PUBLIC_REPO_POLICY.md).

## Definición rápida de “conforme”

`active_surfaces` ↔ filesystem ↔ CI paths ↔ Sentry ↔ PORTFOLIO, y cadena docs producto → features → ops sin enlaces rotos críticos.
