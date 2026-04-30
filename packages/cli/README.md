# @1c2c/cli

Unified **OCTC** command-line entry point. **MVP:** `octc sync agents` delegates to [`octc-agents`](../agent-templates) from `@1c2c/agent-templates` (same `init` / `verify` / `sync` semantics).

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

# Shorthand
npx @1c2c/cli agents verify
npx @1c2c/cli agents init --force
```

## Why this package?

- Single command (`octc`) for adopters; future subcommands will cover governance templates, ACP→runtime sync, etc. (see [RUNTIME_SYNC](../../docs/agents/RUNTIME_SYNC.md)).
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
