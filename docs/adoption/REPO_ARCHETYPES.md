# Arquetipos de repo (`active_surfaces`)

Los **arquetipos** son atajos narrativos; la fuente de verdad sigue siendo la **lista ordenada** `active_surfaces` en `docs/architecture.md` y el espejo en PORTFOLIO interno (`repo_surfaces`).

## Formato

- Lista ordenada, por ejemplo: `landing,web,data,mobile,ml`.
- En PORTFOLIO interno puede serializarse como CSV en una columna dedicada.
- Mismo orden que en la documentación del repo para facilitar diffs y revisiones humanas.

## Atajos

| Arquetipo | `active_surfaces` típico | Cuándo usarlo |
|-----------|--------------------------|---------------|
| **DocsAndLanding** | `landing` | Idea, marca, captación; aún sin app de producto. |
| **ProductWeb** | `landing`, `web` | Producto principal en web; landing puede compartir `apps/web` por rutas. |
| **ProductMonorepo** | `landing`, `web`, `data`, … | Varias superficies: web + Supabase + mobile y/o ml y/o api. |
| **DataFirst** | `data` (+ `landing` opcional) | Prototipo backend/RLS antes de cliente rico; documentar explícitamente. |
| **ACP / agent-heavy** | `chat` y/o `api` + capacidades en `agents/` | Registro en [REGISTRY.md](../agents/REGISTRY.md); gobernanza ACP según ADR-0002. |
| **Runtime** | `api` o worker desplegable | Servicio sin UI propia (integración, webhooks, MCP remoto). |

## Ejemplos de evolución

1. `landing` → captación y docs de marca.
2. `landing`, `web` → autenticación y flujos de producto.
3. `landing`, `web`, `data` → persistencia, RLS, Edge Functions.
4. `landing`, `web`, `data`, `mobile` → paridad móvil documentada.
5. `landing`, `web`, `data`, `mobile`, `ml` → insights o modelos servidos aparte.
6. `…`, `api` → frontera HTTP/WS/gRPC/MCP **fuera** de `supabase/` cuando sea servicio propio.
7. `…`, `chat` → experiencia conversacional de producto o backoffice de agentes.

Cada salto debe tener **ADR o entrada de roadmap** y actualización de CI/`paths` y observabilidad.

## Referencia amplia

Ver [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md).
