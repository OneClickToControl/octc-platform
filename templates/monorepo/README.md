# Template — `.octc/monorepo.yaml` (ADR-0003 v0)

Copy this file to **`.octc/monorepo.yaml`** at the root of your product repo and adapt it. Validate with:

```bash
pnpm exec octc verify monorepo
# or
npx @1c2c/cli@latest verify monorepo
```

Documentation: [REFERENCE_PRODUCT_MONOREPO](../../docs/adoption/REFERENCE_PRODUCT_MONOREPO.md) · [ADR-0003](../../docs/adr/ADR-0003-monorepo-cli-machine-ssot.md).

## Fields

| Field | Required | Description |
|-------|-----------|-------------|
| `schema_version` | recommended | `0` today; integer per `@1c2c/cli` CHANGELOG |
| `active_surfaces` | yes | Ordered list: `landing`, `web`, `mobile`, `ml`, `api`, `chat`, `data` |
| `paths` | no | Per-surface globs relative to root; if omitted, the CLI uses default conventions (except `data`, which requires `supabase/`) |
| `portfolio` | no | e.g. `repo_surfaces_csv` for cross-lint with PORTFOLIO (same order as `active_surfaces`) |

Do not include secrets or URLs with sensitive data in public repos.
