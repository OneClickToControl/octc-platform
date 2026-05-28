# CLAUDE.md — `__PRODUCT__-agents`

## Rol del repo

Soy el repositorio **ACP / agents** del producto **__PRODUCT__**. Mi SSOT de registro OCTC es `agents/__PRODUCT__-acp/manifest.json`.

## Fronteras

- **`*-app`:** código y superficies del producto; usa `octc verify monorepo`, `octc add/sync surface`.
- **`*-agents` (este repo):** comportamiento y capacidades agénticas; valida el manifest contra el schema público OCTC y despacha metadatos al interno cuando cambia el manifest.
- **`*-workspace`:** memoria, identidad, notas, canales — no mezclar aquí.

## Comandos útiles

- `pnpm install`
- `pnpm run octc:agents:verify`
- `pnpm run octc:agents:sync` (baseline agents only)
