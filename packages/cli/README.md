# @1c2c/cli

Unified **OCTC** command-line entry point (**`@1c2c/cli` · v0.3+**). Agent flows delegate to [`octc-agents`](../agent-templates); monorepo / superficies / gobernanza / sugerencias de PORTFOLIO viven en el mismo binario (`octc verify monorepo`, `octc add|sync surface`, `octc sync governance`, `octc portfolio suggest` — ver [ADR-0003](../../docs/adr/ADR-0003-monorepo-cli-machine-ssot.md)).

## Install

```bash
pnpm add -D @1c2c/cli
```

Or run without installing:

```bash
npx @1c2c/cli --help
```

## Usage

```bash
# Preferred (P3-3 umbrella)
npx @1c2c/cli sync agents
npx @1c2c/cli sync agents --target ./some-repo

# Monorepo / governance (ADR-0003, ≥ 0.2)
npx @1c2c/cli verify monorepo
npx @1c2c/cli verify monorepo --cwd ./some-repo

# Stubs y plantillas empaquetadas (≥ 0.3)
npx @1c2c/cli add surface web
npx @1c2c/cli sync surface web --dry-run
npx @1c2c/cli sync surface --all --force
npx @1c2c/cli sync governance --only doc-contract
npx @1c2c/cli portfolio suggest --repo my-product

# *-workspace bootstrap (files on disk only; does not create GitHub repo or PORTFOLIO)
npx @1c2c/cli init workspace ./my-workspace --pin <SHA>
# *-app public-safe scaffold (same limits; --pin optional for portfolio dispatch callable)
npx @1c2c/cli init app ./my-app

# Shorthand
npx @1c2c/cli agents verify
npx @1c2c/cli agents init --force
```

Plantilla YAML monorepo: en el repo publicado [`templates/monorepo/monorepo.yaml.example`](https://github.com/OneClickToControl/octc-platform/blob/main/templates/monorepo/monorepo.yaml.example); copia a `.octc/monorepo.yaml` en tu producto.

## `init workspace` / `init app`

- **`octc init workspace <dir>`** — Materializa el árbol estándar **`*-workspace`** (paridad con `octc-platform-internal` `templates/workspace-repo`). Opciones: `--force`, `--pin <SHA>` (mismo valor en `uses:` y `tooling_ref` del wrapper generado), `--template-dir <path>`. No crea repo en GitHub ni configuración org; ver runbook interno.
- **`octc init app <dir>`** — Scaffold **`templates/product`**: contrato *-app* en disco (p. ej. `.octc/monorepo.yaml`, workflow portfolio dispatch). **`--pin`** opcional para el callable de portfolio; por defecto `main` si la plantilla usa placeholder. No sustituye [NEW_PRODUCT_REPO](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_PRODUCT_REPO.md) para rulesets/secretos.

## Why this package?

- **`octc verify monorepo`**, **`octc add surface`**, **`octc sync surface`**, **`octc sync governance`**, **`octc portfolio suggest`** — ver [ADR-0003](../../docs/adr/ADR-0003-monorepo-cli-machine-ssot.md) y [PORTFOLIO_BRIDGE](../../docs/adoption/PORTFOLIO_BRIDGE.md). Matriz de superficies pensada para repos **`*-app`** ([REFERENCE_PRODUCT_MONOREPO](../../docs/adoption/REFERENCE_PRODUCT_MONOREPO.md)). Roadmap: automatizar PR a internal solo con credenciales org.
- `@1c2c/agent-templates` remains the **implementation** for agent file sync; this package pins it as a dependency.

## Provenance

Published with **npm provenance** from CI. Verify in consumers:

```bash
pnpm dlx audit-signatures || npm audit signatures
```

Policy: [docs/packages/POLICY.md](../../docs/packages/POLICY.md).

## First publish (maintainers)

The package must exist on npm before `npx @1c2c/cli` works for consumers. If it is not created yet:

1. Ensure `packages/cli/package.json` version is correct (e.g. `0.1.0`).
2. From repo root, with `NPM_TOKEN` in `./.env` (classic or granular token with publish rights to `@1c2c`), run:
   ```bash
   bash scripts/publish-cli-manual.sh
   ```
   The script uses a **temporary `.npmrc` with only the token** so a previous `npm login` in your user profile does not trigger the **browser / device** flow. If publish still asks for OTP: `bash scripts/publish-cli-manual.sh --otp=XXXXXX`. For CI, prefer a **granular automation** token that can publish without OTP (if org policy allows).
3. First publish uses `--no-provenance` (token on laptop). After the package exists, configure **Trusted Publisher** for `@1c2c/cli` on npm and prefer `release.yml` for subsequent releases (provenance + OIDC), per [SUPPLY_CHAIN](../../docs/security/SUPPLY_CHAIN.md).
