# Repo archetypes (`active_surfaces`)

**Archetypes** are narrative shortcuts; the source of truth remains the **ordered** `active_surfaces` list in `docs/architecture.md` and the mirror in internal PORTFOLIO (`repo_surfaces`).

## Format

- Ordered list, e.g. `landing,web,data,mobile,ml`.
- Internal PORTFOLIO may serialize as CSV in a dedicated column.
- Same order as repo documentation for easier diffs and human review.

## Shortcuts

| Archetype | Typical `active_surfaces` | When to use |
|-----------|--------------------------|---------------|
| **DocsAndLanding** | `landing` | Idea, brand, lead capture; no product app yet. |
| **ProductWeb** | `landing`, `web` | Main product on web; landing may share `apps/web` by routes. |
| **ProductMonorepo** | `landing`, `web`, `data`, … | Multiple surfaces: web + Supabase + mobile and/or ml and/or api. |
| **DataFirst** | `data` (+ optional `landing`) | Backend/RLS prototype before rich client; document explicitly. |
| **ACP / agent-heavy** | `chat` and/or `api` + capabilities in `agents/` | Register in [REGISTRY.md](../agents/REGISTRY.md); ACP governance per ADR-0002. |
| **Runtime** | `api` or deployable worker | Service without its own UI (integration, webhooks, remote MCP). |

## Evolution examples

1. `landing` → capture and brand docs.
2. `landing`, `web` → auth and product flows.
3. `landing`, `web`, `data` → persistence, RLS, Edge Functions.
4. `landing`, `web`, `data`, `mobile` → documented mobile parity.
5. `landing`, `web`, `data`, `mobile`, `ml` → insights or models served separately.
6. `…`, `api` → HTTP/WS/gRPC/MCP boundary **outside** `supabase/` when it is a dedicated service.
7. `…`, `chat` → product conversational experience or agent backoffice.

Each step should have an **ADR or roadmap entry** and CI/`paths` and observability updates.

## Broader reference

See [REFERENCE_PRODUCT_MONOREPO.md](REFERENCE_PRODUCT_MONOREPO.md).
