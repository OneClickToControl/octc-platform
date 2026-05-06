# Agent templates adoption

How each repo (product or ACP) adopts and keeps updated the `CLAUDE.md`, `.cursor/rules/`, and `AGENTS.md` templates from `@1c2c/agent-templates`.

**`*-workspace`** repos (memory, identity, notes) are **not** required to follow this pin/CI flow; lane and CLI limits are in **[WORKSPACE_LANE.md](../adoption/WORKSPACE_LANE.md)**.

## `@1c2c/agent-templates` versioning

- Follow **strict SemVer** (see the **Special case: `@1c2c/agent-templates` versioning** section in [POLICY.md](../packages/POLICY.md)).
- **Major:** incompatible template structure, removed or renamed sections.
- **Minor:** new sections or additional non-breaking rules.
- **Patch:** fixes, wording, examples.
- Each minor/major release opens an issue in repos with an outdated `agent_templates_pin`. SLAs are defined in POLICY.

## Adoption

1. The repo declares the consumed version in `package.json` and pins it as `agent_templates_pin` in the private companion **PORTFOLIO** (link in [PORTFOLIO.md](../PORTFOLIO.md)).
2. Apply templates with the package CLI (Quickstart below), which regenerates base files while keeping `<!-- octc:user -->` markers for local extensions.
3. Local extensions **never** change content between `<!-- octc:base -->` and `<!-- octc:end-base -->`.

## Quickstart via CLI

### Unified entry point (recommended): `@1c2c/cli`

The **`@1c2c/cli`** package exposes the `octc` binary and delegates to `octc-agents` for agents; it also includes monorepo commands (`octc verify monorepo`, `octc sync surface`, …) per [ADR-0003](../adr/ADR-0003-monorepo-cli-machine-ssot.md). **ACP→runtime** overview: [RUNTIME_SYNC](RUNTIME_SYNC.md).

```bash
pnpm add -D @1c2c/cli @1c2c/agent-templates

# Sync templates (same as octc-agents sync)
npx @1c2c/cli sync agents

# Shortcuts equivalent to octc-agents
npx @1c2c/cli agents init
npx @1c2c/cli agents verify
npx @1c2c/cli agents sync
```

### `octc-agents` only (`@1c2c/agent-templates`)

The historical path remains valid:

```bash
# initial scaffold in target repo
npx @1c2c/agent-templates init

# drift check in CI or local (exit 1 on drift)
npx @1c2c/agent-templates verify

# sync to canonical, preserving local <!-- octc:user --> blocks
npx @1c2c/agent-templates sync
```

Files produced by `init`:

```
<repo>/CLAUDE.md
<repo>/AGENTS.md
<repo>/.cursor/rules/00-octc-base.mdc
<repo>/.cursor/rules/01-octc-tooling.mdc
<repo>/.octc/agents/manifest.schema.json
```

`sync` only rewrites the block between `<!-- octc:base ... -->` and `<!-- octc:end-base -->`; anything under `<!-- octc:user -->` is preserved.

## Maintenance

- In **CI** (after `install` and signature verification), run `octc-agents verify` or `pnpm run octc:agents:verify` / `npm run octc:agents:verify` to fail the build on *drift* vs the `@1c2c/agent-templates` pin.
- Each minor/major package release opens an **automatic issue** in repos with an outdated `agent_templates_pin`.
- Repo owners have **30 days** to update (major) or **90 days** (minor) before a SCORECARD alert.

## Compatibility

- A major version receives patches for at least 6 months after the next major ships.
- Old templates are removed from the catalog after a grace period and entry in [docs/governance/DEPRECATION.md](../governance/DEPRECATION.md).
