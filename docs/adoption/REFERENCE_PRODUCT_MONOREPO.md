# Patrón de monorepo de producto (referencia)

Contrato legible por humanos y agentes para repos que **materializan** un producto digital: varias superficies de ejecución, datos, calidad y trazabilidad desde contexto de negocio hasta código.

No sustituye ADRs ni PORTFOLIO: **los define y los enlaza**.

## Objetivos

1. Declarar **`active_surfaces`** y **dónde viven** en el filesystem (`docs/architecture.md` o equivalente).
2. Mantener **trazabilidad** brand → estrategia → producto → features → arquitectura → ops → auditorías.
3. Evitar **drift** entre documentación del repo, **CI/observabilidad** y **PORTFOLIO** interno al cambiar composición.
4. Permitir **nuevos productos** arrancando desde plantillas y checklist, no desde memoria tribal.

## Superficies canónicas (`active_surfaces`)

| Superficie | Rol | Directorios típicos | Notas |
|------------|-----|---------------------|--------|
| `landing` | Sitio público / idea / waitlist | Rutas o app segmentada en `apps/web`, o `apps/landing` | Primera superficie de despliegue frecuente junto con `docs/`. |
| `web` | Aplicación de producto (auth, datos de usuario) | `apps/web` | Upgrade **WebSocket en el mismo** Next suele ser `web`; proceso separado → `api`. |
| `mobile` | Cliente móvil | `apps/mobile` | Paridad UX documentada en `docs/design/`. |
| `ml` | Inferencia / modelo servido | `apps/ml-service`, `services/ml`, … | Contrato HTTP/documentado; despliegue propio (contenedor, PaaS). |
| `api` | Frontera programática **fuera de** `supabase/` | `apps/api`, worker, MCP remoto, gRPC, WS dedicado | Incluye REST, SSE, gRPC, servidor MCP (HTTP/SSE). No cubre Edge Functions en `supabase/functions`. |
| `chat` | UI o backend conversacional | Rutas, `apps/chat-web`, servicio | Políticas agénticas OCTC cuando aplica. |
| `data` | Plataforma de datos Supabase | `supabase/` completo | Migraciones, RLS, **`functions/` (Edge Functions)**, seeds, CLI. |

**Edge Functions** en `supabase/functions` → **`data`**. Solo usar **`api`** si existe **otra** frontera programática desplegada fuera de ese árbol.

**`docs/`** no es superficie de despliegue: es **capa transversal** (precede y alimenta decisiones).

### Formato máquina-legible (opcional, roadmap CLI)

Para `octc verify monorepo` (futuro): frontmatter en `docs/architecture.md` o `.octc/monorepo.yaml` con lista `active_surfaces` y rutas; debe reflejar la misma tabla que la documentación en prosa.

## Trazabilidad (cadena mínima)

```text
brand | market | research | strategy
    → decisions (ADR) / docs/memory u órgano equivalente
    → product (PRD, roadmap, backlog, contratos de sync con issue tracker si aplica)
    → docs/features ↔ código (apps, supabase, packages)
    → docs/architecture + docs/ops + ops/ (runbooks)
    → docs/audits (cierre o deuda explícita)
```

Reglas:

- Cambio de **alcance** de producto → actualizar roadmap/backlog **y** enlazar feature/architecture en el mismo ciclo.
- Nada de **datos sensibles** ni nombres internos de clientes en repos públicos: [`PUBLIC_REPO_POLICY`](../security/PUBLIC_REPO_POLICY.md).

## Matriz CI (por superficie y coste)

Patrón **repos multi-superficie** (referencia interna validada en monorepos producto de la org):

| Patrón | Qué cubre | Notas |
|--------|-----------|--------|
| **CI principal con `paths` / filtros** | Solo construye/prueba lo tocado (mobile, web, ml, validación RLS, etc.) | Documentar en el workflow qué rutas disparan cada job; `workflow_dispatch` puede ejecutar todo. |
| **CI “solo docs”** | En repos que omiten markdown en el CI pesado: workflow paralelo para enlaces MD, estilo, gobernanza ligera | Evita regresiones de documentación sin minutos de build. |
| **Agentes OCTC** | Workflow acotado a `AGENTS.md`, `CLAUDE.md`, `.octc/**`, lockfile | `pnpm run octc:agents:verify` (o equivalente). |
| **Calidad web** | Lint, tests unitarios, **e2e** (p. ej. Playwright) cuando el producto lo exige | Acotar secretos de entorno CI en ops. |
| **Calidad mobile** | `analyze`, tests; opcional **goldens** con job explícito de actualización | Umbral de cobertura si aplica — documentar número y política en backlog o ADR; **pin de SDK** (p. ej. FVM/`.fvmrc`) recomendado para CI estable. |
| **Calidad `ml`** | Linter Python, tests, build de imagen | Dockerfile y variables de runtime documentadas en `docs/ops`. |
| **`data` / RLS** | Tests que ejercen políticas; regeneración de tipos cliente alineada con migraciones | Job dedicado o integrado; rutas `supabase/**` + tests RLS en web si aplica. |

La matriz exacta es **SSOT del repo** (comentario en `.github/workflows/*.y` + párrafo en `docs/architecture.md`).

## Observabilidad

- Proyectos Sentry: patrón `octc-<producto>-<surface>` con `surface ∈ {landing, web, mobile, ml, api, chat, …}`.
- Ver [OBSERVABILITY.md](../observability/OBSERVABILITY.md) y plantillas en `templates/observability/`.

## Alta y baja de superficie

**Alta:** código + fila en tabla de arquitectura + `docs/ops` + jobs CI con `paths` + proyecto de observabilidad + entrada en PORTFOLIO (`repo_surfaces`) en la misma ventana que el cambio estructural.

**Baja:** ADR si rompe contratos; retirar apps y tareas turbo/workflow huérfanas; deprecar proyectos Sentry; sin filas fantasma en `active_surfaces`.

**Auditoría:** comparación trimestral (o en release) PORTFOLIO ↔ `docs/architecture.md`.

## Inventario de aristas — paridad “monorepo potente”

Lista de capacidades que ya aparecen en **repos producto de referencia** (multi-app + datos + automatización). Sirven para no olvidar huecos al lanzar un **producto nuevo**; marcar N/A con justificación en el repo concreto.

| Arista | Ubicación típica | Superficie / capa | En checklist |
|--------|------------------|-------------------|--------------|
| Monorepo (Turborepo/npm/pnpm, engines) | raíz, `turbo.json` | transversal | ✓ |
| Husky / lint-staged | raíz | transversal | ✓ |
| Paquetes compartidos (tipos, SDK) | `packages/*` | transversal | ✓ |
| Activos de marca compartidos | `assets/` | transversal | ✓ |
| Scripts: DB local/remoto, verificación cloud | `scripts/db`, `scripts/supabase` | `data` + dev | ✓ |
| Scripts: gobernanza (enlaces MD, estilo, reglas repo) | `scripts/governance` | transversal | ✓ |
| Scripts: i18n (cadenas hardcodeadas) | `scripts/i18n` | `web` + `mobile` | ✓ |
| Scripts: seguridad (p. ej. escaneo secretos) | `scripts/security` | transversal | ✓ |
| Scripts: integración issue tracker / proyecto (V2, sync estado) | `scripts/github` u homólogo | producto | ✓ |
| Scripts: deploy helpers (p. ej. paso ignorado por docs-only) | `scripts/vercel` o similar | `web` / CI | ✓ |
| Labs o experimentación documentada | `scripts/labs`, `docs/features/labs.md` | opcional | ✓ |
| Runbooks operador en raíz | `ops/` | operación | ✓ |
| Documentación de ops en árbol docs | `docs/ops/` | operación | ✓ |
| Diccionario de datos | `docs/db/` | `data` | ✓ |
| Mapas de arquitectura vivos | `docs/architecture/` | transversal | ✓ |
| ADRs / memoria decisión | `docs/memory`, `docs/decisions` o `docs/adr` | producto | ✓ |
| Auditorías y trabajo pendiente explícito | `docs/audits`, ítems enlazados | calidad | ✓ |
| Contrato backlog ↔ issues | `docs/product/` (+ doc de sync si aplica) | producto | ✓ |
| `@1c2c/*` + `octc sync agents` / verify | `package.json`, workflows | adopción plataforma | ✓ |
| Archivo(s) de agente canónicos | `AGENTS.md`, `CLAUDE.md` | adopción plataforma | ✓ |
| Workflows auxiliares (p. ej. actualización de goldens, archivo de docs, sync estado proyecto) | `.github/workflows/*` | calidad / producto / gobernanza | ✓ (N/A si no aplica) |
| Edge Functions | `supabase/functions` | `data` | ✓ |
| Ruta handlers Next / BFF ligero | `apps/web/app/api` | `web` (salvo proceso aparte → `api`) | ✓ |
| Cliente externo multi-plataforma + paridad | `docs/design/` | `mobile` + `web` | ✓ |

Cualquier repo nuevo puede **subsetear** esta lista; lo no negociable es **declararlo** (README de architecture + checklist) y **PORTFOLIO** alineado.

## Enlaces

- [REPO_ARCHETYPES.md](REPO_ARCHETYPES.md) — atajos de composición.
- [MONOREPO_CONFORMANCE_CHECKLIST.md](MONOREPO_CONFORMANCE_CHECKLIST.md) — verificación práctica.
- [DOCUMENTATION_TREE.md](DOCUMENTATION_TREE.md) — árbol mínimo y extensiones.
- [GOLDEN_PATH.md](GOLDEN_PATH.md) — orden de adopción.
