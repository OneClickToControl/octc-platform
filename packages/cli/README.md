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
