# Plantilla — `.octc/monorepo.yaml` (ADR-0003 v0)

Copia este archivo a **`.octc/monorepo.yaml`** en la raíz de tu repo producto y adáptalo. Valídalo con:

```bash
pnpm exec octc verify monorepo
# o
npx @1c2c/cli@latest verify monorepo
```

Documentación: [REFERENCE_PRODUCT_MONOREPO](../../docs/adoption/REFERENCE_PRODUCT_MONOREPO.md) · [ADR-0003](../../docs/adr/ADR-0003-monorepo-cli-machine-ssot.md).

## Campos

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| `schema_version` | recomendado | `0` hoy; entero según CHANGELOG de `@1c2c/cli` |
| `active_surfaces` | sí | Lista ordenada: `landing`, `web`, `mobile`, `ml`, `api`, `chat`, `data` |
| `paths` | no | Por superficie, globs relativos al root; si omites, el CLI usa convenciones por defecto (excepto `data`, que exige `supabase/`) |
| `portfolio` | no | p. ej. `repo_surfaces_csv` para lint cruzado con PORTFOLIO (mismo orden que `active_surfaces`) |

No incluyas secretos ni URLs con datos sensibles en repos públicos.
