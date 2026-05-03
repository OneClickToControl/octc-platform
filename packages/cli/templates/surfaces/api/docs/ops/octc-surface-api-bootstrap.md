# Bootstrap — superficie `api`

Generado por `octc add surface api` / `octc sync surface api`. Completar según [REFERENCE_PRODUCT_MONOREPO](https://github.com/OneClickToControl/octc-platform/blob/main/docs/adoption/REFERENCE_PRODUCT_MONOREPO.md) y `docs/architecture.md`.

**Alcance:** repos **`*-app`** únicamente. Frontera fuera de `supabase/` (REST, MCP, workers).

- Convención típica: `apps/api/**`, `apps/chat_api/**` o `services/api/**`.
- Alineación con `data` (auth, RLS vía cliente) documentada.
- Observabilidad: **octc-{producto}-api**.
