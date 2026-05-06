# @1c2c/cli

Unified **OCTC** command-line entry point (**`@1c2c/cli` · v0.3+**). Agent flows delegate to [`octc-agents`](../agent-templates); monorepo / surfaces / governance / PORTFOLIO suggestions live in the same binary (`octc verify monorepo`, `octc add|sync surface`, `octc sync governance`, `octc portfolio suggest` — see [ADR-0003](../../docs/adr/ADR-0003-monorepo-cli-machine-ssot.md)).

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

# Packaged stubs and templates (≥ 0.3)
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

Monorepo YAML template: in the published repo [`templates/monorepo/monorepo.yaml.example`](https://github.com/OneClickToControl/octc-platform/blob/main/templates/monorepo/monorepo.yaml.example); copy to `.octc/monorepo.yaml` in your product repo.

## `init workspace` / `init app`

- **`octc init workspace <dir>`** — Materializes the standard **`*-workspace`** tree (parity with `octc-platform-internal` `templates/workspace-repo`). Options: `--force`, `--pin <SHA>` (same value in `uses:` and `tooling_ref` of the generated wrapper), `--template-dir <path>`. Does not create a GitHub repo or org configuration; see internal runbook.
- **`octc init app <dir>`** — Scaffolds **`templates/product`**: **`*-app`** contract on disk (e.g. `.octc/monorepo.yaml`, portfolio dispatch workflow). **`--pin`** optional for the portfolio callable; defaults to `main` if the template uses a placeholder. Does not replace [NEW_PRODUCT_REPO](https://github.com/OneClickToControl/octc-platform-internal/blob/main/docs/runbooks/NEW_PRODUCT_REPO.md) for rulesets/secrets.

## Why this package?

- **`octc verify monorepo`**, **`octc add surface`**, **`octc sync surface`**, **`octc sync governance`**, **`octc portfolio suggest`** — see [ADR-0003](../../docs/adr/ADR-0003-monorepo-cli-machine-ssot.md) and [PORTFOLIO_BRIDGE](../../docs/adoption/PORTFOLIO_BRIDGE.md). Surface matrix targets **`*-app`** repos ([REFERENCE_PRODUCT_MONOREPO](../../docs/adoption/REFERENCE_PRODUCT_MONOREPO.md)). Roadmap: automate PRs to internal only with org credentials.
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
